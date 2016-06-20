/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

//
//  WLLoginChallengeHandler.swift
//  UserLoginSample
//
//  Created by Ishai Borovoy on 17/04/2015.
//  Copyright © 2015 IBM. All rights reserved.
//

import Foundation
import IBMMobileFirstPlatformFoundation

public class LTPAChallengeHandler : SecurityCheckChallengeHandler {
    
    //The login view controller
    var loginViewController : LoginViewController?
    var loginURL : String?
    var isInChallenge = false;
    
    override init!(securityCheck: String!) {
        super.init(securityCheck: securityCheck)
        let mainStoryboard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        loginViewController = mainStoryboard.instantiateViewControllerWithIdentifier("userLogin") as? LoginViewController
    }
    
    //Handle the LTPA challenge handler
    override public func handleChallenge(challenge: [NSObject : AnyObject]!) {
        self.loginURL = challenge["loginURL"] as? String
        let navigationController = UIApplication.sharedApplication().delegate?.window!?.rootViewController as! UINavigationController
        if (isInChallenge) {
            self.loginViewController?.setErrorMsg("Wrong credentials")
        } else {
            navigationController.pushViewController(self.loginViewController!, animated: true)
        }
        isInChallenge = true
    }
    
    //Send the credentials to the server
    public func sendLoginCredentials (user: String, password: String) {
        let request = NSMutableURLRequest(URL: NSURL(string: self.loginURL!)!)
        let session = NSURLSession.sharedSession()
        
        // To use the Form based authentication uncomment the following and comment the Basic authentication part
        
        /*
         
         // Start Form Authorization
         
         request.HTTPMethod = "POST"
         request.HTTPBody = String("j_username=\(user)&j_password=\(password)&action=Login").dataUsingEncoding(NSUTF8StringEncoding)
         
         // End Form Authorization
         
         */
        
        
        
        // Start Basic authentication
        
        let credentials = "\(user):\(password)".dataUsingEncoding(NSUTF8StringEncoding)
        if let credentialsBase64Encoded = credentials?.base64EncodedStringWithOptions(NSDataBase64EncodingOptions(rawValue: 0))
        {
            request.addValue("Basic \(credentialsBase64Encoded)", forHTTPHeaderField: "Authorization")
            let task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                dispatch_async(dispatch_get_main_queue(),{
                    if (error == nil) {
                        //Assume authentication succeeded, if not we will be challenged again
                        self.submitChallengeAnswer(nil)
                    } else {
                        self.cancel()
                    }
                })
            })
            task.resume()
        } else {
            dispatch_async(dispatch_get_main_queue(),{
                self.cancel()
            })
        }
        
        // End Basic authentication
    }
    
    
    //Handle failure hook
    public override func handleFailure(failure: [NSObject : AnyObject]!) {
        isInChallenge = false
        loginViewController?.dismiss()
    }
    
    //Handle success hook
    public override func handleSuccess(success: [NSObject : AnyObject]!) {
        isInChallenge = false
        loginViewController?.dismiss()
    }
}

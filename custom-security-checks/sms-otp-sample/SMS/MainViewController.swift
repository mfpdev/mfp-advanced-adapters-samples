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
//  HelloUserViewController.swift
//  UserLoginSample
//
//  Created by Ishai Borovoy on 03/11/2015.
//  Copyright © 2015 IBM. All rights reserved.
//

import UIKit
import IBMMobileFirstPlatformFoundation

class MainViewController: UIViewController{
    
    @IBOutlet weak var registerButton: UIButton!
    @IBOutlet weak var loginButton: UIButton!
    
    override func viewDidLoad() {
        let resourseRequest = WLResourceRequest(URL: NSURL(string:"/adapters/smsOtp/phone/isRegistered")!, method:"GET")
        resourseRequest.sendWithCompletionHandler({ (response, error) -> Void in
            if error == nil {
                self.enableButtons (response.responseText == "true")
            } else {
                self.alert ("Oops, something wrong happen!")
            }
        })
    }
    
    @IBAction func smsOTPLogin(sender: AnyObject) {
        WLAuthorizationManager.sharedInstance().obtainAccessTokenForScope("smsOTP") { (accessToken, error) in
            if (error == nil) {
                self.alert ("Success :-)")
            } else {
                self.alert ("Failed :-(")
            }
        }
    }
    
    @IBAction func registerNumber(sender: AnyObject) {
        MainViewController.codeDialog("Phone Number", message: "Please provide your phone number",isCode: true) { (phone, ok) -> Void in
            if ok {
                let resourseRequest = WLResourceRequest(URL: NSURL(string:"/adapters/smsOtp/phone/register/\(phone)")!, method:"POST")
                resourseRequest.sendWithCompletionHandler({ (response, error) -> Void in
                    if error == nil {
                        self.enableButtons (response.responseText == "true")
                    } else {
                        self.alert ("Oops, failed to register.")
                    }
                })
            }
        }
    }
    
    private func enableButtons (isRegistered : Bool) {
        self.registerButton.enabled = !isRegistered;
        self.loginButton.enabled = isRegistered;
    }
    
    private func alert (msg : String) {
        let alert = UIAlertController(title: "SMS OTP Login", message: msg, preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default, handler: nil))
        self.presentViewController(alert, animated: true, completion: nil)
    }
    
    internal static func codeDialog (title: String, message: String, isCode : Bool, completion: (code: String, ok: Bool) -> Void) {
        let codeDialog = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.Alert)
        
        var codeTxtField :UITextField?
        
        codeDialog.addTextFieldWithConfigurationHandler { (txtCode) -> Void in
            codeTxtField = txtCode
            if (isCode) {
                codeTxtField?.secureTextEntry = true
            }
            txtCode.placeholder = title
        }
        
        codeDialog.addAction(UIAlertAction(title: "Ok", style:.Default, handler: { (action: UIAlertAction!) in
            completion (code: codeTxtField!.text!, ok: true)
        }))
        
        codeDialog.addAction(UIAlertAction(title: "Cancel", style: .Default, handler: { (action: UIAlertAction!) in
            completion (code: "", ok: false)
        }))
        
        UIApplication.sharedApplication().delegate?.window!!.rootViewController!.presentViewController(codeDialog, animated: true, completion: nil)
    }
}



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
//  ViewController.swift
//  LTPABasedSample
//
//  Created by Ishai Borovoy on 17/04/2016.
//

import UIKit
import IBMMobileFirstPlatformFoundation

class HelloLTPAUserViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @IBAction func invokeProtectedResource(sender: AnyObject) {
        let resourseRequest = WLResourceRequest(URL: NSURL(string:"/adapters/HelloLTPAUser/hello/user")!, method:WLHttpMethodGet, scope: "LTPA")
        
        //Call to the hello resource request
        resourseRequest.sendWithCompletionHandler({ (response, error) -> Void in
            if error == nil {
                self.alert("Hello \(response.responseJSON["displayName"]!)")
            } else {
               self.alert(error.localizedDescription)
            }
        })
        
    }
    
    //Display the result in dialog box
    private func alert (msg : String) {
        let alert = UIAlertController(title: "Hello User", message: msg, preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default, handler: nil))
        self.presentViewController(alert, animated: true, completion: nil)
    }
}


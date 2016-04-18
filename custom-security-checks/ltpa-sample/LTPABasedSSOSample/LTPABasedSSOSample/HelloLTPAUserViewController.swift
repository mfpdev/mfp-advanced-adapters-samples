//
//  ViewController.swift
//  LTPABasedSSOSample
//
//  Created by Ishai Borovoy on 17/04/2016.
//  Copyright © 2016 IBM. All rights reserved.
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


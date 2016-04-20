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
//  UserLoginSample
//
//  Created by Ishai Borovoy on 03/11/2015.
//

import UIKit
import IBMMobileFirstPlatformFoundation

class LoginViewController: UIViewController {
    
    //Login fields
    @IBOutlet private weak var usernameTextField: UITextField!
    @IBOutlet private weak var passwordTextField: UITextField!
    @IBOutlet private weak var errorLable: UILabel!
    
    var challenge : LTPAChallengeHandler?
    
    override func viewDidLoad() {
        self.navigationItem.setHidesBackButton(true, animated: true)
        super.viewDidLoad()
    }
    
    override func viewDidDisappear(animated: Bool) {
        usernameTextField.becomeFirstResponder()
        self.navigationItem.setHidesBackButton(true, animated: true)
        self.clearFields()
    }
    
    //Called when press on Log in button
    @IBAction func login(sender: AnyObject) {
        if (validateFields()) {
            if let challenge = WLClient.sharedInstance().getChallengeHandlerBySecurityCheck("LTPA") as? LTPAChallengeHandler {
                challenge.sendLoginCredentials(self.usernameTextField.text!, password: self.passwordTextField.text!);
            }
        } else {
            errorLable.text = "Username & password are required fields"
        }
    }
    
    // Valdaite username and password is not empty
    private func validateFields ()->Bool {
        let username = usernameTextField.text?.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        let password = passwordTextField.text?.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())

        return username != "" && password != ""
    }
    
    //Clear username and password
    private func clearFields () {
        usernameTextField.text = ""
        passwordTextField.text = ""
    }
    
    //Dismiss the view
    func dismiss () {
        self.navigationController?.popViewControllerAnimated(true)
    }
    
    // Set error message
    func setErrorMsg (errorMsg : String) {
        self.errorLable.text = errorMsg
    }
}


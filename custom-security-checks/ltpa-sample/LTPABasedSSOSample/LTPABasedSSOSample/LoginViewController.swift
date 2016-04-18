//
//  ViewController.swift
//  UserLoginSample
//
//  Created by Ishai Borovoy on 03/11/2015.
//  Copyright © 2015 IBM. All rights reserved.
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
         self.navigationItem.setHidesBackButton(true, animated: true)
        self.clearFields()
    }
    
    //Called when press on Log in button
    @IBAction func login(sender: AnyObject) {
        if (validateFields()) {
            if let challenge = WLClient.sharedInstance().getChallengeHandlerBySecurityCheck("LTPA") as? LTPAChallengeHandler {
                challenge.sendLoginForm(self.usernameTextField.text!, password: self.passwordTextField.text!);
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


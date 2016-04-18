//
//  AppDelegate.swift
//  LTPABasedSSOSample
//
//  Created by Ishai Borovoy on 17/04/2016.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import IBMMobileFirstPlatformFoundation


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        //Register the LTPA challenge handler
        WLClient.sharedInstance().registerChallengeHandler(LTPAChallengeHandler(securityCheck: "LTPA"))
        return true
    }

}


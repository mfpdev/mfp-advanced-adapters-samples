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
package com.github.mfpdev.twilio.sample.phoneuser;

/**
 * Holds information regarding a registration record for a user and its phone number.
 */
public class RegistrationRecord {

    private final int key;
    private final String userID;
    private final String phoneNumber;
    private final String validationCode;
    private final boolean inValidation;

    public RegistrationRecord(int key, String userID, String phoneNumber, String validationCode, boolean inValidation) {
        this.key = key;
        this.userID = userID;
        this.phoneNumber = phoneNumber;
        this.validationCode = validationCode;
        this.inValidation = inValidation;
    }
    public int getKey() {
        return key;
    }

    public String getUserID() {
        return userID;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getValidationCode() {
        return validationCode;
    }

    public boolean isInValidation() {
        return inValidation;
    }

    public String toString() {

        return String.format("RegistrationRecord {%d, %s, %s, %s, %b }",
                key, userID, phoneNumber, validationCode, inValidation);
    }
}

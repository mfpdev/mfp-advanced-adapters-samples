package com.ibm.mfp.sample.phoneuser;

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

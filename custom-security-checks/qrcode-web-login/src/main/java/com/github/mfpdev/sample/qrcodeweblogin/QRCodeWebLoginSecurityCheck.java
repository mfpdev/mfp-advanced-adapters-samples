/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.github.mfpdev.sample.qrcodeweblogin;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import io.swagger.annotations.Api;
import net.glxn.qrgen.core.image.ImageType;
import net.glxn.qrgen.javase.QRCode;
import org.apache.commons.codec.binary.Base64;

import javax.ws.rs.Path;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Api(value = "QR Code Web Login")
@Path("/")
public class QRCodeWebLoginSecurityCheck extends UserAuthenticationSecurityCheck {

	static final String QR_CODE_UUID = "qrCodeUUID";
	static final String WEB_USER_REGISTRATION_KEY = "webUser";

	private String userId, displayName;

	@Override
	protected AuthenticatedUser createUser() {
		return new AuthenticatedUser(userId, displayName, this.getName());
	}

	protected boolean validateCredentials(Map<String, Object> map) {
		AuthenticatedUser webUser = getWebUser();
		if (webUser != null) {
			userId = webUser.getId();
			displayName = webUser.getDisplayName();
			removeWebUser();
			return true;
		} else {
			return false;
		}
	}

	protected Map<String, Object> createChallenge() {
		AuthenticatedUser webUser = getWebUser();
		Map <String, Object> challenge = new HashMap<> ();
		if (webUser != null) {
			challenge.put("isRegistered", true);
		} else {
			String qrUUID = UUID.randomUUID().toString();
			registrationContext.getRegisteredPublicAttributes().put(QR_CODE_UUID, qrUUID);

			ByteArrayOutputStream stream = QRCode.from(qrUUID).to(ImageType.JPG).withSize(300,300).stream();
			String encodedImage = Base64.encodeBase64String(stream.toByteArray());
			challenge.put("qrCode", encodedImage);
		}




		return challenge;
	}

	private AuthenticatedUser getWebUser () {
		return registrationContext.getRegisteredPublicAttributes().get(WEB_USER_REGISTRATION_KEY, AuthenticatedUser.class);
	}

	private void removeWebUser() {
		registrationContext.getRegisteredPublicAttributes().put(WEB_USER_REGISTRATION_KEY, null);
	}
 }

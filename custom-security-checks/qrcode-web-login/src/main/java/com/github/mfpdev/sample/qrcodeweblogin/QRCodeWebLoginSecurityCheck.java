/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.github.mfpdev.sample.qrcodeweblogin;

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
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
public class QRCodeWebLoginSecurityCheck extends CredentialsValidationSecurityCheck {
	private UUID uuid;


	protected boolean validateCredentials(Map<String, Object> map) {
		return false;
	}

	protected Map<String, Object> createChallenge() {
		String clientId = registrationContext.getRegisteredProtectedAttributes().get(QRCodeResource.CLIENT_ID);

		uuid = UUID.randomUUID();

		ByteArrayOutputStream stream = QRCode.from(clientId + ":" + uuid).to(ImageType.JPG).withSize(300,300).stream();
		String encodedImage = Base64.encodeBase64String(stream.toByteArray());
		Map <String, Object> challenge = new HashMap<> ();

		challenge.put("qrCode", encodedImage);
		return challenge;
	}
}

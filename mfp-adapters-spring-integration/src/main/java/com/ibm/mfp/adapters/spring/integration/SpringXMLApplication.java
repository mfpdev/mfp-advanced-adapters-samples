package com.ibm.mfp.adapters.spring.integration;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

@Configuration
@ImportResource(value = "applicationContext.xml")
public class SpringXMLApplication extends SpringBaseApplication {


}

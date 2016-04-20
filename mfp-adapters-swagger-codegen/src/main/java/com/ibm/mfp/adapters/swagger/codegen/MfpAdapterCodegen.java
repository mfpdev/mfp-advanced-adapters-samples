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
package com.ibm.mfp.adapters.swagger.codegen;

import io.swagger.codegen.CodegenConstants;
import io.swagger.codegen.CodegenOperation;
import io.swagger.codegen.CodegenResponse;
import io.swagger.codegen.CodegenSecurity;
import io.swagger.codegen.CodegenType;
import io.swagger.codegen.SupportingFile;
import io.swagger.codegen.languages.JavaJerseyServerCodegen;
import io.swagger.models.properties.ArrayProperty;
import io.swagger.models.properties.MapProperty;
import io.swagger.models.properties.Property;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
/*
 * Extends Swagger default Jaxrs codegen and customizes for MFP JavaAdapter requirements
 */
public class MfpAdapterCodegen extends JavaJerseyServerCodegen  {
	
  private static final String SERVICE_FACTORY_CLASSNAME = "serviceFactoryClassname";
  private static final String AUTO_WIRED_SPRING_SERVICE = "autowiredSpringService";

  // source folder where to write the files
  //protected String sourceFolder = "src";
  protected String apiVersion = "1.0.0";
  
  /**
   * Configures the type of generator.
   * 
   * @return  the CodegenType for this generator
   * @see     io.swagger.codegen.CodegenType
   */
  public CodegenType getTag() {
    return CodegenType.SERVER;
  }

  /**
   * Configures a friendly name for the generator.  This will be used by the generator
   * to select the library with the -l flag.
   * 
   * @return the friendly name for the generator
   */
  public String getName() {
    return "MFPAdapter";
  }

  /**
   * Returns human-friendly help for the generator.  Provide the consumer with help
   * tips, parameters here
   * 
   * @return A string value for the help message
   */
  public String getHelp() {
    return "Generates a MFPAdapter client library.";
  }

  public MfpAdapterCodegen() {
    super();

    // set the output folder here
    outputFolder = "./java/main/generated";

    /**
     * Models.  You can write model files using the modelTemplateFiles map.
     * if you want to create one template for file, you can do so here.
     * for multiple files for model, just put another entry in the `modelTemplateFiles` with
     * a different extension
     */
    modelTemplateFiles.put(
      "model.mustache", // the template to use
      ".java");       // the extension for each file to write

    /**
     * Api classes.  You can write classes for each Api file with the apiTemplateFiles map.
     * as with models, add multiple entries with different extensions for multiple files per
     * class
     */
    apiTemplateFiles.put("api.mustache", ".java");
    apiTemplateFiles.put("apiService.mustache", ".java");
    
        //remove templates added by base classes since they are not relevant here
    apiTemplateFiles.remove("apiServiceImpl.mustache");
    apiTemplateFiles.remove("apiServiceFactory.mustache");
    
    
    
    /**
     * Template Location.  This is the location which templates will be read from.  The generator
     * will use the resource stream to attempt to read the templates.
     */
    embeddedTemplateDir = templateDir = "MFPAdapter";

    /**
     * Api Package.  Optional, if needed, this can be used in templates
     */
    apiPackage = "com.ibm.mfp.adapters.sample.api";

    /**
     * Model Package.  Optional, if needed, this can be used in templates
     */
    modelPackage = "com.ibm.mfp.adapters.sample.model";
    
    sourceFolder = ".";

    /**
     * Reserved words.  Override this with reserved words specific to your language
     */
    /*reservedWords = new HashSet<String> (
      Arrays.asList(
        "sample1",  // replace with static values
        "sample2")
    );*/

    /**
     * Additional Properties.  These values can be passed to the templates and
     * are available in models, apis, and supporting files
     */
    additionalProperties.put("apiVersion", apiVersion);

    /**
     * Supporting Files.  You can write single files for the generator with the
     * entire object tree available.  If the input file has a suffix of `.mustache
     * it will be processed by the template engine.  Otherwise, it will be copied
     */
    /* supportingFiles.add(new SupportingFile("myFile.mustache",   // the input template or file
      "",                                                       // the destination folder, relative `outputFolder`
      "myFile.sample")                                          // the output file
    );*/

    /**
     * Language Specific Primitives.  These types will not trigger imports by
     * the client generator
     */
    /*languageSpecificPrimitives = new HashSet<String>(
      Arrays.asList(
        "Type1",      // replace these with your types
        "Type2")
    );*/
  }
  
  @Override
  public void processOpts() {
      super.processOpts();
      
      String adapterJaxrsApplication = (additionalProperties.get("adapterApplicationClassname")) != null ? 
    		  								(String)(additionalProperties.get("adapterApplicationClassname")) + ".java" : "DefaultAdapterApplication.java";

      if ( additionalProperties.containsKey(CodegenConstants.IMPL_FOLDER) ) {
          implFolder = (String) additionalProperties.get(CodegenConstants.IMPL_FOLDER);
      }
      
      if ( additionalProperties.containsKey(SERVICE_FACTORY_CLASSNAME) ) {
    	  apiTemplateFiles.put("apiServiceFactoryIfc.mustache", ".java");
    	  apiTemplateFiles.put("apiServiceFactoryFinder.mustache", ".java");
    	  apiTemplateFiles.put("apiServiceFactoryFinderException.mustache", ".java");
      }
      
      if ( additionalProperties.containsKey(AUTO_WIRED_SPRING_SERVICE) ) {
    	  Boolean value = (Boolean)additionalProperties.get(AUTO_WIRED_SPRING_SERVICE);
    	  if ( !value.booleanValue() ) {
    		  additionalProperties.remove(AUTO_WIRED_SPRING_SERVICE);
    	  }
      }

      supportingFiles.clear();
      //supportingFiles.add(new SupportingFile("pom.mustache", "", "pom.xml"));
      //supportingFiles.add(new SupportingFile("adapter.mustache", "/src/main/adapter-resources", "adapter.xml"));
      //supportingFiles.add(new SupportingFile("adapterJaxrsApplication.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), adapterJaxrsApplication));
      //writeOptional(outputFolder, new SupportingFile("README.mustache", "", "README.md"));
      supportingFiles.add(new SupportingFile("ApiException.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "ApiException.java"));
      supportingFiles.add(new SupportingFile("ApiResponseMessage.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "ApiResponseMessage.java"));
      supportingFiles.add(new SupportingFile("NotFoundException.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "NotFoundException.java"));
      
      if ( additionalProperties.containsKey("dateLibrary") ) {
          setDateLibrary(additionalProperties.get("dateLibrary").toString());
          additionalProperties.put(dateLibrary, "true");
      }

      if ( "joda".equals(dateLibrary) ) {
          supportingFiles.add(new SupportingFile("JodaDateTimeProvider.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "JodaDateTimeProvider.java"));
          supportingFiles.add(new SupportingFile("JodaLocalDateProvider.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "JodaLocalDateProvider.java"));
      } else if ( "java8".equals(dateLibrary) ) {
          supportingFiles.add(new SupportingFile("LocalDateTimeProvider.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "LocalDateTimeProvider.java"));
          supportingFiles.add(new SupportingFile("LocalDateProvider.mustache", (sourceFolder + '/' + apiPackage).replace(".", "/"), "LocalDateProvider.java"));
      }
  }
  
  @Override
  public String apiFilename(String templateName, String tag) {
      String result = super.apiFilename(templateName, tag);

      if ( templateName.endsWith("Impl.mustache") ) {
          int ix = result.lastIndexOf('/');
          result = result.substring(0, ix) + "/impl" + result.substring(ix, result.length() - 5) + "ServiceImpl.java";
          result = result.replace(apiFileFolder(), implFileFolder(implFolder));
      } else if ( templateName.endsWith("FactoryFinder.mustache") ) {
    	  int ix = result.lastIndexOf('.');
    	  result = result.substring(0, ix) + "ServiceFactoryFinder.java";
      } else if ( templateName.endsWith("FactoryIfc.mustache") ) {
          int ix = result.lastIndexOf('.');
          result = result.substring(0, ix) + "ServiceFactoryIfc.java";
      } else if ( templateName.endsWith("ServiceFactoryFinderException.mustache") ) {
    	  int ix = result.lastIndexOf('/');
    	  result = result.substring(0, ix) + "/ServiceFactoryFinderException.java";
      }
      return result;
  }
  
  @Override
  public Map<String, Object> postProcessOperations(Map<String, Object> objs) {
	  super.postProcessOperations(objs);
	  
	  @SuppressWarnings("unchecked")
      Map<String, Object> operations = (Map<String, Object>) objs.get("operations");
      if ( operations != null ) {
          @SuppressWarnings("unchecked")
          List<CodegenOperation> ops = (List<CodegenOperation>) operations.get("operation");
          for ( CodegenOperation operation : ops ) {
        	  if ( operation.authMethods != null ) {
        		  List<CodegenSecurity> methodsToRemove = new ArrayList<CodegenSecurity>();
        		  for ( CodegenSecurity aMethod : operation.authMethods ) {
        			  boolean clearScopes = false;
        			  if ( aMethod.scopes != null && aMethod.scopes.size() > 0 ) {
	        			  for ( Map<String, Object> aScope : aMethod.scopes ) {
	        				  if ( aScope.get("scope").equals("DEFAULT_SCOPE") ) {
	        					  if ( aMethod.scopes.size() > 1 ) {
	        						  throw new RuntimeException("No multiple scopes allowed if DEFAUL_SCOPE is specified for " + 
	        								  						operation.operationId + "->" + aMethod.name);	
	        					  } else 
	        						  clearScopes = true;
	        				  }
	        			  }
        			  } else {
        				  methodsToRemove.add(aMethod);
        			  }
        			  
        			  if ( clearScopes ) {
        				  aMethod.scopes.clear();
        				  aMethod.scopes = null;
        			  }
        		  }
        		  for ( CodegenSecurity aMethod : methodsToRemove ) {
        			  operation.authMethods.remove(aMethod);
        		  }
        	  }
        	  
          }
      }
      return objs;
  }
  
      
  private String implFileFolder(String output) {
      return outputFolder + "/" + output + "/" + apiPackage().replace('.', '/');
  }

  /**
   * Escapes a reserved word as defined in the `reservedWords` array. Handle escaping
   * those terms here.  This logic is only called if a variable matches the reseved words
   * 
   * @return the escaped term
   */
  @Override
  public String escapeReservedWord(String name) {
    return "_" + name;  // add an underscore to the name
  }

  /**
   * Location to write model files.  You can use the modelPackage() as defined when the class is
   * instantiated
   */
  @Override
  public String modelFileFolder() {
    return outputFolder + "/" + sourceFolder + "/" + modelPackage().replace('.', File.separatorChar);
  }

  /**
   * Location to write api files.  You can use the apiPackage() as defined when the class is
   * instantiated
   */
  @Override
  public String apiFileFolder() {
    return outputFolder + "/" + sourceFolder + "/" + apiPackage().replace('.', File.separatorChar);
  }
  
  @Override
  public String outputFolder() {
      return outputFolder;
  }
  
  @Override
  public String getOutputDir() {
      return outputFolder();
  }
  
  @Override
  public void setOutputDir(String dir) {
      this.outputFolder = dir;
  }
  
}
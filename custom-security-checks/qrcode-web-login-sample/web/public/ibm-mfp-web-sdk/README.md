
## Core Web-sdk

Learn how to integrate the MobileFirst Foundation Web SDK in a web application [here](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adding-the-mfpf-sdk/web/)

## Analytics Web-sdk

  By default ibmmfpfanalytics is enabled, meaning data is passed to the ibmmfpfanalytics. You can explicitly enable or disable persistent data capture by calling ibmmfpfanalytics.enable
  or ibmmfpfanalytics.disable.
 
  Note: The data collected via the ibmmfpfanalytics API and sent to the IBM MobileFirst server, is then available in the Operational
  Analytics engine console (Apps -> Client Log Search).
  The IBM MobileFirst ibmmfpfanalytics API provides the ability to enable, disable, and log custom events to analytics and send it to the server.
 
  The IBM MobileFirst ibmmfpfanalytics was coded using the UMD pattern for javascript. This means it can be used as a separate module or used under the global context.  
  
  Following are examples of integrating the IBM MobileFirst ibmmfpfanalytics as a module, using 'define', and an example of integrating the IBM MobileFirst ibmmfpfanalytics on the global context.
  
  Example usage as module, using 'define':
  -----------------------------------
  define([
  	'ibmmfpfanalytics'
  ], function(ibmmfpfanalytics){
  	ibmmfpfanalytics.send();  
  }
  );
  
  
  Example usage on global context:
  -----------------------------------
  <script src="ibmmfpfanalytics.js"></script>
  <script>
  	ibmmfpfanalytics.send();
  </script>
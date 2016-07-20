

/**
 * ================================================================= 
 * Source file taken from :: ibmmfpfanalytics.d.ts
 * ================================================================= 
 */

interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
}

declare class Promise<T> implements Thenable<T> {
	/**
	 * If you call resolve in the body of the callback passed to the constructor,
	 * your promise is fulfilled with result object passed to resolve.
	 * If you call reject your promise is rejected with the object passed to reject.
	 * For consistency and debugging (eg stack traces), obj should be an instanceof Error.
	 * Any errors thrown in the constructor callback will be implicitly passed to reject().
	 */
	constructor(callback: (resolve: (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);

	/**
	 * onFulfilled is called when/if "promise" resolves. onRejected is called when/if "promise" rejects.
	 * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
	 * Both callbacks have a single parameter , the fulfillment value or rejection reason.
	 * "then" returns a new promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
	 * If an error is thrown in the callback, the returned promise rejects with that error.
	 *
	 * @param onFulfilled called when/if "promise" resolves
	 * @param onRejected called when/if "promise" rejects
	 */
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;

	/**
	 * Sugar for promise.then(undefined, onRejected)
	 *
	 * @param onRejected called when/if "promise" rejects
	 */
	catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}

declare namespace Promise {
	/**
	 * Make a new promise from the thenable.
	 * A thenable is promise-like in as far as it has a "then" method.
	 */
	function resolve<T>(value?: T | Thenable<T>): Promise<T>;

	/**
	 * Make a promise that rejects to obj. For consistency and debugging (eg stack traces), obj should be an instanceof Error
	 */
	function reject(error: any): Promise<any>;
	function reject<T>(error: T): Promise<T>;

	/**
	 * Make a promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
	 * the array passed to all can be a mixture of promise-like objects and other objects.
	 * The fulfillment value is an array (in order) of fulfillment values. The rejection value is the first rejection value.
	 */
	function all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>, T10 | Thenable<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    function all<T1, T2, T3, T4, T5, T6, T7>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    function all<T1, T2, T3, T4, T5, T6>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>, T6 | Thenable<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    function all<T1, T2, T3, T4, T5>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>, T5 | Thenable<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    function all<T1, T2, T3, T4>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable<T4>]): Promise<[T1, T2, T3, T4]>;
    function all<T1, T2, T3>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>]): Promise<[T1, T2, T3]>;
    function all<T1, T2>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>]): Promise<[T1, T2]>;
    function all<T>(values: (T | Thenable<T>)[]): Promise<T[]>;

	/**
	 * Make a Promise that fulfills when any item fulfills, and rejects if any item rejects.
	 */
	function race<T>(promises: (T | Thenable<T>)[]): Promise<T>;
}

declare module ibmmfpfanalytics {

	/**
	 * Initializes the ibmmfpfanalytics.
	 *
	 * @example
	 * ibmmfpfanalytics.init('device-uuid-12345', 'application1', 'mfp');
	 *
	 * @param {string} deviceID The deviceId.
	 * @param {string} appName The Application name.
	 * @param {string} contextRoot The the context root (default is mfp).
	 *
	 * @methodOf ibmmfpfanalytics#
	 */
	function init(deviceID: string, appName: string, contextRoot: string): void;

	/**
	 * Turns on/off the capture of analytics data, according to the value off enableLogs.
	 *
	 * @example
	 * ibmmfpfanalytics.enable(true)
	 * 
	 * @methodOf ibmmfpfanalytics#
	 */
	function enable(enableLogs: boolean): void;

	/**
	 * Get the current state of ibmmfpfanalytics.
	 *
	 * The state object is kept by ibmmfpfanalytics and contains the following key:
	 * 
	 *   enabled (boolean) - Value is true if capture is enabled, false otherwise.
	 *
	 * @returns {Object} the current state of ibmmfpfanalytics.
	 * @methodOf ibmmfpfanalytics#
	 */
	function state(): Object;

	/**
	 *
	 * Send any analytics data collected up to this point to the IBM MobileFirst server.
	 * 
	 * @returns {Promise} Resolved with success status, rejected with an error message.
	 * @example
	 * ibmmfpfanalytics.send()
	 * .then(function (response) {
     *	console.log(response);
     * })
     *.catch(function (error) {
     *	console.log(error);
     *  });
     *	 	 
	 * @methodOf ibmmfpfanalytics#
	 * @name ibmmfpfanalytics#send
	 */
	function send(): Promise<Object>;


	/**
	 * 
	 * Stops the current app session and starts new session for the given user.
	 * 
	 * @example
	 * ibmmfpfanalytics.setUserContext("user1");
	 * 	 
	 * @param {string} user The name of the user.
	 * @methodOf ibmmfpfanalytics#
	 * @name ibmmfpfanalytics#setUserContext
	 */
	function setUserContext(user: string): void;

	/**
	 * 
	 * Enable/Disable the Auto send Logs feature.
	 * If enabled the logs will be auto sent when getting a reply for a Resource Request.
	 * 
	 * @param {boolean} [autoSend]
	 * @example
	 * ibmmfpfanalytics.setAutoSendLogs(true);
	 * 
	 * @methodOf ibmmfpfanalytics#
	 * @name ibmmfpfanalytics#setAutoSendLogs
	 */
	function setAutoSendLogs(autoSend: boolean): void;

	/**
	 * 
	 * Logs custom event data to ibmmfpfanalytics, to be used by IBM MobileFirst server.
	 * 
	 * @param {Object|string} [message] The message to log.
	 * @example
	 * ibmmfpfanalytics.addEvent({'Purchases':'radio'});
	 * ibmmfpfanalytics.addEvent({'src':'App landing page','target':'About page'});
	 * 
	 * @methodOf ibmmfpfanalytics#
	 * @name ibmmfpfanalytics#addEvent
	 */
	function addEvent(message: string | Object): void;

	class logger {
		/**
		* Get the current state of ibmmfpfanalytics.logger
		*
		* @returns {Object} the current state of ibmmfpfanalytics.logger
		* @methodOf ibmmfpfanalytics.logger#
		*/
		static state(): Object;


		/**
		 * Sets the logger package name and returns the logger.
		 *
		 * The logger that is returned is then available for the next call only. Any further calls should set the package name again.
		 *
		 * @example
		 * logger.pkg('pkg1').log('example');
		 *
		 * @returns {logger} related with the package set.
		 * @memberof ibmmfpfanalytics.logger
		 * @method pkg
		 */
		static pkg(packageName): ibmmfpfanalytics.logger;

		/**
		 * Gets the logger configuration definitions from the server and updates the SDK.
		 *
		 * @returns {Promise} Resolved with the configuration returned from server, rejected with an error message.
		 * @example
		 * logger.updateConfigFromServer()
		 * .then(function (response) {
		 *	console.log(response);
		 * })	 
		 *.catch(function (error) {
		 *	console.log(error);
		 *  });
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method updateConfigFromServer
		 */
		static updateConfigFromServer(): Promise<Object>;;

		/**
		 *
		 * Logs a message with additional contextual information at the trace level.
		 *
		 * Log messages are automatically added to a persistent queue. The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit ibmmfpfanalytics.send function call.
		 *
		 * @example
		 * logger.trace('my record');
		 * // or
		 * logger.trace({data: [1,2,3]});
		 * // or
		 * logger.trace({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method trace
		 */
		static trace(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the trace level.
		 *
		 * Log messages are automatically added to a persistent queue. The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit ibmmfpfanalytics.send function call.
		 *
		 * @example
		 * logger.trace('my record');
		 * // or
		 * logger.trace({data: [1,2,3]});
		 * // or
		 * logger.trace({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method trace
		 */
		trace(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the debug level
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.debug('my record');
		 * // or
		 * logger.debug({data: [1,2,3]});
		 * // or
		 * logger.debug({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method debug
		 */
		static debug(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the debug level
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.debug('my record');
		 * // or
		 * logger.debug({data: [1,2,3]});
		 * // or
		 * logger.debug({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method debug
		 */
		debug(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at log level.
		 *
		 * <p>Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.log('my record');
		 * // or
		 * logger.log({data: [1,2,3]});
		 * // or
		 * logger.log({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 * 
		 * @memberof ibmmfpfanalytics.logger
		 * @method log
		 */
		static log(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at log level.
		 *
		 * <p>Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.log('my record');
		 * // or
		 * logger.log({data: [1,2,3]});
		 * // or
		 * logger.log({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string|Object} message The message to log.
		 * @param {string} name The name of the message to log.
		 * 
		 * @memberof ibmmfpfanalytics.logger
		 * @method log
		 */
		log(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the info level
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.info('my record');
		 * // or
		 * logger.info({data: [1,2,3]});
		 * // or
		 * logger.info({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method info
		 */
		static info(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the info level
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.info('my record');
		 * // or
		 * logger.info({data: [1,2,3]});
		 * // or
		 * logger.info({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method info
		 */
		info(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the warning level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.warn('my record');
		 * // or
		 * logger.warn({data: [1,2,3]});
		 * // or
		 * logger.warn({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method warn
		 */
		static warn(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the warning level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobileFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.warn('my record');
		 * // or
		 * logger.warn({data: [1,2,3]});
		 * // or
		 * logger.warn({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method warn
		 */
		warn(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the error level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobielFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.error('my record');
		 * // or
		 * logger.error({data: [1,2,3]});
		 * // or
		 * logger.error({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method error
		 */
		static error(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the error level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® MobielFirst® server with the next explicit logger.send function call.
		 *
		 * @example
		 * logger.error('my record');
		 * // or
		 * logger.error({data: [1,2,3]});
		 * // or
		 * logger.error({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method error
		 */
		error(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the fatal level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® Worklight® server with the next explicit logger.send function call.</p>
		 *
		 * @example
		 * logger.fatal('my record');
		 * // or
		 * logger.fatal({data: [1,2,3]});
		 * // or
		 * logger.fatal({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method fatal
		 */
		static fatal(message: string | Object, name: string): void;

		/**
		 *
		 * Logs a message with additional contextual information at the fatal level.
		 *
		 * Log messages are automatically added to a persistent queue.  The accumulated data is automatically sent
		 * to IBM® Worklight® server with the next explicit logger.send function call.</p>
		 *
		 * @example
		 * logger.fatal('my record');
		 * // or
		 * logger.fatal({data: [1,2,3]});
		 * // or
		 * logger.fatal({data: [1,2,3]}, 'MyData');
		 *
		 * @param {string or object} [message] The message to log.
		 * @param {string} [name] The name of the message to log.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method fatal
		 */
		fatal(message: string | Object, name: string): void;

		/**
		 *
		 * Set the capture property of logger.
		 *
		 * @example
		 * logger.capture(true);
		 * @param {boolean} captureFlag true, for capturing log messages, false - for not capturing log messages.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method capture
		 */
		static capture(captureFlag: boolean): void;


		/**
		 *
		 * Set the enablement property of logger
		 *
		 * @example
		 * logger.enable(true);
		 * @param {boolean} enablementFlag true, for enabling log messages, false - for not enabling log messages.
		 *
		 * @memberof ibmmfpfanalytics.logger
		 * @method enable
		 */
		static enable(enablementFlag: boolean): void;
	}
}


/**
 * ================================================================= 
 * Source file taken from :: securityutils.d.ts
 * ================================================================= 
 */

declare module WL.SecurityUtils {

		/**
       * Generates a key by using the PBKDF2 algorithm.
       * 
       * @param {Object} options Required.
       * @param {string} options.password Required. Password that is used to generate the key.
       * @param {string} options.salt Required. Salt that is used to to generate the key.
       * @param {number} options.iterations Required. Number of iterations that is used for the key generation algorithm.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the hex encoded key.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function keygen(options: Object): WLPromise;

		/**
       * Encrypts text with a key.
       * 
       * @param {Object} options Required.
       * @param {string} options.key Required. Text to encrypt.
       * @param {string} options.text Required. Key that is used for encryption.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is an object which includes the cipher text.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function encrypt(options: Object): WLPromise;

		/**
       * Decryption function.
       * 
       * @param {Object} options Required.
       * @param {string} options.key Required. Key.
       * @param {string} options.ct Required. Cipher Text.
       * @param {string} options.iv Required. Initialization Vector.
       * @param {string} options.src Required. Source ('obj' = iOS, 'java' = Android, 'js' = Web).
       * @param {number} options.v Required. Version.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the decrypted text.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function decrypt(options: Object): WLPromise;

		/**
       * Generates a random hex string locally.
       * 
       * @param {number} [bytes] Optional. Number of bytes that is used to generate the string. Default is 32 bytes.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the random hex string.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function localRandomString(bytes?: number): WLPromise;

		/**
       * Encodes input as base64 string.
       * 
       * @param {string} input Required. Input string.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the input string encoded.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function base64Encode(input: string): WLPromise;

		/**
       * Decodes input base64 string to a non base64 encoded string.
       * 
       * @param {string} input Required. Input base64 encoded string.
       *
       * @return {Promise} Resolved when the operation succeeds, first parameter is the input string decoded.
       *   Rejected when there is a failure.
       *   
       * @methodOf WL.SecurityUtils#
       */
    function base64Decode(input: string): WLPromise;

		/**
      	 * ONLY FOR IOS
         * Choose wether internal/native or openssl basaed encryption will be applied.
         *
         * @param {boolean} enable Required. true native false openssl.
         *
         * @return {Promise} Resolved when the operation succeeds.
         *   Rejected when there is a failure.
         *
         * @methodOf WL.SecurityUtils#
         */
    function enableOSNativeEncryption(enable: boolean): WLPromise;
}


/**
 * ================================================================= 
 * Source file taken from :: wlapp.d.ts
 * ================================================================= 
 */


declare module WL.App {

		/**
         * @deprecated Since version 8.0
    	 * @description Shows the default IBM MobileFirst splash screen on the activity that was passed as a parameter
    	 * @methodOf WL.App#
    	 * @name WL.App#showSplashScreen
    	 */
    function showSplashScreen(): void;

		/**
         * @deprecated Since version 8.0
    	 * @description Hides the default IBM MobileFirst splash screen if it is shown, 
    	 * and does nothing if the default MobileFirst splash screen is already hidden
    	 * @methodOf WL.App#
    	 * @name WL.App#hideSplashScreen
    	 */
    function hideSplashScreen(): void;


		/**
    	 * This method is applicable to iOS, Android and WP8.
    	 * @description
    	 * Sets the MobileFirst server URL to the specified URL.
    	 *
    	 * Changes the MobileFirst server URL to the new URL, cleans the HTTP client context, and calls successCallback when finished.
    	 * After calling this method, the application is not logged in to any server.
    	 * If the specified URL is malformed, then failCallback is called and the MobileFirst server URL remains unchanged.
    	 *
    	 * Notes:
    	 * The responsibility for checking the validity of the URL is on the developer.
    	 * When using this function you might want to perform additional clean-up, for example partial or full wipe of JSONStore or HTML5 LocalStorage. 
    	 * For more information on clean-up, see {@link WL.JSONStore}.
    	 * 
    	 * @example
    	 * WL.App.setServerUrl("http://9.148.23.88:10080/context", successCallback, failCallback);
    	 * 
    	 * @param {string} url Mandatory. The URL of the new server, including protocol, IP, port, and context.
    	 * @param successCallback Optional. The callback function that is called after the MobileFirst URL is set to the specified URL.
    	 * @param failCallback Optional. The callback function that is called if this method fails or is not supported.
    	 * @methodOf WL.App#
    	 */
    function setServerUrl(url: string, successCallback?: Function, failCallback?: Function ): void;

		/**
    	 * @description
    	 * Gets MobileFirst server URL.
    	 * This method is asynchronous, so the MobileFirst server URL is returned as an argument to the successCallback function.
    	 * 
    	 * @param successCallback Mandatory. The callback function that is called with the MobileFirst server URL as an argument.
    	 * @param failCallback Optional. The callback function that is called if this method fails.
    	 * @methodOf WL.App#
    	 */
    function getServerUrl(successCallback: Function , failCallback?: Function): void;

		/**
    	 * Extracts a string that contains an error message.
    	 * @description 
    	 * 
    	 * Extracts a string that contains the error message within the specified exception object. 
    	 * Use for exceptions that are thrown by the IBM MobileFirst client runtime framework.
    	 * @param {exception} exception Mandatory. The exception object from which the error string is extracted.
    	 * @methodOf WL.App#
    	 * @name WL.App#getErrorMessage
    	 */
    function getErrorMessage(exception: any): string;

}

declare module WL.NativePage {

		/**
		 * @deprecated Since version 8.0
     	 * Switches the currently displayed, web-based screen with a natively written page
    	 * @param className Mandatory. String. The name of the native class. For iOS, the name of the class (for example, BarCodeController). 
    	 * 		For Android, the complete name of the class and package (for example, com.neebula.barcode.Scanner). 
    	 * @param callback Mandatory. Function. A function object that is called when the native page switches back to the web view. 
    	 * 		This function is passed a single JSON object parameter when invoked.
    	 * @param data Optional. Object. A JSON object that is sent to the native class. For iOS, The data must be single string or a flat record of strings.
    	 *
    	 * @example
    	 * // Good
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1'});
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1', key2 : 'value2'});
    	 *
    	 * // Bad
    	 * WL.NativePage.show("com.scan.BarCode", function(data){alert(data);}, {key1 : 'value1', innerStruct : {innerKey1 : 'innervalue1'}});
     	 *
     	 * @methodOf WL.NativePage#
    	 * @name WL.NativePage#show
    	 */
    function show(className: string, callback: Function, data?: Object): void;
}


/**
 * ================================================================= 
 * Source file taken from :: wlauthorizationmanager.web.d.ts
 * ================================================================= 
 */

declare module WL.AuthorizationManager {

		/**
		 * @description Obtains an access token for the specified resource scope from the MobileFirst authorization server.
		 * @param {String} scope Optional. Scope for which to obtain the access token. 
		 * @returns A promise object that can be used to receive the access token asynchronously.
		 *   The access token is sent as an object with the following properties:
		 *   	scope - the scope which the access token was obtained for.
		 *		value - the access token value.
		 *		asAuthorizationRequestHeaderField - the access token value required for an authorization header.
		 *		asFormEncodedBodyParameter - the access token value required for the HTTP-request entity body.
	     * @example    
		 * WLAuthorizationManager.obtainAccessToken(scope)
		 * .then (
		 *   function(accessToken) {
		 * 	   // success flow with the access token
		 *   },
		 *   function(error) {
		 *     // failure flow
		 *   }
		 * };
		 * 
	     * @methodOf WL.AuthorizationManager#
		 */
    function obtainAccessToken(scope?: string): WLPromise;
    
		/**
	     * @description Logs into the specified security check.
	     * @param {String} securityCheck Mandatory. Name of the security check to log into.
	     * @param {Object} credentials Mandatory. Credentials for logging into the specified security check.
	     * @returns A promise object that can be used to login asynchronously.
	     * @methodOf WLAuthorizationManager#
	    */
	function login(securityCheck: string, credentials: Object): WLPromise;
	
	    /**
	     * @description Logs out of the specified security check.
	     * @param {String} securityCheck Mandatory. Name of the security check to log out of.
	     * @returns A promise object that can be used to logout asynchronously.
	     * @methodOf WLAuthorizationManager#
	     */
	function logout(securityCheck: string): WLPromise;
	    
		/**
		 * @description Checks whether the provided response status and headers represent a protected resource that requires authorization.
		 * @param {Integer} responseStatus Mandatory. Specifies the response status code.
		 * @param {String} responseHeaders Mandatory. A String representation of the response headers separated by CRLF, as returned from XMLHttpRequest.getAllResponseHeaders().
		 * @returns A boolean value, indicating whether authorization is required (<code>true</code>), or not (<code>false</code>).
		 * @methodOf WLAuthorizationManager#
		 */
    function isAuthorizationRequired(responseStatus: number, responseHeaders: Object): boolean;
    
		/**
		 * @description Checks whether the provided response status and headers represent a protected resource that requires authorization.
		 * @param {Integer} responseStatus Mandatory. Specifies the response status code.
		 * @param {String} responseHeaders Mandatory. A String representation of the response headers separated by CRLF, as returned from XMLHttpRequest.getAllResponseHeaders().
		 * @returns A boolean value, indicating whether authorization is required (<code>true</code>), or not (<code>false</code>).
		 * @methodOf WLAuthorizationManager#
		 */
	function clearAccessToken(accessToken: Object): WLPromise;

		/**
		 * @description Returns the scope of the protected resource for the provided response headers.<br/>
		 * Note: Call this method only for response headers for which {@link #isAuthorizationRequired(int, Map)}
	   	 * returns {@code true}, indicating that the resource is protected.
		 * @param {String} responseHeaders Mandatory. A String representation of the response headers separated by CRLF, as returned from XMLHttpRequest.getAllResponseHeaders().
		 * @returns The protecting scope of the target resource, as returned in the {@code WWW-Authenticate} HTTP response header.
		 * @methodOf WLAuthorizationManager#
		 */
    function getResourceScope(responseHeaders: string): string;
    
		 /**
	     * @description Sets the URL of the authorization server.
	     * When this method is not called, the MobileFirst Server URL is used.
	     * @param {String} url Mandatory. URL of the authorization server to set.
	     * @returns A promise object.
	     * @methodOf WLAuthorizationManager#
	     */
    function setAuthorizationServerUrl(url: string): WLPromise;
	
	    /**
	     * @description Retrieves the URL of the authorization server.
	     * @returns Returns the URL of the current authorization server, as a String.
	     * @returns A promise object.
	     * @methodOf WLAuthorizationManager#
	     */
    function getAuthorizationServerUrl(): WLPromise;

}


/**
 * ================================================================= 
 * Source file taken from :: wlclient.d.ts
 * ================================================================= 
 */


declare module WL.Client {

		/**
		* @deprecated Since version 8.0
        * Adds an HTTP header to be used in server requests issued by an IBM MobileFirst framework.
        * @description
        * The HTTP header is used in all requests until removed by the WL.Client.removeGlobalHeader API call.
        * @example
        * WL.Client.addGlobalHeader("MyCustomHeader","abcdefgh");
        * @param headerName Mandatory. The name of the header to be added.
        * @param headerValue Mandatory. The value of the header to be added.
        * @methodOf WL.Client#
        */
    function addGlobalHeader(headerName: string, headerValue: string): void;

		/**
		* @deprecated Since version 8.0
        * Identifies the type of environment in which the application is running. Such as iPhone, Android, or Windows.
        * @description
        * @returns A constant that identifies the type of environment. The valid values are defined in the WL.Environment variable in the worklight.js file, and are as follows:
        *
        * WL.Environment.ANDROID
        * WL.Environment.IPAD
        * WL.Environment.IPHONE
        * WL.Environment.MOBILE_WEB
        * WL.Environment.PREVIEW (when the application runs in Preview mode)
        * WL.Environment.WINDOWS_PHONE_8
        * WL.Environment.WINDOWS8
        * WL.Environment.DESKTOPBROWSER
        *
        * When an app is running in Preview mode, this method returns WL.Environment.PREVIEW, regardless of the previewed environment.
        * There are two reasons for this behavior:
        *
        * Environment - specific code can fail when invoked from the browser (because the environment might support features that are not available in the browser).
        *WL.Client behaves differently in different environments (for example, cookie management).
        *
        *A good practice is to rely on the IBM MobileFirst UI optimization framework and separate environment-dependent JS to separate files rather than using the WL.Client.getEnvironment() function.
        * @methodOf WL.Client#
        */
    function getEnvironment(): string;


		/**
        * Initializes the WL.Client object. The options of this method reside in the initOptions.js file.
        * @description
        * @param options An optional options object augmented with the following additional optional properties:
        *
        * 		Timeout:
        * 		An integer value, denoting the timeout in milliseconds.
        * 			The timeout affects all calls from the app to the MobileFirst Server. If not specified, a timeout of 30,000 milliseconds (30 seconds) is used.
        *
        * 		messages:
        * 			A dictionary object for localizing texts, located in the messages.js file. If not specified, the default object Messages (in the same file) is used.
        *
        *
        * 		heartBeatIntervalInSecs:
        * 			An integer value, denoting the interval in seconds between heartbeat messages automatically sent by WLClient to the MobileFirst Server. The default value is 420 (7 minutes).
        *
        * 		connectOnStartup:
        * 			Deprecated: The connectOnStartup init option is deprecated. MobileFirst applications by default are configured to not connect to the MobileFirst Server. If you would like your application to connect to the MobileFirst Server, use WL.Client.connect().
        *
        * 		onConnectionFailure:
        * 			A failure-handling function invoked when connection to the MobileFirst Server, performed on initialization by default, or if the connectOnStartup flag is true, fails.
        *
        * 		onUnsupportedVersion
        * 			A failure-handling function invoked when the current version of the application is no longer supported (a newer application has been deployed to the server). For more information about the signature of failure-handling functions, see The Options Object.
        *
        * 		onRequestTimeout
        * 			A failure-handling function invoked when the init() request times out. For more information about the signature of failure-handling functions, see The Options Object.
        *
        *
        * 		onUserInstanceAccessViolation:
        * 			A failure-handling function invoked when the user is trying to access an application that was provisioned to a different user.
        * 			For more information about the signature of failure-handling functions, see The Options Object.
        *
        * 		onErrorRemoteDisableDenial:
        * 			A failure-handling function invoked when the server denies access to the application, according to rules defined in the IBM MobileFirst Console.
        * 			If this function is not provided, the application opens a dialog box, which displays an error message defined in the IBM MobileFirst Console.
        * 			When used, the function can provide an application-specific dialog box, or can be used to implement additional behavior in situations where the server denies access to the application.
        * 			It is important to ensure that the application remains offline (not connected).
        *
        * 		Parameters:
        * 		message: This parameter contains the notification text that you defined in the MobileFirst Console, which indicates that an application is denied access to the MobileFirst Server.
        * 		downloadLink: This parameter contains the URL that you defined in the MobileFirst Console to download the new version of the application, that users can find in the appropriate application store.
        *
        * 		Example
        * var wlInitOptions = {
        * 	connectOnStartup : true,
        * 	onErrorRemoteDisableDenial : function (message, downloadLink) {
        * 	WL.SimpleDialog.show(
        * 		"Application Disabled",
        * 		message,
        * 		[{text: "Close application", handler: function() {WL.App.close();}},
        * 		{text: "Download new version", handler: function() {WL.App.openURL(downloadLink, "_blank");}}]
        * 		);
        * 	}
        * };
        *
        * 		onErrorAppVersionAccessDenial:
        * 		A failure-handling function invoked when the server denies access to the application, according to rules defined in the IBM MobileFirst Console.
        * 			If this function is used, the developer takes full ownership of the implementation and handling if Remote Disable took place.
        * 			If the failure-handling function is not provided, the application opens a dialog box, which displays an error message defined in the IBM MobileFirst Console.
        * 			Note: onErrorAppVersionAccessDenial is deprecated since V5.0.6. Instead, use onErrorRemoteDisableDenial.
        *
        * 		validateArguments:
        * 		A Boolean value, indicating whether the IBM MobileFirst Client runtime library validates the number and type of method parameters. The default is true.
        *
        * 		autoHideSplash:
        * 		A Boolean value, indicating whether the IBM MobileFirst splash-screen will be auto-hidden. To disable automatic hiding of the splash screen set this property to false. Default is true.
        *
        *
        * @note {Note} The onSuccess function is used to initialize the application.
        * 	If an onFailure function is not passed, a default onFailure function is called. If onFailure is passed, it overrides any specific failure-handling function.
        * @methodOf WL.Client#
        * @name WL.Client#init
        */
    function init(initOptions?: Object): void;

    	/**
        * @deprecated Since version 8.0. Use WLResourceRequest instead
        *
        * Invokes a procedure that is exposed by an IBM MobileFirst adapter. Prior to invoking a procedure, a connect request to the MobileFirst Server is first initiated.
        * @description
        * @param invocationData Mandatory. A JSON block of parameters. For a description of the structure of the parameter block.
        * The WL.Client invokeProcedure function accepts the following JSON block of parameters:
        * {
        * 	adapter : 'adapter-name',
        *	procedure : 'procedure-name',
        *	parameters : []
        * }
        *
        * 		adapter:
        * 		Mandatory. A string that contains the name of the adapter as specified when the adapter was defined.
        *
        * 		procedure:
        * 		Mandatory. A string that contains the name of the procedure as specified when the adapter was defined.
        *
        * 		parameters:
        * 		Optional. An array of parameters that is passed to the back-end procedure.
        *
        * @param options Optional. A standard options object, augmented with the following property:
        *
        *   The success handler response object can contain the following properties:
		*
        * 		    invocationContext:
        * 		    The invocationContext object that was originally passed to the MobileFirst Server in the callback object.
        *
        *		      invocationResult:
        *
        *           An object that contains the data that is returned by the invoked procedure, and the invocation status. Its format is as follows:
        * invocationResult = {
        * 	isSuccessful: Boolean,
        * 	errors : "Error Message"
        * 	// Procedure results go here
        * }
        *
        * 		      Where:
        * 			        isSuccessful – Contains true if the procedure invocation succeeded, false otherwise.
        * 			         If the invocation failed, the failure handler for the request is called.
        * 			        errors – An optional array of strings containing error messages.
        *
        * 			  parameters:
        * 			  Optional. An array of parameters that is passed to the back-end procedure.
        *
        *   timeout: Integer. Number of milliseconds to wait for the server response before failing with a request timeout. The default timeout value is 30000 milliseconds (30 seconds).
        *
        *       The maximum timeout value in any Windows Phone environment is 60000 milliseconds (60 seconds).
        *
        *   The failure handler of this call is called in two cases:
        *
        *       The procedure was called but failed. In this case, the invocationResult property is added to the response received by the failure handler.
        *        This property has the same structure as the invocationResult property returned to the success handler,
        *        but the value of the isSuccessful attribute is false. For the structure of the invocationResult property, see invocationResult.
        *       A technical failure resulted in the procedure not being called. In this case, the failure handler receives a standard response object.
        *
        * @return {Promise} Resolved when the operation is successful. Rejected when there is a failure.
        *
        * @methodOf WL.Client#
        */
    function invokeProcedure(invocationData: Object, options?: Object): WLPromise;
 
 
        /**
        * @deprecated Since version 8.0. Use WLAuthorizationManager.obtainAccessToken() to check connectivity to the server and apply application management rules.
        *
        * This method sends an initialization request to the MobileFirst Platform Server, establishes a connection with the server, validates the application version and provides and Access Token.
        * @description
        * @param options Optional. A standard options object.
        *
        * @methodOf WL.Client#
        */   
       function connect(options?: Object);



    	/**
    	* Pins the host X509 certificate public key to the client application.
    	* Secured calls to the pinned remote host will be checked for a public key match.
    	* Secured calls to other hosts containing other certificates will be rejected.
    	* Some mobile operating systems might cache the certificate validation check results.
    	* Your app must call the certificate pinning method before making a secured request.
    	* Calling this method a second time overrides any previous pinning operation.
		* @param certificateFilename -  the name of the certificate file that is located under
		* the certificate folder located in the application root
		* @return {Promise} Resolved when the operation is successful and the certificate is pinned. Rejected if certificateFilename is undefined, not found or is not in DER format.
		* @methodOf WL.Client#
		*/
    function pinTrustedCertificatePublicKey(certificateFilename: string): WLPromise;

		/**
        * Reloads the application
        * @description It can be used to recover an application from errors. It is preferable to avoid using it and to use alternative error handling mechanisms instead.
        *  		The method is mainly available for compatibility with earlier versions.
        * @methodOf WL.Client#
        */
    function reloadApp(): void;

		/**
		* @deprecated Since version 8.0
        * Removes the global HTTP header added by the WL.Client.addGlobalHeader API call
        * @description
        * @param headerName Mandatory. The name of the header to be removed.
        * @example
        * WL.Client.removeGlobalHeader("MyCustomHeader");
        * @methodOf WL.Client#
        */
    function removeGlobalHeader(headerName: string): void;

		/**
        * Sets the interval of the heartbeat signal.
        * @description Sets the interval of the heartbeat signal sent to the MobileFirst Server to the specified number of seconds.
        * 		The heartbeat is used to ensure that the session with the server is kept alive when the app does not issue any call to the server (such as invokeProcedure).
        * @param interval Mandatory. An integer value, denoting the interval in seconds between heartbeat messages automatically sent by WLClient to the MobileFirst Server.
        * 			An interval value of -1 disables the heartbeat:
        * 			WL.Client.setHeartBeatInterval(-1)
        * @methodOf WL.Client#
        */
    function setHeartBeatInterval(interval: number): void;

		/**
    	 * Retrieves cookies from the native HTTP client.
    	 * @description This function is asynchronous and returns a promise.
    	 *
    	 * The array of cookies will be passed as a parameter to resolve callback.
    	 * @example
    	 * WL.Client.getCookies().then(function(cookies){...})
    	 * @note {Note} HttpOnly and Secure cookies are not returned.
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function getCookies(): WLPromise;

		/**
    	 * Adds a cookie to the native HTTP client.
    	 * @description This function is asynchronous and returns a promise.
    	 * @example
    	 * WL.Client.setCookie(myCookie).then(successFlow);
    	 * @param cookie Mandatory. JSON object with required cookie properties: name, value, domain, path, expires
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function setCookie(cookie: Object): WLPromise;

		/**
    	 * Deletes a cookie from the native HTTP client cookie storage.
    	 * @description This function is asynchronous and returns a promise.
    	 * @example
    	 * WL.Client.deleteCookie(myCookie).then(successFlow);
    	 * @param name Mandatory. Cookie name.
    	 * @returns Promise
    	 * @methodOf WL.Client#
    	 */
    function deleteCookie(name: string): WLPromise;

		/**
		* @deprecated Since version 8.0
        * Return the language code of the language being used.
        * @description  This method returns the language or dialect code of the language currently being used for the application.
        * @note {Note}  This method is not relevant for mobile operating systems. Use mobile locale methods instead.
        * @returns The language or dialect code of the currently set language, or NULL if no language is set. The language or dialect code has the format ll or ll-cc,
        * 		where ll is a two-letter ISO 639-1 language code and cc is a two-letter ISO 3166-1-alpha-2 country or region code.
        *
        * @methodOf WL.Client#
        */
    function getLanguage(): string;

		/**
	    * Creates a challenge handler responsible for handling responses from a third party gateway.
	    * An arbitrary name must be supplied as a parameter.
	    *
	    * When you create a GatewayCheckChallengeHandler, you must implement the following methods:
	    *
	    * - canHandleResponse() - Called each time that a response is received from the server. It is used to detect whether the response contains data that is related to this challenge handler, and returns TRUE if so, and FALSE if not. If this method returns TRUE, the framework will call handleChallenge.
	    * - handleChallenge() - The MobileFirst framework calls this method only when canHandleResponse(). This function is used to perform required actions, such as hiding the application screen, displaying the login screen, or other actions required to pass the challenge successfully.
	    *
	    * The following APIs are available on the generated GatewayCheckChallengeHandler:
	    *
	    * - cancel() - Notifies the MobileFirst framework that the authentication process needs to be canceled.
	    * The MobileFirst framework then disposes of the original request that triggered the authentication.
	    * - submitLoginForm(reqURL, options, submitLoginFormCallback) - Call this method to send collected credentials to a specific URL. The developer can also specify request parameters, headers, and callback.
	    * - submitSuccess - Call this method to notify the MobileFirst framework that the authentication successfully finished.
	    * The MobileFirst framework then automatically issues the original request that triggered the authentication.
	    *
	    * @param gatewayName An arbitrary name representing the challenge.
	    * @methodOf WL.Client#
	    */
    function createGatewayChallengeHandler(gatewayName: string): WL.Client.GatewayChallengeHandler;

		/**
	   * Creates a challenge handler object to handle challenges that are sent by the MobileFirst Server.
	   *
	   * A SecurityCheckChallengeHandler works only with a security check that is based on the MobileFirst authentication protocol,
	   * that is, server side security check instance extends one of the MobileFirst provided security checks,
	   * There must be only one challenge handler per security check. To comply with the MobileFirst authentication protocol,
	   * the challenge that the challenge handler receives must be a JSON object.
	   * <p>
	   * When you create a SecurityCheckChallengeHandler, you must implement the following methods:
	   *
	   * - handleChallenge() - The MobileFirst framework calls this method only for the relevant challenge. This function is used to perform required actions,
	   * such as hiding the application screen, displaying the login screen, or other actions required to pass the challenge successfully.
	   * - handleSuccess() - This method is called when the MobileFirst Server reports an authentication success.
	   * - handleFailure() - This method is called when the MobileFirst Server reports an authentication failure.
	   *
	   *
	   * The following APIs are available on the generated GatewayCheckChallengeHandler:
	   *
	   * - cancel() - Notifies the MobileFirst framework that the authentication process needs to be canceled.
	   * The MobileFirst framework then disposes of the original request that triggered the authentication.
	   * - submitChallengeAnswer(answer) - Call this method to send an answer back to the security check that triggered this challenge. The answer should be in a JSON format.
	   *
	   * @param securityCheckName security check name that represents the challenge,
	   * Used to identify which security check requires authentication.
	   *
	   * @methodOf WL.Client#
	   *
	   */
    function createSecurityCheckChallengeHandler(securityCheckName: string): WL.Client.SecurityCheckChallengeHandler;


    class AbstractChallengeHandler {

	    isWLHandler: boolean;
			activeRequest: Object;
			requestWaitingList: Object[];

		/**
        * This function is called whenever the response is considered relevant to this challenge. This function is used to perform required actions,
        * such as hiding the application screen, displaying the login screen, or other actions required to pass the challenge successfully.
        * @param challenge Challenge to handle
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#handleChallenge
        */
     handleChallenge(challenge: Object): void;

		/**
        * Notifies the MobileFirst framework that the authentication process needs to be canceled.
		    * The MobileFirst framework then disposes of the original request that triggered the authentication
        * @param err Error message if available
        * @methodOf WL.Client.AbstractChallengeHandler#
        * @name WL.Client.AbstractChallengeHandler#cancel
        */
     cancel(): void;

}

class SecurityCheckChallengeHandler extends AbstractChallengeHandler{
    MAX_NUMBER_OF_FAILURES: number;
		numOfFailures: number;

		/**
		* This method is called when the MobileFirst Server reports an authentication success.
		**/
		handleSuccess(identity?: any): void;

		/**
		* This method is called when the MobileFirst Server reports an authentication failure.
		**/
    handleFailure(err?: any): void;

		/**
		* Call this method to send an answer back to the security check that triggered this challenge. The answer should be in a JSON format.
		**/
		submitChallengeAnswer(answer: Object): void;

}

class GatewayChallengeHandler extends AbstractChallengeHandler{

    	/**
		 * User calls this function when the the challenge was handled successfully.
		 * When a success is submitted, the state of successes is checked for all challenges issued per original request.
		 * What this means is that, if all challenges are successfully met, the original message would be resent automatically.
		 */
        submitSuccess(): void;

		/**
		 * Must be implemented by developer.
		 *
		 * This method will be invoked by the IBM MobileFirst Platform for every server response.
		 * It is responsible to detect whether server response contains data
		 * that should be processed by this challenge handler.
         * @param transport Response that arrived from the server
         * @return true if the response is a challenge that this handler handles
		 */
        canHandleResponse(transport: any): boolean;

		/**
        * Used to send collected credentials to a specific URL. The developer can also specify request parameters, headers, and callback.
        * @param reqURL URL to send data to
        * @param options Other options like timeout, extra headers
        * @param submitLoginFormCallback Callback method when operation is done
        */
     submitLoginForm(reqURL: string, options: Object, submitLoginFormCallback: Function): void;


}

       /**
	    * get device display name from server registration data
	    * @param options include onSucess, onFailure methods
	    * @methodOf WL.Client#
	    */
	  function getDeviceDisplayName(options: Object): void;

	  /**
	    * set device display name to server registration data, cause update registration request to server
	    * @param options include onSucess, onFailure methods
	    * @param deviceDisplayName device display name
	    * @methodOf WL.Client#
	    */
	  function setDeviceDisplayName(deviceDisplayName: string, options: Object): void;
}


/**
 * ================================================================= 
 * Source file taken from :: wlgap.d.ts
 * ================================================================= 
 */



declare module WL.App {

    /**
    * supported only on Android environment
    * returns the screen height
    * @returns {number} screen height
    */
    function getScreenHeight(): number;

    /**
    * supported only on Android environment
    * returns the screen width
    * @returns {number} screen width
    */
    function getScreenWidth(): number;

    /**
    * supported only on Android environment
    * retrieving screen size
    * @param {Function} callback Mandatory function. The callback function that is invoked when the size is received.
    */
    function getScreenSize(callback: Function): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * reset server context
    */
    function resetServerContext(): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * returns user preference value for the given key
    * @param {string} key
    * @param {Object} options
    * @param {Function} options.onSuccess
    * @param {Function} options.onFailure
    */
    function readUserPref(key: string, options: Object): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * writes user preference with the give key,value pair
    * @param {string} key
    * @param {Object} value
    */
    function writeUserPref(key: string, value: Object): void;

    /**
    * supported only on Android, Windows Phone and iOS environments
    * get init parameters
    * @param {string} parameters
    * @param {Function} successCallback Mandatory function.
    * @param {Function} failCallback Mandatory function.
    */
    function getInitParameters(parameters: string, successCallback: Function, failCallback: Function): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * Send an action to the native code. The action will be processed immediately, if the target receiver has been registered. 
     * Otherwise, the action will be stored in the cache and processed as soon as the target receiver becomes available (registered).
     * @param {string} action - a string that identifies target receivers; all receivers registered with the specified action will receive the message.
     * @param {Object} data - an optional data object to be passed to target receivers along with action; 
     * @param {string} tag  
     */
    function sendActionToNative(action: string, data?: Object, tag?: string): void;

    /**
     * supported only on Android, Windows Phone and iOS environments
     * Registers an action receiver. In JavaScript a receiver should be implemented as a callback that can receive an object.
     * @param {string} id - a string that identifies the receiver. This string will be specified in the native code when sending notifications to JavaScript.
     * @param {Function} callback - implementation of receiver. This callback will be called when an action identified by "id" is sent from the native code.
     * @param {string} tag
     */
    function addActionReceiver(id: string, callback: Function, tag?: string): void;
    
    /**
    * supported only on Android, Windows Phone and iOS environments
 	* Removes (unregisters) an action receiver. All further messages addressed to this receiver will be placed to the cache. The pending
 	* messages will be delivered as soon as the receiver is registered again with the same id.
 	* @param id - a string that identifies the receiver to be unregistered.
 	*/
	function removeActionReceiver(id: string): void;
	
}

declare module WL.Badge {

		/**
     	 * Sets the application badge to the number provided.
    	 * @description Sets the application badge to the number provided.
    	 * @note {Note} This object is only applicable to iOS and Windows Phone 8 applications.
    	 * 
    	 * 
    	 * @param number Mandatory. Integer. An integer that is displayed as a badge over the application icon. 
    	 * 		For iOS, a value lesser than or equal to 0 removes the application badge. Values that are too long (5 digits, or more) to be entirely  displayed in an iPhone device are truncated with ellipsis.
    	 *      For Windows Phone 8, a value lesser than or equal to 0 removes the application badge. A number greater than 99 sets the tile count to 99.
    	 * 
     	 * @methodOf WL.Badge#
    	 */
    function setNumber(num: number): void;
}

/**
 * ================================================================= 
 * Source file taken from :: wlproperties.d.ts
 * ================================================================= 
 */

declare module WL{

var AppProperty : {
  DOWNLOAD_APP_LINK: string,
  ENVIRONMENT: string,
  APP_DISPLAY_NAME: string,
  APP_LOGIN_TYPE: string,
  APP_VERSION: string,
  HEIGHT: string,
  IID: string,
  LATEST_VERSION: string,
  LOGIN_DISPLAY_TYPE: string,
  LOGIN_REALM: string,
  MAIN_FILE_PATH: string,
  SHOW_IN_TASKBAR: string,
  THUMBNAIL_IMAGE_URL: string,
  WELCOME_PAGE_URL: string,
  WIDTH: string,
  WORKLIGHT_ROOT_URL: string,
  WORKLIGHT_RELATIVE_URL: string,
  APP_SERVICES_URL: string,
  APP_SERVICES_RELATIVE_URL: string,
  WLCLIENT_TIMEOUT_IN_MILLIS: string
};

var AppLoginType : {
  LOGIN_ON_STARTUP: string,
  LOGIN_ON_DEMAND: string,
  NO_LOGIN: string
};

var UserInfo : {
  IS_USER_AUTHENTICATED: string,
  USER_NAME: string,
  LOGIN_NAME: string,
  USER_ID: string
};

var Orientation : {
  AUTO: number,
  LANDSCAPE: number,
  PORTRAIT: number
};

var FixedViewType : {
  TOP: string,
  BOTTOM: string
};

var Language : {
  DIRECTION_LTR: number,
  DIRECTION_RTL: number,
  LANGUAGES_RTL: string[]
};


var WLErrorCode : {
  UNEXPECTED_ERROR: string,
  API_INVOCATION_FAILURE: string,
  USER_INSTANCE_ACCESS_VIOLATION: string,
  AUTHENTICATION_REQUIRED: string,
  DOMAIN_ACCESS_FORBIDDEN: string,

  // Client Side Errors
  UNRESPONSIVE_HOST: string,
  LOGIN_FAILURE: string,
  REQUEST_TIMEOUT: string,
  PROCEDURE_ERROR: string,
  UNSUPPORTED_VERSION: string,
  UNSUPPORTED_BROWSER: string,
  DISABLED_COOKIES: string,
  CONNECTION_IN_PROGRESS: string,
  AUTHORIZATION_FAILURE: string,
  CHALLENGE_HANDLING_CANCELED: string
};

var FBRealmPopupOptions : {
  width: number,
  height: number
};

var EPField : {

  // NOTICE - value must be equal to the field name!!!
  SUPPORT_COOKIES: string,
  DESKTOP: string,
  WEB: string,
  MOBILE: string,
  USES_AUTHENTICATOR: string,
  SAVES_USERNAME: string,
  HAS_NATIVE_LOGGER: string,
  USES_NATIVE_TOOLBAR: string,
  USES_CORDOVA: string,
  SUPPORT_DIRECT_UPDATE_FROM_SERVER: string,
  SUPPORT_DIAGNOSTIC: string,
  ISIOS: string,
  WEB_BROWSER_ONLY: string,
  SUPPORT_CHALLENGE: string,
  SUPPORT_SHELL: string,
  SUPPORT_DEVICE_AUTH: string,
  SERVER_ADDRESS_CONFIGURABLE: string,
  SUPPORT_WL_USER_PREF: string,
  SUPPORT_WL_NATIVE_XHR: string,
  SUPPORT_WL_SERVER_CHANGE: string,
  SUPPORT_OAUTH: string
};


var BaseProfileData : {
  SUPPORT_COOKIES: boolean,
  SUPPORT_DIRECT_UPDATE_FROM_SERVER: boolean,
  SUPPORT_DIAGNOSTIC: boolean,
  SUPPORT_DEVICE_AUTH: boolean,
  SERVER_ADDRESS_CONFIGURABLE: boolean,
  SUPPORT_WL_USER_PREF: boolean
};

var WebProfileData : {
  WEB: boolean
};


var DesktopProfileData : {
  DESKTOP: boolean,
  USES_AUTHENTICATOR: boolean,
  SAVES_USERNAME: boolean
};

var MobileProfileData : {
  USES_AUTHENTICATOR: boolean,
  SAVES_USERNAME: boolean
};

}

/**
 * ================================================================= 
 * Source file taken from :: wlresourcerequest.web.d.ts
 * ================================================================= 
 */

declare module WL{
	class ResourceRequest {
    
		/**
		* @class
		* The WL.ResourceRequest object is used to send a request to any protected or unprotected resource using an absolute or relative URL.
		* It exposes a set of methods that allow you to set up and configure the requested object.
		*
		* If a request is sent to a protected resource, the <code>WLResourceRequest object automatically handles the MobileFirst OAuth-based security model
		* protocol and invokes the required challenges.
		* The WLAuthorizationManager and WLResourceRequest classes are supported for the following hybrid environments only:
		* Android, iOS, Windows Phone 8 and Window 8.
		*
		* @param {string} url Mandatory. Specifies absolute or relative URL. If you send a request to an adapter, you must add the /adapters path element.
		* For example: /adapters/myAdapterName/myMethodName
		* @param {string} method Mandatory. Request method, usually WLResourceRequest.GET or WLResourceRequest.POST
		* @param {number} timeout Optional. Request timeout, in milliseconds.
		*
		* @example
		* var request = new WL.ResourceRequest('/adapters/sampleAdapter/multiplyNumbers', WLResourceRequest.GET);
		* request.setQueryParameter('params', [5, 6]);
		* request.send().then(
		*      function(response) {
		*          // success flow, the result can be found in response.responseJSON
		*      },
		*      function(error) {
		*          // failure flow
		*          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
		*      }
		* );
		*
		* @name WL.ResourceRequest
		*/
			constructor(_url: string, _method: string, _timeout?: number);

			/**
			 * @description Returns request URL. The URL must have been passed to the constructor.
			 * @methodOf WLResourceRequest#
			 */
			getUrl(): string;

			/**
			 * @description Returns current request method. A valid request method must have been passed to constructor.
			 * @methodOf WLResourceRequest#
			 */
			getMethod(): string;

			/**
			 * @description Returns query parameters as a JSON object with key-value pairs.
			 * @methodOf WLResourceRequest#
			 */
			getQueryParameters(): Object;

			/**
			 * @description Sets query parameters.
			 * @param {object} parameters Optional. A JSON object with key-value pairs.
			 * If this parameter is null, or undefined, the query parameters are cleared.
			 * @methodOf WLResourceRequest#
			 */
			setQueryParameters(parameters?: Object): void;

			/**
			 * @description Sets a new query parameter. If a parameter with the same name already exists, it will be replaced.
			 * @param {String} name Mandatory. Parameter name.
			 * @param value Mandatory. Parameter value. Should be string, number or boolean.
			 * @methodOf WLResourceRequest#
			 */
			setQueryParameter(name: string, value: string|number|boolean): void;

			/**
			 * @description Returns array of header values.
			 * @param {string} name Optional. Header name. If header name is specified, this function returns an array of header values
			 * stored with this header, or undefined, if the specified header name is not found. If name is null, or undefined,
			 * this function returns all headers.
			 * @methodOf WLResourceRequest#
			 */
			getHeaders(name?: string): Object[];

			/**
			 * @description Returns array of header names. It can be empty, if no headers have been added.
			 * @methodOf WLResourceRequest#
			 */
			getHeaderNames(): string[];

			/**
			 * @description Returns a first header value stored with the specified header name. The value is returned as a string.
			 * Can be undefined if a header with the specified name does not exist.
			 * @param {String} name Mandatory. Header name.
			 * @methodOf WLResourceRequest#
			 */
			getHeader(name: string): string;

			/**
			 * @description Sets request headers. The existing headers are replaced.
			 * @param {Object} requestHeaders Optional. JSON object with request headers. Each header value should be either string, or array of strings. This function
			 * throws an error if one of the specified header values is not valid. If this parameter is not specified, all headers will be removed.
			 * @methodOf WLResourceRequest#
			 */
			setHeaders(requestHeaders?: Object): void;

			/**
			 * @description Sets a new header or replaces an existing header with the same name.
			 * @param {String} name Mandatory. Header name.
			 * @param value Mandatory. Header value. The value must be of a simple type (string, boolean or value).
			 * @methodOf WLResourceRequest#
			 */
			setHeader(name: string, value: string|number|boolean): void;

			/**
			 * @description Adds a new header. If a header with the same name already exists, the header value will be added to the existing header. The name is
			 * case insensitive.
			 * @param {String} name Mandatory. Header name.
			 * @param value Mandatory. Header value. The value must be of a simple type (string, number or boolean).
			 * @methodOf WLResourceRequest#
			 */
			addHeader(name: string, value: string|number|boolean): void;

			/**
			 * @description Returns request timeout, in milliseconds.
			 * @methodOf WLResourceRequest#
			 */
			getTimeout(): number;

			/**
			 * @description Sets request timeout. If timeout is not specified, then a default timeout will be used.
			 * @param {Integer} requestTimeout Mandatory. Request timeout, in milliseconds.
			 * @methodOf WLResourceRequest#
			 */
			setTimeout(requestTimeout: number): void;

			/**
			 * @description Sends the request to a server.
			 * @param content Optional. Body content. It can be of a simple type (like string), object, or undefined.
			 * @returns Promise
			 * @example
			 * var request = WLResourceRequest(url, method, timeout);
			 * request.send(content).then(
			 *   function(response) {
			 *     // success flow
			 *   },
			 * 	 function(error) {
			 *     // fail flow
			 *   }
			 * );
			 *
			 * @methodOf WLResourceRequest#
			 */
			send(content?: any): WLPromise;

			/**
			 * @description Sends the request to a server with URL encoded form parameters.
			 * @param {Object} json Mandatory. Body content as JSON object or string as form data. The JSON object values must be a simple type.
			 * The content type will be set to application/x-www-form-urlencoded.
			 * @returns Promise
			 * @example
			 * var request = WLResourceRequest(url, method, timeout);
			 * request.send(json).then(
			 *   function(response) {
			 *     // success flow
			 *   },
			 *   function(error) {
			 *     // fail flow
			 *   }
			 * );
			 *
			 * @methodOf WLResourceRequest#
			 */
			sendFormParameters(json: Object): WLPromise;

		static GET: string;
		static POST: string;
		static PUT: string;
		static DELETE: string;
		static HEAD: string;
		static OPTIONS: string;
		static TRACE: string;
		static CONNECT: string;
	}
}


/**
 * ================================================================= 
 * Source file taken from :: worklight.d.ts
 * ================================================================= 
 */

declare module WL.Events {
	var WORKLIGHT_IS_CONNECTED: string;
	var WORKLIGHT_IS_DISCONNECTED: string;
}	

declare module WL.Environment {
	var PREVIEW: string;
	var IPHONE: string;
	var IPAD: string;
	var DESKTOPBROWSER: string;
	var ANDROID: string;
	var WINDOWS_PHONE_8: string;
	var WINDOWS8: string;
	var MOBILE_WEB: string;
}

declare class WLPromise{
    state():string;
    always():Object;
    then(onSuccess?:Function, onFailure?:Function, onProgress?:Function):WLPromise;
    promise(obj?:Object):Object;
    fail(failCallbacks:Function|Function[], additionalFailCallbacks?:Function|Function[]):WLPromise;
    done(doneCallbacks:Function|Function[], additionalDoneCallbacks?:Function|Function[]):WLPromise;
    progress(progressCallbacks:Function|Function[], additionalProgressCallbacks?:Function|Function[]):WLPromise;
}
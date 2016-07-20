/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD init. No dependencies
        define(factory);
    } else {
        // Browser globals init
        root.ibmmfpfanalytics = factory();
        
    }
}(this, function () { 	
	
	/////////////////////////// logger

        REQ_SEND_LOGS = '/api/loguploader',
        REQ_UPDATE_CONFIG = '/api/clientLogProfile',
        KEY_LOCAL_STORAGE_LOGS = '__WL_WEBLOG_LOGS__',
        KEY_LOCAL_STORAGE_SWAP = '__WL_WEBLOG_SWAP__',
        KEY_LOCAL_STORAGE_ANALYTICS = '__WL_WEBLOG_ANALYTICS__',
        KEY_LOCAL_STORAGE_CONFIG = '__WL_WEBLOG_CONFIG__',
        KEY_REMOTE_STORAGE_CONFIG = '__WL_WEBLOG_REMOTE_CONFIG__',

        DEFAULT_MAX_STORAGE_SIZE = 500000,
        BUFFER_TIME_IN_MILLISECONDS = 60000,
        sendLogsTimeBuffer = 0;
        var LEFT_BRACKET = '[';
    	var RIGHT_BRACKET = '] '; //There's a space at the end.
    	var _ANSALYTICS_PKG_NAME = 'wl.analytics';
    
    	var metadataHeader = {};
        var startupTime = 0;
        var appSessionID = generateUUID('new');
        var userID = '';
        var state = __getStateDefaults();
        
        	// Private variables
		var pendingTrackingIDs = {};
		var logger;

        if (!window.console) {  // thanks a lot, IE9
          /*jshint -W020 */
          console = {
            error: function() {},
            warn: function() {},
            info: function() {},
            log: function() {},
            debug: function() {},
            trace: function() {}
          };
        }

        console.log = console.log || function() {};  // I suppose console.log is the most likely to exist.
        console.warn = console.warn || console.log;
        console.error = console.error || console.log;
        console.info = console.info || console.log;
        console.debug = console.debug || console.info;
        console.trace = console.trace || console.debug;  // try to keep the verbosity down a bit

    var priorities = {
        trace      : 600,
        debug      : 500,
        log        : 400,
        info       : 300,
        warn       : 200,
        error      : 100,
        fatal      : 50,
        analytics : 25
    };

	var __usingLocalConfiguration = function(){
		var configurationString = localStorage.getItem(KEY_REMOTE_STORAGE_CONFIG);

		if(configurationString == null){
			return true;
		}

		return false;
	};

	/*
	*	INIT - Load state if persisted. Else get default state
	*/
	(function(){
		try {
			if (typeof(Storage) !== 'undefined') {

				var configurationString = null;

				if(__usingLocalConfiguration()){
					configurationString = localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG);
				}else{
					configurationString = localStorage.getItem(KEY_REMOTE_STORAGE_CONFIG);
				}

				if (configurationString === null){
				  var state = __state();
				  state.maxFileSize = DEFAULT_MAX_STORAGE_SIZE;
				  __updateState(state);

				  var stateString = JSON.stringify(state);
				  localStorage.setItem(KEY_LOCAL_STORAGE_CONFIG, stateString);
				} else {
				  var configuration = JSON.parse(configurationString);
				  __updateState(configuration);
				}
				_init();
			}
		} catch ( err ) {
			console.err(err.message);
		}
	})();
	
	function generateUUID(newSession) {
		"use strict";

		var d = new Date().getTime();
		var uuid = '';
		var generate = function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		};
		if (newSession) {
			uuid = 'xxxxxxxx-xxxx-4567-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, generate);
		}
		else {
			uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, generate);
		}

		return uuid;
	};
	
	var getTrackingId = function () {
		return generateUUID();
	};
	
	function initXHR(XHR, analytics) {
		"use strict";

		var open = XHR.prototype.open;
		var send = XHR.prototype.send;

		XHR.prototype.open = function(method, url, async, user, pass) {
			this._url = url;
			open.call(this, method, url, async, user, pass);
		};

		XHR.prototype.send = function(data) {
			var self = this;
			
			if (!state.allDomains && (!metadataHeader.contextRoot || this._url.indexOf(metadataHeader.contextRoot) == -1)) {
				send.call(this, data);
				return;
			}
			
			var oldOnReadyStateChange;
			var url = this._url;
			var track = logOutboundRequest(this);
			if (track) {
		    	var duration = new Date().getTime() - startupTime;
		    	if (isNewSession()) {
		   			logAnalyticsSessionStart();
		    	}
		    	else if (duration > 1800000) {
		   			logAnalyticsSessionStop();
		    	}
		    	startupTime = new Date().getTime();
				this.setRequestHeader("x-wl-analytics-tracking-id", this.trackingId);
				this.setRequestHeader("x-mfp-analytics-metadata", JSON.stringify(metadataHeader));
			}

			function onReadyStateChange() {
				if(self.readyState == 4 /* complete */) {
					/* This is where you can put code that you want to execute post-complete*/
					/* URL is kept in this._url */
					logInboundResponse(this);
					console.log('analytics: Call issued to ' + this._url);
				}

				if(oldOnReadyStateChange) {
					oldOnReadyStateChange();
				}
			}

			/* Set xhr.noIntercept to true to disable the interceptor for a particular call */
			if(!this.noIntercept) {            
				if(this.addEventListener) {
					this.addEventListener("readystatechange", onReadyStateChange, false);
				} else {
					oldOnReadyStateChange = this.onreadystatechange; 
					this.onreadystatechange = onReadyStateChange;
				}
			}

			send.call(this, data);
		}
	}; 


	/*
	 * PRIVATE METHODS
	 */

	var __send = function(keys) {
	
	
	return new Promise(function (resolve, reject) {
		
		var data = getLogsData(keys);
		
		if(data == null || data == ''  ){
             console.log('analytics: There are no persisted logs to send.');
             resolve('There were no persisted logs to send');
             return;
        }
                		
		__ajax(data, REQ_SEND_LOGS)
			.then(function (response) {
				emptyLogs(keys);
				//logInboundForSendResponse(response[0]);
				console.log('analytics: Client logs successfully sent to the server');
				resolve('Log was successfully sent');
			})
			.catch(function (err) {
			  console.error('analytics: Call failed, server returned: ' , err.statusText);
			  reject('analytics: Call failed, server returned: ' + err.statusText);
			});
	  	});
    	  
      };

    var __ajax = function(data,path,method) {
    	  
    	return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			if (method == null){
				method = 'POST'
			}
			xhr.open(method, metadataHeader.contextRoot+path,true);
			
			xhr.onload = function () {
			  if (this.status >= 200 && this.status < 300) {
				resolve([xhr.networkMetadata,xhr.response]);				
			  } else {
				reject({
				  status: this.status,
				  statusText: xhr.statusText
				});
			  }
			};
			xhr.onerror = function () {
			  reject({
				status: this.status,
				statusText: xhr.statusText
			  });
			};
			xhr.send(data);
	  	});
    	  
      };
      
       logOutboundRequest = function (request) {
			try{
			    if (!request.trackingId) {
					request.trackingId = getTrackingId();
				}
				else {
					return false;
				}
				var outboundTimestamp = new Date().getTime();
	
				var metadata = {
// 					'$path': url, //$path for legacy reasons
					'$category' : 'network',
					'$trackingid' : request.trackingId,
					'$outboundTimestamp' : outboundTimestamp
				};
				
				var logMetadata = {
					'$class':'wl.analytics.xhrInterceptor',
					'$file':'ibmmfpfanalytics.js',
					'$method':'intercept',
// 					'$line":138,
					'$src':'javascript'
				};
				
				request.networkMetadata = metadata;
				
				var logData = {
				 'pkg': 'wl.analytics',
				 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
				 'level': 'ANALYTICS',
				 'msg': 'InternalRequestSender outbound',
				 'metadata': logMetadata
				};
				
    			__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
    			return true;
				
			}catch(e){
				// Do nothing
			}
	};
	

	var logInboundResponse = function (request) {
		
			try{
				var trackingId = request.trackingId;
				
				if(trackingId){					
					var inboundTimestamp = new Date().getTime();
					var numBytes = 0;
					var responseText = '';//response.responseJSON;TODO
					
					/*jshint maxdepth:4*/
					if(responseText){
						numBytes = JSON.stringify(responseText).length;
					}
					
					var metadata = request.networkMetadata;
					
					if(metadata !== null){
						var outboundTimestamp = metadata['$outboundTimestamp'];
						var roundTripTime = inboundTimestamp - outboundTimestamp;
							
						metadata['$inboundTimestamp'] = inboundTimestamp;
						metadata['$bytesReceived'] = numBytes;
						metadata['$roundTripTime'] = roundTripTime;
						metadata['$responseCode'] = request.status;
						metadata['$requestMethod'] = 'post';//TODO request.status;
						metadata['$path'] = request.resposeURL;
						
						request.networkMetadata = metadata;

					}
					
					
					var logData = {
					 'pkg': 'wl.analytics',
					 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
					 'level': 'ANALYTICS',
					 'msg': 'InternalRequestSender logInboundResponse',
					 'metadata': metadata
					};
    			__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
				}
			}catch(e){
// 				alert(e);
				// Do nothing
			}
	};
	
	
	var logInboundForSendResponse = function (metadata) {
			try{
				
				var logData = {
				 'pkg': 'wl.analytics',
				 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
				 'level': 'ANALYTICS',
				 'msg': 'InternalRequestSender logInboundResponse',
				 'metadata': metadata
				};
				__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
				
			}catch(e){
				console.error('analytics: Failed to log event');
			}
	};
	
    function getLogsData(keys){
        var persistedLogs = '';
        keys.forEach(function(key){
            var value = localStorage.getItem(key);
            if(value !== null){
            	if (persistedLogs !== ''){
            		persistedLogs += ',';
            	}
                persistedLogs += value;
            }
        });
		if (persistedLogs == ''){
            return '';
        }

        var logdata = {
            __logdata : persistedLogs
        };
        return JSON.stringify(logdata);
    };

      var __persistLog = function(log, key){
    		if(__fileSizeReached(key)){
    			if(key === KEY_LOCAL_STORAGE_LOGS){
    				__attemptFileSwap();
    			}else{
    				// No swapping for analytics
    				return;
    			}
    		}

    		var stringified = JSON.stringify(log);
    		var persistedLogs = localStorage.getItem(key);

    		if(persistedLogs === null){
    			persistedLogs = stringified;
    		}else{
    			persistedLogs +=  ', ' + stringified;
    		}

    		try{
    			localStorage.setItem(key, persistedLogs);
    		}catch(e){
    			console.log('analytics: Local storage capacity reached. Client logs will not be persisted');
    		}
    	};

    	var __attemptFileSwap = function(){
    		try{
    			var currentLogs = localStorage.getItem(KEY_LOCAL_STORAGE_LOGS);
    			localStorage.setItem(KEY_LOCAL_STORAGE_SWAP, currentLogs);
    			localStorage.removeItem(KEY_LOCAL_STORAGE_LOGS);
    		}catch(e){
    			console.log('analytics: Local storage capacity reached. WL.Logger will delete old logs to make room for new ones.');
    			localStorage.removeItem(KEY_LOCAL_STORAGE_LOGS);
    			localStorage.removeItem(KEY_LOCAL_STORAGE_SWAP);
    		}
    	};

    	var __processUpdateConfig = function(configString){
    		var config = null;
    		try{
    			config = JSON.parse(configString);
    		}catch(e){

    		}
    		if(config && config.clientLogProfileConfig){
    			console.log('analytics: Matching configuration successfully retrieved from the server.');
    			var wllogger = config.clientLogProfileConfig;
    		    localStorage.setItem(KEY_REMOTE_STORAGE_CONFIG, localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG));
    		    state.levelFromServer = null;
    		    state.filtersFromServer = null;
    			__setServerOverrides(wllogger.clientLogProfiles);
    		}else{
    			console.log('analytics: No matching configurations found from the server. Defaulting to local configuration');
    			localStorage.removeItem(KEY_REMOTE_STORAGE_CONFIG);

    			var configurationString = localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG);
    			var configuration = JSON.parse(configurationString);
                __updateState(configuration);
                __unsetServerOverrides();
    		}
    	};

      /*
    	* UTILITY METHODS
       */

	   function printStackTrace(e) {
		   e = e || {
			   guess: true
		   };
		   var t = e.e || null,
			   n = !!e.guess;
		   var r = new printStackTrace.implementation,
			   i = r.run(t);
		   return n ? r.guessAnonymousFunctions(i) : i
	   }
	   if (typeof module !== "undefined" && module.exports) {
		   module.exports = printStackTrace
	   }
	   printStackTrace.implementation = function() {};
	   printStackTrace.implementation.prototype = {
		   run: function(e, t) {
			   e = e || this.createException();
			   t = t || this.mode(e);
			   if (t === "other") {
				   return this.other(arguments.callee)
			   } else {
				   return this[t](e)
			   }
		   },
		   createException: function() {
			   try {
				   this.undef()
			   } catch (e) {
				   return e
			   }
		   },
		   mode: function(e) {
			   if (e["arguments"] && e.stack) {
				   return "chrome"
			   } else if (e.stack && e.sourceURL) {
				   return "safari"
			   } else if (e.stack && e.number) {
				   return "ie"
			   } else if (typeof e.message === "string" && typeof window !== "undefined" && window.opera) {
				   if (!e.stacktrace) {
					   return "opera9"
				   }
				   if (e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
					   return "opera9"
				   }
				   if (!e.stack) {
					   return "opera10a"
				   }
				   if (e.stacktrace.indexOf("called from line") < 0) {
					   return "opera10b"
				   }
				   return "opera11"
			   } else if (e.stack) {
				   return "firefox"
			   }
			   return "other"
		   },
		   instrumentFunction: function(e, t, n) {
			   e = e || window;
			   var r = e[t];
			   e[t] = function() {
				   n.call(this, printStackTrace().slice(4));
				   return e[t]._instrumented.apply(this, arguments)
			   };
			   e[t]._instrumented = r
		   },
		   deinstrumentFunction: function(e, t) {
			   if (e[t].constructor === Function && e[t]._instrumented && e[t]._instrumented.constructor === Function) {
				   e[t] = e[t]._instrumented
			   }
		   },
		   chrome: function(e) {
			   var t = (e.stack + "\n").replace(/^\S[^\(]+?[\n$]/gm, "").replace(/^\s+(at eval )?at\s+/gm, "").replace(/^([^\(]+?)([\n$])/gm, "{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}()@$1").split("\n");
			   t.pop();
			   return t
		   },
		   safari: function(e) {
			   return e.stack.replace(/\[native code\]\n/m, "").replace(/^(?=\w+Error\:).*$\n/m, "").replace(/^@/gm, "{anonymous}()@").split("\n")
		   },
		   ie: function(e) {
			   var t = /^.*at (\w+) \(([^\)]+)\)$/gm;
			   return e.stack.replace(/at Anonymous function /gm, "{anonymous}()@").replace(/^(?=\w+Error\:).*$\n/m, "").replace(t, "$1@$2").split("\n")
		   },
		   firefox: function(e) {
			   return e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^[\(@]/gm, "{anonymous}()@").split("\n")
		   },
		   opera11: function(e) {
			   var t = "{anonymous}",
				   n = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
			   var r = e.stacktrace.split("\n"),
				   i = [];
			   for (var s = 0, o = r.length; s < o; s += 2) {
				   var u = n.exec(r[s]);
				   if (u) {
					   var a = u[4] + ":" + u[1] + ":" + u[2];
					   var f = u[3] || "global code";
					   f = f.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, t);
					   i.push(f + "@" + a + " -- " + r[s + 1].replace(/^\s+/, ""))
				   }
			   }
			   return i
		   },
		   opera10b: function(e) {
			   var t = /^(.*)@(.+):(\d+)$/;
			   var n = e.stacktrace.split("\n"),
				   r = [];
			   for (var i = 0, s = n.length; i < s; i++) {
				   var o = t.exec(n[i]);
				   if (o) {
					   var u = o[1] ? o[1] + "()" : "global code";
					   r.push(u + "@" + o[2] + ":" + o[3])
				   }
			   }
			   return r
		   },
		   opera10a: function(e) {
			   var t = "{anonymous}",
				   n = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
			   var r = e.stacktrace.split("\n"),
				   i = [];
			   for (var s = 0, o = r.length; s < o; s += 2) {
				   var u = n.exec(r[s]);
				   if (u) {
					   var a = u[3] || t;
					   i.push(a + "()@" + u[2] + ":" + u[1] + " -- " + r[s + 1].replace(/^\s+/, ""))
				   }
			   }
			   return i
		   },
		   opera9: function(e) {
			   var t = "{anonymous}",
				   n = /Line (\d+).*script (?:in )?(\S+)/i;
			   var r = e.message.split("\n"),
				   i = [];
			   for (var s = 2, o = r.length; s < o; s += 2) {
				   var u = n.exec(r[s]);
				   if (u) {
					   i.push(t + "()@" + u[2] + ":" + u[1] + " -- " + r[s + 1].replace(/^\s+/, ""))
				   }
			   }
			   return i
		   },
		   other: function(e) {
			   var t = "{anonymous}",
				   n = /function\s*([\w\-$]+)?\s*\(/i,
				   r = [],
				   i, s, o = 10;
			   while (e && e["arguments"] && r.length < o) {
				   i = n.test(e.toString()) ? RegExp.$1 || t : t;
				   s = Array.prototype.slice.call(e["arguments"] || []);
				   r[r.length] = i + "(" + this.stringifyArguments(s) + ")";
				   e = e.caller
			   }
			   return r
		   },
		   stringifyArguments: function(e) {
			   var t = [];
			   var n = Array.prototype.slice;
			   for (var r = 0; r < e.length; ++r) {
				   var i = e[r];
				   if (i === undefined) {
					   t[r] = "undefined"
				   } else if (i === null) {
					   t[r] = "null"
				   } else if (i.constructor) {
					   if (i.constructor === Array) {
						   if (i.length < 3) {
							   t[r] = "[" + this.stringifyArguments(i) + "]"
						   } else {
							   t[r] = "[" + this.stringifyArguments(n.call(i, 0, 1)) + "..." + this.stringifyArguments(n.call(i, -1)) + "]"
						   }
					   } else if (i.constructor === Object) {
						   t[r] = "#object"
					   } else if (i.constructor === Function) {
						   t[r] = "#function"
					   } else if (i.constructor === String) {
						   t[r] = '"' + i + '"'
					   } else if (i.constructor === Number) {
						   t[r] = i
					   }
				   }
			   }
			   return t.join(",")
		   },
		   sourceCache: {},
		   ajax: function(e) {
			   var t = this.createXMLHTTPObject();
			   if (t) {
				   try {
					   t.open("GET", e, false);
					   t.send(null);
					   return t.responseText
				   } catch (n) {}
			   }
			   return ""
		   },
		   createXMLHTTPObject: function() {
			   var e, t = [function() {
				   return new XMLHttpRequest
			   }, function() {
				   return new ActiveXObject("Msxml2.XMLHTTP")
			   }, function() {
				   return new ActiveXObject("Msxml3.XMLHTTP")
			   }, function() {
				   return new ActiveXObject("Microsoft.XMLHTTP")
			   }];
			   for (var n = 0; n < t.length; n++) {
				   try {
					   e = t[n]();
					   this.createXMLHTTPObject = t[n];
					   return e
				   } catch (r) {}
			   }
		   },
		   isSameDomain: function(e) {
			   return typeof location !== "undefined" && e.indexOf(location.hostname) !== -1
		   },
		   getSource: function(e) {
			   if (!(e in this.sourceCache)) {
				   this.sourceCache[e] = this.ajax(e).split("\n")
			   }
			   return this.sourceCache[e]
		   },
		   guessAnonymousFunctions: function(e) {
			   for (var t = 0; t < e.length; ++t) {
				   var n = /\{anonymous\}\(.*\)@(.*)/,
					   r = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
					   i = e[t],
					   s = n.exec(i);
				   if (s) {
					   var o = r.exec(s[1]);
					   if (o) {
						   var u = o[1],
							   a = o[2],
							   f = o[3] || 0;
						   if (u && this.isSameDomain(u) && a) {
							   var l = this.guessAnonymousFunction(u, a, f);
							   e[t] = i.replace("{anonymous}", l)
						   }
					   }
				   }
			   }
			   return e
		   },
		   guessAnonymousFunction: function(e, t, n) {
			   var r;
			   try {
				   r = this.findFunctionName(this.getSource(e), t)
			   } catch (i) {
				   r = "getSource failed with url: " + e + ", exception: " + i.toString()
			   }
			   return r
		   },
		   findFunctionName: function(e, t) {
			   var n = /function\s+([^(]*?)\s*\(([^)]*)\)/;
			   var r = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
			   var i = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
			   var s = "",
				   o, u = Math.min(t, 20),
				   a, f;
			   for (var l = 0; l < u; ++l) {
				   o = e[t - l - 1];
				   f = o.indexOf("//");
				   if (f >= 0) {
					   o = o.substr(0, f)
				   }
				   if (o) {
					   s = o + s;
					   a = r.exec(s);
					   if (a && a[1]) {
						   return a[1]
					   }
					   a = n.exec(s);
					   if (a && a[1]) {
						   return a[1]
					   }
					   a = i.exec(s);
					   if (a && a[1]) {
						   return a[1]
					   }
				   }
			   }
			   return "(?)"
		   }
	   };
   
		function __fileSizeReached(key){
			var persistedLogs = localStorage.getItem(key);
			if(persistedLogs === null) {
		       return false;
			}

			var m = encodeURIComponent(persistedLogs).match(/%[89ABab]/g);
			var size = persistedLogs.length + (m ? m.length : 0);

			var maxSize = __state().maxFileSize;
			if(maxSize === null || typeof maxSize === 'undefined') {
				maxSize = DEFAULT_MAX_STORAGE_SIZE;
			}

			if(size >= maxSize){
				return true;
			}

			return false;
		};

		function __formatDate (date, fmt) {
			function pad(value) {
		  		return (value.toString().length < 2) ? '0' + value : value;
			}
		
		return fmt.replace(/%([a-zA-Z])/g, function (m, fmtCode) {
		  switch (fmtCode) {
			case 'Y':
			return date.getFullYear();
			case 'M':
			return pad(date.getMonth() + 1);
			case 'd':
			return pad(date.getDate());
			case 'H':
			return pad(date.getHours());
			case 'm':
			return pad(date.getMinutes());
			case 's':
			return pad(date.getSeconds());
			case 'ms':
			return pad(date.getMilliseconds());
			default:
			throw new Error('Unsupported format code: ' + fmtCode);
		  }
	   });
	  };


    function __getStateDefaults() {
        var udf;  // because undefined can be overridden
        return {
            enabled : true,
            stringify : true,
            pretty: false,
            stacktrace : false,
            ismsie : !!(document.all && document.querySelector && !document.addEventListener),
            callback : '',
            tag : {level: false, pkg: true},
            pkg : '',
            filters : udf,
            filtersFromServer: udf,
            level : 'trace',
            levelFromServer : udf,
            metadata : {},
            capture : udf,
            captureFromServer : udf,
            analyticsCapture : udf,
            allDomains : udf,
            maxFileSize : udf,
            autoSendLogs: true
        };
    };

    function __resetState() {
        state = __getStateDefaults();
        localStorage.removeItem('__WL_WEBLOG_LOGS__');
        localStorage.removeItem('__WL_WEBLOG_ANALYTICS__');
        localStorage.removeItem('__WL_WEBLOG_CONFIG__');        
        return this;
    };

    function __getLogArgArray(args, priority, pkg) {

        var msgStr = __stringifyArguments(args);
        var caller = getCallerLine();
		var originMeta = {
			'$src': 'js'
		 };
		if(!state.metadata.hasOwnProperty('filename') && caller != ""){
			var parsed = formatStackLine(caller);
			originMeta = {
			 '$class' : 'Object',
			 '$file' : parsed.file,
			 '$method' : parsed.method,
			 '$line' : parsed.linenumber,
			 '$src': 'js'
			};
    	}
        var meta = __extend({},true, state.metadata ,originMeta); //clone obj
        state.metadata = {}; //clear metadata obj

        for (var i = 0; i < args.length; i++) {

            if (args[i] instanceof Error) {
                args[i] = {'$name': args[i].toString(), '$stacktrace': printStackTrace({e: args[i]})};
            }
        }

        if (typeof priority === 'string') {
            priority = priority.toUpperCase();
        }

        return [priority, pkg, msgStr, meta, (new Date()).getTime()];
    };


	function getCallerLine(){
		var stack = printStackTrace();
		for(var i = 1; i<stack.length; ++i){
			var line = stack[i];
			if(line.indexOf("ibmmfpfanalytics") == -1){
				return line;
			}
		}
		return "";
		
	}
	function formatStackLine(stackLine){
		var formats = [/^\x20*at\x20([^(]+)\x20\(?(.*?)(?::(\d+):(\d+))?\)$/,/^([^@]*)@(.*?)(?::(\d+):(\d+))?\)?$/,/^\x20+at\x20(.*?)(?::(\d+))?$/,/^(.*?)(?::(\d+):(\d+))?$/];
		var method = "";
		var file = "";
		var linenumber = "";
		var parsed  = null;
		parsed = stackLine.match(formats[0]);
		if( parsed == null){
			parsed = stackLine.match(formats[1]);
		}
		if(parsed != null){
			method = parsed[1];
			file = parsed[2];
			linenumber = parsed[3];
		}else{
			parsed = stackLine.match(formats[2]);
			if( parsed == null){
				parsed = stackLine.match(formats[3]);
			}
			if(parsed != null){
				file = parsed[1];
				linenumber = parsed[2];
			}
		}
    	return {
      		method: method,
      		file: file,
      		linenumber: linenumber
    	};
	}

    function __insideArray(needle, haystack) {
        return haystack.indexOf(needle) !== -1;
    };

    function __getKeys(obj) {
        var arr = [];

        for (var key in obj) {
            if(obj.hasOwnProperty(key)){
                arr.push(key);
            }
        }
        return arr;
    };

    function __setState(options) {

        state = {
            enabled : typeof options.enabled === 'boolean' ? options.enabled : state.enabled,
            stringify : typeof options.stringify === 'boolean' ? options.stringify : state.stringify,
            pretty: typeof options.pretty === 'boolean' ? options.pretty : state.pretty,
            stacktrace : typeof options.stacktrace === 'boolean' ? options.stacktrace : state.stacktrace,
            ismsie : typeof options.ismsie === 'boolean' ? options.ismsie : state.ismsie,
            callback : options.callback || state.callback,
            tag : __extend({},{level: false, pkg: true}, options.tag || state.tag),
            pkg : options.pkg || state.pkg,
            filters : options.filters === null || typeof options.filters === 'object' ? options.filters : state.filters,  // {'jsonstore': 'WARN', 'otherPkg': 'DEBUG'}
            filtersFromServer : typeof options.filtersFromServer === 'object' ? options.filtersFromServer : state.filtersFromServer,
            level : options.level || state.level,
            levelFromServer : options.levelFromServer || state.levelFromServer,
            metadata: options.metadata || state.metadata,
            capture : typeof options.capture === 'boolean' ? options.capture : state.capture,
            captureFromServer : typeof options.captureFromServer === 'boolean' ? options.captureFromServer : state.captureFromServer,
            analyticsCapture : typeof options.analyticsCapture === 'boolean' ? options.analyticsCapture : state.analyticsCapture,
            allDomains : typeof options.allDomains === 'boolean' ? options.allDomains : state.allDomains,
            maxFileSize : typeof options.maxFileSize === 'number' && options.maxFileSize % 1 === 0 ? options.maxFileSize : state.maxFileSize,
            autoSendLogs : typeof options.autoSendLogs === 'boolean' ? options.autoSendLogs : state.autoSendLogs
        };

         if (typeof(Storage) !== 'undefined') {
            	var stateString = JSON.stringify(state);

            	if(__usingLocalConfiguration()){
            		  localStorage.setItem(KEY_LOCAL_STORAGE_CONFIG, stateString);
            	}else{
            		  localStorage.setItem(KEY_REMOTE_STORAGE_CONFIG, stateString);
            		  }
          }
    };

    function __stringify(input) {

        if (input instanceof Error) {
            return (state.stacktrace) ? printStackTrace({e: input}).join('\n') : input.toString();
        }
        else if (typeof input === 'object' && JSON && JSON.stringify) {
            try {
                return (state.pretty) ? JSON.stringify(input, null, ' ') : JSON.stringify(input);
            }
            catch (e) {
                return 'Stringify Failed: ' + e;
            }

        } else {
            return (typeof input === 'undefined') ? 'undefined' : input.toString();
        }
    };

    function __stringifyArguments(args) {
		if (typeof args === 'string' || args instanceof String){
			return args;
		}
        var len = args.length,
            i = 0,
            res = [];

        for (; i < len ; i++) {
            res.push(__stringify(args[i]));
        }
        return res.join(' ');
    };

    //currentPriority is the priority linked to the current log msg
    //stateLevel can be a string (e.g. 'warn') or a number (200)
    function __checkLevel(currentPriority, stateLevel) {
        if (Array.isArray(stateLevel)) {
            return  (//Check if current is whitelisted (state)
                stateLevel.length > 0 &&
                !__insideArray(currentPriority, stateLevel)
            );

        } else if (typeof stateLevel === 'string') {
            stateLevel = stateLevel.toLowerCase();//Handle WARN, wArN, etc instead of just warn
            return  (//Get numeric value and compare current with state
                typeof (priorities[currentPriority]) === 'number' &&
                typeof (priorities[stateLevel]) === 'number' &&
                (priorities[currentPriority]  > priorities[stateLevel])
            );

        } else if (typeof stateLevel === 'number') {

            return (//Compare current with state
                typeof (priorities[currentPriority]) === 'number' &&
                (priorities[currentPriority]  > stateLevel)
            );
        }

        return true; //Bail out, level is some unknown type
    };

    function __checkLoggingLevel(priority, pkg) {
        var currFilters = state.filtersFromServer || state.filters;
        if (__getKeys(currFilters).length > 0) {  // non-empty filters object
            return __checkLevel(priority, __getCurrentPackageFilterLevel(pkg));
        }else{
        	return __checkLevel(priority, state.levelFromServer || state.level);
        }
        return false;
    };
    
    function __getCurrentPackageFilterLevel(pkg){
    	var configFilters = state.filtersFromServer || state.filters;
    	if (pkg == null){
    		pkg = '';
    	} 
		for (var i in configFilters) {
    		if (configFilters[i].name === pkg){
				return configFilters[i].level	;
    		}
		}
		return null;
    };

    function __log(args, priority) {

		priority = priority.toLowerCase();
        //TODO check if env is IE and then set console.trace = console.debug;
		state = __state();
        var str = '',
            pkg = state.pkg;

        state.pkg = ''; //clear pkg from state obj

        if (!state.enabled ||
            __checkLoggingLevel(priority, pkg)) {
             state.metadata = {}; //clear metadata obj
            return;
        }

        if (state.stringify) {
            str = __stringifyArguments(args);
        }

        //Apply Package Tag
        if (state.tag.pkg && typeof pkg === 'string' && pkg.length > 0) {
            str = LEFT_BRACKET + pkg + RIGHT_BRACKET + str;
        }

        //Apply Level Tag
        if (state.tag.level) {
            str = LEFT_BRACKET + priority.toUpperCase() + RIGHT_BRACKET + str;
        }

        if (!state.stringify && str.length > 0) {
            args.unshift(str);
        }

        // Queue for later sending
         var logArgArray = __getLogArgArray(args, priority, pkg)
         var state = __state();

		  //setTimeout(function () {
			  if (typeof(Storage) !== 'undefined') {
					var level =  logArgArray[0];
					var pkg = logArgArray[1];
					var msg = logArgArray[2];
					var meta = logArgArray[3];
					var time = logArgArray[4];

					var logData = {
					  'timestamp': time,
					  'level': level,
					  'pkg': pkg,
					  'msg': msg,
					  'metadata': meta
					};

					if(level === 'ANALYTICS' && state.analyticsCapture !== false){
					  __persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
					}else if(state.capture !== false){
					  __persistLog(logData, KEY_LOCAL_STORAGE_LOGS);
					}
			  }
		  //}, 0, logArgArray);

        //Log to the console
        // we use WL.StaticAppProps instead of WL.Client.getEnvironment because the former is
        // guaranteed to be available
        if (typeof console === 'object') {  // avoid infinite loop on Adobe AIR

            if (typeof console[priority] === 'function') {
                (state.stringify) ? console[priority](str) : console[priority].apply(console, args);

            } else if (priority === 'fatal') {
                if (typeof console.error === 'function') {
                    (state.stringify) ? console.error(str) : console.error.apply(console, args);
                }

            } else if (priority === 'trace') {
                if (typeof console.debug === 'function') {
                    (state.stringify) ? console.debug(str) : console.debug.apply(console, args);
                }

            } else if (priority === 'analytics') {
                // Do nothing
            } else if (typeof console.log === 'function') {
                (state.stringify) ? console.log(str) : console.log.apply(console, args);

            } else if (state.ismsie && typeof console.log === 'object') {
                (state.stringify) ? console.log(str) : console.log.apply(console, args);
            }

        }

        //The default value of state.callback is an empty string (not a function)
        if (typeof state.callback === 'function') {
            if (!state.stringify) {
                str = args;
            }
            state.callback(str, priority, pkg);
        }

    };
    
    function _pkg(pkgName) {

		if (state.pkg != null){
		    state.pkg = pkgName;
		}    	
    	return this;
    };

    function _config(options) {
        __setState(__extend({},options || {}));
        return this;
    };
    
    function __sendAll() {
        return __send([KEY_LOCAL_STORAGE_ANALYTICS,KEY_LOCAL_STORAGE_LOGS, KEY_LOCAL_STORAGE_SWAP]);
    };

     function _updateConfigFromServer() {
    
		return new Promise(function (resolve, reject) {
			 var appName = metadataHeader.mfpAppName ;
			 var platform = metadataHeader.os ;
			 var getConfigUrl = REQ_UPDATE_CONFIG + '/' + appName + '/' + platform;
			 __ajax({}, getConfigUrl,'GET')
				.then(function (metadata) {
					__processUpdateConfig(metadata[1]);
					resolve(metadata[1]);
				})
				.catch(function (err) {
				    console.error('analytics: Failed to call the server', err.statusText);
				    reject('analytics: Failed to call the server' + err.statusText)
			});
         
       });
    };

    function __setServerOverrides(configFilters,level,capture) {
    	var updatedConfigFilters = null;
    	for (i = 0; i < configFilters.length; i++) { 
			if (configFilters[i].name == null || configFilters[i].name == ''){
				level = configFilters[i].level;
			}else{
				if (updatedConfigFilters == null){
					updatedConfigFilters = [configFilters[i]];
				}else{
					updatedConfigFilters.push(configFilters[i]);
				}
			}		
        }        
        _config({levelFromServer: level, captureFromServer: capture, filtersFromServer: updatedConfigFilters});
    };

	function logAnalyticsCrash(errorEvt) {
	    var duration = new Date().getTime() - startupTime;
	    var filename = errorEvt.filename;
	    var linenumber = errorEvt.lineno;
	    var errorMessage = errorEvt.message;
	    var method = 'none';
	    var stack = [];
	    if(errorEvt.error != null){
	    	var errstack = errorEvt.error.stack;
	    	stack = errstack.split('\n');
	    }
	    var caller = "";
	    for(var i = 1; i<stack.length; ++i){
			var line = stack[i];
			if(line.indexOf("ibmmfpfanalytics") == -1){
				caller = line;
				break;
			}
		}
		if(caller != ""){
			var parsed = formatStackLine(caller);
			method = parsed.method;
		}
	    var type = errorEvt.type;
    	var meta = {
    	 '$category' : 'appSession',
    	 '$duration' : duration,
    	 '$closedBy' : 'CRASH',
    	 '$appSessionID' : appSessionID,
    	 '$class' : 'Object',
    	 '$file' : filename,
    	 '$method' : method,
    	 '$line' : linenumber,
    	 '$src' : 'js',
    	 '$stacktrace' :  stack,
    	 '$exceptionMessage' : errorMessage,
    	 '$exceptionClass' : type
    	};
    	state.metadata = meta;
    	_pkg('wl.analytics');
    	__log('appSession','ANALYTICS');

		var meta2 = {
    	 '$class' : 'Object',
    	 '$file' : filename,
    	 '$method' : method,
    	 '$line' : linenumber,
    	 '$src' : 'js',
    	 '$stacktrace' :  stack,
    	 '$exceptionMessage' : errorMessage,
    	 '$exceptionClass' : type
    	};
		state.metadata = meta2;
    	_pkg('wl.analytics');
    	__log('analytics: detected an error (Uncaught Exception)','FATAL');
    	
    	//send immediately
    	__sendAll();
	};
	
	function _setUserContext(user) {
	    logAnalyticsSessionStop();
	    userID = user;
	};
	
	function _logUserAnalytics() {
		var meta = {
    	'$category' : 'userSwitch',
    	 '$userID' : userID,
    	'$appSessionID' : appSessionID
    	 };
    	state.metadata = meta;
    	_pkg('wl.analytics');
    	__log('appSession','ANALYTICS');
	};
	
	function logAnalyticsSessionStart() {
	    appSessionID = generateUUID();
    	var meta = {
    	 '$category' : 'appSession',
    	 '$appSessionID' : appSessionID
    	};
    	state.metadata = meta;
    	_pkg('wl.analytics');
    	__log('appSession','ANALYTICS');
	};
	
	function logAnalyticsSessionStop() {
	    var duration = new Date().getTime() - startupTime;
        _logUserAnalytics();
    	var meta = {
    	 '$category' : 'appSession',
    	 '$duration' : duration,
    	 '$closedBy' : 'user',
    	 '$appSessionID' : appSessionID
    	};
    	appSessionID = generateUUID('new');
    	state.metadata = meta;
    	_pkg('wl.analytics');
    	__log('appSession','ANALYTICS');
	};
	
	function isNewSession() {
		return (appSessionID && appSessionID.indexOf('4567') > -1)
	};

    function emptyLogs(keys){
            keys.forEach(function(key){
                localStorage.removeItem(key);
            });
    };

    function initErrorHandler(){
        if(window.hasErrorHandler == null){
            window.addEventListener('error', function (evt) {
                logAnalyticsCrash(evt);
            });
            window.hasErrorHandler = true;
        }
    };

    function browserName(){
		var browserName  = navigator.appName;
		var nVer = navigator.appVersion;
    	var nAgt = navigator.userAgent;
    	var nameOffset,verOffset,ix;

    	// In Opera, the true version is after "Opera" or after "Version"
		if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
		   browserName = "Opera";
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
		   browserName = "Microsoft Internet Explorer";
		}
		// In Chrome, the true version is after "Chrome" 
		else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 	  		browserName = "Chrome";
		}
		// In Safari, the true version is after "Safari" or after "Version" 
		else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	   		browserName = "Safari";
		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	    	browserName = "Firefox";
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
	    	browserName = nAgt.substring(nameOffset,verOffset);
		}

		return browserName;
	}


    function _init(deviceID, appName, contextRoot){
    	startupTime = new Date().getTime();
    	initErrorHandler();
    	metadataHeader.contextRoot = "/mfp";
    	if (contextRoot != null && contextRoot != ''){
    		metadataHeader.contextRoot = contextRoot;
    	}
    	metadataHeader.deviceID = "Undefined";
    	if (deviceID != null && deviceID != ''){
    		metadataHeader.deviceID = deviceID;
    	}
    	metadataHeader.mfpAppVersion = "latest";

    	metadataHeader.mfpAppName = "MFPWebApp";
    	if (appName != null && appName != ''){
    		metadataHeader.mfpAppName = appName;
    	}
    	if (userID == '') {
    		userID = metadataHeader.deviceID;
    	}
		metadataHeader.os = "web";  // MFP
		metadataHeader.osVersion =  navigator.platform;  // human-readable o/s version; like "MacIntel"
		metadataHeader.brand = navigator.appVersion;  // human-readable brand; 
		metadataHeader.model = browserName();  // human-readable model; like "Chrome"
		metadataHeader.appVersionDisplay = metadataHeader.mfpAppVersion;  // human readable display version
		metadataHeader.appVersionCode = metadataHeader.mfpAppVersion;  // version as known to the app store
		metadataHeader.appStoreId = metadataHeader.mfpAppName; // app pkg name (e.g. com.ibm.MyApp)
		metadataHeader.appStoreLabel = metadataHeader.mfpAppName; 
    	initXHR(XMLHttpRequest, this);

    };

	function __unsetServerOverrides() {
		var udf;  // undefined
		state.levelFromServer = udf;
		state.captureFromServer = udf;
		state.filtersFromServer = udf;
		_config({levelFromServer: udf, captureFromServer: udf, filtersFromServer: udf});
	};

 // For web logger state manipulation
  function __state() {
		return state;
  };

   function __updateState(newState) {
		if(newState) {
			state = newState;
		}
   };
       
    function capture(captureLogs) {
		_config({capture: typeof(captureLogs) === "boolean" ? captureLogs : true});
    }; 
    
    function __enable(enableLogs) {
		_config({enabled: typeof(enableLogs) === "boolean" ? enableLogs : true});
    };
      
    function __extend(){
		for(var i=1; i<arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	};

    logger = {
		pkg: _pkg,
        state: __state,
        capture: capture,
        enable: __enable,
        updateConfigFromServer: _updateConfigFromServer,
        //testing:
        __resetState : __resetState  // back to the defaults
        
    };

    __getKeys(priorities).forEach(function (idx) {
        logger[idx] = function () {
            __log([].slice.call(arguments), idx);
        };
    });
	
	/**
    Turns on/off the capture of analytics data.
	 */
	var _enable = function (analyticsCapture) {
		_config({analyticsCapture: typeof(analyticsCapture) === "boolean" ? analyticsCapture : true});
	};

	/**
    	Collect custom events data.
	*/
	var _event = function (msg) {
		var name = '';
		if (typeof msg === 'object') {
			for(var key in msg){
				name+=key + ' ';
			}
			logger.state().metadata = msg;
			logger.pkg(_ANSALYTICS_PKG_NAME).analytics(name);
		}
		else {
			logger.pkg(_ANSALYTICS_PKG_NAME).analytics(msg)
		}		
	}
	
	/**
		Returns the current state of WL.Analytics
	 */
	var _state = function () {
		var currentLoggerState = logger.state();
		return currentLoggerState.analyticsCapture;		
	};
	
	var  _processAutomaticTrigger = function(){
		  var currentTime = Date.now();
		  var elapsedTime = currentTime - sendLogsTimeBuffer;
		  
		  var autoSend =__state().autoSendLogs;

		  if(elapsedTime > BUFFER_TIME_IN_MILLISECONDS){
			  if(autoSend){
				  __sendAll();
			  }

			  sendLogsTimeBuffer = currentTime;
		  }
	  }
	
	function _setAutoSendLogs(autoSend) {
		_config({autoSendLogs: typeof(autoSend) === "boolean" ? autoSend : true});
	};

	//public API
	return {
	    init: _init,
		enable : _enable,
		state: _state,
		send: __sendAll,
		setUserContext: _setUserContext,
		addEvent: _event,
		logger: logger,
		setAutoSendLogs: _setAutoSendLogs,
        processAutomaticTrigger: _processAutomaticTrigger,
		_config:_config
	}

}));

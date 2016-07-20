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

/**
 * This file is a wrapper for the web SDK which is in target/jslibexpanded/app/web/worklight.js
 * Its purpose is to make the web SDK as an AMD module.
 *
 * There is a placeholder in this file which will be replaced with the web sdk during the build of client-javascript.
 * The replacement is defined in expandjslib.xml inside buildEnv_web target
 * After the replacement the file will be renamed to worklight.js
 */

(function (root, factory) {
    var wlanalytics = dummyanalytics();//This function is being injected later on the "skeleton.placeholder" below

    // scripts which are AMD defined by calling define function
    // if 'define' is in our global name space then we expose our web SDK as an AMD module with one dependency: wlanalytics.
    if (typeof define === 'function' && define.amd) {

        if (!require.specified('ibmmfpfanalytics')) {
			define("ibmmfpfanalytics",function() {
      			return dummyanalytics();
			});            
		}
        define(['ibmmfpfanalytics'], factory);

    } else {
        // not using 'define', so we expose our web sdk (WL) to the global name space.
        // if wlanalytics is not in the global name space, we use dummy implementation for them

        if (!root.ibmmfpfanalytics) {
            root.ibmmfpfanalytics = wlanalytics;
        }
        root.WL = factory(root.ibmmfpfanalytics);
    }
    
    
    function dummyanalytics() {

	  	logger = {
			pkg: _apiAnalyticsMissing,
			state: _apiAnalyticsMissing,
			capture: _apiAnalyticsMissing,
			enable: _apiAnalyticsMissing,
			updateConfigFromServer: _apiAnalyticsMissing,
			trace      : _apiAnalyticsMissing,
			debug      : _apiAnalyticsMissing,
			log        : _apiAnalyticsMissing,
			info       : _apiAnalyticsMissing,
			warn       : _apiAnalyticsMissing,
			error      : _apiAnalyticsMissing,
			fatal      : _apiAnalyticsMissing
			      
		};	
	   return {
			init: _apiAnalyticsMissing,
			enable : _apiAnalyticsMissing,
			state: _apiAnalyticsMissing,
			send: _apiAnalyticsMissing,
			setUserContext: _apiAnalyticsMissing,
			addEvent: _apiAnalyticsMissing,
			setAutoSendLogs: _apiAnalyticsMissing,
	        processAutomaticTrigger: _apiAnalyticsMissing,
			logger: logger
		}
		function _apiAnalyticsMissing(message){
			var textMssg = '';
			if (typeof message === 'string'){
				textMssg = ' (message sent: ' + message + ')';
			}		
			console.log("Sending analytics data to the MobileFirst Analytics server is ignored. Are you sure the MobileFirst Analytics JavaScript file is included in your project?." +  textMssg);
		};
	};

}(this, function(wlanalytics) {

    
    

/**
 * ================================================================= 
 * Source file taken from :: wldeferredjs.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license
 * deferred-js https://github.com/warpdesign/deferred-js#licence
 * Copyright 2012 © Nicolas Ramz
 * Released under the MIT license
 */

(function(global) {
	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}

	function foreach(arr, handler) {
		if (isArray(arr)) {
			for (var i = 0; i < arr.length; i++) {
				handler(arr[i]);
			}
		}
		else
			handler(arr);
	}

	function D(fn) {
		var status = 'pending',
			doneFuncs = [],
			failFuncs = [],
			progressFuncs = [],
			resultArgs = null,

			promise = {
				done: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'resolved') {
									arr[j].apply(this, resultArgs);
								}

								doneFuncs.push(arr[j]);
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'resolved') {
								arguments[i].apply(this, resultArgs);
							}

							doneFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				fail: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'rejected') {
									arr[j].apply(this, resultArgs);
								}

								failFuncs.push(arr[j]);
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'rejected') {
								arguments[i].apply(this, resultArgs);
							}

							failFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				always: function() {
					return this.done.apply(this, arguments).fail.apply(this, arguments);
				},

				progress: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'pending') {
									progressFuncs.push(arr[j]);
								}
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'pending') {
								progressFuncs.push(arguments[i]);
							}
						}
					}

					return this;
				},

				then: function() {
					// fail callbacks
					if (arguments.length > 1 && arguments[1]) {
						this.fail(arguments[1]);
					}

					// done callbacks
					if (arguments.length > 0 && arguments[0]) {
						this.done(arguments[0]);
					}

					// notify callbacks
					if (arguments.length > 2 && arguments[2]) {
						this.progress(arguments[2]);
					}
				},

				promise: function(obj) {
					if (obj == null) {
						return promise;
					} else {
						for (var i in promise) {
							obj[i] = promise[i];
						}
						return obj;
					}
				},

				state: function() {
					return status;
				},

				debug: function() {
					console.log('[debug]', doneFuncs, failFuncs, status);
				},

				isRejected: function() {
					return status === 'rejected';
				},

				isResolved: function() {
					return status === 'resolved';
				},

				pipe: function(done, fail, progress) {
					return D(function(def) {
						foreach(done, function(func) {
							// filter function
							if (typeof func === 'function') {
								deferred.done(function() {
									var returnval = func.apply(this, arguments);
									// if a new deferred/promise is returned, its state is passed to the current deferred/promise
									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									}
									else {	// if new return val is passed, it is passed to the piped done
										def.resolve(returnval);
									}
								});
							}
							else {
								deferred.done(def.resolve);
							}
						});

						foreach(fail, function(func) {
							if (typeof func === 'function') {
								deferred.fail(function() {
									var returnval = func.apply(this, arguments);

									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									} else {
										def.reject(returnval);
									}
								});
							}
							else {
								deferred.fail(def.reject);
							}
						});
					}).promise();
				}
			},

			deferred = {
				resolveWith: function(context) {
					if (status === 'pending') {
						status = 'resolved';
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < doneFuncs.length; i++) {
							doneFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				rejectWith: function(context) {
					if (status === 'pending') {
						status = 'rejected';
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < failFuncs.length; i++) {
							failFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				notifyWith: function(context) {
					if (status === 'pending') {
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < progressFuncs.length; i++) {
							progressFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				resolve: function() {
					return this.resolveWith(this, arguments);
				},

				reject: function() {
					return this.rejectWith(this, arguments);
				},

				notify: function() {
					return this.notifyWith(this, arguments);
				}
			}

		var obj = promise.promise(deferred);

		if (fn) {
			fn.apply(obj, [obj]);
		}

		return obj;
	}

	D.when = function() {
		if (arguments.length < 2) {
			var obj = arguments.length ? arguments[0] : undefined;
			if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
				return obj.promise();
			}
			else {
				return D().resolve(obj).promise();
			}
		}
		else {
			return (function(args){
				var df = D(),
					size = args.length,
					done = 0,
					rp = new Array(size);	// resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved

				for (var i = 0; i < args.length; i++) {
					(function(j) {
						var obj = null;

						if (args[j].done) {
							args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(df, rp); }})
								.fail(function() { df.reject(arguments); });
						} else {
							obj = args[j];
							args[j] = new Deferred();

							args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(df, rp); }})
								.fail(function() { df.reject(arguments); }).resolve(obj);
						}
					})(i);
				}

				return df.promise();
			})(arguments);
		}
	},

	D.isEmptyObject = function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	}

	global.Deferred = D;
	global.WLJQ = D;
	global.WLJQ.Deferred = function () {
		return new Deferred();
	}
})(window);/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
 

/**
 * ================================================================= 
 * Source file taken from :: stacktrace.min.js
 * ================================================================= 
 */

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
// https://github.com/eriwen/javascript-stacktrace/blob/v0.5.0/stacktrace.js
function printStackTrace(e){e=e||{guess:true};var t=e.e||null,n=!!e.guess;var r=new printStackTrace.implementation,i=r.run(t);return n?r.guessAnonymousFunctions(i):i}if(typeof module!=="undefined"&&module.exports){module.exports=printStackTrace}printStackTrace.implementation=function(){};printStackTrace.implementation.prototype={run:function(e,t){e=e||this.createException();t=t||this.mode(e);if(t==="other"){return this.other(arguments.callee)}else{return this[t](e)}},createException:function(){try{this.undef()}catch(e){return e}},mode:function(e){if(e["arguments"]&&e.stack){return"chrome"}else if(e.stack&&e.sourceURL){return"safari"}else if(e.stack&&e.number){return"ie"}else if(typeof e.message==="string"&&typeof window!=="undefined"&&window.opera){if(!e.stacktrace){return"opera9"}if(e.message.indexOf("\n")>-1&&e.message.split("\n").length>e.stacktrace.split("\n").length){return"opera9"}if(!e.stack){return"opera10a"}if(e.stacktrace.indexOf("called from line")<0){return"opera10b"}return"opera11"}else if(e.stack){return"firefox"}return"other"},instrumentFunction:function(e,t,n){e=e||window;var r=e[t];e[t]=function(){n.call(this,printStackTrace().slice(4));return e[t]._instrumented.apply(this,arguments)};e[t]._instrumented=r},deinstrumentFunction:function(e,t){if(e[t].constructor===Function&&e[t]._instrumented&&e[t]._instrumented.constructor===Function){e[t]=e[t]._instrumented}},chrome:function(e){var t=(e.stack+"\n").replace(/^\S[^\(]+?[\n$]/gm,"").replace(/^\s+(at eval )?at\s+/gm,"").replace(/^([^\(]+?)([\n$])/gm,"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,"{anonymous}()@$1").split("\n");t.pop();return t},safari:function(e){return e.stack.replace(/\[native code\]\n/m,"").replace(/^(?=\w+Error\:).*$\n/m,"").replace(/^@/gm,"{anonymous}()@").split("\n")},ie:function(e){var t=/^.*at (\w+) \(([^\)]+)\)$/gm;return e.stack.replace(/at Anonymous function /gm,"{anonymous}()@").replace(/^(?=\w+Error\:).*$\n/m,"").replace(t,"$1@$2").split("\n")},firefox:function(e){return e.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^[\(@]/gm,"{anonymous}()@").split("\n")},opera11:function(e){var t="{anonymous}",n=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;var r=e.stacktrace.split("\n"),i=[];for(var s=0,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){var a=u[4]+":"+u[1]+":"+u[2];var f=u[3]||"global code";f=f.replace(/<anonymous function: (\S+)>/,"$1").replace(/<anonymous function>/,t);i.push(f+"@"+a+" -- "+r[s+1].replace(/^\s+/,""))}}return i},opera10b:function(e){var t=/^(.*)@(.+):(\d+)$/;var n=e.stacktrace.split("\n"),r=[];for(var i=0,s=n.length;i<s;i++){var o=t.exec(n[i]);if(o){var u=o[1]?o[1]+"()":"global code";r.push(u+"@"+o[2]+":"+o[3])}}return r},opera10a:function(e){var t="{anonymous}",n=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;var r=e.stacktrace.split("\n"),i=[];for(var s=0,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){var a=u[3]||t;i.push(a+"()@"+u[2]+":"+u[1]+" -- "+r[s+1].replace(/^\s+/,""))}}return i},opera9:function(e){var t="{anonymous}",n=/Line (\d+).*script (?:in )?(\S+)/i;var r=e.message.split("\n"),i=[];for(var s=2,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){i.push(t+"()@"+u[2]+":"+u[1]+" -- "+r[s+1].replace(/^\s+/,""))}}return i},other:function(e){var t="{anonymous}",n=/function\s*([\w\-$]+)?\s*\(/i,r=[],i,s,o=10;while(e&&e["arguments"]&&r.length<o){i=n.test(e.toString())?RegExp.$1||t:t;s=Array.prototype.slice.call(e["arguments"]||[]);r[r.length]=i+"("+this.stringifyArguments(s)+")";e=e.caller}return r},stringifyArguments:function(e){var t=[];var n=Array.prototype.slice;for(var r=0;r<e.length;++r){var i=e[r];if(i===undefined){t[r]="undefined"}else if(i===null){t[r]="null"}else if(i.constructor){if(i.constructor===Array){if(i.length<3){t[r]="["+this.stringifyArguments(i)+"]"}else{t[r]="["+this.stringifyArguments(n.call(i,0,1))+"..."+this.stringifyArguments(n.call(i,-1))+"]"}}else if(i.constructor===Object){t[r]="#object"}else if(i.constructor===Function){t[r]="#function"}else if(i.constructor===String){t[r]='"'+i+'"'}else if(i.constructor===Number){t[r]=i}}}return t.join(",")},sourceCache:{},ajax:function(e){var t=this.createXMLHTTPObject();if(t){try{t.open("GET",e,false);t.send(null);return t.responseText}catch(n){}}return""},createXMLHTTPObject:function(){var e,t=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var n=0;n<t.length;n++){try{e=t[n]();this.createXMLHTTPObject=t[n];return e}catch(r){}}},isSameDomain:function(e){return typeof location!=="undefined"&&e.indexOf(location.hostname)!==-1},getSource:function(e){if(!(e in this.sourceCache)){this.sourceCache[e]=this.ajax(e).split("\n")}return this.sourceCache[e]},guessAnonymousFunctions:function(e){for(var t=0;t<e.length;++t){var n=/\{anonymous\}\(.*\)@(.*)/,r=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,i=e[t],s=n.exec(i);if(s){var o=r.exec(s[1]);if(o){var u=o[1],a=o[2],f=o[3]||0;if(u&&this.isSameDomain(u)&&a){var l=this.guessAnonymousFunction(u,a,f);e[t]=i.replace("{anonymous}",l)}}}}return e},guessAnonymousFunction:function(e,t,n){var r;try{r=this.findFunctionName(this.getSource(e),t)}catch(i){r="getSource failed with url: "+e+", exception: "+i.toString()}return r},findFunctionName:function(e,t){var n=/function\s+([^(]*?)\s*\(([^)]*)\)/;var r=/['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;var i=/['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;var s="",o,u=Math.min(t,20),a,f;for(var l=0;l<u;++l){o=e[t-l-1];f=o.indexOf("//");if(f>=0){o=o.substr(0,f)}if(o){s=o+s;a=r.exec(s);if(a&&a[1]){return a[1]}a=n.exec(s);if(a&&a[1]){return a[1]}a=i.exec(s);if(a&&a[1]){return a[1]}}}return"(?)"}}


/**
 * ================================================================= 
 * Source file taken from :: webcrypto-shim.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


/**
 * @file Web Cryptography API shim
 * @author Artem S Vybornov <vybornov@gmail.com>
 * @license MIT
 */
!function ( global ) {
    'use strict';

    if ( typeof Promise !== 'function' )
        throw "Promise support required";

    var _crypto = global.crypto || global.msCrypto;
    if ( !_crypto ) return;

    var _subtle = _crypto.subtle || _crypto.webkitSubtle;
    if ( !_subtle ) return;

    var _Crypto     = global.Crypto || _crypto.constructor || Object,
        _SubtleCrypto = global.SubtleCrypto || _subtle.constructor || Object,
        _CryptoKey  = global.CryptoKey || global.Key || Object;

    var isIE    = !!global.msCrypto,
        isWebkit = !!_crypto.webkitSubtle;
    if ( !isIE && !isWebkit ) return;

    function s2a ( s ) {
        return btoa(s).replace(/\=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    function a2s ( s ) {
        s += '===', s = s.slice( 0, -s.length % 4 );
        return atob( s.replace(/-/g, '+').replace(/_/g, '/') );
    }

    function s2b ( s ) {
        var b = new Uint8Array(s.length);
        for ( var i = 0; i < s.length; i++ ) b[i] = s.charCodeAt(i);
        return b;
    }

    function b2s ( b ) {
        if ( b instanceof ArrayBuffer ) b = new Uint8Array(b);
        return String.fromCharCode.apply( String, b );
    }

    function alg ( a ) {
        var r = { 'name': (a.name || a || '').toUpperCase().replace('V','v') };
        switch ( r.name ) {
            case 'SHA-1':
            case 'SHA-256':
            case 'SHA-384':
            case 'SHA-512':
                break;
            case 'AES-CBC':
            case 'AES-GCM':
            case 'AES-KW':
                if ( a.length ) r['length'] = a.length;
                break;
            case 'HMAC':
                if ( a.hash ) r['hash'] = alg(a.hash);
                if ( a.length ) r['length'] = a.length;
                break;
            case 'RSAES-PKCS1-v1_5':
                if ( a.publicExponent ) r['publicExponent'] = new Uint8Array(a.publicExponent);
                if ( a.modulusLength ) r['modulusLength'] = a.modulusLength;
                break;
            case 'RSASSA-PKCS1-v1_5':
            case 'RSA-OAEP':
                if ( a.hash ) r['hash'] = alg(a.hash);
                if ( a.publicExponent ) r['publicExponent'] = new Uint8Array(a.publicExponent);
                if ( a.modulusLength ) r['modulusLength'] = a.modulusLength;
                break;
            default:
                throw new SyntaxError("Bad algorithm name");
        }
        return r;
    };

    function jwkAlg ( a ) {
        return {
            'HMAC': {
                'SHA-1': 'HS1',
                'SHA-256': 'HS256',
                'SHA-384': 'HS384',
                'SHA-512': 'HS512'
            },
            'RSASSA-PKCS1-v1_5': {
                'SHA-1': 'RS1',
                'SHA-256': 'RS256',
                'SHA-384': 'RS384',
                'SHA-512': 'RS512'
            },
            'RSAES-PKCS1-v1_5': {
                '': 'RSA1_5'
            },
            'RSA-OAEP': {
                'SHA-1': 'RSA-OAEP',
                'SHA-256': 'RSA-OAEP-256'
            },
            'AES-KW': {
                '128': 'A128KW',
                '192': 'A192KW',
                '256': 'A256KW'
            },
            'AES-GCM': {
                '128': 'A128GCM',
                '192': 'A192GCM',
                '256': 'A256GCM'
            },
            'AES-CBC': {
                '128': 'A128CBC',
                '192': 'A192CBC',
                '256': 'A256CBC'
            }
        }[a.name][ ( a.hash || {} ).name || a.length || '' ];
    }

    function b2jwk ( k ) {
        if ( k instanceof ArrayBuffer || k instanceof Uint8Array ) k = JSON.parse( decodeURIComponent( escape( b2s(k) ) ) );
        var jwk = { 'kty': k.kty, 'alg': k.alg, 'ext': k.ext || k.extractable };
        switch ( jwk.kty ) {
            case 'oct':
                jwk.k = k.k;
            case 'RSA':
                [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'oth' ].forEach( function ( x ) { if ( x in k ) jwk[x] = k[x] } );
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        return jwk;
    }

    function jwk2b ( k ) {
        var jwk = b2jwk(k);
        if ( isIE ) jwk['extractable'] = jwk.ext, delete jwk.ext;
        return s2b( unescape( encodeURIComponent( JSON.stringify(jwk) ) ) ).buffer;
    }

    function pkcs2jwk ( k ) {
        var info = b2der(k), prv = false;
        if ( info.length > 2 ) prv = true, info.shift(); // remove version from PKCS#8 PrivateKeyInfo structure
        var jwk = { 'ext': true };
        switch ( info[0][0] ) {
            case '1.2.840.113549.1.1.1':
                var rsaComp = [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi' ],
                    rsaKey  = b2der( info[1] );
                if ( prv ) rsaKey.shift(); // remove version from PKCS#1 RSAPrivateKey structure
                for ( var i = 0; i < rsaKey.length; i++ ) {
                    if ( !rsaKey[i][0] ) rsaKey[i] = rsaKey[i].subarray(1);
                    jwk[ rsaComp[i] ] = s2a( b2s( rsaKey[i] ) );
                }
                jwk['kty'] = 'RSA';
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        return jwk;
    }

    function jwk2pkcs ( k ) {
        var key, info = [ [ '', null ] ], prv = false;
        switch ( k.kty ) {
            case 'RSA':
                var rsaComp = [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi' ],
                    rsaKey = [];
                for ( var i = 0; i < rsaComp.length; i++ ) {
                    if ( !( rsaComp[i] in k ) ) break;
                    var b = rsaKey[i] = s2b( a2s( k[ rsaComp[i] ] ) );
                    if ( b[0] & 0x80 ) rsaKey[i] = new Uint8Array(b.length + 1), rsaKey[i].set( b, 1 );
                }
                if ( rsaKey.length > 2 ) prv = true, rsaKey.unshift( new Uint8Array([0]) ); // add version to PKCS#1 RSAPrivateKey structure
                info[0][0] = '1.2.840.113549.1.1.1';
                key = rsaKey;
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        info.push( new Uint8Array( der2b(key) ).buffer );
        if ( !prv ) info[1] = { 'tag': 0x03, 'value': info[1] };
        else info.unshift( new Uint8Array([0]) ); // add version to PKCS#8 PrivateKeyInfo structure
        return new Uint8Array( der2b(info) ).buffer;
    }

    var oid2str = { 'KoZIhvcNAQEB': '1.2.840.113549.1.1.1' },
        str2oid = { '1.2.840.113549.1.1.1': 'KoZIhvcNAQEB' };

    function b2der ( buf, ctx ) {
        if ( buf instanceof ArrayBuffer ) buf = new Uint8Array(buf);
        if ( !ctx ) ctx = { pos: 0, end: buf.length };

        if ( ctx.end - ctx.pos < 2 || ctx.end > buf.length ) throw new RangeError("Malformed DER");

        var tag = buf[ctx.pos++],
            len = buf[ctx.pos++];

        if ( len >= 0x80 ) {
            len &= 0x7f;
            if ( ctx.end - ctx.pos < len ) throw new RangeError("Malformed DER");
            for ( var xlen = 0; len--; ) xlen <<= 8, xlen |= buf[ctx.pos++];
            len = xlen;
        }

        if ( ctx.end - ctx.pos < len ) throw new RangeError("Malformed DER");

        var rv;

        switch ( tag ) {
            case 0x02: // Universal Primitive INTEGER
                rv = buf.subarray( ctx.pos, ctx.pos += len );
                break;
            case 0x03: // Universal Primitive BIT STRING
                if ( buf[ctx.pos++] ) throw new Error( "Unsupported bit string" );
                len--;
            case 0x04: // Universal Primitive OCTET STRING
                rv = new Uint8Array( buf.subarray( ctx.pos, ctx.pos += len ) ).buffer;
                break;
            case 0x05: // Universal Primitive NULL
                rv = null;
                break;
            case 0x06: // Universal Primitive OBJECT IDENTIFIER
                var oid = btoa( b2s( buf.subarray( ctx.pos, ctx.pos += len ) ) );
                if ( !( oid in oid2str ) ) throw new Error( "Unsupported OBJECT ID " + oid );
                rv = oid2str[oid];
                break;
            case 0x30: // Universal Constructed SEQUENCE
                rv = [];
                for ( var end = ctx.pos + len; ctx.pos < end; ) rv.push( b2der( buf, ctx ) );
                break;
            default:
                throw new Error( "Unsupported DER tag 0x" + tag.toString(16) );
        }

        return rv;
    }

    function der2b ( val, buf ) {
        if ( !buf ) buf = [];

        var tag = 0, len = 0,
            pos = buf.length + 2;

        buf.push( 0, 0 ); // placeholder

        if ( val instanceof Uint8Array ) {  // Universal Primitive INTEGER
            tag = 0x02, len = val.length;
            for ( var i = 0; i < len; i++ ) buf.push( val[i] );
        }
        else if ( val instanceof ArrayBuffer ) { // Universal Primitive OCTET STRING
            tag = 0x04, len = val.byteLength, val = new Uint8Array(val);
            for ( var i = 0; i < len; i++ ) buf.push( val[i] );
        }
        else if ( val === null ) { // Universal Primitive NULL
            tag = 0x05, len = 0;
        }
        else if ( typeof val === 'string' && val in str2oid ) { // Universal Primitive OBJECT IDENTIFIER
            var oid = s2b( atob( str2oid[val] ) );
            tag = 0x06, len = oid.length;
            for ( var i = 0; i < len; i++ ) buf.push( oid[i] );
        }
        else if ( val instanceof Array ) { // Universal Constructed SEQUENCE
            for ( var i = 0; i < val.length; i++ ) der2b( val[i], buf );
            tag = 0x30, len = buf.length - pos;
        }
        else if ( typeof val === 'object' && val.tag === 0x03 && val.value instanceof ArrayBuffer ) { // Tag hint
            val = new Uint8Array(val.value), tag = 0x03, len = val.byteLength;
            buf.push(0); for ( var i = 0; i < len; i++ ) buf.push( val[i] );
            len++;
        }
        else {
            throw new Error( "Unsupported DER value " + val );
        }

        if ( len >= 0x80 ) {
            var xlen = len, len = 4;
            buf.splice( pos, 0, (xlen >> 24) & 0xff, (xlen >> 16) & 0xff, (xlen >> 8) & 0xff, xlen & 0xff );
            while ( len > 1 && !(xlen >> 24) ) xlen <<= 8, len--;
            if ( len < 4 ) buf.splice( pos, 4 - len );
            len |= 0x80;
        }

        buf.splice( pos - 2, 2, tag, len );

        return buf;
    }

    function CryptoKey ( key, alg, ext, use ) {
        Object.defineProperties( this, {
            _key: {
                value: key
            },
            type: {
                value: key.type,
                enumerable: true
            },
            extractable: {
                value: (ext === undefined) ? key.extractable : ext,
                enumerable: true
            },
            algorithm: {
                value: (alg === undefined) ? key.algorithm : alg,
                enumerable: true
            },
            usages: {
                value: (use === undefined) ? key.usages : use,
                enumerable: true
            }
        });
    }

    function isPubKeyUse ( u ) {
        return u === 'verify' || u === 'encrypt' || u === 'wrapKey';
    }

    function isPrvKeyUse ( u ) {
        return u === 'sign' || u === 'decrypt' || u === 'unwrapKey';
    }

    [ 'generateKey', 'importKey', 'unwrapKey' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c ) {
                var args = [].slice.call(arguments),
                    ka, kx, ku;

                switch ( m ) {
                    case 'generateKey':
                        ka = alg(a), kx = b, ku = c;
                        break;
                    case 'importKey':
                        ka = alg(c), kx = args[3], ku = args[4];
                        if ( a === 'jwk' ) {
                            b = b2jwk(b);
                            if ( !b.alg ) b.alg = jwkAlg(ka);
                            if ( !b.key_ops ) b.key_ops = ( b.kty !== 'oct' ) ? ( 'd' in b ) ? ku.filter(isPrvKeyUse) : ku.filter(isPubKeyUse) : ku.slice();
                            args[1] = jwk2b(b);
                        }
                        break;
                    case 'unwrapKey':
                        ka = args[4], kx = args[5], ku = args[6];
                        args[2] = c._key;
                        break;
                }

                if ( m === 'generateKey' && ka.name === 'HMAC' && ka.hash ) {
                    ka.length = ka.length || { 'SHA-1': 512, 'SHA-256': 512, 'SHA-384': 1024, 'SHA-512': 1024 }[ka.hash.name];
                    return _subtle.importKey( 'raw', _crypto.getRandomValues( new Uint8Array( (ka.length+7)>>3 ) ), ka, kx, ku );
                }

                if ( isWebkit && m === 'generateKey' && ka.name === 'RSASSA-PKCS1-v1_5' && ( !ka.modulusLength || ka.modulusLength >= 2048 ) ) {
                    a = alg(a), a.name = 'RSAES-PKCS1-v1_5', delete a.hash;
                    return _subtle.generateKey( a, true, [ 'encrypt', 'decrypt' ] )
                        .then( function ( k ) {
                            return Promise.all([
                                _subtle.exportKey( 'jwk', k.publicKey ),
                                _subtle.exportKey( 'jwk', k.privateKey )
                            ]);
                        })
                        .then( function ( keys ) {
                            keys[0].alg = keys[1].alg = jwkAlg(ka);
                            keys[0].key_ops = ku.filter(isPubKeyUse), keys[1].key_ops = ku.filter(isPrvKeyUse);
                            return Promise.all([
                                _subtle.importKey( 'jwk', keys[0], ka, kx, keys[0].key_ops ),
                                _subtle.importKey( 'jwk', keys[1], ka, kx, keys[1].key_ops )
                            ]);
                        })
                        .then( function ( keys ) {
                            return {
                                publicKey: keys[0],
                                privateKey: keys[1]
                            };
                        });
                }

                if ( ( isWebkit || ( isIE && ( ka.hash || {} ).name === 'SHA-1' ) )
                        && m === 'importKey' && a === 'jwk' && ka.name === 'HMAC' && b.kty === 'oct' ) {
                    return _subtle.importKey( 'raw', s2b( a2s(b.k) ), c, args[3], args[4] );
                }

                if ( isWebkit && m === 'importKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    return _subtle.importKey( 'jwk', pkcs2jwk(b), c, args[3], args[4] );
                }

                if ( isIE && m === 'unwrapKey' ) {
                    return _subtle.decrypt( args[3], c, b )
                        .then( function ( k ) {
                            return _subtle.importKey( a, k, args[4], args[5], args[6] );
                        });
                }

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror =    function ( e ) { rej(e)               };
                        op.oncomplete = function ( r ) { res(r.target.result) };
                    });
                }

                op = op.then( function ( k ) {
                    if ( ka.name === 'HMAC' ) {
                        if ( !ka.length ) ka.length = 8 * k.algorithm.length;
                    }
                    if ( ka.name.search('RSA') == 0 ) {
                        if ( !ka.modulusLength ) ka.modulusLength = (k.publicKey || k).algorithm.modulusLength;
                        if ( !ka.publicExponent ) ka.publicExponent = (k.publicKey || k).algorithm.publicExponent;
                    }
                    if ( k.publicKey && k.privateKey ) {
                        k = {
                            publicKey: new CryptoKey( k.publicKey, ka, kx, ku.filter(isPubKeyUse) ),
                            privateKey: new CryptoKey( k.privateKey, ka, kx, ku.filter(isPrvKeyUse) )
                        };
                    }
                    else {
                        k = new CryptoKey( k, ka, kx, ku );
                    }
                    return k;
                });

                return op;
            }
        });

    [ 'exportKey', 'wrapKey' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c ) {
                var args = [].slice.call(arguments);

                switch ( m ) {
                    case 'exportKey':
                        args[1] = b._key;
                        break;
                    case 'wrapKey':
                        args[1] = b._key, args[2] = c._key;
                        break;
                }

                if ( ( isWebkit || ( isIE && ( b.algorithm.hash || {} ).name === 'SHA-1' ) )
                        && m === 'exportKey' && a === 'jwk' && b.algorithm.name === 'HMAC' ) {
                    args[0] = 'raw';
                }

                if ( isWebkit && m === 'exportKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    args[0] = 'jwk';
                }

                if ( isIE && m === 'wrapKey' ) {
                    return _subtle.exportKey( a, b )
                        .then( function ( k ) {
                            if ( a === 'jwk' ) k = s2b( unescape( encodeURIComponent( JSON.stringify( b2jwk(k) ) ) ) );
                            return  _subtle.encrypt( args[3], c, k );
                        });
                }

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror =    function ( e ) { rej(e)               };
                        op.oncomplete = function ( r ) { res(r.target.result) };
                    });
                }

                if ( m === 'exportKey' && a === 'jwk' ) {
                    op = op.then( function ( k ) {
                        if ( ( isWebkit || ( isIE && ( b.algorithm.hash || {} ).name === 'SHA-1' ) )
                                && b.algorithm.name === 'HMAC') {
                            return { 'kty': 'oct', 'alg': jwkAlg(b.algorithm), 'key_ops': b.usages.slice(), 'ext': true, 'k': s2a( b2s(k) ) };
                        }
                        k = b2jwk(k);
                        if ( !k.alg ) k['alg'] = jwkAlg(b.algorithm);
                        if ( !k.key_ops ) k['key_ops'] = ( b.type === 'public' ) ? b.usages.filter(isPubKeyUse) : ( b.type === 'private' ) ? b.usages.filter(isPrvKeyUse) : b.usages.slice();
                        return k;
                    });
                }

                if ( isWebkit && m === 'exportKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    op = op.then( function ( k ) {
                        k = jwk2pkcs( b2jwk(k) );
                        return k;
                    });
                }

                return op;
            }
        });

    [ 'encrypt', 'decrypt', 'sign', 'verify' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c, d ) {
                if ( isIE && ( !c.byteLength || ( d && !d.byteLength ) ) )
                    throw new Error("Empy input is not allowed");

                var args = [].slice.call(arguments),
                    ka = alg(a);

                if ( isIE && m === 'decrypt' && ka.name === 'AES-GCM' ) {
                    var tl = a.tagLength >> 3;
                    args[2] = (c.buffer || c).slice( 0, c.byteLength - tl ),
                    a.tag = (c.buffer || c).slice( c.byteLength - tl );
                }

                args[1] = b._key;

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror = function ( e ) {
                            rej(e);
                        };

                        op.oncomplete = function ( r ) {
                            var r = r.target.result;

                            if ( m === 'encrypt' && r instanceof AesGcmEncryptResult ) {
                                var c = r.ciphertext, t = r.tag;
                                r = new Uint8Array( c.byteLength + t.byteLength );
                                r.set( new Uint8Array(c), 0 );
                                r.set( new Uint8Array(t), c.byteLength );
                                r = r.buffer;
                            }

                            res(r);
                        };
                    });
                }

                return op;
            }
        });

    if ( isIE ) {
        var _digest = _subtle.digest;

        _subtle['digest'] = function ( a, b ) {
            if ( !b.byteLength )
                throw new Error("Empy input is not allowed");

            var op;
            try {
                op = _digest.call( _subtle, a, b );
            }
            catch ( e ) {
                return Promise.reject(e);
            }

            op = new Promise( function ( res, rej ) {
                op.onabort =
                op.onerror =    function ( e ) { rej(e)               };
                op.oncomplete = function ( r ) { res(r.target.result) };
            });

            return op;
        };

        global.crypto = Object.create( _crypto, {
            getRandomValues: { value: function ( a ) { return _crypto.getRandomValues(a) } },
            subtle:          { value: _subtle }
        });

        global.CryptoKey = CryptoKey;
    }

    if ( isWebkit ) {
        _crypto.subtle = _subtle;

        global.Crypto = _Crypto;
        global.SubtleCrypto = _SubtleCrypto;
        global.CryptoKey = CryptoKey;
    }
}(this);


/**
 * ================================================================= 
 * Source file taken from :: wljsx.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

 /*globals WLJSX, WLJQ*/

/*jshint unused:false*/
function __WL() {}
var WL = WL ? WL : {};

window.WLJSX = {

  /*jshint strict:false*/

  /*
   * Constant values, required for prototype.js functionality
   */
  emptyFunction: function() {},

  /**
   * Search for an element with a specified ID and returns it as a DOM element.
   * Returns null if element is not found
   *
   * @Param selector - a string with the requires DOM element's Id
   */
  $: function(id) {
    var elements = WLJQ('#' + id);
    if (elements.length === 0) {
      return null;
    } else {
      return elements[0];
    }
  },

  /**
   * Searches for the elements with a specified selector and returns them as an array of DOM elements
   *
   * @Param selector - a string representing a CSS selector
   */
  $$: function(selector) {
    return WLJQ(selector);
  },

  $$$: function(elem) {
    var elements = WLJQ(elem);
    if (elements.length === 0) {
      return null;
    } else {
      return elements[0];
    }
  },

  /**
   * Same as $$ but searches inside of a given element only. Returns array of DOM elements
   *
   * @Param el - the DOM element to search inside of
   * @Param selector - a string representing a CSS selector
   */
  find: function(el, selector) {
    return WLJQ(el).find(selector);
  },

  /**
   * Creates a new DOM element and returns it
   *
   * @Param type - a string representing the element type (tag name, e.g. '<div/>')
   * @Param attrs - an object of attributes to be added to newly created element
   */
  newElement: function(type, attrs) {
    return WLJQ(type, attrs)[0];
  },

  /**
   * Appends the content before the end of a DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to append content to
   * @Param content - new content to be appended
   */
  append: function(el, content) {
    WLJQ(el).append(content);
  },

  /**
   * Prepends the content at the beginning of a DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to prepend content to
   * @Param content - new content to be prepended
   */
  prepend: function(el, content) {
    WLJQ(el).prepend(content);
  },

  /**
   * Sets or Gets DOM element's content
   *
   * @Param el - the DOM element to update content in
   * @Param content - new content, can be string or other DOM elements
   */
  html: function(el, content) {
    if (content) {
      WLJQ(el).html(content);
    } else {
      return WLJQ(el).html();
    }
  },

  /**
   * Empties the content of a given DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to empty
   */
  empty: function(el) {
    WLJQ(el).empty();
  },

  /**
   * Shows a DOM element (makes visible)
   *
   * @Param el - the DOM element (or CSS selector string) to make visible
   */
  show: function(el) {
    WLJQ(el).show();
  },

  /**
   * Hides a DOM element (makes invisible)
   *
   * @Param el - the DOM element (or CSS selector string) to hide
   */
  hide: function(el) {
    WLJQ(el).hide();
  },

  /**
   * Adds a specified CSS class to DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to add the CSS class to
   * @Param className - string with the class' name
   */
  addClass: function(el, className) {
    WLJQ(el).addClass(className);
  },

  /**
   * Removes a specified CSS class from DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to remove the CSS class from
   * @Param className - string with the class' name
   */
  removeClass: function(el, className) {
    WLJQ(el).removeClass(className);
  },

  /**
   * Sets or Gets the width of a DOM element (first one in case several elements fit CSS selector)
   *
   * @Param el - the DOM element to get/set width
   * @Param width - new width to set
   */
  width: function(el, width) {
    if (width) {
      WLJQ(el).width(width);
    } else {
      return WLJQ(el).width();
    }
  },

  /**
   * Sets or Gets the height of a DOM element (first one in case several elements fit CSS selector)
   *
   * @Param el - the DOM element to get/set height
   * @Param height - new height to set
   */
  height: function(el, height) {
    if (height) {
      WLJQ(el).height(height);
    } else {
      return WLJQ(el).height();
    }
  },

  /**
   * Removes an element from the DOM.
   *
   * @Param el - the DOM element (or CSS selector string) to remove
   */
  remove: function(el) {
    WLJQ(el).remove();
  },

  /**
   * Sets specific CSS style on the DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to set CSS style on
   * @Param style - an object of CSS styles to be set
   */
  css: function(el, style) {
    WLJQ(el).css(style);
  },

  /**
   * Sets or Gets the attribute of a DOM element
   *
   * @Param el - the DOM element to get/set attribute
   * @Param attrName - the name of an attribute
   * @Param attrValue - the new value of the attribute
   */
  attr: function(el, attrName, attrValue) {
    if (attrValue) {
      WLJQ(el).attr(attrName, attrValue);
    } else {
      return WLJQ(el).attr(attrName);
    }
  },

  /**
   * Adds the event listener to DOM elements for a specified event
   *
   * @Param el - the DOM element (or CSS selector string) to add event listener to
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   * @Param callback - a JavaScript function to be invoked once event is triggered
   */
  bind: function(el, event, callback) {
    WLJQ(el).bind(event, callback);
  },

  /**
   * Removes the event listener from DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to remove event listener form
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   */
  unbind: function(el, event) {
    if (event) {
      WLJQ(el).unbind(event);
    } else {
      WLJQ(el).unbind();
    }
  },

  /**
   * Triggers a specific event on DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to trigger the event on
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   */
  trigger: function(el, event) {
    WLJQ(el).trigger(event);
  },

  /**
   * Retrieves the element that triggered the event (event's target)
   *
   * @Param event - event to get the target from
   */
  eventTarget: function(event) {
    return event.target;
  },

  /*
   * Detects browser types. Implementation taken from Prototype.js
   */
  detectBrowser: function() {
    var userAgent = navigator.userAgent;
    /*jshint eqeqeq:false*/
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      isIE: !!window.attachEvent && !isOpera,
      isOpera: isOpera,
      isWebKit: userAgent.indexOf('AppleWebKit/') > -1,
      isGecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
      isMobileSafari: /Apple.*Mobile/.test(userAgent),
      isWP81RT: userAgent.indexOf('Windows Phone 8.1') > -1
    };
  },

  /*
   * Returns viewport root element depending on a browser. Implementation taken from Prototype.js
   */
  getViewportRootElement: function() {
    var browser = WLJSX.detectBrowser();

    if (browser.isWebKit && !document.evaluate) {
      return document;
    }

    if (browser.isOpera && window.parseFloat(window.opera.version()) < 9.5) {
      return document.body;
    }

    return document.documentElement;
  },

  /*
   * Returns the width of a viewport
   */
  getViewportWidth: function() {
    return (this.getViewportRootElement())['clientWidth'];
  },

  /*
   * Returns the height of a viewport
   */
  getViewportHeight: function() {
    return (this.getViewportRootElement())['clientHeight'];
  },

  isEmptyObject: function(obj) {
    return WLJQ.isEmptyObject(obj);
  }


};

/*
 * The following namespaces are taken from prototypejs framework and adopted to work with MobileFirst Platform
 */

/*
 * Class object defines a Class.create API for object oriented JS approach
 */
window.WLJSX.Class = (function() {
  var IS_DONTENUM_BUGGY = (function() {
    for (var p in {
        toString: 1
      }) {
      if (p === 'toString') {
        return false;
      }
    }
    return true;
  })();

  function subclass() {}

  function create() {
    var parent = null;
    var properties = WLJSX.Object.toArray(arguments);

    if (WLJSX.Object.isFunction(properties[0])) {
      parent = properties.shift();
    }

    function klass() {
      this.initialize.apply(this, arguments);
    }

    WLJSX.Object.extend(klass, WLJSX.Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      /*jshint newcap:false*/
      klass.prototype = new subclass();
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      klass.addMethods(properties[i]);
    }

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = WLJSX.emptyFunction;
    }

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor = this.superclass && this.superclass.prototype,
      properties = WLJSX.Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      /*jshint eqeqeq:false*/
      if (source.toString != Object.prototype.toString) {
        properties.push('toString');
      }
      if (source.valueOf != Object.prototype.valueOf) {
        properties.push('valueOf');
      }
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i],
        value = source[property];

      if (ancestor && WLJSX.Object.isFunction(value) && value.argumentNames()[0] == '__super') {
        var method = value;
        /*jshint -W083*/
        value = (function(m) {
          return function() {
            return ancestor[m].apply(this, arguments);
          };
        })
        (property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }
    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();

/*
 * WLJSX.Object APIs are responsible for Object related functionality
 *
 * WLJSX.Object.objectSize(obj) - returns the number of properties in the supplied object
 * WLJSX.Object.toArray(iterable) - coverts object to array
 * WLJSX.Object.toJSON(obj) - converts object to it's JSON representation
 * WLJSX.Object.extend(destination, source) - extends destination object with properties from the source object
 * WLJSX.Object.toQueryString(obj) - converts object to a query string
 * WLJSX.Object.keys(obj) - returns object keys as array
 * WLJSX.Object.clone(obj) - returns a new copy of a supplied object
 * WLJSX.Object.isArray(obj) - checks whether object is an array
 * WLJSX.Object.isFunction(obj) - checks whether object is a function
 * WLJSX.Object.isString(obj) - checks whether object is a string
 * WLJSX.Object.isNumber(obj) - checks whether object is a number
 * WLJSX.Object.isDate(obj) - checks whether object is a date
 * WLJSX.Object.isUndefined(obj) - checks whether object is undefined
 */
window.WLJSX.Object = {
  _toString: Object.prototype.toString,
  NULL_TYPE: 'Null',
  UNDEFINED_TYPE: 'Undefined',
  BOOLEAN_TYPE: 'Boolean',
  NUMBER_TYPE: 'Number',
  STRING_TYPE: 'String',
  OBJECT_TYPE: 'Object',
  FUNCTION_CLASS: '[object Function]',
  BOOLEAN_CLASS: '[object Boolean]',
  NUMBER_CLASS: '[object Number]',
  STRING_CLASS: '[object String]',
  ARRAY_CLASS: '[object Array]',
  DATE_CLASS: '[object Date]',

  NATIVE_JSON_STRINGIFY_SUPPORT: (window.JSON &&
    typeof JSON.stringify === 'function' &&
    JSON.stringify(0) === '0' &&
    typeof JSON.stringify(function(x) {
      return x;
    }) === 'undefined'),

  objectSize: function(obj) {
    var count = 0;
    /*jshint forin:false*/
    for (var key in obj) {
      count++;
    }
    return count;
  },

  toArray: function(iterable) {
    if (!iterable) {
      return [];
    }
    if ('toArray' in Object(iterable)) {
      return iterable.toArray();
    }
    var length = iterable.length || 0;
    var result = new Array(length);
    while (length--) {
      result[length] = iterable[length];
    }
    return result;
  },

  Type: function(o) {
    switch (o) {
      case null:
        return WLJSX.Object.NULL_TYPE;
      case (void 0):
        return WLJSX.Object.UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch (type) {
      case 'boolean':
        return WLJSX.Object.BOOLEAN_TYPE;
      case 'number':
        return WLJSX.Object.NUMBER_TYPE;
      case 'string':
        return WLJSX.Object.STRING_TYPE;
    }
    return WLJSX.Object.OBJECT_TYPE;
  },

  extend: function(destination, source) {
    /*jshint forin:false*/
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  },

  toJSON: function(object) {
    if (WLJSX.Object.NATIVE_JSON_STRINGIFY_SUPPORT) {
      return JSON.stringify(object);
    }
    else {
      return WLJSX.Object.Str('', {
        '': object
      }, []);
    }
  },

  Str: function(key, holder, stack) {
    var value = holder[key];
    var type = typeof value;
    if (WLJSX.Object.Type(value) === WLJSX.Object.OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }
    var _class = WLJSX.Object._toString.call(value);
    switch (_class) {
      case WLJSX.Object.NUMBER_CLASS:
      case WLJSX.Object.BOOLEAN_CLASS:
      case WLJSX.Object.STRING_CLASS:
        value = value.valueOf();
    }
    switch (value) {
      case null:
        return 'null';
      case true:
        return 'true';
      case false:
        return 'false';
    }
    type = typeof value;
    switch (type) {
      case 'string':
        return value;
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':
        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError();
          }
        }
        stack.push(value);
        var partial = [];
        if (_class === WLJSX.Object.ARRAY_CLASS) {
          for (i = 0, length = value.length; i < length; i++) {
            var str = WLJSX.Object.Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = '[' + partial.join(',') + ']';
        } else {
          var keys = WLJSX.Object.keys(value);
          for (i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            var strResult = WLJSX.Object.Str(key, value, stack);
            if (typeof strResult !== 'undefined') {
              partial.push(WLJSX.String.inspect(key, true) + ':' + strResult);
            }
          }
          partial = '{' + partial.join(',') + '}';
        }
        stack.pop();
        return partial;
    }
  },

  toQueryString: function(object) {
    var results = [];

    /*jshint forin:false*/
    for (var key in object) {
      key = encodeURIComponent(key);
      var value = object[key];
      var queryPair = (WLJSX.Object.isUndefined(value)) ? key : key + '=' + encodeURIComponent(WLJSX.String.interpret(value));
      results.push(queryPair);
    }
    return results.join('&');
  },

  keys: function(object) {
    if (WLJSX.Object.Type(object) !== WLJSX.Object.OBJECT_TYPE) {
      throw new TypeError();
    }
    var results = [];
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        results.push(property);
      }
    }
    return results;
  },

  clone: function(object) {
    return WLJSX.Object.extend({}, object);
  },

  isArray: function(object) {
    if ((typeof Array.isArray === 'function') && Array.isArray([]) && !Array.isArray({})) {
      return Array.isArray(object);
    } else {
      return WLJSX.Object._toString.call(object) === WLJSX.Object.ARRAY_CLASS;
    }
  },

  isFunction: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.FUNCTION_CLASS;
  },

  isString: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.STRING_CLASS;
  },

  isNumber: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.NUMBER_CLASS;
  },

  isDate: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.DATE_CLASS;
  },

  isUndefined: function(object) {
    return typeof object === 'undefined';
  }
};

/*jshint -W100*/

/*
 * WLJSX.String APIs are responsible for String related functionality
 *
 * WLJSX.String.stripScripts(str) - stripts <script> tags from string
 * WLJSX.String.escapeHTML(str) - replaces &, < and > characters with their escaped HTML values
 * WLJSX.String.inspect(str) - Returns a debug-oriented version of the string (i.e. wrapped in single or double quotes, with backslashes and quotes escaped)
 * WLJSX.String.interpret(str) - Forces value into a string. Returns an empty string for null
 * WLJSX.String.strip(str) - Strips all leading and trailing whitespace from a string
 * WLJSX.String.isJSON(str) - validates whether string is a valid JSON representation
 * WLJSX.String.isBlank(str) - Check if the string is 'blank' � either empty (length of 0) or containing only whitespace.
 * WLJSX.String.unfilterJSON(str) - Strips comment delimiters around Ajax JSON or JavaScript responses. This security method is called internally
 * WLJSX.String.evalJSON(str) - Evaluates the JSON in the string and returns the resulting object
 * WLJSX.String.parseResponseHeaders(str) - Parses the string returned by the XMLHttpRequest.getAllResponseHeaders() method and returns an map holding the response headers
 * WLJSX.String.getHeaderByKey(headers, key) - case insenstive search in a map for a given key, Returns the header as json
 */
window.WLJSX.String = {
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  },
  stripScripts: function(str) {
    return str.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
  },

  escapeHTML: function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  interpret: function(str) {
    return str === null ? '' : String(str);
  },

  strip: function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  toQueryParams: function(str) {
    var match = WLJSX.String.strip(str).match(/([^?#]*)(#.*)?$/);
    if (!match) {
      return {};
    }

    var paramsArray = match[1].split('&');
    var paramsObj = {};
    for (var i = 0; i < paramsArray.length; i++) {
      var pair = paramsArray[i].split('=');
      if (pair[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value !== undefined) {
          value = decodeURIComponent(value);
        }
        paramsObj[key] = value;
      }
    }
    return paramsObj;
  },

  isJSON: function(str) {
    if (WLJSX.String.isBlank(str)) {
      return false;
    }
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
  },

  isBlank: function(str) {
    return (/^\s*$/).test(str);
  },

  inspect: function(str, useDoubleQuotes) {
    var escapedString = str.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in WLJSX.String.specialChar) {
        return WLJSX.String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) {
      return '"' + escapedString.replace(/"/g, '\\"') + '"';
    }
    return '\'' + escapedString.replace(/'/g, '\\\'') + '\'';
  },

  unfilterJSON: function(str) {
    return str.replace(/^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1');
  },

  evalJSON: function(str, sanitize) {
    var json = WLJSX.String.unfilterJSON(str);
    if (window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test) {
      // Native json parse support
      return JSON.parse(json);
    } else {
      // No native json parse support
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      if (cx.test(json)) {
        json = json.replace(cx, function(a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      try {
        if (!sanitize || WLJSX.String.isJSON(json)) {
          /*jshint evil:true*/
          return eval('(' + json + ')');
        }
      } catch (e) {}
      throw new SyntaxError('Badly formed JSON string: ' + WLJSX.String.inspect(str));
    }
  },
  
  parseResponseHeaders: function(responseHeadersString) {
    var responseHeaders = {};
    if (responseHeadersString !== null && typeof (responseHeadersString) !== 'undefined') {
       var delimiter = responseHeadersString.indexOf('\r') > -1 ? '\r\n' : '\n';
       var allHeaders = responseHeadersString.split(delimiter);

       /*jshint maxdepth:4*/
       for (var i = 0; i < allHeaders.length; i++) {
         var pair = allHeaders[i];
         var index = pair.indexOf(': ');
         /*jshint maxdepth:5*/
         if (index > 0) {
           var key = pair.substring(0, index);
           var value = pair.substring(index + 2);
           responseHeaders[key] = value;
         }
       }
    }
    return responseHeaders;
  },
  
  getHeaderByKey: function(headers, key) {
	//case insensitive search
	for (var headerKey in headers) {
		if (headerKey.toLowerCase() === key.toLowerCase()) {
			var jsonHeader = {};
			jsonHeader[key] = headers[headerKey];
			return jsonHeader;
		}
	}
	return null;
  }
};

/*
 * WLJSX.PeriodicalExecuter APIs are responsible for PeriodicalExecuter related functionality
 *
 * WLJSX.Object.execute() - Executes a callback supplied at initialization
 * WLJSX.Object.stop() - Stops the timer interval execution
 * new WLJSX.PeriodicalExecuter(callback, frequency) - returns new WLJSX.PeriodicalExecuter() object
 * which will call callback at specified frequencies (in seconds)
 */
window.WLJSX.PeriodicalExecuter = function(callback, frequency) {
  var currentlyExecuting = false;

  function onTimerEvent() {
    if (!currentlyExecuting) {
      try {
        currentlyExecuting = true;
        callback();
        currentlyExecuting = false;
      } catch (e) {
        currentlyExecuting = false;
        throw e;
      }
    }
  }

  var timer = setInterval(onTimerEvent.bind(this), frequency * 1000);

  return {
    execute: function() {
      callback(this);
    },

    stop: function() {
      if (!timer) {
        return;
      }
      clearInterval(timer);
      timer = null;
    }
  };
};


/*
 * Extends JavaScript Function object
 *
 * Public API:
 * functionName.argumentNames - http://api.prototypejs.org/language/Function/prototype/argumentNames/
 * finctionName.bind - http://api.prototypejs.org/language/Function/prototype/bind/
 * functionName.bindAsEventListener - http://api.prototypejs.org/language/Function/prototype/bindAsEventListener/
 * functionName.curry - http://api.prototypejs.org/language/Function/prototype/curry/
 * functionName.delay - http://api.prototypejs.org/language/Function/prototype/delay/
 * functionName.defer - http://api.prototypejs.org/language/Function/prototype/defer/
 * functionName.wrap - http://api.prototypejs.org/language/Function/prototype/wrap/
 */
WLJSX.Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length,
      length = args.length;
    while (length--) {
      array[arrayLength + length] = args[length];
    }
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    /*jshint eqeqeq:false*/
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && WLJSX.Object.isUndefined(arguments[0])) {
      return this;
    }
    var __method = this,
      args = slice.call(arguments, 1);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    };
  }

  function bindAsEventListener(context) {
    var __method = this,
      args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    };
  }

  function curry() {
    if (!arguments.length) {
      return this;
    }
    var __method = this,
      args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    };
  }

  function delay(timeout) {
    var __method = this,
      args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    };
  }

  return {
    argumentNames: argumentNames,
    bind: bind,
    bindAsEventListener: bindAsEventListener,
    curry: curry,
    delay: delay,
    defer: defer,
    wrap: wrap
  };
})());


/**
 * ================================================================= 
 * Source file taken from :: validators.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */


/**
 * Validators are responsible for validating method arguments in development mode.
 */
WL.Validators = {
    // Validation should be disabled by default - so Welcome pages do not validate in production.
    // If we want validation for the welcome page we must add a solution to turn it off in production.
    isValidationEnabled : false,
    verbose : true,

    // True when 'o' is set, the native JavaScript event is defined, and 'o' has an event phase
    isEvent : function(obj) {
	return obj && obj.type;
    },

    logAndThrow : function(msg, callerName) {
	// Logger is not be available in public resources (welcome page).
	if (WL.Logger) {
	    if (callerName) {
		msg = "Invalid invocation of method " + callerName + "; " + msg;
	    }
	    if (this.verbose) {
		WL.Logger.error(msg);
	    }
	}
	throw new Error(msg);
    },

    enableValidation : function() {
	this.isValidationEnabled = true;
    },

    disableValidation : function() {
	this.isValidationEnabled = false;
    },

    validateArguments : function(validators, args, callerName) {
	if (validators.length < args.length) {
	    // More arguments than validators ... accept only if last argument is an Event.
	    if ((validators.length !== (args.length - 1)) || !this.isEvent(args[args.length - 1])) {
		this.logAndThrow("Method was passed " + args.length + " arguments, expected only " + validators.length + " " + WLJSX.Object.toJSON(validators) + ".", callerName);
	    }
	}
	this.validateArray(validators, args, callerName);
    },

    validateMinimumArguments : function(args, mandatoryArgsLength, callerName) {
	if (args.length < mandatoryArgsLength) {
	    this.logAndThrow("Method passed: " + args.length + " arguments. Minimum arguments expected are: " + mandatoryArgsLength + " arguments.", callerName);
	}
    },

    /**
     * Validates each argument in the array with the matching validator. @Param array - a JavaScript array.
     * @Param validators - an array of validators - a validator can be a function or a simple JavaScript type
     * (string).
     */
    validateArray : function(validators, array, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	for ( var i = 0; i < validators.length; ++i) {
	    this.validateArgument(validators[i], array[i], callerName);
	}
    },

    /**
     * Validates a single argument. @Param arg - an argument of any type. @Param validator - a function or a
     * simple JavaScript type (string).
     */
    validateArgument : function(validator, arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	switch (typeof validator) {
	    // Case validation function.
	    case 'function':
		validator.call(this, arg);
		break;
	    // Case direct type.
	    case 'string':
		if (typeof arg !== validator) {
		    this.logAndThrow("Invalid value '" + WLJSX.Object.toJSON(arg) + "' (" + (typeof arg) + "), expected type '" + validator + "'.", callerName);
		}
		break;
	    default:
		// This error can be caused only if IBM MobileFirst Platform code is bugged.
		this.logAndThrow("Invalid or undefined validator for argument '" + WLJSX.Object.toJSON(arg) + "'", callerName);
	}
    },

    /**
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptions : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, true, callerName);

    },

    /**
     * Validates that option attribute in the given options have a valid name and type - only if they are
     * explicitly defined in validOptions. If an option attribute does not exist in validOptions, it is simply
     * ignored @Param options - the options to validate. @Param validOptions - the valid options hash with
     * their validators: validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptionsLoose : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, false, callerName);
    },

    /**
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} } @Param strict - a boolean
     * indicating whether options' properties that don't exist in validOptions are allowed
     * 
     */
    validateObjectProperties : function(validOptions, options, strict, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	for ( var att in options) {
	    // Check that the attribute exists in the validOptions.
	    if (!validOptions[att]) {
		if (strict) {
		    this.logAndThrow("Invalid options attribute '" + att + "', valid attributes: " + WLJSX.Object.toJSON(validOptions), callerName);
		} else {
		    continue;
		}
	    }
	    try {
		// Check that the attribute type is valid.
		this.validateArgument(validOptions[att], options[att], callerName);
	    } catch (e) {
		this.logAndThrow("Invalid options attribute '" + att + "'. " + (e.message || e.description), callerName);
	    }
	}
    },

    /**
     * Validates that each option attribute in the given options is from the one of the validators type.
     * @Param options - the options to validate. @Param validatos - the valid types (in string format):
     * validators = ['string','null','undefined',someFunction,'boolean'...]
     * 
     */
    validateAllOptionTypes : function(validators, options, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	var isValidAtt = false;
	for ( var att in options) {
	    isValidAtt = false;
	    for ( var i = 0; i < validators.length; ++i) {
		try {
		    // Check that the attribute type is valid.
		    this.verbose = false;
		    this.validateArgument(validators[i], options[att], callerName);
		    isValidAtt = true;
		    break;
		} catch (e) {
		    // do nothing
		}
	    }
	    this.verbose = true;
	    if (!isValidAtt) {
		this.logAndThrow("Invalid options attribute '" + att + "' (" + typeof (options[att]) + "). Please use just the following types: " + validators.join(","), callerName);
	    }
	}
    },

    validateStringOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'string')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'string'.", callerName);
	}
    },
    
    validateNumberOrNull : function(arg, callerName) {
    	if (!this.isValidationEnabled) {
    	    return;
    	}
    	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'number')) {
    	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'number'.", callerName);
    	}
    },
        
    validateBooleanOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'boolean')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'boolean'.", callerName);
	}
    },
    
    validateObjectOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'object')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'object'.", callerName);
	}
    },

    validateArrayObjectOrNull : function(arg, callerName) {
    	if (!this.isValidationEnabled) {
    	    return;
    	}

    	if ((typeof arg !== 'undefined') && (arg !== null) && (!Array.isArray(arg))) {	
    		this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'array'.", callerName);
    	}
    	
    },
        
    validateFunctionOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'function')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'function'.", callerName);
	}
    },
	/**
	 * Validates that the url is a valid url
	 * Throws exception if not
	 * @param validOptions
	 * @param options
	 * @param callerName
	 */
	validateURLOrNull : function(url, callerName) {
		if (!this.isValidationEnabled || typeof url === 'undefined' || url == null) {
			return;
		}
		var pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		if(!url.match(pattern)) {
			this.logAndThrow("Invalid URL : " + url, callerName);
		}
	},
	validateDefined : function(arg, callerName) {
		if(typeof (arg) === 'undefined' || arg === null){
			this.logAndThrow("Invalid argument value '" + arg + "', expected not empty string.", callerName);
		}
	},
    isDefined : function(arg) {
        return(typeof (arg) === 'undefined' || arg === null)
    },

    validateNotEmptyString : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'string') || arg.length == 0) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected not empty string.", callerName);
	}
    },
	isNullOrUndefined: function (object) {
		return object === null || typeof object === 'undefined';
	},
	isString: function (object) {
	    return (typeof (object) === 'string');
	},
    isBoolean: function (object) {
        return (typeof (object) === 'boolean');
    },
    isNumber: function (object) {
        return (typeof (object) === 'number');
    },
    isArray: function (object) {
        return Array.isArray(object);
    }
};


/**
 * ================================================================= 
 * Source file taken from :: wlconfig.js
 * ================================================================= 
 */


/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLConfig = function() {
    /*jshint strict:false, maxparams:4*/
    var baseURL;
    var applicationName;
    var contextRoot;

    var serverRelativeTime;

    this.__getBaseURL = function() {
        if(typeof baseURL === 'undefined' || baseURL === null) {
            baseURL = this.__getContext() + '/api';
        }
        return baseURL;
    };

    this.__setBaseURL = function(url) {
        WL.Validators.validateURLOrNull(url, '__setBaseURL');
        baseURL = url;
    };

    this.__getApplicationName = function() {
        return applicationName;
    };

    this.__setApplicationName = function(app) {
        WL.Validators.validateDefined(app, '__setApplicationName');
        applicationName = app;
    };
    
    this.__getClientPlatform = function () {
        return 'web';
    };

    this.__getApplicationData = function () {
        var data = {};
        data['clientPlatform'] = this.__getClientPlatform();
        data['id'] = this.__getApplicationName();
        return data;
    };

    this.__getServerRelativeTime = function () {
        return WL.Validators.isNullOrUndefined(serverRelativeTime) ? 0 : serverRelativeTime;
    };

    this.__setServerRelativeTime = function (time) {
        WL.Validators.validateNumberOrNull(time, '__setServerRelativeTime');
        serverRelativeTime = time;
    };

    this.__getContext = function () {
        return contextRoot;
    };

    this.__setContext = function (ctx) {
        contextRoot = ctx;
    };
};

__WL.prototype.Config = new __WLConfig;
WL.Config = new __WLConfig;




/**
 * ================================================================= 
 * Source file taken from :: wlproperties.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*
 * NOTICE: All server errors MUST be defined with same values in the ErrorCode
 * java enumeration.
 */
var __WLErrorCode = {
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
    API_INVOCATION_FAILURE: 'API_INVOCATION_FAILURE',
    USER_INSTANCE_ACCESS_VIOLATION: 'USER_INSTANCE_ACCESS_VIOLATION',
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    DOMAIN_ACCESS_FORBIDDEN: 'DOMAIN_ACCESS_FORBIDDEN',

    // Client Side Errors
    UNRESPONSIVE_HOST: 'UNRESPONSIVE_HOST',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
    PROCEDURE_ERROR: 'PROCEDURE_ERROR',
    UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
    UNSUPPORTED_BROWSER: 'UNSUPPORTED_BROWSER',
    DISABLED_COOKIES: 'DISABLED_COOKIES',
    CONNECTION_IN_PROGRESS: 'CONNECTION_IN_PROGRESS',
    AUTHORIZATION_FAILURE: 'AUTHORIZATION_FAILURE',
    CHALLENGE_HANDLING_CANCELED: 'CHALLENGE_HANDLING_CANCELED'
};

WL.Language = {
  DIRECTION_LTR: 0,
  DIRECTION_RTL: 1,
  LANGUAGES_RTL: ['he', 'iw', 'ar']
};

__WL.prototype.ErrorCode = __WLErrorCode;
WL.ErrorCode = __WLErrorCode;


/**
 * ================================================================= 
 * Source file taken from :: wlIndexDb.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*jshint strict:false, maxparams:4*/
__WLIndexDB = function() {
    var defaultCategory = 'default';

    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;



    // Open (or create) the database, the database is always the appID
    var dbName;

    var db;

    /**
     * Initializes the DB and creates a default category, should be called on startup
     * @param name
     * @returns {*}
     */
    this.init = function() {
        var dfd = WLJQ.Deferred();

        // In the cases where we don't have indexedDB support
        WL.Validators.validateDefined(indexedDB, 'init');

        dbName = WL.Config.__getApplicationName();
        var request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = function(event) {
            var thisDB = event.target.result;
            if(!thisDB.objectStoreNames.contains(defaultCategory)) {
                thisDB.createObjectStore(defaultCategory, {keyPath: "key"});
            }
            var transaction = event.target.transaction;

            transaction.oncomplete =
                function() {
                    dfd.resolve();
                }
        };

        request.onerror = function (event) {
            WL.Logger.error(JSON.stringify(event.target.error.message));
            dfd.reject(event.target.error);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            dfd.resolve();
        };
        return dfd.promise();
    };

    this.saveOrUpdateKeyPair = function(keyId, keypair) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        var privateKey = keypair.privateKey;
        var publicKey = keypair.publicKey;

        // Save private key
        WL.IndexDB.saveOrUpdateItem(publicKeyKey, publicKey).then(
            function(){
                // Save public key
               WL.IndexDB.saveOrUpdateItem(privateKeyKey, privateKey).then(
                   function(){
                   dfd.resolve();
               },
                   function(error){
                       dfd.reject(error);
               })
        }, function(error){
                dfd.reject(error);
        });
        return dfd.promise();
    };


    this.saveOrUpdateItem = function(key, value) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readwrite');
        var input = {'key' : key , 'value' : value};
        var request = store.put(input);

        request.onsuccess = function() {
            dfd.resolve();
        };

        request.onerror = function(e) {
            WL.Logger.error('Error setting item in indexedDb : ' + e.target.error.name);
            dfd.reject(e);
        };
        return dfd.promise();
    };

    this.getKeyPair = function(keyId) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        var keypair = {};
        this.getItem(privateKeyKey).then(
            function(privateKey){
                if(!privateKey) {
                    dfd.resolve(null);
                }
                // Continue to public key
                keypair['privateKey'] = privateKey;
                WL.IndexDB.getItem(publicKeyKey).then(
                    function(publicKey){
                        if(!publicKey) {
                            dfd.resolve(null);
                        }
                        // Got both keys
                        keypair['publicKey'] = publicKey;
                        dfd.resolve(keypair);
                    },
                    function(e){
                        dfd.reject(e);
                });
        }, function(e){
                dfd.reject(e);
        });
        return dfd.promise();
    };

    this.getItem = function(key) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readonly');
        var request = store.get(key);

        request.onerror = function(e) {
            WL.Logger.error('Error getting item from indexedDb : ' + e.target.error.name);
            dfd.reject(e);
        };

        request.onsuccess = function() {
            if (!WL.Validators.isNullOrUndefined(request.result)){
                dfd.resolve(request.result.value);
            } else {
                dfd.resolve();
            }
        };
        return dfd.promise();
    };

    this.removeKeyPair = function(keyId) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        this.removeItem(privateKeyKey).always(
            function(){
            WL.IndexDB.removeItem(publicKeyKey).always(function(){
                dfd.resolve();
            });
        });
        return dfd.promise();
    };

    this.removeItem = function(key) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readwrite');

        var request = store.delete(key);

        request.onsuccess = function() {
            dfd.resolve();
        };
        return dfd.promise();
    };

    this.clearDB = function() {
        var dfd = WLJQ.Deferred();
        var DBOpenRequest = window.indexedDB.open(dbName, 1);
        DBOpenRequest.onsuccess = function (event) {

            // store the result of opening the database in the db variable. This is used a lot below
            var db = event.target.result;
            var transaction = db.transaction(defaultCategory, 'readwrite');
            var objectStore = transaction.objectStore(defaultCategory);
            var objectStoreRequest = objectStore.clear();

            objectStoreRequest.onsuccess = function(event) {
                dfd.resolve();
            };

            objectStoreRequest.onerror = function(event) {
                dfd.reject();
            };
        };
        return dfd.promise();
    };

    function getObjectStore(permissions) {
        WL.Validators.validateDefined(db, 'getObjectStore');
        var tx = db.transaction(defaultCategory, permissions);
        return tx.objectStore(defaultCategory);
    }

};
__WL.prototype.IndexDB = new __WLIndexDB;
WL.IndexDB = new __WLIndexDB;


/**
 * ================================================================= 
 * Source file taken from :: wllocalstoragedb.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/*globals WLConfig */

__WLLocalStorageDB = function() {
    /*jshint strict:false, maxparams:4*/

    var appNamePrefix;

    // By Default, we work with localStorage, unless it is changed during a set/get
    var storage = window.localStorage;


    this.init = function() {
        appNamePrefix = WL.Config.__getApplicationName();
    };

    /**
     * Sets an item in the Database
     * @param key
     * @param value
     * @param options {{session : boolean, global : boolean}}
     * @returns {*}
     */
    this.setItem = function(key, value, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        var finalValue = value ? JSON.stringify(value) : null;
        storage.setItem(finalKey, finalValue);
    };

    this.getItem = function(key, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        var value = storage.getItem(finalKey);
        return value ? JSON.parse(value) : null;
    };


    this.removeItem = function(key, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        storage.removeItem(finalKey);
    };

    /**
     * Takes the options the user entered (if any) and appends them to the default
     * options, overriding the default values
     * @param userOptions
     * @returns {{global: boolean, session: boolean}}
     */
    function initOptions(userOptions) {
        var options = {
            'session' : false,
            'global' : false
        };
        for (var property in userOptions) {
            options[property] = userOptions[property];
        }

        // Init the storage
        storage = options.session ? window.sessionStorage : window.localStorage;

        return options;
    }

    function buildKey(key, options) {
        return options.global ? key : appNamePrefix + '.' + key;
    }
};

__WL.prototype.LocalStorageDB = new __WLLocalStorageDB;
WL.LocalStorageDB = new __WLLocalStorageDB;


/**
 * ================================================================= 
 * Source file taken from :: wlclient.web.js
 * ================================================================= 
 */

/*
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */


__WLClient = function() {

    this.__chMap = {};
    this.__globalHeaders = {};
    var userInfo = {};
    var initOptions = {};
    var MESSAGE_ID = 'messageId';

    var isConnecting = false;

    this.addGlobalHeader = function (headerName, headerValue) {
        this.__globalHeaders[headerName] = headerValue;
    };

    this.__getGlobalHeaders = function(onSuccess){
        return this.__globalHeaders;
    };

    this.getEnvironment = function () {
        return 'web';
    };

    this.getMessageID = function() {
        return MESSAGE_ID;
    };


    this.init = function (initOptions) {
        var dfd = WLJQ.Deferred();

        setInitParams(initOptions);

        // Init the DBs
        WL.LocalStorageDB.init();

        // init analytics - analytics is defined in AMDWrapper.js
        wlanalytics.init(WL.BrowserManager.getWLUniqueID(),WL.Config.__getApplicationName(), WL.Config.__getContext());

        var hasWlCommonInit = window.wlCommonInit !== undefined;
        //Call to load localized user visible messages based on device locale.
        WL.Utils.setLocalization().always(function () {
            WL.IndexDB.init().then(
            function(){
                if (hasWlCommonInit) {
                    wlCommonInit();
                }
                dfd.resolve();
            }
            ,function(error) {
                dfd.reject(error);
            });
        });

        if(!hasWlCommonInit) {
            // We return a promise only if the user didn't implement wlCommonInit();
            return dfd.promise();
        }
    };

    function setInitParams(params) {
        WL.Validators.enableValidation();

        // assign params to initOptions inside WL.Client class
        initOptions = params;

        var mfpContextRoot = params['mfpContextRoot'];
        WL.Validators.validateDefined(mfpContextRoot, 'init');

        var appId = params['applicationId'];
        WL.Validators.validateDefined(appId, 'init');

        // Pass to config
        WL.Config.__setContext(mfpContextRoot);
        WL.Config.__setApplicationName(appId);
    }

    this.invokeProcedure = function (invocationData, options) {
        WL.Validators.validateOptions({
            onSuccess : 'function',
            onFailure : 'function',
            invocationContext : function() {
            },
            onConnectionFailure : 'function',
            timeout : 'number',
            fromChallengeRequest : 'boolean'
        }, options, 'WL.Client.invokeProcedure');

        options = extendWithDefaultOptions(options);

        var blocked = false;

        function onInvokeProcedureSuccess(transport) {
            if (!blocked) {
                blocked = true;
                if (!transport.responseJSON || (transport.responseJSON && !transport.responseJSON.isSuccessful)) {
                    var failResponse = new WL.Response(transport, options.invocationContext);
                    failResponse.errorCode = WL.ErrorCode.PROCEDURE_ERROR;
                    failResponse.errorMsg = 'Procedure invocation error.';
                    failResponse.invocationResult = transport.responseJSON;
                    if (!failResponse.invocationResult) {
                    }
                    else if (failResponse.invocationResult.errors) {
                        failResponse.errorMsg += " " + failResponse.invocationResult.errors;
                    }
                    WL.Logger.error(failResponse.errorMsg);
                    options.onFailure(failResponse);
                } else {
                    var response = new WL.Response(transport, options.invocationContext);
                    response.invocationResult = transport.responseJSON;
                    options.onSuccess(response);
                }
            }

        }

        function onInvokeProcedureFailure(transport) {
            if (!blocked) {
                blocked = true;
                setConnected(false);
                var errorCode = transport.responseJSON.errorCode;
                if (options.onConnectionFailure && (errorCode == WL.ErrorCode.UNRESPONSIVE_HOST || errorCode == WL.ErrorCode.REQUEST_TIMEOUT)) {
                    options.onConnectionFailure(new WL.FailResponse(transport, options.invocationContext));
                } else {
                    options.onFailure(new WL.FailResponse(transport, options.invocationContext));
                }
            }
        }

        var resourceRequest = {};

        if (!WLJSX.Object.isUndefined(options.timeout)) {
            resourceRequest = new WL.ResourceRequest("/adapters/" + invocationData.adapter + "/" + invocationData.procedure, WL.ResourceRequest.GET, options.timeout);
        } else {
            resourceRequest = new WL.ResourceRequest("/adapters/" + invocationData.adapter + "/" + invocationData.procedure, WL.ResourceRequest.GET);
        }

        //add parameters
        resourceRequest.setQueryParameter("params", WLJSX.Object.toJSON(invocationData.parameters));

        var environment = WL.Client.getEnvironment();

        resourceRequest.send().then(
            onInvokeProcedureSuccess,
            onInvokeProcedureFailure
        );
    };


    this.pinTrustedCertificatePublicKey = function(certificateFilename){};

    this.reloadApp = function () {
        document.location.reload();
    };

    this.setHeartBeatInterval = function (interval) {
        WL.Validators.validateArguments(['number'], arguments, 'WL.Client.setHeartBeatInterval');
        if (typeof(WL.AuthorizationManager) !== 'undefined' && WL.AuthorizationManager !== null) {
            WL.AuthorizationManager.__sendHeartBeat(interval);
        }
    };

    this.setDeviceDisplayName = function(deviceDisplayName, options) {
        WL.Validators.validateArguments(['string', WL.Validators.validateObjectOrNull], arguments, 'WL.Client.setDeviceDisplayName');

        if ( typeof options !== "undefined") {
            WL.Validators.validateOptions({
                onSuccess : 'function',
                onFailure : 'function'
            }, options, 'WL.Client.setDeviceDisplayName');
        } else {
            options = {};
            options.onSuccess = function(){};
            options.onFailure = function(){};
        }

        WL.DeviceAuth.__setDeviceDisplayName(deviceDisplayName, options.onSuccess, options.onFailure);
    };

    this.getDeviceDisplayName = function(options) {

        WL.Validators.validateArguments(['object'], arguments, 'WL.Client.getDeviceDisplayName');

        WL.Validators.validateOptions({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, 'WL.Client.getDeviceDisplayName');

        WL.DeviceAuth.__getDeviceDisplayName(options.onSuccess, options.onFailure);
    };


    this.removeGlobalHeader = function (headerName) {
        delete this.__globalHeaders[headerName];
    };


    this.getCookies = function () {};


    this.setCookie = function (cookie) {};


    this.deleteCookie = function (name) {};


    this.getLanguage = function() {};

    this.isWl401 = function(response) {
        if (response.status == 401) {
            var challengesHeader = response.getHeader("WWW-Authenticate");
            if (( typeof challengesHeader !== "undefined") && (challengesHeader == "MFP-Challenge")) {
                return true;
            }
        }
        return false;
    };

    /**
     * @ignore
     * check is a IBM MobileFirst Platform 403 response
     */
    this.isWl403 = function(response) {
        if (response.status == 403 || response.status == 222) {
            if (( typeof response.responseJSON !== "undefined") && (response.responseJSON != null) && response.responseJSON["failures"]) {
                return true;
            }
        }
        return false;
    };

    this.checkResponseForChallenges = function(wlRequest, response, responseForPostAnswersRealm) {
        var containsChallenges = false;

        // iterate over successes in json
        if (( typeof response.responseJSON !== "undefined") && (response.responseJSON != null) && (response.responseJSON["successes"] !== "undefined") && (response.responseJSON["successes"] != null)) {
            successes = response.responseJSON["successes"];
            handleSuccess(successes);
        }

        if (this.isWl401(response)) {
            var challengeRealms = response.responseJSON.challenges;
            wlRequest.setExpectedAnswers(challengeRealms);
            var realm = getDirectUpdateRealm(challengeRealms);
            if (realm) {
                executeChallenge(challengeRealms, realm);
            } else {
                for (realm in challengeRealms) {
                    executeChallenge(challengeRealms, realm);
                }
            }
            containsChallenges = true;
        }
        // check if wl403
        else if (this.isWl403(response)) {
            var wlFailure = response.responseJSON["failures"];
            isConnecting = false;
            // only one failure in this type of message
            for (var realm in wlFailure) {
                if (Object.prototype.hasOwnProperty.call(wlFailure, realm)) {
                    handler = this.__chMap[realm];
                    if (handler != null && typeof handler !== 'undefined') {
                        handler.handleFailure(wlFailure[realm], wlRequest, response);
                        handler.clearWaitingList();
                        wlRequest.onFailure(response);
                    }
                }
            }
            containsChallenges = true;
        }
        else {
            for (var processorRealm in WL.Client.__chMap) {
                if (Object.prototype.hasOwnProperty.call(WL.Client.__chMap, processorRealm)) {
                    var handler = WL.Client.__chMap[processorRealm];
                    if (!handler.isWLHandler && handler.canHandleResponse(response)) {
                        handler.startChallengeHandling(wlRequest, response);
                        containsChallenges = true;
                        break;
                    }
                }
            }
        }
        // Handle successes
        function handleSuccess(successes) {
            for (var securityCheck in successes) {
                if (Object.prototype.hasOwnProperty.call(successes, securityCheck)) {
                    // always add the identity to userInfo even if there is
                    // no cp to handle it (like SingleIdentity)
                    userInfo[securityCheck] = successes[securityCheck];
                    var cp = WL.Client.__chMap[securityCheck];
                    if ( typeof cp !== "undefined") {
                        if (cp.isWLHandler) {
                            cp.handleSuccess(successes[securityCheck]);
                            cp.releaseWaitingList();
                        }
                    }
                }
            }
        }

        /**
         * Search for the direct update scope in an array of realms
         * @param realms - an array of realms
         * @returns the update realm if it found or null if it doesn't
         */
        function getDirectUpdateRealm(realms) {

            for (var scope in realms) {
                if (scope == 'directUpdate') {
                    return scope;
                }
            }

            return null;
        }

        /**
         * handle the challenge (execute it if everything is ok)
         * @param challengeRealms - an array of realms that the given realm is part of
         * @param realm - the realm of the challenge that needs to be execute
         */
        function executeChallenge(challengeRealms,realm)
        {
            if (Object.prototype.hasOwnProperty
                    .call(challengeRealms, realm)) {
                // get the correct challenge
                var handler = WL.Client.__chMap[realm];
                if (handler == null || typeof handler == 'undefined') {
                    var errorMsg = "unknown challenge arrived, cannot proccess challenge handler: "
                        + realm + ". register challenge handler using WL.Client.createSecurityCheckChallengeHandler()";
                    WL.Logger.error(errorMsg);
                    var transportFailure = {
                        status: -1,
                        responseJSON: {
                            errorCode: WL.ErrorCode.UNEXPECTED_ERROR,
                            errorMsg: errorMsg
                        }
                    };
                    wlRequest.onFailure(transportFailure);

                } else {
                    handler.startChallengeHandling(wlRequest,
                        challengeRealms[realm]);
                }
            }
        }

        return containsChallenges;
    };



    this.createGatewayChallengeHandler = function(gatewayName) {
            // Creates abstract challenge handler
            var challengeHandler = new AbstractChallengeHandler(gatewayName);
            challengeHandler.isWLHandler = false;

            // Extends it by adding new methods (can also override methods)

            /**
             * User calls this function when the the challange was handled successfully.
             * When a success is submitted, the state of successes is checked for all chalanges issued per original request.
             * What this means is that, if all challenges are succesfully met, the original message would be resent automagically.
             */
            challengeHandler.submitSuccess = function() {
                // ch has done its job, now we can set the activRequest to null.
                challengeHandler.activeRequest.removeExpectedAnswer(this.realm);
                challengeHandler.activeRequest = null;
                challengeHandler.releaseWaitingList();

            };

            /**
             * Must be implemented by developer.
             *
             * This method will be invoked by the IBM MobileFirst Platform for every server response.
             * It is responsible to detect whether server response contains data
             * that should be processed by this challenge handler.
             */
            challengeHandler.canHandleResponse = function(transport) {
                return false;
            };

            /**
             * This method should be used in a challenge handler to submit authentication of a form, in case of form
             * based authentication.
             */
            challengeHandler.submitLoginForm = function(reqURL, options, submitLoginFormCallback) {
                var timer = null;

                WL.Logger.debug("Request [login]");

                function onUnresponsiveHost(transport) {
                    if (isTimeout()) {
                        return;
                    }
                    cancelTimer();

                    WLJSX.Ajax.WLRequest.setConnected(false);
                    submitLoginFormCallback(transport);
                }

                function onLoginFormResponse(transport) {
                    if (isTimeout()) {
                        return;
                    }
                    cancelTimer();
                    submitLoginFormCallback(transport);
                }

                setTimer(WLJSX.Ajax.WLRequest.options.timeout);

                var requestHeaders = WL.CookieManager.createCookieHeaders();
                requestHeaders['x-wl-app-version'] = WL.StaticAppProps.APP_VERSION;
                if (!WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_WL_NATIVE_XHR)) {
                    // should be removed when all environments will work via native
                    requestHeaders['x-wl-device-id'] = WL.Client.__getGlobalHeaders()['x-wl-device-id'];
                }

                // add headers
                if (options && options.headers) {
                    var headers = options.headers;
                    if (( typeof headers != "undefined") && (headers != null)) {
                        for (var headerName in headers) {
                            if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
                                requestHeaders[headerName] = headers[headerName];
                            }
                        }
                    }
                }

                var reqOptions = {
                    method : 'post',
                    contentType : 'application/x-www-form-urlencoded',
                    onSuccess : onLoginFormResponse,
                    onFailure : onLoginFormResponse,
                    // Unresponsive host: Some desktops treat as success if not
                    // defined explicitly.
                    on0 : onUnresponsiveHost.bind(this),
                    requestHeaders : requestHeaders
                };

                if (WL.StaticAppProps.ENVIRONMENT === WL.Environment.ADOBE_AIR) {
                    reqOptions.postBody = WLJSX.Object.toQueryString(options.parameters);
                } else {
                    reqOptions.parameters = options.parameters;
                }

                var finalUrl = null;

                if (reqURL.indexOf("http") == 0 && reqURL.indexOf(':') > 0) {
                    finalUrl = reqURL;
                } else {
                    finalUrl = WL.Utils.createAPIRequestURL(reqURL);
                }

                var ajaxRequest = null;

                __sendRequest();

                function __sendRequest() {
                    ajaxRequest = new WLJSX.Ajax.Request(finalUrl, reqOptions);
                }

                function setTimer(timeout) {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                    }
                    timer = window.setTimeout(onTimeout, timeout);
                }

                function onTimeout() {
                    timer = null;
                    if (ajaxRequest !== null) {
                        ajaxRequest.transport.abort();
                    }

                    var transport = {};
                    transport.responseJSON = {
                        errorCode : WL.ErrorCode.REQUEST_TIMEOUT,
                        errorMsg : WL.ClientMessages.requestTimeout
                    };
                    transport.responseText = null;
                    submitLoginFormCallback(transport);
                }

                function cancelTimer() {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                }

                function isTimeout() {
                    return (timer === null);
                }

            };


            return challengeHandler;
    };


    this.createSecurityCheckChallengeHandler = function (securityCheckName) {
            // Creates SUPER challenge processor
            var challengeHandler = new AbstractChallengeHandler(securityCheckName);
            challengeHandler.isWLHandler = true;

            challengeHandler.MAX_NUMBER_OF_FAILURES = 3;
            challengeHandler.numOfFailures = 0;

            // Extends it by adding new methods (can also override methods)
            challengeHandler.submitChallengeAnswer = function(answer) {
                if (( typeof answer === "undefined") || answer == null) {
                    challengeHandler.activeRequest.removeExpectedAnswer(this.realm);
                } else {
                    challengeHandler.activeRequest.submitAnswer(this.realm, answer);
                }
                // cp has done its job, now we can set the activRequest to null.
                challengeHandler.activeRequest = null;
            };

            // when a WL success arrives, this user method is called.
            challengeHandler.handleSuccess = function(identity) {

            };

            // when a WL failure arrives, this user method is called.
            challengeHandler.handleFailure = function(err) {

            };

            // Returns it
            return challengeHandler;

    };


    function AbstractChallengeHandler(securityCheckName) {
        this.realm = securityCheckName;
        this.isWLHandler = false;
        this.activeRequest = null;
        this.requestWaitingList = [];

        /**
         * @ignore
         * in case this is the first request that is associated with the
         * challenge, set activeRequest and handleChallenge. If this is not the
         * first request, we place it in a queue for handling once we finish
         * handling the first request (just get the result).
         */
        this.startChallengeHandling = function(wlRequest, obj) {
            if (this.activeRequest == null) {
                this.activeRequest = wlRequest;
            } else if (WLJSX.Object.isUndefined(wlRequest.options.fromChallengeRequest)) {
                this.requestWaitingList.push(wlRequest);
                return;
            }

            this.handleChallenge(obj);

        };

        /**
         * @ignore
         * Must be implemented by developer.
         *
         * This method is responsible for actual challenge handling.
         * It will be invoked by the IBM MobileFirst Platform in case canHandleResponse() API has
         * returned true value
         *
         */
        this.handleChallenge = function(obj) {
        };

        /**
         * @ignore
         * In case of cancel we need to clear the waiting list of request,
         * without further handling.
         */
        this.clearWaitingList = function() {
            this.requestWaitingList = [];
        };

        /**
         * @ignore
         * When processing is successful (onSuccess) we assume the challenge is
         * answered, and does need further handling so we remove the expected
         * answer from the waiting list. Then we clear the waiting list.
         */
        this.releaseWaitingList = function() {
            if (this.requestWaitingList.length > 0) {
                for (var i = 0; i < this.requestWaitingList.length; i++) {
                    this.requestWaitingList[i].removeExpectedAnswer(this.realm);
                }
            }
            this.requestWaitingList = [];
        };

        /**
         * @ignore
         * This method is used to cancel the processing of the challenge
         * Because this is a failure to authenticate, the original message will be discarded
         * (i.e. will not be sent again, even if all other challenges are successfull)
         */
        this.cancel = function() {
            isConnecting=false;
            // store active request before calling to clearWaitingList, because of later call on onFailure
            var request = this.activeRequest;
            this.activeRequest = null;
            this.clearWaitingList();
            if (request !== null && typeof(request.options) !== 'undefined' &&
                typeof(request.options.onAuthRequestFailure) !== 'undefined') {
                var transport = {
                    status : 0,
                    responseJSON : {
                        errorCode: WL.ErrorCode.CHALLENGE_HANDLING_CANCELED,
                        errorMsg: 'Challenge handler operation was cancelled.'
                    },
                    responseText : 'Challenge handler operation was cancelled.'
                };

                var err = new WL.Response(transport, null);
                request.options.onAuthRequestFailure(err);
            }
        };

        this.moveToWaitingList = function(wlRequest) {
            this.requestWaitingList.push(wlRequest);
        };

        this.removeFromWaitingList = function(wlRequest) {
            for (var i = 0; i < this.requestWaitingList.length; i++) {
                if (this.requestWaitingList[i] === wlRequest) {
                    spliced = this.requestWaitingList.splice(i - 1, 1);
                    break;
                }
            }
        };

        WL.Client.__chMap[securityCheckName] = this;
    }

    /*
     * Check if the user added a default handler for OnRemoteDisableDenial and
     * if so, activate it. If not then call the defaultRemoteDisableDenial.
     */
    this.__handleOnRemoteDisableDenial = function(defaultonErrorRemoteDisableDenial, that, msg, downloadLink) {
        if (initOptions.onErrorRemoteDisableDenial) {
            initOptions.onErrorRemoteDisableDenial(msg, downloadLink);
        } else {
            defaultonErrorRemoteDisableDenial(that, msg, downloadLink);
        }
    };

    this.isShowCloseButtonOnRemoteDisable = function() {
      return initOptions.showCloseOnRemoteDisableDenial ? true : false;
    };
};


__WL.prototype.Client = new __WLClient;
WL.Client = new __WLClient;


/**
 * ================================================================= 
 * Source file taken from :: jwt.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLAuthorizationManager, WLConfig, WLJSX */

/*jshint strict:false, maxparams:4*/



WL.JWT = WLJSX.Class.create({
    iss :  null,
    sub : null,
    exp : 0,
    iat : 0,
    jti : null,
    aud : null,

    initialize : function JWT (jti, aud) {
        var DEFAULT_JWT_EXP_MILLIS = 60 * 1000;
        var currentTime = new Date().getTime() + WL.Config.__getServerRelativeTime();

        this.iss = WL.Config.__getApplicationName() + '$' + WL.Config.__getClientPlatform();
        this.sub = WLAuthorizationManager.__getClientId();
        this.exp = currentTime + DEFAULT_JWT_EXP_MILLIS;
        this.iat = currentTime;
        this.jti = typeof jti === 'undefined' ? null : jti;
        this.aud = typeof aud === 'undefined' ? null : aud;
    }
});

/**
 * ================================================================= 
 * Source file taken from :: accessToken.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX */

/*jshint strict:false, maxparams:4*/
WL.AccessToken = WLJSX.Class.create({
    value : null,
    expiration : 0,
    scope : null,
    asAuthorizationRequestHeader : null,
    asFormEncodedBodyParameter : null,

    initialize : function(token, expiration, scope) {
        var currentTime = new Date().getTime();
        this.value = token;

        // Expiration is in seconds, we transform to millis and add current time
        this.expiration = currentTime + (expiration * 1000);
        this.scope = scope;
        this.asAuthorizationRequestHeader = 'Bearer ' + token;
        this.asFormEncodedBodyParameter = 'access_token=' + token;
    }
});


/**
 * ================================================================= 
 * Source file taken from :: wlcrypto.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Handles the Crypto API
 * @type {{signPayload, generateKeypair}}
 */
WL.Crypto = (function () {

    var crypto = window.crypto.subtle || window.crypto.webkitSubtle;

    var generateKeyPair = function () {
        var dfd = WLJQ.Deferred();

        var algorithmKeyGen = {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),  // Equivalent to 65537
            hash: {
                name: 'SHA-256'
            }
        };

        crypto.generateKey(algorithmKeyGen, true, ['sign']).then(
            function (keyPair) {
                dfd.resolve(keyPair);
            },
            function (error) {
                WL.Logger.error('Failed to generate keypair ' + JSON.stringify(error));
                dfd.reject(error);
            }
        );

        return dfd.promise();
    };

    var signJWS = function (payload, kid, keyPair) {
        var dfd = WLJQ.Deferred();

        exportPublicKey(keyPair).then(
            function (jwk) {
                var alg = jwk.alg;
                jwk.kid = !WL.Validators.isNullOrUndefined(kid) ? kid : undefined;
                var header = {'alg' : alg, 'jwk' : jwk};
                var jwsHeaderAsString = JSON.stringify(header);
                var payloadAsString = JSON.stringify(payload);
                // concatenate JWS Header and payload.
                var csrHeaderAndPayload = encodeToBase64(jwsHeaderAsString) + '.' + encodeToBase64(payloadAsString);
                signData(csrHeaderAndPayload, keyPair).then(
                    function (signedData) {
                        dfd.resolve(csrHeaderAndPayload + '.' + signedData);
                    },
                    function (error) {
                        dfd.reject(error);
                    });
            },
            function (error) {
                dfd.reject(error);
            });
        return dfd.promise();
    };

    var signData = function (stringToSign, keyPair) {
        var dfd = WLJQ.Deferred();

        var algorithmSign = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        };
        crypto.sign(algorithmSign, keyPair.privateKey, new Uint8Array(str2arrayBuffer(stringToSign))).then(
            function (signedData) {
                var base64sign = btoa(String.fromCharCode.apply(null, new Uint8Array(signedData)));
                dfd.resolve(base64sign);
            })
            .catch(
                function (error) {
                    WL.Logger.error('error in signing data with keypair: ' + error.toString());
                    dfd.reject(error);
                });

        return dfd.promise();
    };

    var encodeToBase64 = function (string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(str2arrayBuffer(string))));
    };

    var exportPublicKey = function (keyPair) {
        var dfd = WLJQ.Deferred();

        crypto.exportKey("jwk", keyPair.publicKey).then(
            function (jsonKey) {
                dfd.resolve(jsonKey);
            },
            function (error) {
                WL.Logger.error('Failed to extract public key from keypair ' + error.toString());
                dfd.reject(error);
            });

        return dfd.promise();
    };

    var str2arrayBuffer = function (str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    return {
        signJWS: signJWS,
        generateKeyPair: generateKeyPair
    };

}());

/**
 * ================================================================= 
 * Source file taken from :: wlbrowsermanager.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLBrowserManager = function() {
    /*jshint strict:false, maxparams:4*/
    var uniqueId;
    var localDeviceDisplayName;

    /**
     * Unique ID taken from different parts of the browser information
     * @returns {*}
     */
    this.getWLUniqueID = function() {
        var key = 'com.mfp.browser.uniqueid';

        // BrowserID should be saved cross applications
        var globalOptions = {'global' : true};
        
        var uniqueId = WL.LocalStorageDB.getItem(key, globalOptions);
        if(WL.Validators.isNullOrUndefined(uniqueId)) {
            uniqueId = generateGUID();
            WL.LocalStorageDB.setItem(key, uniqueId, globalOptions);
        }
        return uniqueId;
    };

    this.__setLocalDeviceDisplayName = function(name) {
        localDeviceDisplayName = name;
    };

    /**
     * Browser Object that is used for registration
     * @returns {{}}
     */
    this.getDeviceData = function() {
        var data = {};
        data['id'] = this.getWLUniqueID();
        data['platform'] = getUserAgent();
        data['hardware'] = getPlatform();
        data['deviceDisplayName'] = localDeviceDisplayName;
        return data;
    };

    function getUserAgent() {
        return window.navigator.userAgent;
    }

    function getPlatform() {
        return window.navigator.platform;
    }

    /*
    Generates a unique ID based on the random information
     */
    function generateGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
};


__WL.prototype.BrowserManager = new __WLBrowserManager;
WL.BrowserManager = new __WLBrowserManager;


/**
 * ================================================================= 
 * Source file taken from :: ajax.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX, WL, escape, unescape*/

/*jshint strict:false*/

window.WLJSX.Ajax = {
    getTransport: function() {
        var tr = null;
        try {
            tr = new XMLHttpRequest();
        } catch (e) {}

        return tr;
    }
};

window.WLJSX.Ajax.Request = WLJSX.Class.create({
    _complete: false,

    initialize: function(url, options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/json',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        WLJSX.Object.extend(this.options, options || {});

        this.options.method = this.options.method.toLowerCase();
        this.transport = window.WLJSX.Ajax.getTransport();

        this.transport.timeout = options.timeout || 60 * 1000;


        this.request(url);
    },

    request: function(url) {
        this.url = url;
        this.method = this.options.method;
        var params = WLJSX.Object.isString(this.options.parameters) ?
            this.options.parameters : WLJSX.Object.toJSON(this.options.parameters);

        if (this.method !== 'get' && this.method !== 'post' && this.method !== 'put') {
            params += (params ? '&' : '') + '_method=' + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            // Query params
            params = WLJSX.Object.toQueryString(this.options.parameters);
            this.url += ((this.url.indexOf('?') > -1) ? '&' : '?') + params;
        }

        if (params && this.method.toLowerCase() === 'post' || this.method.toLowerCase() === 'put') {
            if(this.options.contentType === 'application/x-www-form-urlencoded') {
                // Send the body as form
                params = WLJSX.Object.toQueryString(this.options.parameters);
            } else {
                // Send body as JSON
                params = WLJSX.Object.toJSON(this.options.parameters);
            }
        }

        try {
            var response = new window.WLJSX.Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(response);
            }

            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1);
            }

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();

            /*jshint eqeqeq:false*/
            this.body = (this.method == 'post' || this.method == 'put')? (this.options.postBody || params) : null;
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange();
            }

        } catch (e) {
            this.dispatchException(e);
        }
    },

    onStateChange: function() {
        var readyState = this.transport.readyState;
        /*jshint eqeqeq:false*/
        if (readyState > 1 && !((readyState == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState);
        }
    },

    setRequestHeaders: function() {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
            'Accept-Language': WL.App.__getDeviceLocale()
        };

        /*jshint eqeqeq:false*/
        if (this.method == 'post' || this.method.toLowerCase() === 'put') {
            headers['Content-type'] = this.options.contentType + (this.options.encoding ? '; charset=' + this.options.encoding : '');

            /* Force "Connection: close" for older Mozilla browsers to work
             * around a bug where XMLHttpRequest sends an incorrect
             * Content-length header. See Mozilla Bugzilla #246651.
             */
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                headers['Connection'] = 'close';
            }
        }

        if (typeof this.options.requestHeaders == 'object') {
            var extras = this.options.requestHeaders;

            if (WLJSX.Object.isFunction(extras.push)) {
                for (var i = 0, length = extras.length; i < length; i += 2) {
                    headers[extras[i]] = extras[i + 1];
                }
            }
            else {
                /*jshint forin:false*/
                for (var key in extras) {
                    var value = extras[key];
                    headers[key] = (value === null || typeof(value) == 'undefined') ? '' : value;
                }
            }
        }
        for (var name in headers) {
            this.transport.setRequestHeader(name, unescape(encodeURIComponent(headers[name])));
        }
    },

    success: function() {
        var status = this.getStatus();
        if (status === 0 && this.isSameOrigin() === false) {
            return false;
        }
        /*jshint eqeqeq:false*/
        return !status || (status >= 200 && status < 300) || status == 304 || status == 302;
    },

    getStatus: function() {
        try {
            if (this.transport.status === 1223) {
                return 204;
            }
            return this.transport.status || 0;
        } catch (e) {
            return 0;
        }
    },

    respondToReadyState: function(readyState) {
        var state = window.WLJSX.Ajax.Request.Events[readyState],
            response = new window.WLJSX.Ajax.Response(this);

        /*jshint eqeqeq:false*/
        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || WLJSX.emptyFunction)(response, response.headerJSON);
            } catch (e) {
                this.dispatchException(e);
            }

            var contentType = response.getHeader('Content-type');
            if (this.options.evalJS == 'force' || (this.options.evalJS &&
                this.isSameOrigin() &&
                contentType &&
                contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse();
            }
        }

        try {
            (this.options['on' + state] || WLJSX.emptyFunction)(response, response.headerJSON);
        } catch (e) {
            this.dispatchException(e);
        }

        if (state == 'Complete') {
            this.transport.onreadystatechange = WLJSX.emptyFunction;
        }
    },

    isSameOrigin: function() {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        var url = location.protocol + '//' + document.domain;
        if (location.port) {
            url += ':' + location.port;
        }
        /*jshint eqeqeq:false*/
        return (!m || (m[0] == url));
    },

    getHeader: function(name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },

    evalResponse: function() {
        try {
            /*jshint evil:true*/
            return eval(WLJSX.String.unfilterJSON(this.transport.responseText || ''));
        } catch (e) {
            this.dispatchException(e);
        }
    },

    dispatchException: function(exception) {
        (this.options.onException || WLJSX.emptyFunction)(this, exception);
    }
});

window.WLJSX.Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

window.WLJSX.Ajax.Response = WLJSX.Class.create({
    initialize: function(request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;

        /*jshint eqeqeq:false*/
        if ((readyState > 2 && !WLJSX.detectBrowser().isIE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = WLJSX.String.interpret(transport.responseText);
            this.headerJSON = this._getHeaderJSON();
        }

        if (readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML = WLJSX.Object.isUndefined(xml) ? null : xml;
            this.responseJSON = this._getResponseJSON();

        }
    },

    status: 0,

    statusText: '',

    getStatus: window.WLJSX.Ajax.Request.prototype.getStatus,

    getStatusText: function() {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return '';
        }
    },

    getHeader: window.WLJSX.Ajax.Request.prototype.getHeader,

    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null;
        }
    },

    getResponseHeader: function(name) {
        return this.transport.getResponseHeader(name);
    },

    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders();
    },

    _getHeaderJSON: function() {
        var json = this.getHeader('X-JSON');
        if (!json) {
            return null;
        }
        json = decodeURIComponent(escape(json));
        try {
            return String.wl.evalJSON(json, this.request.options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    },

    _getResponseJSON: function() {
        //Assume JSON is returned regardless, and only throw an exception
        //if we expected JSON and JSON was not returned
        var options = this.request.options;
        try {
            return WLJSX.String.evalJSON(this.responseText, (options.sanitizeJSON || !this.request.isSameOrigin()));
        } catch (e) {
            /*jshint eqeqeq:false*/
            if (!options.evalJSON || (options.evalJSON != 'force' && (this.getHeader('Content-type') || '').indexOf('application/json') < 0) || WLJSX.String.isBlank(this.responseText)) {
                return null;
            } else {
                this.request.dispatchException(e);
            }
        }
    }
});

/**
 * ================================================================= 
 * Source file taken from :: wlapp.web.js
 * ================================================================= 
 */

/**
 \ * @license
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

/**
 * @class
 * @ilog.undocumented.constructor
 * @displayname WL.App
 */
/*jshint undef:false*/
__WLApp = function() {

    /*jshint strict:false*/

    /**
     * Opens the specified URL according to the specified target and options
     * (specs). The behavior of this method depends on the app environment, as
     * follows:
     *  <table class="userTable" cellspacing="0">
     <thead>
     <tr>
     <th>Environment</th>
     <th>Description</th>
     </tr>
     </thead>
     <tbody>
     <tr>
     <td class="attributes">Adobe AIR</td>
     <td class="nameDescription">Opens a new browser window at the specified URL. The target and options parameters are ignored.</td>
     </tr>
     <tr>
     <td class="attributes">TO BE COMPLETED</td>
     <td class="nameDescription">TO BE COMPLETED.</td>
     </tr>
     </tbody>
     </table>
     *
     * @param url
     *            Mandatory. The URL of the web page to be opened.
     * @param target
     *            Optional. The value to be used as the target (or name)
     *            parameter of JavaScript <code>window.open</code> method. If
     *            no value is specified, <code>_self</code> will be used.
     *
     * @param options
     *            Optional. Parameters hash.
     *            If no value is specified, the following options are used:
     *        status=1, toolbar=1, location=1, menubar=1, directories=1, resizable=1, scrollbars=1
     * @return A reference to the newly opened window, or NULL if no window was opened.
     */
    this.__openURL = function(url, target, options) {
        WL.Validators.validateArguments(['string', WL.Validators.validateStringOrNull,
            WL.Validators.validateStringOrNull
        ], arguments, 'WL.App.openURL');

        var wnd = null;
        if (WLJSX.Object.isUndefined(options) || options === null) {
            options = 'status=1,toolbar=1,location=1,menubar=1,directories=1,resizable=1,scrollbars=1';
        }
        if (WLJSX.Object.isUndefined(target) || target === null) {
            target = '_self';
        }
        var absoluteURL = WL.Utils.createAPIRequestURL(url);
        wnd = window.open(absoluteURL, target, options);
        console.log('openURL url: ' + absoluteURL);

        return wnd;
    };

    /**
     * Returns the locale code (or device language on BlackBerry).
     * Returns the locale code according to user device settings, for example: en_US.
     * @note {Note} On BlackBerry 6 and 7, this method returns the device language (for example, en), not the device locale.
     */
    this.__getDeviceLocale = function() {
        return navigator.language;
    };

    /**
     * Returns the language code.
     * Returns the language code according to user device settings, for example: en.
     */
    this.__getDeviceLanguage = function() {
        return this.__getDeviceLocale().substring(0, 2);
    };

    /**
     * Returns a pattern string to format and parse numbers according to the client's user preferences.
     * Returns the pattern to the successCallback with a properties object as a parameter,that contains :
     pattern,symbol,fraction,rounding,positive etc
     */

    this.getLocalePattern = function() {
        pattern = WL.Client.getLocalePattern();
        return pattern;
    };

    /**
     * Returns the decimal separator.
     * Returns the decimal separator accoriding to the region/locale preferences. eg : French uses "," but English uses "."
     */
    this.getDecimalSeparator = function() {
        var localepattern = this.getLocalePattern();
        if (typeof localepattern === 'undefined' || localepattern === null) {
            return '.';
        }
        return localepattern.decimal;
    };

    /**
     * Extracts a string that contains an error message.
     * Extracts a string that contains the error message within the specified exception object.
     * Use for exceptions that are thrown by the IBM MobileFirst Platform client runtime.
     * @param {Function} callback Mandatory. The function that is called when Back is pressed.
     * @example {}
     * WL.App.overrideBackButton(backFunc);
     * function backFunc(){
   *    alert('you hit the back key!');
   * }
     */
    this.getErrorMessage = function(e) {
        var message;
        if (e === null) {
            message = null;
        } else if (WLJSX.Object.isString(e)) {
            message = e;
        } else if (WLJSX.Object.isArray(e)) {
            message = e.join(',');
        } else if (e.description || e.message) {
            // the exception message
            message = e.description ? e.description : e.message;

            // add file name and line number
            if (e.fileName) {
                message += ' [' + e.fileName + ': line ' + e.lineNumber + ']';
            } else if (e.sourceURL) {
                message += ' [' + e.sourceURL + ': line ' + e.line + ']';
            }
        } else {
            message = e.toString();
        }
        return message;
    };



};

/*jshint newcap:false*/
__WL.prototype.App = new __WLApp();
WL.App = new __WLApp();

/**
 * ================================================================= 
 * Source file taken from :: wlutils.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WL_, __WL, WLJSX, WLJQ, WL_LOADER_CHECKSUM, WL_I18N_MESSAGES, WL_CLASS_NAME_TRANSLATE*/

/*
 * IBM MobileFirst Platform Utils
 */
var __WLUtils = function () {

    /*jshint strict:false*/

    // ........................Private methods........................

    var IBMMFPF_SDK_NAME = 'ibmmfpf';

    function loadWLClientMessages(lang) {
        var dfd = WLJQ.Deferred();

        var url = 'lib/messages/' + lang + '/messages.json';
        if (lang === null || typeof lang === 'undefined' || lang.indexOf('en') === 0) {
            url = 'lib/messages/messages.json';
        }
        var sdkPath = findSDKPath();
        loadJSON(sdkPath + url).then(function(data){
            WL.ClientMessages = data;
            dfd.resolve();
        }, function(){
            WL.Logger.error('error loading messages file: ' + url);
            dfd.reject();
        });
        return dfd.promise();
    }

    var findSDKPath = (function () {
        var path = null;

        return function () {
            //check if path is already found, if not search for it.
            if (!path) {
                // search mfp sdk path using script tag
                var scripts = document.getElementsByTagName('script');
                var term = '/' + IBMMFPF_SDK_NAME + '.js';
                for (var n = scripts.length-1; n>-1; n--) {
                    var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
                    if (src.indexOf(term) === (src.length - term.length)) {
                        path = src.substring(0, src.length - term.length) + '/';
                        break;
                    }
                }
            }
            return path;
        }
    }
    )();

    function loadJSON(path) {
        var dfd = WLJQ.Deferred();
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4) {
                if(xobj.status == "200") {
                    dfd.resolve(JSON.parse(xobj.responseText));
                } else {
                    dfd.reject();
                }
            }
        };
        xobj.send(null);
        return dfd.promise();
    }

    this.wlReachableCallback = function () {};

    // .................... Public methods ...........................

    this.__networkCheckTimeout = function () {
        if (!window.connectivityCheckDone) {
            WL.Logger.debug('Connectivity check has timed out');
            window.connectivityCheckDone = true;
        }
    };

    /**
     * @param {Object}
     *            value
     * @return value if defined or null otherwise.
     */
    this.safeGetValue = function (value) {
        if (!WLJSX.Object.isUndefined(value)) {
            return value;
        } else {
            return null;
        }
    };


    this.formatString = function () {
        var resStr = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
            resStr = resStr.replace(re, arguments[i]);
        }
        return resStr;
    };

    var __deviceLocale;
    this.setLocalization = function () {
        var dfd = WLJQ.Deferred();

        var deviceLocale = WL.App.__getDeviceLocale();
        //The json containing user facing messages needs to be loaded and assigned only once.
        //Check if the object has already been assigned.Else re-use the existing object
        if (typeof WL.ClientMessages === 'undefined' || __deviceLocale !== deviceLocale) {
            __deviceLocale = deviceLocale;
            WL.ClientMessages = undefined;
            // In web (mobile web and desktop web), we inject the proper WL.ClientMessages in the HTML file at the server,
            // so we would never get into this conditional code block.  This is a good thing!  No extra round trips to the
            // server to pick up language files.  We trust the web browser's Accept-Language header in those environments.
            // Ensure that the messages.json files are placed in lang folders or lang-COUNTRYCODE folders.
            // Ensure that the separator is '-' and not '_' as the RPX tool places translated files into folders with '-'.
            var lang = deviceLocale.substring(0, 2);
            var region = deviceLocale.substring(3);
            deviceLocale = lang.toLowerCase();
            if (region) {
                deviceLocale += '-' + region.toUpperCase();
            }

            // special fallback for zh languages (see 41026)
            if (deviceLocale.indexOf('zh-HANS') !== -1) {
                deviceLocale = 'zh';
            } else if (deviceLocale.indexOf('zh-HANT') !== -1 || deviceLocale.indexOf('zh-HK') !== -1) {
                deviceLocale = 'zh-TW';
            }

            try {
                // Get the file from which to pickup the user visible messages.
                if (typeof WL.ClientMessages === 'undefined') {
                    // find sdk path first, because messages.json is relative to it.
                    if (!findSDKPath()) {
                        WL.Logger.error('could not find ' + IBMMFPF_SDK_NAME + '.js, please rename MobileFirst SDK name to: ' + IBMMFPF_SDK_NAME + '.js');
                        return dfd.reject()
                    }
                    // prefer deviceLocale, then deviceLanguage, then English, in that order
                    loadWLClientMessages(deviceLocale).always(function() {
                        // we don't have a deviceLanguage translation file, try deviceLanguage
                        if (typeof WL.ClientMessages === 'undefined') {
                            loadWLClientMessages(lang).always(function() {
                                // fall back to English
                                if (typeof WL.ClientMessages === 'undefined') {
                                    loadWLClientMessages('en').always(function(){dfd.resolve()});
                                } else {
                                    dfd.resolve();
                                }
                            });
                        } else {
                            dfd.resolve();
                        }
                    });
                } else {
                    dfd.resolve();
                }
            } catch (e) {
                WL.Logger.error(e);
            }
        }
        return dfd.promise();
    };

    this.getLanguageDirectionality = function (lang) {
        if (typeof lang !== 'string') {
            lang = WL.App.__getDeviceLanguage();
        }
        for (var i = 0; i < WL.Language.LANGUAGES_RTL.length; i++) {
            if (lang.indexOf(WL.Language.LANGUAGES_RTL[i]) !== -1) {
                return WL.Language.DIRECTION_RTL;
            }
        }
        return WL.Language.DIRECTION_LTR;
    };

    /*
     * Adds the URL prefix to the URL if not already added and
     * WL.StaticAppProps.WORKLIGHT_ROOT_URL is set This is used when working
     * with desktop gadget and we need a static URL
     */
    this.createAPIRequestURL = function (path) {
        return path;
    };

    /*
     * Extends the target object with the source object only with fields and
     * methods that do not already exist on the target.
     */
    this.extend = function (target, source) {
        target = WLJSX.Object.extend(WLJSX.Object.clone(source), target);
        return target;
    };

    /*
     * extracts the host part of a url. For example, for the input
     * url="https://212.10.0.15:8888/application/service/?arg=blue", the result
     * would be "212.10.0.15".
     */
    this.getHostname = function (url) {
        var re = new RegExp('^(?:f|ht)tp(?:s)?://([^/:]+)', 'im');
        return url.match(re)[1].toString();
    };

    this.dispatchWLEvent = function (eventName, data) {
        // ie (WP7/VISTA) support custom event
        if (typeof document.createEvent === 'undefined') {
            WLJSX.trigger(document, eventName);
        } else {
            var e = document.createEvent('Events');
            e.initEvent(eventName, false, false);
            if (data !== null) {
                e.data = data;
            }
            document.dispatchEvent(e);
        }
    };


    /**
     * Version compares 2 version numbers in strings to the length of the maxLength parameter
     * @param {string} x
     * @param {string} y
     * @param {string} maxLength
     * @return -1 if x>y, 1 if x<y, or 0 if equal
     */
    this.versionCompare = function (x, y, maxLength) {
        var i = 0,
        /*jshint camelcase:false*/
            x_components = x.split('.'),
            y_components = y.split('.'),
            len = Math.min(x_components.length, y_components.length),
            maxLng = maxLength || 5;

        if (x === y) {
            return 0;
        }

        for (i = 0; i < len; i += 1) {

            // x > y
            if (parseInt(x_components[i], 10) > parseInt(y_components[i], 10)) {
                return 1;
            }

            // y > x
            if (parseInt(x_components[i], 10) < parseInt(y_components[i], 10)) {
                return -1;
            }

            if (i >= maxLng) {
                break; //check only up to maxLength+1 parts
            }

            // If one's a prefix of the other, the longer one is greater.
            if (x_components.length > y_components.length) {
                return 1;
            }

            if (x_components.length < y_components.length) {
                return -1;
            }


        }

        return 0; //same
    };
}; // End WL.Utils

/*jshint newcap:false*/
__WL.prototype.Utils = new __WLUtils();
WL.Utils = new __WLUtils();

/**
 * ================================================================= 
 * Source file taken from :: wlrequest.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX, WL, WLAuthorizationManager, WL_*/

// Overwriting the prototype.js isSameOrigin method -
// Updated the original method by wrapping the return statement with try/catch
// because it does not work properly in desktop applications such as Vista
// (document.domain is undefined).
WLJSX.Ajax.Request.prototype.isSameOrigin = function () {

    /*jshint strict:false*/

    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    try {
        var url = location.protocol + '//' + document.domain;
        if (location.port) {
            url += ':' + location.port;
        }
        return (!m || (m[0] === url));
    } catch (e) {
        return true;
    }
};


WL.Response = WLJSX.Class.create({
    invocationContext: null,
    status: -1,
    errorCode: null,
    errorMsg: null,
    responseText: '',
    responseJSON: '',
    initialize: function (transport, invocationContext) {

        /*jshint strict:false*/
        this.responseHeaders = {};
        if (transport !== null && typeof transport.status !== 'undefined') {
            this.status = (transport.status || 200);
            this.responseHeaders = {};

            try {
                this.responseText = WLJSX.String.interpret(transport.responseText);
            } catch (e) {

            }

            try {
                this.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
            } catch (e) {

            }

            if (typeof (transport.responseJSON) !== 'undefined' && transport.responseJSON !== null) {
                this.errorCode = transport.responseJSON.errorCode;
                if (typeof (transport.responseJSON.error) !== 'undefined' && transport.responseJSON.error !== null) {
                    this.errorMsg = transport.responseJSON.error;
                } else {
                    this.errorMsg = transport.responseJSON.errorMsg;
                }
            }

            if (typeof (transport.getAllResponseHeaders) === 'function') {
                var responseHeadersString = transport.getAllResponseHeaders();
                this.responseHeaders = WLJSX.String.parseResponseHeaders(responseHeadersString);
            }
        }
        this.invocationContext = invocationContext;
    },

    getHeaderNames: function () {

        /*jshint strict:false*/

        var headerNames = [];
        for (var headerName in this.responseHeaders) {
            if (true) { // thanks jshint
                headerNames.push(headerName);
            }
        }
        return headerNames;
    },

    getAllHeaders: function () {

        /*jshint strict:false*/

        return this.responseHeaders;
    },

    getHeader: function (name) {
        /*jshint strict:false*/
        if (name === null || typeof (name) === 'undefined') {
            return null;
        }

        return this.responseHeaders[name];
    }
});

WL.FailResponse = WLJSX.Class.create({
    invocationContext: null,
    status: -1,
    errorCode: null,
    errorMsg: null,
    initialize: function (transport, invocationContext) {
        /*jshint strict:false*/
        if (transport !== null && typeof transport.status !== 'undefined') {
            this.status = (transport.status || 200);
            if (transport.responseJSON !== null && typeof (transport.responseJSON) !== 'undefined') {
                this.errorCode = transport.responseJSON.errorCode;
                this.errorMsg = transport.responseJSON.errorMsg;
            }
        }
        this.invocationContext = invocationContext;
    }
});


/*
 * Piggybackers should have the following optional properties:
 *  - a function called processOptions(options) (called before the request is sent)
 *  - a function called onSuccess(transport, options)
 *  - a function called onFailure(transport, options)
 */
window.WLJSX.Ajax.WlRequestPiggyBackers = [];

/*
 * A wrapper for the prototype Ajax.Request. The wrapper is responsible for: 1.
 * Add double-cookie headers to the request. 2. Parse cookies from the response.
 * 3. Invoke the authenticator on demand.
 */
window.WLJSX.Ajax.WLRequest = WLJSX.Class.create({
    instanceId: null,
    wlAnswers: {},
    postAnswerRealm: '',
    MAX_AUTH_HEADER_SIZE: 900,
    MAX_TOTAL_HEADER_SIZE: 3000,
    MAX_CONFLICT_ATTEMPTS: 7,

    initialize: function (url, options) {
        /*jshint strict:false*/
        this.options = WLJSX.Object.clone(WLJSX.Ajax.WLRequest.options);

        WLJSX.Object.extend(this.options, options || {});
        this.url = url;
        this.callerOptions = options;
        this.isTimeout = false;
        this.timeoutTimer = null;
        this.conflictCounter = 0;

        // this.stopPolling = false;
        this.options.onSuccess = this.onWlSuccess.bind(this);
        this.options.onFailure = this.onWlFailure.bind(this);

        // Handle Exceptions
        this.options.onException = this.onException.bind(this);

        // 0 is the response status when the host is unresponsive
        // (server is
        // down)
        this.options.on0 = this.onUnresponsiveHost.bind(this);

        // Appending the cookie headers to possibly existing ones.
        // If you pass additional headers make sure to use objects of
        // name-value
        // pairs (and not arrays).
        // this.options.requestHeaders =
        // Object.extend(CookieManager.createCookieHeaders(),
        // this.options.requestHeaders || {});
       // this.options.requestHeaders = WL.CookieManager.createCookieHeaders();

        // For GET requests - preventing Vista from returning cached GET
        // ajax
        // responses.
        // For POST requests - preventing Air from sending a GET request
        // if the
        // request has no body (even if
        // it's declared as a POST request).
        if (WLJSX.Object.isUndefined(this.options.parameters) || this.options.parameters === null || this.options.parameters === '') {
            this.options.parameters = {};
        }

        // call piggybackers to modify options
        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.processOptions) === 'function') {
                piggybacker.processOptions(this.options, url);
            }
        }
        this.wlAnswers = {};
        this.sendRequest();
    },

    /*
     * We need to know ahead of time, for challenge processing if extra work needs to be done if we try and send
     * a message which headers are too big.
     */
    createRequestHeaders: function () {
        /*jshint strict:false*/
        var requestHeaders = {};
        // requestHeaders = WL.CookieManager.createCookieHeaders();
        // requestHeaders['x-wl-app-version'] = WL.StaticAppProps.APP_VERSION;

        // add Authorization header from wlAnswres
        if (typeof this.wlAnswers !== 'undefined') {
            var authJson = {};
            var shouldSendAuthHeader = false;
            for (var realm in this.wlAnswers) {
                if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                    var answer = '';
                    /*jshint maxdepth:4*/
                    try {
                        answer = JSON.parse(this.wlAnswers[realm]);
                    } catch (e) {
                        answer = this.wlAnswers[realm];
                    }
                    // Validate we are working with standrad JSON
                    if (typeof answer === 'string' && typeof JSON === 'undefined') {
                        authJson[realm] = answer.indexOf('"') === 0 ? answer : '"' + answer + '"';
                    } else {
                        authJson[realm] = answer;
                    }
                    shouldSendAuthHeader = true;
                }
            }
            if (shouldSendAuthHeader === true) {
                this.options.parameters.challengeResponse = authJson;
            }
        }

        // add headers from WL.Client.globalHeaders in case the Single (native) HTTP Client is disabled;
        // otherwise the headers will be added in native code
        this.__addGlobalHeaders(requestHeaders);

        var optionalHeaders = this.options.optionalHeaders;
        if (typeof optionalHeaders !== 'undefined' && optionalHeaders !== null) {
            for (var headerName in optionalHeaders) {
                if (Object.prototype.hasOwnProperty.call(optionalHeaders, headerName)) {
                    requestHeaders[headerName] = optionalHeaders[headerName];
                }
            }
        }
        return requestHeaders;
    },

    // automaticResend is to be used when comming from submitAnswer or removeExpectedAnswer, we need to know if we should handle the
    // request differently (add it to the challangeHandler wiating list).
    sendRequest: function (requestHeaders) {
        /*jshint strict:false*/
        var shouldPostAnswers = false;

        console.log('Request [' + this.url + ']');

        //add headers
        if (typeof (requestHeaders) === 'undefined') {
            this.options.requestHeaders = this.createRequestHeaders();
        } else {
            this.options.requestHeaders = requestHeaders;
        }

        var postAnswersOptions = {};

        //check if we need to send the auth header in the body, becuase it is too large or the total header size is too large
        var allHeadersSize = WLJSX.Object.toJSON(this.options.requestHeaders).length;
        var authHeaderSize = typeof (this.options.requestHeaders.Authorization) === 'undefined' ? -1 :
            WLJSX.Object.toJSON(this.options.requestHeaders.Authorization).length;

        if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize > -1) {

            postAnswersOptions = WL.Utils.extend(postAnswersOptions, this.options);
            postAnswersOptions.requestHeaders = this.options.requestHeaders;
            postAnswersOptions.onSuccess = this.onPostAnswersSuccess.bind(this);
            postAnswersOptions.onFailure = this.onPostAnswersFailure.bind(this);

            postAnswersOptions.postBody = this.options.requestHeaders.Authorization;
            postAnswersOptions.requestHeaders.Authorization = 'wl-authorization-in-body';
            // Get HTTP request cannot hold a body
            postAnswersOptions.method = 'post';

            this.wlAnswers = {};
        }

        if (typeof (this.options.requestHeaders.Authorization) !== 'undefined') {
            //init the wlAnswer map...
            this.wlAnswers = {};
        }

        if (this.options.timeout > 0) {
            this.timeoutTimer = window.setTimeout(this.handleTimeout.bind(this), this.options.timeout);
        }

        var thisRequest = this;
        __sendRequest();
        /*jshint latedef: false */
        function __sendRequest() {
            new WLJSX.Ajax.Request(thisRequest.url, thisRequest.options);
        }

    },

    __addGlobalHeaders: function (requestHeaders) {
        /*jshint strict:false*/
            if ((typeof WL.Client.__globalHeaders !== 'undefined') && (WL.Client.__globalHeaders !== null)) {
                for (var headerName in WL.Client.__globalHeaders) {
                    /*jshint maxdepth:4*/
                    if (Object.prototype.hasOwnProperty.call(WL.Client.__globalHeaders, headerName)) {
                        requestHeaders[headerName] = WL.Client.__globalHeaders[headerName];
                    }
                }
            }
    },

    onSuccessParent: function (transport, par) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
        var containsChallenges = WL.Client.checkResponseForChallenges(this, transport, par);

        return containsChallenges;
    },

    /*
     * Custom success handelr for PostAnswer Request, it will not send the onSuccess to the application code,
     * because this is not a resend but a swpecial request, and the user should not be informed about it.
     */
    onPostAnswersSuccess: function (transport) {
        /*jshint strict:false*/
        this.onSuccessParent(transport, this.postAnswerRealm);
        this.postAnswerRealm = '';
    },

    /**
     * when a onWlSuccess arrives but it came from an response to a
     * postAnsweresRequest then we should not continue the onSucess any
     * further
     *
     * @param transport
     * @param responseToPostAnswers
     */
    onWlSuccess: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        var containsChallenges = this.onSuccessParent(transport);

        if (!containsChallenges) {
            this.onSuccess(transport);
        }
    },

    onSuccess: function (transport) {
        /*jshint strict:false*/
        if (transport.getAllHeaders() !== null) {
            // Handle Cookies:
            var headers = transport.getAllHeaders().split('\n');
            WL.CookieManager.handleResponseHeaders(headers);
        }

        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.onSuccess) === 'function') {
                piggybacker.onSuccess(transport, this.options);
            }
        }


        if (typeof (this.callerOptions.onSuccess) === 'function') {
            this.callerOptions.onSuccess(transport);
        }
    },

    /*
     * Custom failure handelr for PostAnswer Request, it will remove the original request from waiting list, and not send the onFailure to the application code,
     * because this is not a resend but a special request, and the user should not be informed about it.
     *
     * When a message arrives from a postAnswerRequert ('authenticate') and it is a 401,403, we need to remove it from the waitinglist so there wont be any resend on it,
     * because if has accepts in it, it will trigger the resend.
     */
    onPostAnswersFailure: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
        WL.Client.removeFromWaitingListOnPostAnsweresWlReponse(transport, this, this.postAnswerRealm);
        WL.Client.checkResponseForChallenges(this, transport, this.postAnswerRealm);
        this.postAnswerRealm = '';
    },

    onWlFailure: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
            if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
                var allHeaders = transport.getAllHeaders();
                if (WLJSX.Object.isString(allHeaders)) {
                    var headers = allHeaders.split('\n');
                    WL.CookieManager.handleResponseHeaders(headers);
                }
            }
        if (transport.status === 409 && WLAuthorizationManager.isAuthorizationRequired(transport.status, transport.getAllResponseHeaders()) && this.conflictCounter++ < this.MAX_CONFLICT_ATTEMPTS) {
            this.sendRequest();
        } else {
            var containsChallenges = WL.Client.checkResponseForChallenges(this, transport);
            if (!containsChallenges) {
                this.onFailure(transport);
            }
        }
    },

    onFailure: function (transport) {
        /*jshint strict:false*/
        // sometimes onFailure is called with a dummy transport object
        // for example when an authentication timeout occurs.
        if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
            var allHeaders = transport.getAllHeaders();
            if (WLJSX.Object.isString(allHeaders)) {
                var headers = allHeaders.split('\n');
                WL.CookieManager.handleResponseHeaders(headers);
            }
        }

        if (transport.responseJSON === null) {
            try {
                transport.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
            } catch (e) {
                transport.responseJSON = {
                    errorCode: WL.ErrorCode.UNEXPECTED_ERROR,
                    errorMsg:'unexpected error'
                };
            }
        }


        var callbackHandler = this.getCallbackForErrorCode(transport.responseJSON.errorCode);

        if (callbackHandler) {
            callbackHandler(this, transport);
        }

        if (transport.responseJSON.errorCode === WL.ErrorCode.USER_INSTANCE_ACCESS_VIOLATION) {
            WLJSX.Ajax.WLRequest.options.onAuthentication(this, transport);
            return;
        }
        console.log('[' + this.url + '] failure. state: ' + transport.status + ', response: ' + transport.responseJSON.errorMsg);

        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.onFailure) === 'function') {
                piggybacker.onFailure(transport, this.options);
            }
        }


        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    getCallbackForErrorCode: function (errorCode) {
        /*jshint strict:false*/
        return this.options['on' + errorCode];
    },

    onException: function (request, ex) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();

        if (typeof (this.options.onAuthException) === 'function') {
            this.options.onAuthException(request, ex);
        }

        console.log('[' + this.url + '] exception.', ex);
        // Workaround for prototype's known behavior of swallowing
        // exceptions.
        /*jshint -W068*/
        (function () {
            throw ex;
        }).defer();
    },

    onUnresponsiveHost: function () {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();

        console.log('[' + this.url + '] Host is not responsive.');
        var transport = {};
        transport.status = 0;
        transport.responseJSON = {
            errorCode: WL.ErrorCode.UNRESPONSIVE_HOST,
            errorMsg: 'unresponsive host'
        };

        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    handleTimeout: function () {
        /*jshint strict:false*/
        console.log('Request timeout for [' + this.url + ']');
        this.cancelTimeout(); // cancel all other timers (if there are
        // any)
        this.isTimeout = true;

        var transport = {};

        //changes made

        /*transport.responseJSON = {
         errorCode : WL.ErrorCode.REQUEST_TIMEOUT,
         errorMsg : WL.Utils
         .formatString(
         'Request timed out for {0}. Make sure the host address is available to the app (especially relevant for Android and iPhone apps).',
         this.url)
         };*/
        transport.responseJSON = {
            errorCode: WL.ErrorCode.REQUEST_TIMEOUT,
            errorMsg: WL.Utils
                .formatString(
                    'timeout',
                    this.url)
        };
        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    cancelTimeout: function () {
        /*jshint strict:false*/
        if (this.timeoutTimer !== null) {
            window.clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
            this.isTimeout = false;
        }
    },

    checkIfCanResend: function () {
        /*jshint strict:false*/
        if (typeof this.wlAnswers === 'undefined') {
            return true;
        }

        for (var realm in this.wlAnswers) {
            if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                if (this.wlAnswers[realm] === null) {
                    return false;
                }
            }
        }

        return true;
    },

    // initialize the wlAnswer table with realm = null values
    setExpectedAnswers: function (realms) {
        /*jshint strict:false*/
        for (var realm in realms) {
            if (Object.prototype.hasOwnProperty.call(realms, realm)) {
                this.wlAnswers[realm] = null;
            }
        }
    },

    submitAnswer: function (realm, answer) {
        /*jshint strict:false*/
        this.wlAnswers[realm] = answer;
        if (this.checkIfCanResend()) {
            this.handleResendOrSendPostAnswers(realm);
        }
    },

    removeExpectedAnswer: function (realm) {
        /*jshint strict:false*/
        delete this.wlAnswers[realm];
        if (this.checkIfCanResend()) {
            this.handleResendOrSendPostAnswers(realm);
        }
    },

    /*
     * If the total header size is larger than MAX_TOTAL_HEADER_SIZE or the auth header is larger than MAX_AUTH_HEADER_SIZE
     * we need to put the original request into the waiting list, because we will send a special "authenticate" request that will have the
     * Autherization header in the body.
     *
     */
    handleResendOrSendPostAnswers: function (realm) {
        /*jshint strict:false*/
        var headers = this.createRequestHeaders();

        var moveToWaitingList = false;
        var allHeadersSize = WLJSX.Object.toJSON(headers).length;
        var authHeaderSize = typeof (headers.Authorization) === 'undefined' ? -1 :
            WLJSX.Object.toJSON(headers.Authorization).length;

        if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize > -1) {
            moveToWaitingList = true;
        }

        if (moveToWaitingList) {
            //iterate over all the challageHandlers
            this.postAnswerRealm = realm;
            var handler = WL.Client.__chMap[realm];
            if (typeof (handler) !== 'undefined') {
                handler.moveToWaitingList(this);
            }
        }
        this.sendRequest(headers);
    }


});


// always add this piggybacker
WLJSX.Ajax.WlRequestPiggyBackers.push({

    name: 'ConfigProfile Piggybacker', // for display/debug purposes

    processOptions: function (options, url) {
        /*jshint strict:false*/

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        if (endsWith(url, 'init') || endsWith(url, 'query') || endsWith(url, 'configprofile') || endsWith(url, 'loguploader')) {
            var piggybackerHeaders = WL.WebLogger._getHeaders();
            var optionalHeaders = options.optionalHeaders || {};

            // we can't assume we have jQuery.extend available to us,
            // so we do it ourselves:
            for (var property in piggybackerHeaders) {
                if (piggybackerHeaders.hasOwnProperty(property)) {
                    optionalHeaders[property] = piggybackerHeaders[property];
                }
            }

            options.optionalHeaders = optionalHeaders;
        }
    },

    onSuccess: function (data) {
        /*jshint strict:false*/
        // process piggybacked response, if any, and remove it
        function startsWith(str, prefix) {
            return str && str.lastIndexOf(prefix, 0) === 0;
        }

        var responseText = '';
        if (data.responseJSON) {
            if (data.responseJSON.piggyback) {
                if (data.responseJSON.piggyback.configprofile) {
                    responseText = JSON.stringify(data.responseJSON.piggyback.configprofile);
                    WL.WebLogger._processUpdateConfig({
                        responseText: responseText
                    });
                }
                delete data.responseJSON.piggyback;
                if (startsWith(data.responseText, '/')) { // response came from init or invokeProcedure
                    data.responseText = '/*-secure-' + JSON.stringify(data.responseJSON) + '*/';
                }
            }
        }
    }
});

// WLRequest default options:
WLJSX.Ajax.WLRequest.options = {
    method: 'post',
    asynchronous: true,
    encoding: 'UTF-8',
    parameters: '',
    evalJSON: true,
    timeout: -1,
    onAuthentication: null,
    isAuthResponse: null
};

/**
 * ================================================================= 
 * Source file taken from :: wlauthorizationmanager.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WLJQ, WLJSX, cordova, WLAuthorizationManager, WLIndexDB, WLConfig, WLBrowserManager, WLCrypto, WLLocalStorageDB */

WL.AuthorizationManager = (function () {

    /*jshint strict:false, maxparams:4*/

    var WL_AUTHORIZATION_HEADER = 'Authorization';
    var PARAM_CLIENT_ID_KEY = 'client_id';
    var PARAM_SCOPE_KEY = 'scope';
    var INVALID_CLIENT_ERROR = 'INVALID_CLIENT_ID';
    var CHALLENGE_RESPONSE_KEY = 'challengeResponse';
    var WWW_AUTHENTICATE_HEADER = 'WWW-Authenticate';
    var MFP_CONFLICT_HEADER = 'MFP-Conflict';
    var LOGOUT_ERROR_MSG = 'Cannot logout while authorization request is in progress.';
    var LOGIN_ALREADY_IN_PROCESS = 'Login already in process.';
    var AZ_REDIRECT_URI = '/az/v1/authorization/redirect';
    var JWT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

    // Store the server clock to be synchronize with the server time
    var SERVER_RELATIVE_TIME = 0;
    var authorizationAlreadyInProgress = false;


    // The options for storing in the WL.LocalStorage
    var scopeToTokenMappingKey = 'com.mfp.scope.token.mapping';
    var resourceToScopeMappingKey = 'com.mfp.resource.scope.mapping';
    var clientApplicationDataKey = 'com.mfp.oauth.application.data';
    var clientIdKey = 'com.mfp.oauth.clientid';
    var mappingOptions = {'session' : true};

    var __logAndThrowError = function(msg, callerName) {
        if (WL.Logger) {
            if (callerName) {
                msg = 'Invalid invocation of method ' + callerName + '; ' + msg;
            }
            WL.Logger.error(msg);
        }

        throw new Error(msg);
    };

    /*
    Adds an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function addItemToMap(mapId, key, value) {
        var map = WL.LocalStorageDB.getItem(mapId, mappingOptions) || {};
        map[key] = value;
        WL.LocalStorageDB.setItem(mapId, map, mappingOptions);
    }

    /*
     Gets an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function getItemFromMap(mapId, key) {
        var map = WL.LocalStorageDB.getItem(mapId, mappingOptions) || {};
        return map[key];
    }

    /*
     Removes an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function removeItemFromMap(mapId, key) {
        addItemToMap(mapId, key, null);
    }

    /*
     Clears the Mappings
     */
    function clearMappings() {
       WL.LocalStorageDB.removeItem(scopeToTokenMappingKey, mappingOptions);
       WL.LocalStorageDB.removeItem(resourceToScopeMappingKey, mappingOptions);
       //delete messageId that was received during remote disable notify challenge
       WL.LocalStorageDB.removeItem(WL.Client.getMessageID());
    }

    function getAccessTokenForScope(scope) {
        var sortedScope = sortScopeAlphabetically(scope);
        var accessToken = getItemFromMap(scopeToTokenMappingKey, sortedScope);

        if(!__isUndefinedOrNull(accessToken) && isAccessTokenExpired(accessToken)) {
            // Remove
            removeItemFromMap(scopeToTokenMappingKey, sortedScope);
            accessToken = null;
        }
        return accessToken;
    }

    function isAccessTokenExpired(accessToken) {
        var currentTime = new Date().getTime();
        return currentTime >= accessToken.expiration;
    }

    function saveAccessToken(scope, accessToken) {
        var sortedScope = sortScopeAlphabetically(scope);
        addItemToMap(scopeToTokenMappingKey, sortedScope, accessToken);
    }

    var __getCachedScopeByResource = function (request) {
        var url = request.requestOptions.url;
        var method = request.requestOptions.method;
        var key = url + '_' + method;
        return getItemFromMap(resourceToScopeMappingKey, key);
    };

    var __getCachedAccessToken = function (scope) {
        if(__isUndefinedOrNull(scope)) {
            return null;
        }
        return getAccessTokenForScope(scope);
    };

    var clearAccessToken = function (accessToken) {
        var scope = accessToken.scope;
        saveAccessToken(scope, null);
    };

    var __getAuthorizationScope = function (responseAuthenticationHeader) {
        if (!__isUndefinedOrNull(responseAuthenticationHeader)) {
            var headerParts = responseAuthenticationHeader.split(',');
            for (var i = 0; i < headerParts.length; i++) {
                var headerElement = headerParts[i];
                if (headerElement.indexOf('scope=') >= 0) {
                    var scope = headerElement.split('=')[1].replace(/\"/g, '');
                    return scope;
                }
            }
        }

        return null;
    };

    var obtainAuthHeaderCallbacks = [];
    var EMPTY_SCOPE = '';
    /**
     * Obtains authorization header for specified scope.
     * @param scope Specifies the scope to obtain an authorization header for. Can be null or undefined.
     * @returns A promise object that should be used to receive the authorization header asynchronously. The header is send as a string
     * Example:
     * WLAuthorizationManager.obtainAccessToken(scope)
     * .then (
     *    function(header) {
   *      // success flow with the header
   *    },
     *    function(error) {
   *      // failure flow
   *    }
     *   )
     * };
     */
    var obtainAccessToken = function (scope) {
        var dfd = WLJQ.Deferred();
        if (__isUndefinedOrNull(scope)) {
            scope = EMPTY_SCOPE;
        }
        scope = sortScopeAlphabetically(scope);
        try {
            var accessToken = __getCachedAccessToken(scope);
            if (!__isUndefinedOrNull(accessToken)) {
                dfd.resolve(accessToken);
            } else {

                // obtainAuthHeaderCallbacks is an array of this kind objects; "clientId" will be updated in case of "unknown client" error
                // the "scope" identifies the current "deferred" object
                var callbackObj = {
                    clientId: null,
                    scope: scope,
                    deferred: dfd
                };

                obtainAuthHeaderCallbacks.push(callbackObj);

                // If there is authorization process in progress, put incoming requests to queue
                if (isAuthorizationInProgress()) {
                    return dfd.promise();
                }

                if(!shouldRegister()) {
                    startAuthorizationProcess(scope);
                } else {
                    __invokeInstanceRegistration().then(
                        function(){
                            startAuthorizationProcess(scope);
                        },
                        function(error) {
                            __deleteAuthData();
                            rejectAllCallbacks(error);
                        });
                }
            }
        } catch (e) {
            WL.Logger.error('failed obtaining token, reason: ' + JSON.stringify(e));
            processObtainAccessTokenCallbacks(null, scope, JSON.stringify(e), false);
        }
        return dfd.promise();
    };

    // this flag tells whether we have handled the invalid client error to prevent infinite loop
    var invalidClientReceived = false;

    function startAuthorizationProcess(scope) {
        // invoke authorization request with specified scope
        invokePreAuthorizationRequest(scope, null)
            .then(
                function () {
                    // On preAuth success continue to authorization endpoint
                    __invokeAuthorizationRequestForScope(scope)
                        .then(
                            function (code) {
                                // authorization request succeeded, send to token endpoint with grant-code
                                invokeTokenRequest(code)
                                    .then(
                                        function(accessToken) {
                                            // We have the access token, save it and call next in the queue
                                            saveAccessToken(scope, accessToken);
                                            processObtainAccessTokenCallbacks(__getClientId(), scope, accessToken, true);

                                        },
                                        function(error) {
                                            onAuthorizationProcessFailure(error, scope, __getClientId(), {
                                                retryFunction: startAuthorizationProcess
                                            });
                                        });
                            },
                            function(error) {
                                onAuthorizationProcessFailure(error, scope, __getClientId(), {
                                    retryFunction: startAuthorizationProcess
                                });
                            });

                },
                function(error) {
                    onAuthorizationProcessFailure(error, scope, __getClientId(), {
                        retryFunction: startAuthorizationProcess
                    });
                });
    }

    function isUnknownClientError(error) {
        if (!__isUndefinedOrNull(error) && typeof (error.status) !== 'undefined' &&
            error.status === 400 && !__isUndefinedOrNull(error.responseJSON) &&
            /*jshint camelcase:false*/
            error.responseJSON.errorCode === INVALID_CLIENT_ERROR) {
            return true;
        }

        return false;
    }

    function processObtainAccessTokenCallbacks(clientId, scope, response, isSuccess) {
        var indexesToRemove = [];
        var objectsToNotify = [];

        // loop over callbacks in queue and notify those with specified scope; store appropriate indexes for later removal
        for (var i = 0; i < obtainAuthHeaderCallbacks.length; i++) {
            var callbackObj = obtainAuthHeaderCallbacks[i];
            if (scope === callbackObj.scope) {
                objectsToNotify.push(callbackObj);
                indexesToRemove.push(i);
            }
        }

        // remove processed callbacks
        for (var j = indexesToRemove.length - 1; j >= 0; j--) {
            obtainAuthHeaderCallbacks.splice(indexesToRemove[j], 1);
        }

        // if there is at least one object in the queue, send auth request for its scope
        if (obtainAuthHeaderCallbacks.length > 0) {
            var realClientId = obtainAuthHeaderCallbacks[0].clientId !== null ? obtainAuthHeaderCallbacks[0].clientId : clientId;
            startAuthorizationProcess(realClientId, obtainAuthHeaderCallbacks[0].scope);
        }

        // notify objects. This must be done after splice, because it could be that the code being notified
        // is supposed to send other requests requiring authorization. It means that the callback array
        // must be cleared before notifications are sent.
        for (var k = 0; k < objectsToNotify.length; k++) {
            isSuccess ? objectsToNotify[k].deferred.resolve(response) : objectsToNotify[k].deferred.reject(response);
        }
    }

    function rejectAllCallbacks(error) {
        var objectsToNotify = obtainAuthHeaderCallbacks.slice();
        obtainAuthHeaderCallbacks = [];
        authorizationAlreadyInProgress = false;
        // this method is called upon unrecoverable error; reject all and clear the queue
        for (var n = 0; n < objectsToNotify.length; n++) {
            objectsToNotify[n].deferred.reject(error);
        }
    }

    function updateClientIds(newClientId) {
        // update all callback objects with the new client id; called after processing of "unknown client', when the new
        // client id has been received
        for (var i = 0; i < obtainAuthHeaderCallbacks.length; i++) {
            obtainAuthHeaderCallbacks[i].clientId = newClientId;
        }
    }

    var clientInstanceIdCallbacks = [];

    function processClientInstanceCallbacks(wlresponse, isSuccess) {
        var objectsToNotify = clientInstanceIdCallbacks.slice();
        clientInstanceIdCallbacks = [];

        for (var i = 0; i < objectsToNotify.length; i++) {
            isSuccess ? objectsToNotify[i].resolve(wlresponse) : objectsToNotify[i].reject(wlresponse);
        }

    }

    var __deleteCachedScopeByResource = function (request) {
        var url = request.requestOptions.url;
        var method = request.requestOptions.method;
        var key = url + '_' + method;
        removeItemFromMap(resourceToScopeMappingKey, key);
    };

    // send a request using WL.Request to preAuthorization end point with specified clientId and scope
    function invokePreAuthorizationRequest(scope, credentials) {
        var dfd = WLJQ.Deferred();
        var requestOptions = createCallbacksForPreAuth(dfd);
        requestOptions.parameters[PARAM_CLIENT_ID_KEY] = __getClientId();

        if (!__isUndefinedOrNull(scope)) {
            requestOptions.parameters[PARAM_SCOPE_KEY] = scope;
        }
        // For login requests
        if (!__isUndefinedOrNull(credentials)) {
            var challengeResponse = {};
            challengeResponse[scope] = credentials;
            requestOptions.parameters[CHALLENGE_RESPONSE_KEY] = challengeResponse;
        }

        makeRequest('preauth/v1/preauthorize', requestOptions, false);

        return dfd.promise();
    }

    var createCallbacksForRegistration = function(registrationCallbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            parameters: params,
            onSuccess: function (response) {

                if(response.status == 200) {
                    registrationCallbackDfd.resolve(response);
                }
                // Get the clientId from the response
                var locationHeader = response.getHeader("Location");
                if(__isUndefinedOrNull(locationHeader)) {
                    // If we get an error, we reject the promise
                    processClientInstanceCallbacks(new WL.Response(response), false);
                    return;
                }
                // Extract clientID
                var split = locationHeader.split('/');
                var clientId = split[split.length -1];
                __setClientId(clientId);
                __setClientRegisteredData(WL.BrowserManager.getDeviceData());
                processClientInstanceCallbacks(response, true);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                processClientInstanceCallbacks(new WL.Response(response), false);
            },
            onAuthRequestFailure: function (response) {
                processClientInstanceCallbacks(new WL.Response(response), false);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                processClientInstanceCallbacks(response, false);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    var createCallbacksForLogoutRequest = function (callbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            contentType : 'application/x-www-form-urlencoded',
            parameters: params,
            onSuccess: function (response) {
                // Clear scope to token mappings
                WL.LocalStorageDB.setItem(scopeToTokenMappingKey,{}, mappingOptions);

                callbackDfd.resolve();
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Logout request failed with response: ' + response.responseText);
                }
                callbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                callbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                callbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    var createCallbacksForAuthorization = function (AuthCallbackDfd, params) {
        var requestOptions = {
            method: 'GET',
            parameters: params,
            onSuccess: function (response) {
                // Get the grant-code from the response
                var responseJSON = response.responseJSON;
                var code = responseJSON['code'];
                var error = responseJSON['error'];
                if(!__isUndefinedOrNull(error) || __isUndefinedOrNull(code)) {
                    // If we get an error, we reject the promise
                    AuthCallbackDfd.reject(new WL.Response(response));
                    return;
                }
                // resolve the promise with the grantcode
                AuthCallbackDfd.resolve(code);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                AuthCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                AuthCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                AuthCallbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    /*
     TODO : Make sure request is send as FORM params
     */
    var createCallbacksForTokenRequest = function (tokenCallbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            parameters: params,
            contentType : 'application/x-www-form-urlencoded',
            onSuccess: function (response) {
                var responseJSON = response.responseJSON;
                var accessTokenValue = responseJSON['access_token'];
                if(__isUndefinedOrNull(accessTokenValue)) {
                    tokenCallbackDfd.reject(new WL.Response(response));
                    return;
                }
                var scope = responseJSON['scope'];
                var exp = responseJSON['expires_in'];
                var accessToken = new WL.AccessToken(accessTokenValue, exp, scope);
                tokenCallbackDfd.resolve(accessToken);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Token request failed with response: ' + response.responseText);
                }
                tokenCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                tokenCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                tokenCallbackDfd.reject(failResponse);
            }
        };
        return requestOptions;
    };


    var createCallbacksForPreAuth = function (preAuthCallbackDfd) {
        var requestOptions = {
            method: 'POST',
            parameters: {},
            onSuccess: function (response) {
                preAuthCallbackDfd.resolve(response);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                preAuthCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                preAuthCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                preAuthCallbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };



    var __getClientId = function () {
        return WL.LocalStorageDB.getItem(clientIdKey);
    };

    var __setClientId = function (id) {
        if(!id) {
            WL.LocalStorageDB.removeItem(clientIdKey);
        }
        WL.LocalStorageDB.setItem(clientIdKey, id);
    };


    var __invokeInstanceRegistration = function() {
        var dfd = WLJQ.Deferred();

        // put all incoming calls to queue
        clientInstanceIdCallbacks.push(dfd);

        if (clientInstanceIdCallbacks.length > 1) {
            return dfd.promise();
        }

        var path = 'registration/v1/self';
        paramsForRegistrationRequest().then(function(params){
            var requestOptions = createCallbacksForRegistration(dfd, params);
            if(!__isUndefinedOrNull(__getClientId())) {
                // ClientID exists, this is re-registration
                requestOptions.method = 'PUT';
                path = path + '/' + __getClientId();
            }
            makeRequest(path, requestOptions, false);

        });

        return dfd.promise();
    };

    var __deleteAuthData = function () {
        var dfd = WLJQ.Deferred();

        // Remove mappings
        clearMappings();

        // Remove ClientID and Client Registration Data
        __setClientId(null);
        __setClientRegisteredData(null);

        // Remove keypair
        WL.CertManager.deleteKeyPair().then(function(){
            dfd.resolve();
        });

        // WL.IndexDB.clearDB().then(function(){
        //     dfd.resolve();
        // });
        return dfd.promise();
    };

    var __invokeAuthorizationRequestForScope = function (scope) {
        var dfd = WLJQ.Deferred();
        var params = paramsForAuthorizationRequest(scope);
        var requestOptions = createCallbacksForAuthorization(dfd, params);

        makeRequest('az/v1/authorization', requestOptions, true);
        return dfd.promise();
    };

    /**
     * Invokes a request to the token endpoint
     * @param grantcode
     */
    function invokeTokenRequest(grantcode) {
        var dfd = WLJQ.Deferred();
        paramsForTokenRequest(grantcode).then(function(params){
            var requestOptions = createCallbacksForTokenRequest(dfd, params);
            makeRequest('az/v1/token', requestOptions, true);
        });
        return dfd.promise();
    }

    var __cacheScopeByResource = function (resource, scope) {
        var method = resource.requestOptions.method;
        var path = resource.requestOptions.url;
        var key = path + "_" + method;
        var sortedScope = sortScopeAlphabetically(scope);
        addItemToMap(resourceToScopeMappingKey, key, sortedScope);
    };

    var setAuthorizationServerUrl = function (url) {
        WL.Validators.validateURLOrNull(url, 'setAuthorizationServerUrl');
        WL.LocalStorageDB.setItem('com.mfp.authorization.url', url);
    };

    var getAuthorizationServerUrl = function () {
        var url = WL.LocalStorageDB.getItem('com.mfp.authorization.url');
        if(__isUndefinedOrNull(url)) {
            url = WL.Config.__getBaseURL();
        }
        return url;
    };

    /**
     *
     * @param isAZRequest
     * @returns The serverURL, which could be with the AZ or the MFP depending on the argument
     * @private
     */
    var __getServerUrl = function (isAZRequest) {
        return isAZRequest ? getAuthorizationServerUrl() : WL.Config.__getBaseURL();
    };

    var __getParameterByName = function (url, name) {
        var parts = url.split('?');
        if (parts.length < 2) {
            return null;
        }

        // there should be exactly two elements in the finalParts array. If we have more than two elements in the 'parts' array,
        // then the redirect url contains some other '?'
        var finalParts = [parts[0]];
        parts.splice(0, 1);
        // join extra parts back and push them to the second element of 'finalParts'
        finalParts.push(parts.join('?'));

        var results = finalParts[1].split('&');
        for (var i = 0; i < results.length; i++) {
            var pair = results[i].split('=');
            if (pair[0] === name) {
                return decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
        }
        return null;
    };

    var isAuthorizationRequired = function (responseStatus, responseHeadersString) {
        if (__isUndefinedOrNull(responseStatus) || __isUndefinedOrNull(responseHeadersString)) {
            return false;
        }
        var headersMap = WLJSX.String.parseResponseHeaders(responseHeadersString);
        var mfpConflictHeader = WLJSX.String.getHeaderByKey(headersMap, MFP_CONFLICT_HEADER);
        if (responseStatus === 409 && !__isUndefinedOrNull(mfpConflictHeader)) {
            return true;
        }
        var authenticationHeader = WLJSX.String.getHeaderByKey(headersMap, WWW_AUTHENTICATE_HEADER);
        if ((responseStatus !== 401 && responseStatus !== 403) || __isUndefinedOrNull(authenticationHeader) || __isUndefinedOrNull(authenticationHeader[WWW_AUTHENTICATE_HEADER])) {
            return false;
        }
        return (authenticationHeader[WWW_AUTHENTICATE_HEADER].indexOf('Bearer') >= 0);
    };

    var getResourceScope = function (responseHeadersString) {
        if (__isUndefinedOrNull(responseHeadersString)) {
            return null;
        }
        var headersMap = WLJSX.String.parseResponseHeaders(responseHeadersString);
        var authenticationHeader = WLJSX.String.getHeaderByKey(headersMap, WWW_AUTHENTICATE_HEADER);
        if (__isUndefinedOrNull(authenticationHeader)) {
            return null;
        }
        return WL.AuthorizationManager.__getAuthorizationScope(authenticationHeader[WWW_AUTHENTICATE_HEADER]);
    };

    var __isInvalidToken = function (transport) {
        var responseAuthenticationHeader = transport.getResponseHeader(WWW_AUTHENTICATE_HEADER);
        return responseAuthenticationHeader.indexOf('invalid_token') >= 0;
    };

    var __sendHeartBeat = function (intervalInSecs) {
        setInterval(__HeartBeatTask, intervalInSecs);
    };

    var __HeartBeatTask = function () {
        var id = __getClientId();
        if (__isUndefinedOrNull(id)) {
            WL.Logger.warn('Could not send heartbeat, heartbeat is sent only after client is registered');
        }
        else {
            var jwt = new WL.JWT();
            WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
                var params = {
                    'client_assertion' : signedData,
                    'client_assertion_type' : JWT_ASSERTION_TYPE
                };
                var options = {
                    method: 'POST',
                    contentType : 'application/x-www-form-urlencoded',
                    parameters: params,
                    onSuccess: function (response) {
                        WL.Logger.debug('Heartbeat sent successfully');
                    },
                    onFailure: function (error) {
                        WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
                    }
                };
                makeRequest('preauth/v1/heartbeat', options, false);
            },
            function(error){
                WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
            });
        }
    };

    var __invokeGetRegistrationData = function() {
        var dfd = WLJQ.Deferred();

        var id = __getClientId();
        if (__isUndefinedOrNull(id)) {
            WL.Logger.warn('Could not get registration data, client is not registered');
            return dfd.reject();
        }
        else {
            var jwt = new WL.JWT();
            WL.CertManager.signJWS(jwt, {'kid' : id}).then(function(signedData){
                    var params = {
                        'client_assertion' : signedData,
                        'client_assertion_type' : JWT_ASSERTION_TYPE
                    };
                    var options = {
                        method: 'GET',
                        contentType : 'application/x-www-form-urlencoded',
                        parameters: params,
                        onSuccess: function (response) {
                            dfd.resolve(response);
                        },
                        onFailure: function (error) {
                            dfd.reject(error);
                        }
                    };
                    makeRequest('registration/v1/self/' + id, options, false);
                },
                function(error){
                    WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
                });
        }
        return dfd.promise();
    };

    var __isUndefinedOrNull = function (object) {
        return typeof (object) === 'undefined' || object === null;
    };

    function __login(securityCheck, credentials, userCallbackDfd) {
        if(!shouldRegister()) {
            sendLoginRequest(securityCheck, credentials, __getClientId(), userCallbackDfd);
        } else {
            __invokeInstanceRegistration().then(function(){
                sendLoginRequest(securityCheck, credentials, __getClientId(), userCallbackDfd);
            }, function(error) {
                // In case of an error on registration, reject all waiting requests.
                rejectAllCallbacks(error);
                userCallbackDfd.reject(error);
                __deleteAuthData();

            })
        }
    }

    function sendLoginRequest(securityCheck, credentials, clientId, userCallbackDfd) {
        invokePreAuthorizationRequest(securityCheck, credentials).then(
            function (transport) {
                // No need to continue to authorization end point.
                console.log('Successfully logged in to security check: ' + securityCheck);
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(clientId, securityCheck, transport, true);
                userCallbackDfd.resolve();
            },
            function (error) {
                var loginRetryObject = {
                    retryFunction: loginRetry,
                    userCallbackDfd: userCallbackDfd,
                    credentials: credentials
                };
                onAuthorizationProcessFailure(error, securityCheck, clientId, loginRetryObject);
            });
    }

    function login(securityCheck, credentials) {
        var dfd = WLJQ.Deferred();
        // make sure there is only one authorization request in progress
        if (isAuthorizationInProgress()) {
            var failResponse = createErrorResponse(500, WL.ErrorCode.AUTHORIZATION_FAILURE, LOGIN_ALREADY_IN_PROCESS);
            dfd.reject(failResponse);
        } else {
            if (__isUndefinedOrNull(securityCheck)) {
                securityCheck = EMPTY_SCOPE;
            }
            authorizationAlreadyInProgress = true;
            __login(securityCheck, credentials, dfd);
        }
        return dfd.promise();
    }

    var loginRetry = function (scope, loginRetryObject) {
        __login(scope, loginRetryObject.credentials, loginRetryObject.userCallbackDfd);
    };

    var isAuthorizationInProgress = function () {
        return obtainAuthHeaderCallbacks.length > 1 || authorizationAlreadyInProgress;
    };

    var onAuthorizationProcessFailure = function (error, scope, clientId, tryAgainObject) {
        // in case of unknown client error do not process the callbacks; call the registration part instead
        var shouldProcessCallbacksOnError = true;

        if (isUnknownClientError(error) && !invalidClientReceived) {
            // request failed with unknown client
            invalidClientReceived = true; // set a flag that prevents infinite loop
            shouldProcessCallbacksOnError = false; // do not process callbacks, because request will be sent again

            // call the native to delete the old authentication data
            WL.AuthorizationManager.__deleteAuthData()
                .then(
                    function () {
                        // register the client again
                        __invokeInstanceRegistration()
                            .then(
                                function () {
                                    // the registration returns the new client id.
                                    // update all callbacks in queue with the new client id
                                    updateClientIds(__getClientId());
                                    // resend the request
                                    tryAgainObject.retryFunction(scope, tryAgainObject);
                                },
                                function (error) {
                                    rejectAllCallbacks(error);
                                    __deleteAuthData();
                                }
                            );
                    },
                    function (error) {
                        // unable to delete the old auth data, reject all callbacks and do not re-send the request
                        rejectAllCallbacks(error);
                    }
                );
        }
        // notify the callers about error if it is not the 'unknown client' error thrown on the first time
        if (shouldProcessCallbacksOnError) {
            authorizationAlreadyInProgress = false;
            processObtainAccessTokenCallbacks(clientId, scope, error, false);
            if (!__isUndefinedOrNull(tryAgainObject.userCallbackDfd)) {
                tryAgainObject.userCallbackDfd.reject(error);
            }
        }
    };

    function sortScopeAlphabetically(scope) {
        if (scope === EMPTY_SCOPE) {
            return scope;
        }
        var scopeArray = scope.match(/\S+/g);
        scopeArray.sort();
        return scopeArray.join(' ');
    }

    function logout(securityCheck) {
        var dfd = WLJQ.Deferred();
        var id = __getClientId();
        if (isAuthorizationInProgress() || __isUndefinedOrNull(id)) {
            return dfd.reject(createErrorResponse(500, WL.ErrorCode.AUTHORIZATION_FAILURE, LOGOUT_ERROR_MSG));
        }
        if (__isUndefinedOrNull(securityCheck)) {
            securityCheck = EMPTY_SCOPE;
        }
        authorizationAlreadyInProgress = true;
        __sendLogoutRequest(securityCheck).then(
            function () {
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(null, securityCheck, null, true);
                dfd.resolve();
            },
            function (error) {
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(null, securityCheck, null, false);
                dfd.reject(error);
            });

        return dfd.promise();
    }

    function __setClientRegisteredData(data) {
        if(!data) {
            WL.LocalStorageDB.removeItem(clientApplicationDataKey);
        }
        return WL.LocalStorageDB.setItem(clientApplicationDataKey, data);
    }

    function __getClientRegisteredData() {
        return WL.LocalStorageDB.getItem(clientApplicationDataKey);
    }

    function __sendLogoutRequest(securityCheck) {
        var dfd = WLJQ.Deferred();
        paramsForLogoutRequest(securityCheck).then(function(params){
            var requestOptions = createCallbacksForLogoutRequest(dfd, params);
            makeRequest('preauth/v1/logout', requestOptions, false);
        });
        return dfd.promise();
    }

    /* Determines if the client needs to register/reregister, or not */
    function shouldRegister() {
        var id = __getClientId();
        if(__isUndefinedOrNull(id)) {
            return true;
        }
        var registeredData = __getClientRegisteredData();
        var currentData = WL.BrowserManager.getDeviceData();
        return JSON.stringify(registeredData) !== JSON.stringify(currentData);
    }

    /* Makes a request to MFP or AZ (based on arg) */
    function makeRequest(path, requestOptions, isAZRequest) {
        var serverURL = __getServerUrl(isAZRequest);
        return new WLJSX.Ajax.WLRequest(serverURL + '/' + path, requestOptions);
    }

    function paramsForAuthorizationRequest(scope) {
        var params = {};
        params['response_type'] = 'code';
        params[PARAM_CLIENT_ID_KEY] = __getClientId();
        params['scope'] = __isUndefinedOrNull(scope) ? '' : scope;
        params['redirect_uri'] = buildRedirectURI() ;

        return params;
    }

    function paramsForLogoutRequest(securityCheck) {
        var dfd = WLJQ.Deferred();
        var jwt = new WL.JWT();

        WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
            var params = {
                'client_assertion' : signedData,
                'security_check' : securityCheck,
                'client_assertion_type' : JWT_ASSERTION_TYPE
            };
            dfd.resolve(params);
        });
        return dfd.promise();
    }

    function paramsForRegistrationRequest() {
        var dfd = WLJQ.Deferred();
        var params = {};
        var registrationData = {
            'device' : WL.BrowserManager.getDeviceData(),
            'application' : WL.Config.__getApplicationData()
        };
        WL.CertManager.signJWS(registrationData).then(function(signedData){
            params['signedRegistrationData'] = decomponentJWS(signedData);
            dfd.resolve(params);
        },
        function(error){
            dfd.reject(error);
        });
        return dfd.promise();
    }

    function paramsForTokenRequest(code) {
        var dfd = WLJQ.Deferred();
        var jwt = new WL.JWT(code, 'az/v1/token');
        WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
            var params = {
                'client_assertion' : signedData,
                'code' : code,
                'grant_type' : 'authorization_code',
                'redirect_uri' : buildRedirectURI(),
                'client_assertion_type' : JWT_ASSERTION_TYPE
            };
            dfd.resolve(params);
        },
        function(error){
            dfd.reject(error);
        });
        return dfd.promise();
    }

    function buildRedirectURI() {
        return WL.Config.__getBaseURL() + AZ_REDIRECT_URI + '/' + __getClientId();
    }

    function decomponentJWS(signedData){
        var splitData = signedData.split('.');
        return {
            'header' : splitData[0],
            'payload' : splitData[1],
            'signature' : splitData[2]
        }

    }

    function createErrorResponse(status, errorCode, errorMsg) {
        var transport = {
            status: status,
            responseJSON: {
                errorCode: errorCode,
                errorMsg: errorMsg
            }
        };
        return new WL.Response(transport, null);
    }

    return {
        isAuthorizationRequired: isAuthorizationRequired,
        obtainAccessToken: obtainAccessToken,
        getResourceScope: getResourceScope,
        clearAccessToken: clearAccessToken,
        setAuthorizationServerUrl: setAuthorizationServerUrl,
        getAuthorizationServerUrl: getAuthorizationServerUrl,
        login: login,
        logout: logout,
        __invokeGetRegistrationData : __invokeGetRegistrationData,
        __invokeInstanceRegistration : __invokeInstanceRegistration,
        __logAndThrowError : __logAndThrowError,
        __getAuthorizationScope: __getAuthorizationScope,
        __getClientId: __getClientId,
        __getCachedScopeByResource: __getCachedScopeByResource,
        __deleteAuthData: __deleteAuthData,
        __deleteCachedScopeByResource : __deleteCachedScopeByResource,
        __getWlServerUrl: __getServerUrl,
        __getParameterByName: __getParameterByName,
        __invokeAuthorizationRequestForScope: __invokeAuthorizationRequestForScope,
        __cacheScopeByResource: __cacheScopeByResource,
        __getCachedAccessToken: __getCachedAccessToken,
        __isInvalidToken: __isInvalidToken,
        __sendHeartBeat: __sendHeartBeat,
        __sendLogoutRequest: __sendLogoutRequest,
        __serverRelativeTime: SERVER_RELATIVE_TIME,
        WL_AUTHORIZATION_HEADER: WL_AUTHORIZATION_HEADER,
        WWW_AUTHENTICATE_HEADER: WWW_AUTHENTICATE_HEADER,
        MFP_CONFLICT_HEADER: MFP_CONFLICT_HEADER
    };

}());

/**
 * ================================================================= 
 * Source file taken from :: deviceAuthentication.web.js
 * ================================================================= 
 */

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

/**
 * Object which handle the device authentication
 */
__WLDeviceAuth = function() {
    this.__requestToResend = null, this.__deviceChallengeToken = null,

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProperties. Our default implementation actually does
     * nothing. If overriding this method, the user must call
     * resumeDeviceAuthProcess with the payload
     * 
     * @param resumeDeviceAuthProcess
     *            function to call when done with getting extra data
     */
    this.__defaultOnGetCustomDeviceProperties = function(resumeDeviceAuthProcess) {
        resumeDeviceAuthProcess({});
    },

    
    /**
     * get device friendly name
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__getDeviceDisplayName = function(successCallback, failureCallback) {
       WL.AuthorizationManager.__invokeGetRegistrationData().then(
           function(response){
               var responseJSON = response.responseJSON;
               var regData = responseJSON['registration'];
               var device = regData['device'];
               var displayName = device['deviceDisplayName'];
               if(!displayName) {
                   displayName = null;
               }
               successCallback(displayName);
       },
           function(error){
               failureCallback(error);
           });
    },
    
    /**
     * set device friendly name
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__setDeviceDisplayName = function(deviceDisplayName, successCallback, failureCallback) {
        var id = WL.AuthorizationManager.__getClientId();
        if(!id) {
            failureCallback('Can not set display name until device is registered');
        } else {
            WL.BrowserManager.__setLocalDeviceDisplayName(deviceDisplayName);

            // After we set the deviceDisplayName locally, we invoke re-registration to set the param in the server
            WL.AuthorizationManager.__invokeInstanceRegistration().then(
                function() {
                    WL.BrowserManager.__setLocalDeviceDisplayName(null);
                    successCallback(null);
            },
                function(error) {
                    WL.BrowserManager.__setLocalDeviceDisplayName(null);
                    failureCallback(error);
            });
        }
    };
};
__WL.prototype.DeviceAuth = new __WLDeviceAuth;
WL.DeviceAuth = new __WLDeviceAuth;


/**
 * ================================================================= 
 * Source file taken from :: wlcookiemanager.web.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*globals WL, WLJSX, __WL, air, device*/

/**
 * Cookie manager singleton
 */
WL.CookieManager = (function() {

  /*jshint strict:false, quotmark:double*/

  var COOKIE_JSESSION_ID = "JSESSIONID";
  var COOKIE_WLSESSION_ID = "WLSESSIONID";

  // WARN: This constant is also accessed in the iOS native code
  // (WLCookieExtractor.m)
  var PERSISTED_COOKIES_NAME = "cookies";

  var cookies = null;
  var cookiePersister = null;
  var gadgetName = null;
  var gadgetEnvironment = null;
  var gadgetIID = null;

  var CookiePersister = WLJSX.Class.create({
    init: function() {},
    storeCookies: function() {},
    readCookies: function() {}, // throws exception on failure.
    clearCookies: function() {}
  });

  // Air
  // Adobe Air has a local SQLite DB which is used to persist the cookies.
  // All cookies are saved as a JSON object in the cookies table, under the
  // name "cookies".
  //
  var AirCookiePersister = WLJSX.Class.create(CookiePersister, {
    conn: null,

    init: function() {
      this.conn = new air.SQLConnection();
      // The database file is in the application storage
      // directory
      var folder = air.File.applicationStorageDirectory;
      var dbFile = folder.resolvePath("worklight.db");

      try {
        this.conn.open(dbFile);
      } catch (e) {
        WL.Logger.error("Error opening cookies DB: " + e.message + ", Details: " + e.details);
        return;
      }

      var createStmt = new air.SQLStatement();
      createStmt.sqlConnection = this.conn;
      createStmt.text = "CREATE TABLE IF NOT EXISTS cookies (name VARCHAR(255) PRIMARY KEY, value VARCHAR(255))";

      try {
        createStmt.execute();
      } catch (e) {
        WL.Logger.error("Error creating cookies DB tables: " + e.message + ", Details: " + e.details);
      }
    },

    storeCookies: function() {
      try {
        var JSONCookies = WLJSX.Object.toJSON(cookies);
        WL.Logger.debug("Storing cookies: " + JSONCookies);

        // first cookie - need to use an "insert" sql
        // command
        if (this.getCookieValue(PERSISTED_COOKIES_NAME) === null) {
          var insertStmt = new air.SQLStatement();
          insertStmt.sqlConnection = this.conn;
          insertStmt.text = "INSERT INTO cookies (name, value) VALUES(\"" + PERSISTED_COOKIES_NAME + "\", \"" + JSONCookies + "\")";
          insertStmt.execute();
        } else {
          // cookies were persisted already - need to
          // use an "update"
          // sql command
          var updateStmt = new air.SQLStatement();
          updateStmt.sqlConnection = this.conn;
          updateStmt.text = "UPDATE cookies SET name=\"" + PERSISTED_COOKIES_NAME + "\", value=\"" + JSONCookies + "\" WHERE name=\"" + PERSISTED_COOKIES_NAME + "\"";
          updateStmt.execute();
        }
      } catch (e) {
        WL.Logger.error("Error storing cookies: " + e.message + ", Details: " + e.details);
      }
    },

    readCookies: function() {
      var JSONCookies = this.getCookieValue(PERSISTED_COOKIES_NAME);
      if (JSONCookies) {
        WL.Logger.debug("Read cookies: " + JSONCookies);
        var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
        /*jshint forin:false*/
        for (var key in cookiesObj) {
          cookies[key] = cookiesObj[key];
        }
      }
    },

    clearCookies: function() {
      try {
        var deleteStmt = new air.SQLStatement();
        deleteStmt.sqlConnection = this.conn;
        deleteStmt.text = "DELETE FROM cookies";
        deleteStmt.execute();
      } catch (e) {
        WL.Logger.error("Error clearing cookies: " + e.message);
      }
    },

    getCookieValue: function(cookieName) {
      try {
        var cookieValue = null;
        var selectStmt = new air.SQLStatement();
        selectStmt.sqlConnection = this.conn;
        selectStmt.text = "SELECT * FROM cookies WHERE name=\"" + cookieName + "\"";
        selectStmt.execute();

        var result = selectStmt.getResult();
        if (result.data !== null) {
          var numResults = result.data.length;
          for (var i = 0; i < numResults; i++) {
            cookieValue = result.data[i].value;
          }
        }
        return cookieValue;
      } catch (e) {
        WL.Logger.error("Error getting cookie: " + cookieName + ", error: " + e.message);
      }
    }
  });

  
  //
  // Windows Phone Persister
  //
//  var WPCookiePersister = WLJSX.Class.create(CookiePersister, {
//    storeCookies: function() {
//      try {
//        var JSONCookies = WLJSX.Object.toJSON(cookies);
//        window.localStorage.setItem(PERSISTED_COOKIES_NAME, JSONCookies);
//        WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
//        this.readCookies();
//      } catch (e) {
//        WL.Logger.error("Error storing cookie: " + e.message);
//      }
//    },
//
//    readCookies: function() {
//      try {
//        var JSONCookies = window.localStorage.getItem(PERSISTED_COOKIES_NAME);
//
//        if (JSONCookies !== null) {
//          var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
//          /*jshint forin:false*/
//          for (var key in cookiesObj) {
//            cookies[key] = cookiesObj[key];
//          }
//        }
//      } catch (e) {
//        WL.Logger.error("Error reading cookies: " + e.message);
//      }
//    },
//
//    clearCookies: function() {
//      try {
//        var JSONCookies = window.localStorage.getItem(PERSISTED_COOKIES_NAME);
//        window.localStorage.removeItem(PERSISTED_COOKIES_NAME);
//        WL.Logger.debug("Delete cookies: " + JSONCookies);
//      } catch (e) {
//        WL.Logger.error("Error deleting cookies: " + e.message);
//      }
//    }
//  });

  var LocalStorageCookiePersister = WLJSX.Class.create(CookiePersister, {
    storeCookies: function() {
      try {
        var JSONCookies = WLJSX.Object.toJSON(cookies);
        WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
        __WL.LocalStorage.setValue(PERSISTED_COOKIES_NAME, JSONCookies);
      } catch (e) {
        WL.Logger.error("Error storing cookie: " + e.message);
      }
    },

    readCookies: function() {
      try {
        var JSONCookies = __WL.LocalStorage.getValue(PERSISTED_COOKIES_NAME);
        if (JSONCookies === "") {
          return;
        }
        WL.Logger.debug("Read cookies: " + JSONCookies);
        if (JSONCookies !== null) {
          var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
          /*jshint forin:false*/
          for (var key in cookiesObj) {
            cookies[key] = cookiesObj[key];
          }
        }
      } catch (e) {
        WL.Logger.error("Error reading cookies: " + e.message);
      }
    },

    clearCookies: function() {
      try {
        var JSONCookies = WLJSX.Object.toJSON(cookies);
        __WL.LocalStorage.clear(PERSISTED_COOKIES_NAME);
        WL.Logger.debug("Delete cookies: " + JSONCookies);
      } catch (e) {
        WL.Logger.error("Error deleting cookies: " + e.message);
      }
    }
  });

  // 
  // Android
  //
  var AndroidCookiePersister = LocalStorageCookiePersister;

  //
  // iPhone
  //  
  var IPhoneCookiePersister = LocalStorageCookiePersister;

  // Private methods of the cookie manager:

  // Create the cookie persister according to the environment
  var createCookiePersister = function() {
    switch (gadgetEnvironment) {
      case WL.Env.ADOBE_AIR:
        cookiePersister = new AirCookiePersister();
        break;
      case WL.Env.IPHONE:
        cookiePersister = new IPhoneCookiePersister();
        break;
      case WL.Env.IPAD:
        cookiePersister = new IPhoneCookiePersister();
        break;
      case WL.Env.ANDROID:
        cookiePersister = new AndroidCookiePersister();
        break;
//      case WL.Env.WINDOWSPHONE8:
//        cookiePersister = new WPCookiePersister();
//        break;
      default:
        cookiePersister = null;
        break;
    }
  };

  var parseCookiesFromHeader = function(header) {
    var resultCookies = [];
    var headerValue = header.substr(header.indexOf(":") + 1);

    var cookieParts = headerValue.split(",");
    for (var i = 0; i < cookieParts.length; i++) {
      var cookiePart = cookieParts[i];
      // WL.Logger.debug("CookiePart: " + cookiePart);
      var cookieSubparts = cookiePart.split("=");
      if (cookieSubparts.length < 2) {
        WL.Logger.error("invalid cookie header: " + header);
      } else {
        var cookie = {
          name: WLJSX.String.strip(cookieSubparts[0]),
          value: WLJSX.String.strip(cookieSubparts[1].split(";")[0])
        };
        resultCookies.push(cookie);
      }
    }
    return resultCookies;
  };

  var getCookie = function(cookieName) {
    var cookieValue = "";
    if (isCookieManagementRequired()) {
      cookieValue = cookies[cookieName];
    } else {
      if (document.cookie.length > 0) {
        var cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
          cookieStart = cookieStart + cookieName.length + 1;
          var cookieEnd = document.cookie.indexOf(";", cookieStart);
          /*jshint maxdepth:4*/
          if (cookieEnd === -1) {
            cookieEnd = document.cookie.length;
          }
          cookieValue = decodeURI(document.cookie.substring(cookieStart, cookieEnd));
        }
      }
    }
    if (typeof cookieValue === "undefined") {
      cookieValue = null;
    }
    // WL.Logger.debug("getCookieValue: " + cookieName + "=" + cookieValue);
    return {
      name: cookieName,
      value: cookieValue
    };
  };

  var isCookieManagementRequired = function() {
    return false;
  };

  // Public API methods
  return {
    init: function(gadgetDisplayName, gadgetEnv, gadgetInstanceID) {
      gadgetName = gadgetDisplayName;
      gadgetEnvironment = gadgetEnv;
      gadgetIID = gadgetInstanceID;

      cookies = {};
      createCookiePersister();

      if (cookiePersister !== null) {
        cookiePersister.init();
        try {
          cookiePersister.readCookies();
        } catch (e) {
          WL.Logger.error("error read cookies: " + e.message);
          cookiePersister.clearCookies();
        }
        WL.Logger.debug("CookieMgr read cookies: " + WLJSX.Object.toJSON(cookies));
      }
    },

    // Called by WP7 native code after call readCookies
    updateCookies: function(JSONCookies) {
      try {
        var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
        /*jshint forin:false*/
        for (var key in cookiesObj) {
          cookies[key] = cookiesObj[key];
        }
      } catch (e) {
        WL.Logger.error("Problems to update cookies " + e + " " + JSONCookies);
      }
    },

    clearCookies: function() {
      cookies = {};
      if (cookiePersister !== null) {
        cookiePersister.clearCookies();
      }
    },

    createCookieHeaders: function() {
      var headers = {};
      if (isCookieManagementRequired()) {
        var cookieHeaderValue = "";
        /*jshint forin:false*/
        for (var key in cookies) {
          cookieHeaderValue += key + "=" + cookies[key] + ";";
        }

        if (cookieHeaderValue !== "") {
          headers.Cookie = cookieHeaderValue;
        }
      }

      if (!WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_DEVICE_AUTH) && typeof device !== "undefined" && device !== null && typeof device.uuid !== "undefined") {
        var deviceId = {};
        if (WL.Client.getEnvironment() === WL.Environment.WINDOWS8 || WL.Client.getEnvironment() === WL.Environment.WINDOWS || WL.Client.getEnvironment() === WL.Environment.WINDOWSPHONE8) {
          //Device uuid changes and system generates different uuid's for different apps. 
          //For device SSO to work it should be same across apps and adapterid remains same for a device.
          deviceId.id = WL.Device.getHardwareIdentifier();
        } else {
          deviceId.id = device.uuid;
        }
        deviceId.os = device.version;
        deviceId.model = device.model;
        deviceId.environment = WL.Client.getEnvironment();
        headers.deviceId = WLJSX.Object.toJSON(deviceId);
      }
      return headers;
    },

    handleResponseHeaders: function(headers) {
      if (!isCookieManagementRequired()) {
        return;
      }
      var sessionCookies = {};
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (header.toLowerCase().indexOf("set-cookie") > -1) {
          var parsedCookies = parseCookiesFromHeader(header);
          for (var j = 0; j < parsedCookies.length; j++) {
            var cookie = parsedCookies[j];
            // Persist only the non session cookies
            /*jshint maxdepth:4, eqeqeq:false*/
            if (cookie.name != COOKIE_JSESSION_ID && cookie.name != COOKIE_WLSESSION_ID) {
              cookies[cookie.name] = cookie.value;
            } else {
              sessionCookies[cookie.name] = cookie.value;
            }

            if (cookiePersister !== null) {
              /*jshint maxdepth:5*/
              if (cookies !== null && WLJSX.Object.objectSize(cookies) > 0) {
                // in case there is two requests immediate after
                // login we need
                // to ensure session cookies is not persist
                delete cookies[COOKIE_WLSESSION_ID];
                delete cookies[COOKIE_JSESSION_ID];
                cookiePersister.storeCookies();
              }
            }
          }
        }
      }

      // Add the session cookies into the memory cookies
      if (isCookieManagementRequired()) {
        /*jshint forin:false*/
        for (var key in sessionCookies) {
          cookies[key] = sessionCookies[key];
        }
      }

    },

    getJSessionID: function() {
      var jsessionidCookie = getCookie(COOKIE_JSESSION_ID);
      return (jsessionidCookie === null) ? null : jsessionidCookie.value;
    },

    areCookiesEnabled: function() {
      var enabled = true;
      if (WL.EnvProfile.isEnabled(WL.EPField.WEB)) {
        var date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = "testcookie=oreo; expires=" + date.toGMTString() + "; path=/";
        var cookie = getCookie("testcookie");
        enabled = (cookie.value === "oreo");
      }
      return enabled;
    }
  };
}());
/* End CookieManager */

/**
 * ================================================================= 
 * Source file taken from :: worklight.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/*globals WL, __WL, WLJSX*/

/*jshint strict:false*/

/**
 * EnvironmentProfile
 */
WL.EnvProfile = (function() {

  var profile = null;

  return {
    initialize: function(env) {
      if (typeof WL[env + 'ProfileData'] !== 'undefined') {
        profile = WL[env + 'ProfileData'];
      } else {
        profile = WL.DefaultProfileData;
      }
    },

    getValue: function(field) {
      return profile[field];
    },

    isEnabled: function(field) {
      return !!(field in profile && profile[field]);
    },

    disable: function(field) {
      if (field in profile) {
        profile[field] = false;
      }
    }
  };
})();

__WL.MultiEventListener = WLJSX.Class.create({
  isEventComplete: false,
  onEventsComplete: null,
  events: null,

  initialize: function() {
    this.events = {};
  },

  __onEvent: function(e) {
    this.events[e.type] = true;
    for (var x in this.events) {
      if (!this.events[x]) {
        return;
      }
    }
    this.onEventsComplete();
  },

  registerEvent: function(e) {
    document.addEventListener(e, this.__onEvent.bind(this), false);
    this.events[e] = false;
  }
});

var __WLEvents = {
  WORKLIGHT_IS_CONNECTED: 'WL:WORKLIGHT_IS_CONNECTED',
  WORKLIGHT_IS_DISCONNECTED: 'WL:WORKLIGHT_IS_DISCONNECTED'
};

__WL.prototype.Events = __WLEvents;
WL.Events = __WLEvents;

/*jshint undef:false*/
__WLLocalStorage = function() {
  var isSupportLocalStorage = (typeof localStorage !== 'undefined');
  var HTML5_NOT_SUPPORT_MSG = '. HTML5 localStorage not supported on current browser.';

  function deviceReadyCallback() {
    isSupportLocalStorage = (typeof localStorage !== 'undefined');
    preventClearSpecialValues();
  }

  if (typeof document.addEventListener !== 'undefined') {
    document.addEventListener('deviceready', deviceReadyCallback, false);
  } else {
    document.attachEvent('ondeviceready', deviceReadyCallback);
  }

  function preventClearSpecialValues() {
    // prevent from clear MobileFirst Platform special values
    if (typeof Storage !== 'undefined' && isSupportLocalStorage) {
      Storage.prototype.clear = function() {
        for (var item in localStorage) {
          if (item !== 'cookies' && item !== 'userName') {
            localStorage.removeItem(item);
          }
        }
      };
    }
  }

  this.getValue = function(key) {
      var value = null;
      if (isSupportLocalStorage) {
        value = localStorage.getItem(key);
      } else {
        WL.Logger.debug('Can\'t retrive value for key ' + key + HTML5_NOT_SUPPORT_MSG);
      }
      return value;
    },

    this.setValue = function(key, value) {
      if (isSupportLocalStorage) {
        localStorage.setItem(key, value);
      } else {
        WL.Logger.debug('Can\'t set value ' + value + ' for key' + key + HTML5_NOT_SUPPORT_MSG);
      }
    },

    this.clear = function(key) {
      if (isSupportLocalStorage) {
        localStorage.removeItem(key);
      } else {
        WL.Logger.debug('Can\'t clear key ' + key + HTML5_NOT_SUPPORT_MSG);
      }
    },

    this.clearAll = function() {
      if (isSupportLocalStorage) {
        localStorage.clear();
      } else {
        WL.Logger.debug('Can\'t clear storage ' + HTML5_NOT_SUPPORT_MSG);
      }
    };
};

/*jshint newcap:false*/
__WL.LocalStorage = new __WLLocalStorage();

__WLDevice = function() {
  /**
   * Supported environments: Android, iOS
   *
   * @param callback -
   *            the callback function
   * @return network info from device in JSON format The returned object
   *         consist from the following properties: isNetworkConnected,
   *         isAirplaneMode, isRoaming, networkConnectionType, wifiName,
   *         telephonyNetworkType, carrierName, ipAddress,
   */
  this.getNetworkInfo = function(callback) {
    callback({});
  };
};
__WL.prototype.Device = new __WLDevice();
WL.Device = new __WLDevice();

/**
 * ================================================================= 
 * Source file taken from :: wlresourcerequest.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WL_, WLJQ, WL.AuthorizationManager*/
/*jshint maxparams:4*/
WL.ResourceRequest = function (_url, _method, _options) {
    /*jshint strict:false*/

    function logAndThrowError(msg, callerName) {
        if (WL.Logger) {
            if (callerName) {
                msg = 'Invalid invocation of method ' + callerName + '; ' + msg;
            }
            WL.Logger.error(msg);
        }

        throw new Error(msg);
    }

    var queryParameters = {};

    function extractQueryParamFromUrl(_url) {
        var vars = _url.split('?');
        if (vars.length > 1) {
            var tempParamaters = vars[1].split('&');
            for (var i = 0; i < tempParamaters.length; i++) {
                if (true) { // thanks jshint
                    var pair = tempParamaters[i].split('=');
                    var values = queryParameters[pair[0]];
                    /*jshint maxdepth:5*/
                    if (values === null || typeof (values) === 'undefined') {
                        values = [];
                        queryParameters[pair[0]] = values;
                    }
                    values[values.length] = pair[1];
                }
            }
        }
        return vars[0];
    }

    function isValidRequestMethod(method) {
        return (method === WL.ResourceRequest.GET || method === WL.ResourceRequest.POST || method === WL.ResourceRequest.PUT ||
        method === WL.ResourceRequest.DELETE || method === WL.ResourceRequest.HEAD || method === WL.ResourceRequest.OPTIONS ||
        method === WL.ResourceRequest.TRACE);
    }

    function isUndefinedOrNull(value) {
        return (typeof(value) === 'undefined' || value === null);
    }
    var url = (_url === null || typeof (_url) === 'undefined') ? logAndThrowError('Request URL must be specified.', 'WLResourceRequest') : extractQueryParamFromUrl(_url.trim());
    var method = (typeof (_method) === 'undefined' || !isValidRequestMethod(_method)) ? logAndThrowError('Request method is invalid or not specified.', 'WLResourceRequest') : _method;
    var timeout;
    var headers = {};
    var currentResourceRequest = this;
    currentResourceRequest.scope = null;
    var MAX_CONFLICT_ATTEMPTS = 7;

    /* support timeout given as 3rd parameter for backward compatibility */
    if (typeof(_options) === 'number') {
        timeout = _options;
    } else {
        if (!isUndefinedOrNull(_options) && !isUndefinedOrNull(_options.timeout)) { timeout = _options.timeout;}
        if (!isUndefinedOrNull(_options) && !isUndefinedOrNull(_options.scope)) { currentResourceRequest.scope = _options.scope;}
    }

    /**
     * Returns request URL. The URL must have been passed to constructor.
     */
    this.getUrl = function () {
        return url;
    };

    /**
     * Returns current request method. A valid request method must have been passed to constructor.
     */
    this.getMethod = function () {
        return method;
    };

    /**
     * Returns query parameters as a JSON object with key-value pairs.
     */
    this.getQueryParameters = function () {
        var tempQueryParameters = {};
        for (var paramKey in queryParameters) {
            if (true) { // thanks jshint
                var value = queryParameters[paramKey][0];
                tempQueryParameters[paramKey] = value;
            }
        }
        return tempQueryParameters;
    };

    /**
     * Returns query parameters as string.
     */
    this.getQueryString = function () {
        return buildQueryString();
    };

    /**
     * Sets query parameters.
     * @param {parameters} A JSON object with key-value pairs.
     */
    this.setQueryParameters = function (parameters) {
        queryParameters = {};

        if (typeof (parameters) !== 'undefined' && parameters !== null) {
            for (var paramKey in parameters) {
                if (true) { // thanks jshint
                    this.setQueryParameter(paramKey, parameters[paramKey]);
                }
            }
        }
    };

    /**
     * Sets a new query parameter. If a parameter with the same name already exists, it will be replaced.
     * @param {name} Parameter name
     * @param {value} Parameter value. Should be string, number or boolean.
     */
    this.setQueryParameter = function (name, value) {
        if (typeof (name) !== 'undefined' && name !== null && typeof (value) !== 'undefined' && value !== null) {
            queryParameters[name] = [value];
        }
    };

    // receives string, returns array of header values (even if only 1). if name==undefined returns all headers
    /**
     * Returns array of header values.
     * @param {name} Header name. If header name is specified, this function returns an array of header values
     * stored with this header, or undefined, if specified header name is not found. If <i>name</i> is null, or undefined,
     * this function returns all headers.
     */
    this.getHeaders = function (name) {
        if (name === null || typeof (name) === 'undefined') {
            return headers;
        }

        var headerValue = headers[name];

        if (typeof (headerValue) === 'undefined') {
            // try case insensitive search
            headerValue = __getFirstHeaderByNameNoCase(name).value;
        }

        if (headerValue !== null) {
            if (WL.Validators.isArray(headerValue)) {
                return headerValue;
            } else {
                return [headerValue];
            }
        }

    };

    /**
     * Returns array of header names. It can be empty if no headers has been added.
     */
    this.getHeaderNames = function () {
        var headerNames = [];
        for (var headerName in headers) {
            if (true) { // thanks jshint
                headerNames.push(headerName);
            }
        }
        return headerNames;
    };

    // receives string, returns string. if multiple headers with same name - return first one
    /**
     * Returns a first header value stored with the specified header name. The value is returned as a string.
     * Can be undefined if a header with specified name does not exist.
     * @param {name} Header name.
     */
    this.getHeader = function (name) {
        if (name === null || typeof (name) === 'undefined') {
            logAndThrowError('Header name should be defined.', 'WLResourceRequest.getHeader');
        }

        var headerValue = headers[name];
        if (typeof (headerValue) === 'undefined') {
            // try case insensitive search
            headerValue = __getFirstHeaderByNameNoCase(name).value;
        }

        if (WL.Validators.isArray(headerValue)) {
            return headerValue[0];
        }
        return headerValue;
    };

    //receives JSON object similar to what getHeaders returns
    /**
     * Sets request headers. The existing headers are replaced.
     * @param {requestHeaders} JSON object with request headers. Each header value should be either string, or array of strings. This function will
     * throw error if one of specified header values is not valid.
     */
    this.setHeaders = function (requestHeaders) {
        if (requestHeaders === null || typeof (requestHeaders) === 'undefined') {
            headers = {};
            return;
        }

        // verify that each key contains array of values or simple object
        for (var headerName in requestHeaders) {
            if (true) { // thanks jshint
                var headerValue = requestHeaders[headerName];

                if (WL.Validators.isArray(headerValue)) {
                    /*jshint maxdepth:4*/
                    if (headerValue.length > 0 && !isArrayOfSimpleTypes(headerValue)) {
                        // complex type detected within array of values - throw error
                        logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeaders');
                    }
                } else if (!isSimpleType(headerValue)) {
                    logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeaders');
                }
            }
        }

        headers = {};
        for (var key in requestHeaders) {
            if (true) { // thanks jshint
                var headerValueTemp = requestHeaders[key];
                if (WL.Validators.isArray(headerValueTemp)) {
                    for (var item in headerValueTemp) {
                        /*jshint maxdepth:5*/
                        if (true) { // thanks jshint
                            this.addHeader(key, headerValueTemp[item]);
                        }
                    }
                } else {
                    this.addHeader(key, headerValueTemp);
                }
            }
        }
    };

    /**
     * Sets a new header or replaces an existing header with the same name.
     * @param {name} Header name
     * @param value Header value. The value must be of simple type (string, boolean or value).
     */
    this.setHeader = function (name, value) {
        if (!isSimpleType(value)) {
            // complex type detected instead of string - throw error
            logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeader');
        }

        for (var headerName in headers) {
            if (headerName.toLowerCase() === name.toLowerCase()) {
                delete headers[headerName];
            }
        }

        headers[name] = value;
    };

    /**
     * Adds a new header. If a header with the same name already exists, the header value will be added to the existing header. The name is
     * case insensitive.
     * @param {name} Header name
     * @param {value} Header value. The value must be of simple type (string, number or boolean).
     */
    this.addHeader = function (name, value) {
        if (typeof (value) === 'undefined' || value === null) {
            logAndThrowError('Header value should not be null or undefined.', 'WLResourceRequest.addHeader');
        }
        if (!isSimpleType(value)) {
            // complex type detected instead of string - throw error
            logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.addHeader');
        }

        var header = __getFirstHeaderByNameNoCase(name);
        var existingHeaderName = header.name;
        var existingHeaderValue = header.value;
        if (existingHeaderValue === null) {
            headers[name] = value;
        } else {
            if (WL.Validators.isArray(existingHeaderValue)) {
                for (var idx in existingHeaderValue) {
                    /*jshint maxdepth:4*/
                    if (existingHeaderValue[idx].toString() === value.toString()) {
                        return;
                    }
                }
                existingHeaderValue.push(value);
            } else {
                var array = [];
                array.push(existingHeaderValue);
                array.push(value);
                headers[existingHeaderName] = array;
            }
        }
    };

    function __getFirstHeaderByNameNoCase(name) {
        for (var headerName in headers) {
            if (headerName.toLowerCase() === name.toLowerCase()) {
                return {
                    name: headerName,
                    value: headers[headerName]
                };
            }
        }

        return {
            name: null,
            value: null
        };
    }

    /**
     * Returns request time out in milliseconds.
     */
    this.getTimeout = function () {
        return timeout;
    };

    /**
     * Sets request timeout. If timeout is not specified, then a default timeout will be used.
     * @param {requestTimeout} Request timeout in milliseconds.
     */
    this.setTimeout = function (requestTimeout) {
        timeout = requestTimeout;
    };

    /**
     * Sends the request to a server.
     * @param {content} Body content. It can be of simple type (like string), or object.
     * @returns Returns promise. Sample usage: <br>
     * var request = WL.ResourceRequest(url, method, timeout);<br>
     * request.send(content).then(<br>
     *  function(response) {// success flow}, <br>
     *  function(error) {// fail flow} <br>
     * );
     */
    this.send = function (content) {
        var contentString = '';
        if (typeof (content) !== 'undefined' && content !== null) {
            contentString = isSimpleType(content) ? content.toString() : JSON.stringify(content);
        }

        return sendRequestAsync(contentString, 0, 0);
    };

    /**
     * Sends the request to a server.
     * @param {json} Body content as JSON object or string as a form data. The content type will be set to 'application/x-www-form-urlencoded'.
     * @returns Returns promise. Sample usage: <br>
     * var request = WL.ResourceRequest(url, method, timeout);<br>
     * request.send(json).then(<br>
     *  function(response) {// success flow}, <br>
     *  function(error) {// fail flow} <br>
     * );
     */
    this.sendFormParameters = function (json) {
        var contentString = encodeFormParameters(json);
        this.addHeader('Content-Type', 'application/x-www-form-urlencoded');

        return sendRequestAsync(contentString, 0, 0);
    };

    function encodeFormParameters(json) {
        if (json === null || typeof (json) === 'undefined') {
            return '';
        }

        var result = '';

        if (isSimpleType(json)) {
            var params = json.split('&');
            for (var i = 0; i < params.length; i++) {
                var kv = params[i].split('=');
                if (kv.length === 0) {
                    continue;
                }

                if (kv.length === 1) {
                    result += encodeURIComponent(kv[0]);
                } else {
                    result += encodeURIComponent(kv[0]) + '=' + encodeURIComponent(kv[1]);
                }

                if (i < params.length - 1) {
                    result += '&';
                }
            }
            return result;
        } else {
            for (var key in json) {
                if (true) { // thanks jshint
                    var value = json[key];
                    /*jshint maxdepth:4*/
                    if (!isSimpleType(value)) {
                        logAndThrowError('Form value must be a simple type.', 'WLResourceRequest.sendFormParameters');
                    }

                    result += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    result += '&';
                }
            }

            if (result.length > 0 && result[result.length - 1] === '&') {
                result = result.substring(0, result.length - 1);
            }

            return result;
        }
    }

    function sendRequestAsync(contentString, attempt, conflictAttemptCounter) {
        var dfd = WLJQ.Deferred();
        var builtUrl = buildRequestUrl();

        __send(builtUrl, contentString, attempt, conflictAttemptCounter).then(
            function (response) {
            	wlanalytics.processAutomaticTrigger();
                dfd.resolve(response);
            },
            function (error) {
                dfd.reject(error);
            }
        );

        return dfd.promise();
    }

    var maxRequestAttempts = 4;

    function __send(serverUrl, contentString, attempt, conflictAttemptCounter) {
        var dfd = WLJQ.Deferred();

        // create WLNativeXHR or XMLHttpRequest
        var xhr = window.WLJSX.Ajax.getTransport();

        var queryString = buildQueryString();
        var finalUrl = queryString === null ? serverUrl : serverUrl + '?' + queryString;

        //TODO - ask Yuri, why we need this?
        xhr.requestOptions = {'url' : finalUrl, 'method' : method};

        xhr.open(method, finalUrl, true);

        if (typeof (timeout) !== 'undefined') {
            xhr.timeout = timeout;
        }

        addRequestHeaders(xhr);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                // any status in the 2xx range is considered a success
                if (this.status >= 200 && this.status <= 299) {
                    dfd.resolve(new WL.Response(this, null));
                } else {
                    var transport = this;
                    if (this.status === 0) {
                        var errorCode = this.wlFailureStatus !== 'undefined' ? this.wlFailureStatus : WL.ErrorCode.UNEXPECTED_ERROR;
                        // handle errors - timeout, unresponsive host and unexpected error
                        transport.status = 0;
                        transport.responseJSON = {
                            errorCode: errorCode,
                            errorMsg: this.statusText //WL.Utils.formatString(WL.ClientMessages.handleTimeOut, finalUrl)
                        };
                    }

                    var failResponse = new WL.Response(transport, null);

                    // WL.Response sets status to 200 if transport.status is 0 - set it back to 0.
                    if (this.status === 0) {
                        failResponse.status = 0;
                    }

                    if (typeof (WL.AuthorizationManager) !== 'undefined' && isAuthorizationRequired(transport) && (transport.status !== 409 && attempt < maxRequestAttempts || transport.status === 409 && conflictAttemptCounter < MAX_CONFLICT_ATTEMPTS)) {
                        processResponse(transport);
                    } else {
                        // it's not OAuth error or number of attempts is exceeded; fail the request with last error, which will be propagated up
                        dfd.reject(failResponse);
                    }
                }
            }
        };

        var isAuthorizationRequired = function(transport) {
            if (isUndefinedOrNull(transport)) {
                return false;
            }
            return WL.AuthorizationManager.isAuthorizationRequired(transport.status, transport.getAllResponseHeaders());
        };

        var processResponse = function(transport) {
            // if status is 409 resend request and increment conflictAttemptCounter
            if (transport.status === 409) {
                resendRequest(attempt, ++conflictAttemptCounter);
            } else if (transport.status === 403) {
                currentResourceRequest.scope = WL.AuthorizationManager.getResourceScope(transport.getAllResponseHeaders());
                if (!WL.Validators.isNullOrUndefined(currentResourceRequest.scope)) {
                    WL.AuthorizationManager.__cacheScopeByResource(transport, currentResourceRequest.scope);
                    resendRequest(++attempt, conflictAttemptCounter);
                }
            } else if (WL.AuthorizationManager.__isInvalidToken(transport)) {
                WL.AuthorizationManager.clearAccessToken({
                    scope: currentResourceRequest.scope
                });
                resendRequest(++attempt, conflictAttemptCounter);
            } else {
                // We got 401 we need cache the resource to empty scope so that next time the request will be sent with default access token.
                WL.AuthorizationManager.__cacheScopeByResource(transport, '');
                resendRequest(++attempt, conflictAttemptCounter);
            }
        };

        var resendRequest = function (attemptNumber, conflictAttemptCounterNumber) {
            sendRequestAsync(contentString, attemptNumber, conflictAttemptCounterNumber).then(
                function (response) {
                    dfd.resolve(response);
                },
                function (error) {
                    dfd.reject(error);
                });
        };

        if (typeof (WL.AuthorizationManager) !== 'undefined') {
            // If user provided scope for this resource use it, else get scope from cache.
            if (!WL.Validators.isNullOrUndefined(currentResourceRequest.scope)) {
                obtainAccessTokenAndSendRequest(currentResourceRequest.scope);
            } else {
                var cachedScope = WL.AuthorizationManager.__getCachedScopeByResource(xhr);
                currentResourceRequest.scope = cachedScope;
                obtainAccessTokenAndSendRequest(cachedScope);
            }
        } else {
            sendRequest();
        }
        /*jshint latedef:false*/
        function obtainAccessTokenAndSendRequest(scope) {
            if (!WL.Validators.isNullOrUndefined(scope)) {
                WL.AuthorizationManager.obtainAccessToken(scope).then(
                    function (accessToken) {
                        // Send request with accessToken as authorization header.
                        if (!WL.Validators.isNullOrUndefined(accessToken)) {
                            xhr.setRequestHeader(WL.AuthorizationManager.WL_AUTHORIZATION_HEADER, accessToken.asAuthorizationRequestHeader);
                        }
                        sendRequest();
                    },
                    function (error) {
                        if (error.status === 500) {
                            // if error status is 500 then it is necessary to delete resource to scope mapping.
                            // Because the scope mapping for this resource might have changed.
                            WL.AuthorizationManager.__deleteCachedScopeByResource(xhr);
                                    // Unable to retrieve accessToken, fail the request; the failure will be propagated up the chain
                                    currentResourceRequest.scope = null;
                                    dfd.reject(error);
                        } else {
                            dfd.reject(error);
                        }
                    });
            } else {
                sendRequest();
            }
        }
        /*jshint latedef:false*/
        function sendRequest() {
            xhr.send(method === 'GET' ? null : contentString, true);
        }

        return dfd.promise();
    }

    function buildRequestUrl() {
        if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
            return url;
        } else {
            var serverUrl = WL.Config.__getBaseURL();
            return __buildUrl(serverUrl);
        }

        function __buildUrl(serverUrl) {
            if (serverUrl[serverUrl.length - 1] !== '/' && url[0] !== '/') {
                serverUrl += '/';
            } else if (serverUrl[serverUrl.length - 1] === '/' && url[0] === '/') {
                serverUrl = serverUrl.substring(0, serverUrl.length - 1);
            }
            return serverUrl + url;
        }
    }

    function addRequestHeaders(xhr) {
        for (var headerName in headers) {
            if (true) { // thanks jshint
                var headerValue = headers[headerName];
                if (isSimpleType(headerValue)) {
                    xhr.setRequestHeader(headerName, headerValue.toString());
                } else {
                    var commaSeparatedHeader = headerValue[0];
                    /*jshint maxdepth:4*/
                    for (var i = 1; i < headerValue.length; i++) {
                        commaSeparatedHeader += ', ' + headerValue[i];
                    }
                    xhr.setRequestHeader(headerName, commaSeparatedHeader);
                }
            }
        }
    }

    function buildQueryString() {
        if (queryParameters === null || typeof (queryParameters) === 'undefined' || WLJQ.isEmptyObject(queryParameters)) {
            return null;
        }

        var queryString = '';
        for (var paramKey in queryParameters) {
            if (true) { // thanks jshint
                var values = queryParameters[paramKey];
                if (values === null || typeof (values) === 'undefined' || values.length === 0) {
                    queryString += '&' + paramKey;
                } else {
                    /*jshint maxdepth:6*/
                    for (var i = 0; i < values.length; i++) {
                        var paramValue = isSimpleType(values[i]) ? values[i] : JSON.stringify(values[i]);
                        if (paramValue === null || typeof (paramValue) === 'undefined') {
                            queryString += '&' + paramKey;
                        } else {
                            queryString += '&' + paramKey + '=' + encodeURIComponent(paramValue);
                        }
                    }
                }
            }
        }

        return queryString.substr(1);
    }

    function isSimpleType(value) {
        return (WL.Validators.isString(value) || WL.Validators.isNumber(value) || WL.Validators.isBoolean(value));
    }

    function isArrayOfSimpleTypes(object) {
        for (var i = 0; i < object.length; i++) {
            if (!isSimpleType(object[i])) {
                return false;
            }
        }
        return true;
    }
}

WL.ResourceRequest.GET = 'GET';
WL.ResourceRequest.POST = 'POST';
WL.ResourceRequest.PUT = 'PUT';
WL.ResourceRequest.DELETE = 'DELETE';
WL.ResourceRequest.HEAD = 'HEAD';
WL.ResourceRequest.OPTIONS = 'OPTIONS';
WL.ResourceRequest.TRACE = 'TRACE';
WL.ResourceRequest.CONNECT = 'CONNECT';

/**
 * ================================================================= 
 * Source file taken from :: clockSyncChallengeHandler.web.js
 * ================================================================= 
 */

/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2016 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

var clockSyncChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("clockSynchronization");

clockSyncChallengeHandler.handleSuccess = function(identity) {
	var date = new Date();
	WL.Config.__setServerRelativeTime(identity.serverTimeStamp - date.getTime());
};


/**
 * ================================================================= 
 * Source file taken from :: remoteDisableChallengeHandler.web.js
 * ================================================================= 
 */

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

var wl_remoteDisableChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("wl_remoteDisableRealm");

wl_remoteDisableChallengeHandler.handleChallenge = function(obj) {

	// get new message params
	var message = obj.message;
    var messageId = obj.messageId;
    var messageType = obj.messageType;

    // get value of previously stored message id
	var storedMessageId = WL.LocalStorageDB.getItem(WL.Client.getMessageID());

	var challengeAnswer = { messageId : messageId };

	if (isDisplayMessageDialogue(storedMessageId, messageId, messageType)) {
        addRemoteDisableHTML();

        setDirectionToRemoteDisableMsg();

        document.getElementById('remoteDisableHeaderId').innerHTML = WL.ClientMessages.notificationTitle;
        document.getElementById('remoteDisableTextId').innerHTML = message;

        var remoteDisableModal = document.getElementById('remoteDisableModalId');
        remoteDisableModal.style.display = 'block';

        var remoteDisableCloseBtn = document.getElementById('remoteDisableCloseBtnId');
        remoteDisableCloseBtn.onclick = function() {
           remoteDisableModal.style.display = "none";
           wl_remoteDisableChallengeHandler.submitChallengeAnswer(challengeAnswer);
        }
		// keep the message id in the local storage
		WL.LocalStorageDB.setItem(WL.Client.getMessageID(), messageId);
	} else {
		// don't show dialogue
		wl_remoteDisableChallengeHandler.submitChallengeAnswer(challengeAnswer);
	}

};


/**
 * determine whether or not to display message dialogue
 * @param storedMessageId
 * @param messageId
 * @param messageType
 * @returns {Boolean}
 */
function isDisplayMessageDialogue(storedMessageId,messageId, messageType)
{
	// restrictions apply only to notify messages
	if (messageType != "NOTIFY") {
		return true;
	}
	// display only new messages - the first time they are received
	if (typeof storedMessageId == "undefined" || storedMessageId != messageId) {
		return true;
	} else {
		return false;
	}
}

function getEnv() {
    return WL.StaticAppProps.ENVIRONMENT;
}

wl_remoteDisableChallengeHandler.handleFailure = function(err) {
	var message;

	if (typeof err == "undefined" || err == null)
	{
		message = "unknown error occurred."
	    WL.Logger.debug(">>> wl_remoteDisableChallengeHandler.handleFailure invoked with a missing err argument");
	}
	else if(err.message) {
    	message = err.message;
    } else if (err.reason) {
    	message = err.reason;
    } else {
    	WL.Logger.debug(">>> wl_remoteDisableChallengeHandler.handleFailure invoked with unexpected err format: " + JSON.stringify(err, null, 4));
    	message = "unknown error occurred."
    };
    var downloadLink = err.downloadLink;

    /*
     * Processor default handler for failure (display message and close App).
     */
    function defaultRemoteDisableDenialHandler(that, msg, downloadLink) {

        addRemoteDisableHTML();

        setDirectionToRemoteDisableMsg();

        document.getElementById('remoteDisableHeaderId').innerHTML = WL.ClientMessages.applicationDenied;
        document.getElementById('remoteDisableTextId').innerHTML = msg;

        var remoteDisableRedirectBtn = document.getElementById('remoteDisableRedirectBtnId');

        if (downloadLink) {
            //make button visible
            remoteDisableRedirectBtn.style.display = 'block';
            remoteDisableRedirectBtn.onclick = function() {
                WL.App.__openURL(downloadLink, '_new', null);
            }
        } else {
            remoteDisableRedirectBtn.style.display = 'none';
        }

        //make remoteDisableModal visible
        var remoteDisableModal = document.getElementById('remoteDisableModalId');
        remoteDisableModal.style.display = 'block';

        var remoteDisableCloseBtn = document.getElementById('remoteDisableCloseBtnId');
        remoteDisableCloseBtn.onclick = function() {
           remoteDisableModal.style.display = "none";
        }

    }

    WL.Client.__handleOnRemoteDisableDenial(defaultRemoteDisableDenialHandler, this, message, downloadLink);
};

var addRemoteDisableHTML = (function () {
    var isHtmlAlreadyAdded = false;

    return function () {
        if (!isHtmlAlreadyAdded) {
            isHtmlAlreadyAdded = true;
            var remoteDisableModel = document.createElement('div');
            remoteDisableModel.className = 'remoteDisableModalClass';
            remoteDisableModel.id = 'remoteDisableModalId';
            remoteDisableModel.innerHTML = ''
                + '<div class="remoteDisableHeaderContent">'
                +   '<h2 id="remoteDisableHeaderId" class="remoteDisableHeader"></h2>'
                +   '<div>'
                +       '<p id=remoteDisableTextId class="remoteDisableText"></p>'
                +   '</div>'
                +   '<div class=removeDisableButtons>'
                +       '<button id="remoteDisableCloseBtnId" class="closeBtn">' + WL.ClientMessages.close + '</button>'
                +       '<button id="remoteDisableRedirectBtnId" class="remoteDisableRedirectBtn">' + (WL.ClientMessages.redirect ? WL.ClientMessages.redirect : 'Redirect') + '</button>'
                +   '</div>'
                + '</div>';

            var remoteDisableCss = document.createElement('style');
            remoteDisableCss.innerHTML = ''
                + '.remoteDisableModalClass {'
                +   'display: none; /* Hidden by default */'
                +   'position: fixed; /* Stay in place */'
                +   'z-index: 1; /* Sit on top */'
                +   'padding-top: 100px; /* Location of the box */'
                +   'left: 0;'
                +   'top: 0;'
                +   'width: 100%; /* Full width */'
                +   'height: 100%; /* Full height */'
                +   'overflow: auto; /* Enable scroll if needed */'
                +   'background-color: rgb(0,0,0); /* Fallback color */'
                +   'background-color: rgba(0,0,0,0.4); /* Black w/ opacity */'
                + '}'

                + '.remoteDisableHeaderContent {'
                +   'background-color: #fefefe;'
                +   'margin: auto;'
                +   'padding: 20px;'
                +   'border: 1px solid #888;'
                +   'width: 70%;'
                +   'min-width: 40%;'
                + '}'

                + '.remoteDisableHeader {'
                +   'margin: 0 0 5px 0;'
                + '}'

                + '.remoteDisableText {'
                +   'margin: 0;'
                +   'word-wrap: break-word;'
                + '}'

                + '.removeDisableButtons {'
                +   'margin: 15px 0 33px 0;'
                +   'font-family: sans-serif'
                + '}'

                + '.closeBtn {'
                +   'float: right;'
                +   'font-size: 15px;'
                + '}'

                + '.remoteDisableRedirectBtn {'
                +   'display: none;'
                +   'float: left;'
                +   'font-size: 15px;'
                + '}'

                + '.remoteDisableRedirectBtn:hover {'
                +   'background-color: #555555;'
                +   'color: white;'
                +   'cursor: pointer;'
                + '}'

                + '.closeBtn:hover {'
                +   'background-color: #555555;'
                +   'color: white;'
                +   'cursor: pointer;'
                + '}';

            document.getElementsByTagName('head')[0].appendChild(remoteDisableCss);

            document.body.appendChild(remoteDisableModel);
        }
    }
})();

var setDirectionToRemoteDisableMsg = function() {
    var langDirection = WL.Utils.getLanguageDirectionality(WL.ClientMessages.lang);

        if (langDirection === WL.Language.DIRECTION_RTL) {
            document.getElementById('remoteDisableModalId').dir = 'rtl';
        }
}


/**
 * ================================================================= 
 * Source file taken from :: wlgap.web.js
 * ================================================================= 
 */

/**
 * Created by orep on 4/12/16.
 */
//TODO

/**
 * ================================================================= 
 * Source file taken from :: wlcertmanager.js
 * ================================================================= 
 */

/*
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

WL.CertManager = (function () {
    /*jshint strict:false, maxparams:4*/

    var KEYPAIR_OAUTH_ID = 'com.mfp.oauth.keypair';

    // Map of keypairId -> keypair generated by WL.Crypto.generateKeyPair
    var keyPairMapping = {};

    /**
     * Generate keypair(private+public) and save it in indexDB and in memory.
     */
    var generateKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        keyPairId = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;
        WL.Crypto.generateKeyPair().then(
            function (keyPair) {
                keyPairMapping[keyPairId] = keyPair;
                WL.IndexDB.saveOrUpdateKeyPair(keyPairId, keyPair).then(
                    function () {
                        dfd.resolve(keyPair);
                    },
                    function (error) {
                        WL.Logger.error('Failed to save keypair in indexDB ' + JSON.stringify(error));
                        dfd.reject(error);
                    });
            },
            function (error) {
                dfd.reject(error);
            });

        return dfd.promise();
    };

    var getOrCreateKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        var keyForDB = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;
        if (keyPairMapping.hasOwnProperty(keyPairId) && !WL.Validators.isNullOrUndefined(keyPairMapping[keyPairId])) {
            dfd.resolve(keyPairMapping[keyPairId]);
        } else {
            WL.IndexDB.getKeyPair(keyForDB).then(
                function (keyPair) {
                    if (!WL.Validators.isNullOrUndefined(keyPair)) {
                        dfd.resolve(keyPair);
                    } else {
                        generateKeyPair(keyPairId).then(
                            function (keyPair) {
                                dfd.resolve(keyPair)
                            },
                            function (error) {
                                dfd.reject(error);
                            });
                    }
                },
                // failed to read from DB
                function (error) {
                    dfd.reject(error)
                });
        }

        return dfd.promise();
    };

    var deleteKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        var keyForDB = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;

        if (keyPairMapping.hasOwnProperty(keyForDB)) {
            keyPairMapping.keyPairId = null;
        }
        WL.IndexDB.removeKeyPair(keyForDB).then(
            function () {
                dfd.resolve();
            },
            function (error) {
                dfd.reject(error);
            });
        return dfd.promise();
    };
    /**
     *
     * @param payload - payload to sign
     * @param options - optional json object, {"kid": client_id, "keyPairId" : idForKeyPair}
     */
    var signJWS = function (payload, options) {
        var optionParams = WL.Validators.isNullOrUndefined(options) ? {} : options;
        var dfd = WLJQ.Deferred();

        var kid = optionParams.kid;
        var keyPairId = !WL.Validators.isNullOrUndefined(optionParams.keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;

        getOrCreateKeyPair(keyPairId).then(
            function (keyPair) {
                WL.Crypto.signJWS(payload, kid, keyPair).then(
                    function (jws) {
                        dfd.resolve(jws);
                    },
                    function (error) {
                        dfd.reject(error);
                    });
            },
            function (error) {
                dfd.reject(error);
            });

        return dfd.promise();
    };

    return {
        signJWS: signJWS,
        deleteKeyPair: deleteKeyPair,
        getOrCreateKeyPair: getOrCreateKeyPair
    };

}());

    // Exposing WLResourceRequest and WLAuthorizationManager to the global name space is for backward compatibility and for consistency to hybrid client
    window.WLResourceRequest = WL.ResourceRequest;
    window.WLAuthorizationManager = WL.AuthorizationManager;
	WL.Logger = wlanalytics.logger;
    return WL;
}));
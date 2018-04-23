/**
 * Create by yale. 2018-4-23 
 */
(function(window) {

    function EasyJSBridge() {

    }
    var log = function(text) {
        console.log("EasyJSBridge: " + text);
    };

    var injectObj = function() {

        if (arguments.length < 2) {
            return;
        }

        var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
        var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

        var androidObjName = "";
        var iOSObjName = "";


        var find = function(arr, e) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === e) {
                    return true;
                }
            }
            return false;
        };



        var getRealArags = function(args) {

            var android = [];
            var ios = [];
            for (var i = 0; i < args.length; i++) {

                if (args[i] instanceof Array) {
                    ios = args[i];
                    break;

                } else {
                    android.push(args[i]);
                }

            }
            if (ios.length === 0) {
                return args;
            }
            if (isAndroid) {
                return android;
            }
            if (isiOS) {
                return ios;
            }
            return args;
        };


        var callBack = function(m) {
            return function() {

                var args = Array.prototype.slice.apply(arguments);

                if (isAndroid) {
                    if (typeof window[androidObjName] != 'undefined') {

                        if (typeof typeof window[androidObjName][m] != 'undefined') {
                            window[androidObjName][m].apply(window[androidObjName], getRealArags(args));
                        } else {
                            log("android webview do not define method " + m);
                        }
                    } else {
                        log("android webview do not define obj " + androidObjName);
                    }

                    return;
                }
                if (isiOS) {

                    if (iOSObjName != "") {
                        if (typeof window.webkit != 'undefined' && typeof window.webkit.messageHandlers[iOSObjName] != 'undefined') {
                            var o1 = window.webkit.messageHandlers[iOSObjName];
                            o1.postMessage({ method: m, parameter: getRealArags(args) });
                        } else {
                            log("ios webview do not define object " + iOSObjName);
                        }

                    } else {
                        if (typeof window.webkit != 'undefined' && typeof window.webkit.messageHandlers[m] != 'undefined') {
                            var o2 = window.webkit.messageHandlers[m];
                            o2.postMessage.apply(o2, getRealArags(args));
                        } else {
                            log("ios webview do not define object " + m);
                        }
                    }
                    return;
                }

                log("call in moblie webview");
            };
        };

        var _this = this;

        var addMethods = function(ms) {

            for (var i = 0; i < ms.length; i++) {
                _this[ms[i]] = callBack(ms[i]);
            }
            if (isAndroid && typeof window[androidObjName] != 'undefined') {

                var find = function(arr, e) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] === e) {
                            return true;
                        }
                    }
                    return false;
                };

                for (var j in window[androidObjName]) {
                    if (!find(ms, j)) {
                        _this[j] = callBack(j);
                    }
                }
            }
        };
        if (arguments.length === 2) {

            androidObjName = arguments[0];
            if (arguments[1] instanceof Array) {
                addMethods(arguments[1]);
                return;
            }

        } else if (arguments.length === 3) {
            androidObjName = arguments[0];
            iOSObjName = arguments[1];
            if (arguments[2] instanceof Array) {
                addMethods(arguments[2]);
                return;
            }
        }

        log("parameters error!");

    };
    EasyJSBridge.create = function() {
        var easy = new EasyJSBridge();
        injectObj.apply(easy, arguments);
        return easy;
    };
    window.EasyJSBridge = EasyJSBridge;
})(window);
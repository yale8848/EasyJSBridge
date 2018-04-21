;
(function(window) {

    //1.window.webkit.messageHandlers.obj.postMessage({method:'m1',parameter:['','']})
    //2.window.webkit.messageHandlers.method1.postMessage('','')

    function EasyJSBridge() {


    }
    EasyJSBridge.prototype.inject = function() {
        if (arguments.length < 2) {
            return this;
        }
        if (arguments.length === 2) {

            var o1 = arguments[0];
            if (arguments[1] instanceof Array) {
                this.injectAndroid(o1);
                this.injectiOS(arguments[1]);
            }

        } else if (arguments.length === 3) {
            var o2 = arguments[0];
            var o3 = arguments[1];
            if (arguments[2] instanceof Array) {
                this.injectAndroid(o2);
                this.injectiOS(o3, arguments[2]);
            }
        }

        return this;
    };
    EasyJSBridge.prototype.injectAndroid = function() {
        var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;

        if (!isAndroid) {
            return this;
        }
        if (arguments.length === 0) {
            return this;
        }
        var f = function(o, m) {

            return function() {
                window[o][m].apply(window[o], arguments);
            };
        };
        for (var i = 0; i < arguments.length; i++) {
            if (typeof window[arguments[i]] != 'undefined') {
                for (var j in window[arguments[i]]) {
                    this[j] = f(arguments[i], j);
                }
            }
        }

        return this;
    };
    EasyJSBridge.prototype.injectiOS = function(o, m) {
        var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (!isiOS) {
            return this;
        }
        if (typeof o === 'string') {
            if (typeof m != 'undefined' && m instanceof Array) {
                var f = function(o, m) {
                    return function() {
                        window.webkit.messageHandlers[o].postMessage({ method: m, parameter: Array.prototype.slice.apply(arguments) });
                    };

                };
                for (var i = 0; i < m.length; i++) {
                    this[m[i]] = f(o, m[i]);
                }
            }

        } else if (o instanceof Array) {

            var fa = function(o) {
                return function() {
                    window.webkit.messageHandlers[o].postMessage.apply(window.webkit.messageHandlers[o], arguments);
                };

            };
            for (var j = 0; j < o.length; j++) {
                this[o[j]] = fa(o[j]);
            }
        }
        return this;
    };
    window.EasyJSBridge = new EasyJSBridge();
})(window);
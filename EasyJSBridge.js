(function(window) {

    function EasyJSBridge() {


    }

    var injectAndroid = function(n,ms) {
        //var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;

        //if (!isAndroid) {
        //    return this;
        //}
        var f = function(o, m) {
            return function() {
                if(typeof o[m] != 'undefined' ){
                    o[m].apply(o, arguments);
                }else{
                    console.log("EasyJSBridge: android webview do not define method: "+m);
                }
            };
        };
       var find=function(arr,e){
           for(var i=0;i<arr.length;i++){
               if(arr[i]===e){
                  return true;
               }
           }
           return false;
       };
        if (typeof window[n] != 'undefined') {
            var ps = Object.getOwnPropertyNames(window[n]);
            for(var i=0;i<ms.length;i++){
                if(!find(ps,ms[i])){
                    ps.push(ms[i]);
                }
            }
            var _this =this;
            ps.forEach(function(item,index){
                _this[item] = f(window[n], item);
            });
        }
        return this;
    };
    var injectiOS = function(o, m) {
       // var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
       // if (!isiOS) {
       //     return this;
       // }
      
        if (typeof o === 'string') {
            if (typeof m != 'undefined' && m instanceof Array) {
                var f = function(o, m) {
                    return function() {
                        if(typeof window.webkit != 'undefined' &&
                        typeof window.webkit.messageHandlers[o] != 'undefined'){
                            window.webkit.messageHandlers[o].postMessage({ method: m, parameter: Array.prototype.slice.apply(arguments) });
                        }else{
                            console.log("EasyJSBridge: ios webview do not define messageHandlers: "+o);
                        }
                        
                    };

                };
                for (var i = 0; i < m.length; i++) {
                    this[m[i]] = f(o, m[i]);
                }
            }

        } else if (o instanceof Array) {

            var fa = function(o) {
                return function() {
                    if(typeof window.webkit != 'undefined' &&
                         typeof window.webkit.messageHandlers[o] != 'undefined'){
                        window.webkit.messageHandlers[o].postMessage.apply(window.webkit.messageHandlers[o], arguments);
                    }else{
                        console.log("EasyJSBridge: ios webview do not define messageHandlers: "+o);
                    }
                   
                };
            };
            for (var j = 0; j < o.length; j++) {
                this[o[j]] = fa(o[j]);
            }
        }
        return this;
    };
    EasyJSBridge.prototype.inject = function() {
        if (arguments.length < 2) {
            return this;
        }
        if (arguments.length === 2) {

            var o1 = arguments[0];
            if (arguments[1] instanceof Array) {
                injectAndroid.call(this,o1,arguments[1] );
                injectiOS.call(this,arguments[1]);
            }

        } else if (arguments.length === 3) {
            var o2 = arguments[0];
            var o3 = arguments[1];
            if (arguments[2] instanceof Array) {
                injectAndroid.call(this,o2,arguments[2]);
                injectiOS.call(this,o3, arguments[2]);
            }
        }
        return this;
    };
    EasyJSBridge.create =function(){
        var easy =  new EasyJSBridge();
        easy.inject.apply(easy,arguments);
        return easy;
    };
    window.EasyJSBridge = EasyJSBridge;
})(window);
# EasyJSBridge

EasyJSBridge让Android/iOS WebView JS 反调接口统一，调用更容易；

## JS调用

```

<script type="text/javascript" src="EasyJSBridge.js"></script>

<script type="text/javascript">

//init
var easyJSBridge = EasyJSBridge.create("androidObj",["method1","method2"]);
//or
var easyJSBridge = EasyJSBridge.create("androidObj","iOSObj",["method1","method2"]);

//Android,iOS调用一致
easyJSBridge.method1("arg1","arg2");
easyJSBridge.method2("arg1","arg2")

</script>


```

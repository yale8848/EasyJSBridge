# EasyJSBridge

EasyJSBridge让Android/iOS WebView JS 反调接口统一，调用更容易；

## JS调用

```

<script type="text/javascript" src="EasyJSBridge.js"></script>

<script type="text/javascript">

//init
EasyJSBridge.inject("androidObj",["method1","method2"]);
//or
EasyJSBridge.inject("androidObj","iOSObj",["method1","method2"]);

//Android,iOS调用一致
EasyJSBridge.method1("arg1","arg2")

</script>


```

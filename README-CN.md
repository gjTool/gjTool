# gjTool

[![Build Status](https://travis-ci.org/gjTool/gjTool.svg?branch=master)](https://travis-ci.org/gjTool/gjTool)
[![npm version](https://img.shields.io/npm/v/gjtool.svg)](https://www.npmjs.com/package/gjtool)
[![npm downloads](https://img.shields.io/npm/dt/gjtool.svg)](https://www.npmjs.com/package/gjtool)

gjTool.js是一个js个人类库，模仿jQuery的链式调用，API用法和jQuery的差不多，相当于简版JQ。

作者：GaoJin  邮箱: 861366490@qq.com

## 语言


- [English](README.md)

- [中文](README-CN.md)

### 安装
```

npm install gjtool

```

### 引用方式
```

import gjTool from "gjtool";  //var gjTool = require("gjtool");
```

```
<script type="text/javascript" src="gjtool.js"></script>

```

### 使用
```

对外暴露的全局变量是gjTool、Gj。
gjTool("#test").hide();//Gj("#test").hide(500);

```

### API接口方法
[API文档地址](https://gjtool.github.io/gjToolAPI/)


```

选择器：
 
ID选择器、类选择器、标签选择器、通配符、群组选择器、后代选择器、属性选择器、html字符串、eq、first、last、even、odd、lt、le、gt、ge、not
例如：'#nav'、 '.subNav '、'div '、'div.test' 、'.div.abc'  、 'input[type=button]'、
'.div .ul li , #div'、  '.div ul .li'、 '.div ul li:eq(0)'、 '.div ul li:first'、'.div ul li:odd'、 '.div ul li:not(:eq(0))'

遍历：

each、map、find、 eq 、index 、parent、parents、siblings、prev、next、first、last

class操作：

addClass 、removeClass、hasClass、toggleClass

css操作：

css、width、height、offset、scrollTop、scrollLeft

属性操作：

attr、removeAttr、prop、data、val、html、text、empty

DOM操作：

after、before、append、prepend、remove

动画：

animate、stop、show、hide、fadeIn、fadeOut、fadeTo、fadeToggle


事件：

on、off、hover、还有其他的普通事件、
文档加载完成：gjTool(function(){})、gjTool(document).ready(function(){});
例如：blur focus input load resize scroll unload click dblclick 等




ajax异步请求:（gjTool.ajax）

ajax、get、post、getJSON、getXML

常用工具、方法：（gjTool.each(arr,fn)）

extend、 each、map、browser、now、getTime、getdate、arrSort、cloneArr、cloneObj、extendArr、objSort、setCookie、getCookie、delCookie、encrypt、decrypt、unique、getVerify

插件：

拖拽元素： gjTool("#test").drag(); 禁止拖拽gjTool("#test").nodrag(),允许拖拽gjTool("#test").nodrag(false);

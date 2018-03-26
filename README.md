# gjTool

[![Build Status](https://travis-ci.org/gjTool/gjTool.svg?branch=master)](https://travis-ci.org/gjTool/gjTool)
[![npm version](https://img.shields.io/npm/v/gjtool.svg)](https://www.npmjs.com/package/gjtool)
[![npm downloads](https://img.shields.io/npm/dt/gjtool.svg)](https://www.npmjs.com/package/gjtool)


gjTool.js is a javascript class library (PC && Mobile). that mimics the chain call of jQuery, and the API usage is similar to jQuery, gjTool like a simple version of JQ.
Support extension plug-ins. gjTool.fn.extend、gjTool.extend.

Author: Gao Jin.[Mail: 861366490@qq.com](mailto:861366490@qq.com)

## Language


- [English](README.md)

- [中文](README-CN.md)

## gjTool Test

- [gjTool Test](https://gjtool.github.io/gjTool/index.html)

## Update information

- v1.1.6

- Disuse method drag().

- Add the touch module, the mobile end touch event:touchstart、touchmove、touchend、touchcancel、  tap、longTap、 doubleTap、 swipe、 swipeLeft、swipeRight、 swipeUp、 swipeDown. touch == on、untouch == off. Touch and untouch are only effective for touch events. Both on and off are available.  Add custom events and trigger.

- Now you can use $.Disuse Gj and keep gjTool.

- The new method, clone(), is used to clone elements.appendTo()，Insert element.

- The new attributes of the $.browser object,$.browser.pc、$.browser.phone、$.browser.tablet, the new attributes to determine whether the computer, the phone, the tablet.

- The method of optimizing and perfecting the DOM operation class，after、before、append、prepend. Repair the Css、Show、FadeIn method bug.


### How To Install
```

npm install gjtool

```

### Introduction
```

import gjTool from "gjtool";  //var gjTool = require("gjtool");
```

```
<script type="text/javascript" src="gjtool.js"></script>

```

### How To Use
```

The global variables of external exposure are gjTool, $.

gjTool("#test").hide();//$("#test").hide(500);

```

### API
[API document address](https://gjtool.github.io/gjToolAPI/)


```

Selector:

ID selector, class selector, label selector, wildcard
Group selector, descendant selector, attribute selector、eq、first、last、even、odd、lt、le、gt、ge、not.

For example: '#nav'、 '.subNav '、'div '、'div.test' 、'.div.abc'  、 'input[type=button]'、
'.div .ul li , #div'、  '.div ul .li'、 '.div ul li:eq(0)'、 '.div ul li:first'、'.div ul li:odd'、 '.div ul li:not(:eq(0))'

 li:last'.

Loop traversal: 

each, map、find、 eq 、index 、parent、parents、siblings、prev、next、first、last

Class operation:

addClass, removeClass, hasClass, toggleClass



CSS operation:

css,  width, height, offset, scrollTop, scrollLeft.



Property operation:

attr, removeAttr, prop, data, val, html, text，empty.



DOM operation:

after、before、append、prepend、remove、clone 、appendTo

Animation:

animate、stop、show、hide、fadeIn、fadeOut、fadeTo、fadeToggle


Event：

on、off、hover、trigger, and other common events，
The document is loaded:：gjTool(function(){})、gjTool(document).ready(function(){});

For example: blur focus input load resize scroll unload click dblclick …… and so on.

Touch:

touch、untouch、touchstart、 touchmove、 touchend、 touchcancel、 tap、 longTap、 doubleTap、 swipe、 swipeLeft、 swipeRight、 swipeUp、 swipeDown


Ajax asynchronous request: (gjTool.ajax)

ajax, get, post, getJSON, getXML.


Common tools, methods: (gjTool.each (arr, FN))

Such as:extend、 each、map、browser、now、getTime、getdate、arrSort、cloneArr、cloneObj、extendArr、objSort、setCookie、getCookie、delCookie、encrypt、decrypt、unique、getVerify


Plug-in unit：

Drag and drop elements: gjTool ("#test").drag (); prohibit drag and drop gjTool ("#test").nodrag (), and allow drag and drop gjTool ("#test").nodrag (false);

﻿# gjTool

gjTool.js is a javascript class library that mimics the chain call of jQuery, and the API usage is similar to jQuery, gjTool like a simple version of JQ.

The global variables of external exposure are gjTool, Gj, and if you want to use the $ symbol, you can start to define: var $ = gjTool;

Author: GaoJin. QQ: 861366490

Selector:

ID selector, class selector, label selector, wildcard
Group selector, descendant selector, attribute selector.

For example: '#nav'、 '.subNav '、'div '、'div.test' 、'.div.abc'  、 'input[type=button]'、
'.div .ul li , #div'、  '.div ul .li'、 '.div ul li:eq(0)'、 '.div ul li:first'、'.div ul li:odd'、 '.div ul li:not(:eq(0))'

 li:last'.

Class operation:

addClass, removeClass, hasClass, toggleClass,



CSS operation:

css, show, hide, toggle, width, height, offset, scrollTop, scrollLeft.



Property operation:

attr, removeAttr, prop, data, val, html, text.



DOM operation:

after、before、append、prepend

Animation:
animate、stop


Event：

on、off、bind、unbind、hover, and other common events,、
The document is loaded:：gjTool(function(){})、gjTool(document).ready(function(){});

For example: blur focus input load resize scroll unload click dblclick …… and so on.

Loop traversal: each, map、find、 eq 、index 、parent、parents、siblings、prev、next、first、last

Ajax asynchronous request: (gjTool.ajax)

ajax, get, post, getJSON, getXML.


Common tools, methods: (gjTool.each (arr, FN))

Such as: each、map、browser、now、getTime、getdate、arrSort、objSort、setCookie、getCookie、delCookie、encrypt、decrypt、unique、cloneObj、extendObj、getVerify


Plug-in unit：

Drag and drop elements: gjTool ("#test").drag (); prohibit drag and drop gjTool ("#test").nodrag (), and allow drag and drop gjTool ("#test").nodrag (false);
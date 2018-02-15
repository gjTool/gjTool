GjTool.js is a JS class library that mimics the chain call of jQuery, and the API usage is similar to jQuery, gjTool like a simple version of JQ.

The global variables of external exposure are gjTool, Gj, and if you want to use the $ symbol, you can start to define: var $ = gjTool;

Author: GaoJin. QQ: 305250069

Selector:

ID selector, class selector, label selector, wildcard
Group selector, descendant selector, attribute selector.

For example: '#nav','.subNav','div ','div.test','.div.abc','input[type=button]',
'.div .ul li, #div','.div ul .li','.div ul li:eq(0)','.div ul

 li:last'.

Class operation:

addClass, removeClass, hasClass, toggleClass,



CSS operation:

css, show, hide, toggle, width, height, offset, scrollTop, scrollLeft.



Property operation:

attr, removeAttr, prop, data, val, html, text.



DOM operation:

find¡¢ eq ¡¢index ¡¢parent¡¢parents¡¢siblings¡¢prev¡¢next¡¢first¡¢last¡¢after¡¢before¡¢append¡¢prepend

Animation:
animate¡¢stop


Event£º

on¡¢off¡¢bind¡¢unbind¡¢hover, and other common events,

For example: blur focus input load resize scroll unload click dblclick ¡­¡­ and so on.



Other classes:

Loop traversal: each, map
.
The document is loaded: gjTool (function () {}), gjTool (document).ready (function () {});



Ajax asynchronous request: (gjTool.ajax)

ajax, get, post, getJSON, getXML.



Common tools, methods: (gjTool.each (arr, FN))

Such as: each¡¢map¡¢browser¡¢now¡¢getTime¡¢getdate¡¢arrSort¡¢objSort¡¢setCookie¡¢getCookie¡¢delCookie¡¢encrypt¡¢decrypt¡¢unique¡¢cloneObj¡¢extendObj¡¢getVerify


Plug-in unit£º

Drag and drop elements: gjTool ("#test").drag (); prohibit drag and drop gjTool ("#test").nodrag (), and allow drag and drop gjTool ("#test").nodrag (false);
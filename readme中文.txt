gjTool.js是一个js个人类库，模仿jQuery的链式调用，API用法和jQuery的差不多，相当于简版JQ。
对外暴露的全局变量是gjTool、Gj，如果想用$符号，可以在开始定义var $ = gjTool;
作者：GaoJin  QQ: 861366490

选择器：
 
ID选择器、类选择器、标签选择器、通配符、群组选择器、后代选择器、属性选择器、html字符串
例如：'#nav'、 '.subNav '、'div '、'div.test' 、'.div.abc'  、 'input[type=button]'、
'.div .ul li , #div'、  '.div ul .li'、 '.div ul li:eq(0)'、 '.div ul li:first'、'.div ul li:odd'、 '.div ul li:not(:eq(0))'


class操作：
addClass 、removeClass、hasClass、toggleClass、

css操作：
css、toggle、width、height、offset、scrollTop、scrollLeft

属性操作：
attr、removeAttr、prop、data、val、html、text

DOM操作：
after、before、append、prepend

动画：
animate、stop、show、hide、fadeIn、fadeOut、fadeTo、fadeToggle

事件：
on、off、bind、unbind、hover、还有其他的普通事件、
文档加载完成：gjTool(function(){})、gjTool(document).ready(function(){});
例如：blur focus input load resize scroll unload click dblclick 等


遍历：
each、map、find、 eq 、index 、parent、parents、siblings、prev、next、first、last

ajax异步请求:（gjTool.ajax）
ajax、get、post、getJSON、getXML

常用工具、方法：（gjTool.each(arr,fn)）
extend、each、map、browser、now、getTime、getdate、arrSort、objSort、setCookie、getCookie、delCookie、encrypt、decrypt、unique、cloneObj、extendObj、getVerify

插件：
拖拽元素： gjTool("#test").drag(); 禁止拖拽gjTool("#test").nodrag(),允许拖拽gjTool("#test").nodrag(false);
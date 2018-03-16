/** 个人js类库gjTool.js（方法、插件集合）
 *  @version 1.1.2
 *  @author Gao Jin
 *  @update 2018/03/16 17:53
 */
;(function(g) {
	"use strict";
	if(g.console && g.console.info){
		console.info("gjTool.js v1.1.2. The latest version && API on GitHub:  https://github.com/gjTool/gjTool && http://gjTool.github.io/gjToolAPI")
	}
	//注册全局变量
	g.gjTool = G;

	g.$ === undefined && (g.$ = G);

	if(typeof module !== 'undefined' && module.exports) {
		module.exports = G
	}

	if(typeof define === 'function' && define.amd) {
		define(function() {
			return G
		})
	}
	//定义gjTool类
	function G(selector) {
		return new G.fn.gjTool(selector)
	}
	G.fn = G.prototype = {
		//gjTool基础库
		//选择器 selector gjTool实例 
		gjTool: function(selector) {
			if(G.isFunction(selector)) {
				this.selector = "document";
				return this.ready(selector)
			}
			if(G.isString(selector)) {
				return this.find(selector)
			} else if(selector && (G.isHTMLElement(selector) || selector.nodeType || G.isHTMLDocument(selector) || selector === g)) {
				if(G.isHTMLDocument(selector)) {
					this.selector = "document"
				}
				return this.toArray([selector])
			}
		},
		//toArray  返回元素集合 转化gjTool实例
		toArray: function(arr) {
			for(var i = 0, len = this.length; i < len; i++) {
				[].pop.apply(this)
			}
			this.length = 0;
			[].push.apply(this, arr);
			return this
		},
		//文档加载完成
		ready: function(fn) {
			if(this.selector == 'document') {
				G.public.DOMLoaded(fn)
			} else {
				throw new Error("DOMLoad ready function selector parameter invalid !")
			}
		},
		//根据选择器寻找元素
		find: function(selector) {
			var node = this[0] || document;
			//html字符串
			if(/^</.test(selector)) {
				return this.toArray(G.public.parseHtml(selector));
			} // div.test 、.div.abc
			else if(/[A-Za-z0-9]+\./.test(selector.trim()) && !/\s/.test(selector.trim()) && !/,/.test(selector.trim())) {
				return this.toArray(G.public.classSelector(selector))
			} // input[type=button]
			else if(/\w+\[\w+\=\w+\]/g.test(selector)) {
				var aStr = selector.split(/\[|\=|\]/g);
				var aRes = node.getElementsByTagName(aStr[0]);
				var result = [];
				G.each(aRes, function(i, ele) {
					if(ele.getAttribute(aStr[1]) == aStr[2]) {
						result.push(ele)
					}
				})
				return this.toArray(G.unique(result))
			} // .div:not() 
			else if(!/\s/.test(selector.trim()) && !/,/.test(selector.trim()) && /:/.test(selector.trim())) {
				return this.toArray(G.public.descendantSelector(node, selector));
			}
			//群组选择器或包含选择器或基本选择器
			else {
				return this.toArray(G.public.groupSelector(node, selector))
			}
		}
	};
	G.fn.gjTool.prototype = G.fn;

	//定义extend扩展方法，方便为gjTool扩展插件
	G.extend = G.fn.extend = function(obj) {
		var args = arguments;
		if(args.length < 2) {
			for(var k in obj) {
				this[k] = obj[k]
			}
			return
		} else {
			var temp = G.cloneObj(args[0]); //调用复制对象方法
			for(var n = 1, len = args.length; n < len; n++) {
				for(var i in args[n]) {
					temp[i] = args[n][i]
				}
			}
			return temp
		}
	};
	if(typeof window === 'undefined'){
		return;
	}
	//封装getElementsByClassName
	if(g.document && !g.document.getElementsByClassName) {
		g.document.getElementsByClassName = function(className, element) {
			var children = (element || document).getElementsByTagName('*');
			var elements = [];
			for(var i = 0, len = children.length; i < len; i++) {
				var classNames = children[i].className.split(' ');
				for(var j = 0; j < classNames.length; j++) {
					if(classNames[j] == className) {
						elements.push(children[i]);
						break
					}
				}
			}
			return elements
		}
	}
	//封装trim 字符串去前后空格 
	if(!g.String.prototype.trim) {
		g.String.prototype.trim = function() {
			return this.replace(/(^\s*)|(\s*$)/g, "")
		}
	}

	//封装indexOf 字符串查找下标 
	if(!g.String.prototype.indexOf) {
		g.String.prototype.indexOf = function(value) {
			var arr = new RegExp(value).exec(this);
			return arr ? arr.index : -1
		}
	}
	//封装indexOf 数组查找索引 
	if(!g.Array.prototype.indexOf) {
		g.Array.prototype.indexOf = function(n) {
			for(var i = 0, len = this.length; i < len; i++) {
				if(n === this[i]) {
					return i
				}
			}
			return -1
		}
	}
	//内部基础公用方法、属性
	G.public = {
		//判断文档加载完成后
		DOMLoaded: function(fn){
			var sys = G.public.getBrowser();
			var isReady = false;
			var timer = null;
			if(document.addEventListener) {
				G.public.addEvent(document, 'DOMContentLoaded', function fn2() {
					fn();
					G.public.removeEvent(document, 'DOMContentLoaded', fn2)
				})
			} else if(document.attachEvent) {
				G.public.addEvent(document, 'readystatechange', function fn2() {
					if(document.readyState == "complete") {
						fn();
						G.public.removeEvent(document, 'readystatechange', fn2)
					}
				})
			} else if(sys.ie && sys.ie < 9) {
				timer = setInterval(function() {
					try {
						document.documentElement.doScroll('left');
					} catch(error) {};
					doReady()
				}, 1)
			} else if((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
				timer = setInterval(function() {
					if(document && document.getElementById && document.getElementsByTagName && document.body) {
						doReady()
					}
				}, 1)
			}
			//文档加载完成后执行fn
			function doReady() {
				if(timer) clearInterval(timer);
				if(isReady) return;
				isReady = true;
				fn()
			}
		},
		//获取浏览器版本
		getBrowser: function() {
			var userAgent = navigator.userAgent;

			var ua = userAgent.toLowerCase();
			var sys = {},
				s;
			(s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1]:
				(s = ua.match(/opr\/([\d.]+)/)) ? sys.opera = s[1] :
				(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
				(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
				(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
			if(/webkit/.test(ua)) {
				sys.webkit = ua.match(/webkit\/([\d.]+)/)[1]
			}
			sys.userAgent = ua;
			if(ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
				var android = /(?:android)/i.test(ua);
				if(ua.match(/(pad|iPad|Tablet|PlayBook)/i) || (android && !/(?:Mobile)/i.test(ua)) || (sys.firefox && /(?:Tablet)/i.test(ua))){
					sys.tablet = true;
				}else {
					sys.phone = true;
				}
			}else {
				sys.pc = true;
			}
			function IEVersion() {
				var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
				var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
				var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
				if(isIE) {
					var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
					reIE.test(userAgent);
					var fIEVersion = parseFloat(RegExp["$1"]);
					if(fIEVersion == 10) {
						return 10
					} else if(fIEVersion == 9) {
						return 9
					} else if(fIEVersion == 8) {
						return 8
					} else if(fIEVersion == 7) {
						return 7
					} else if(fIEVersion == 6) {
						return 6
					} else {
						return 5.5 //IE版本<=5.5
					}
				} else if(isEdge) {
					return 'edge' //edge
				} else if(isIE11) {
					return 11 //IE11  
				} else {
					return false
				}
			}
			if(IEVersion()) {
				sys.ie = IEVersion()
			}
			return sys
		},
		//选择器
		regSelector: /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/,
		//DOM其他事件
		eventsArr:
			("blur focus input focusin focusout load resize scroll unload click dblclick " +
				"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
				"change select submit keydown keypress keyup error contextmenu").split(' '),
		//变量类型
		is: function() {
			var is = {
				types: ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Undefined", "Null", "Function", "Window", "HTMLDocument", "Document", "XMLDocument"]
			};
			for(var i = 0, c; c = is.types[i++];) {
				is[c] = (function(type) {
					return function(obj) {
						return Object.prototype.toString.call(obj) == "[object " + type + "]";
					}
				})(c)
			}
			return is
		},
		regName: function(name) {
			return new RegExp('(^|\\s)' + name + '(\\s|$)')
		},
		///'alpha(opacity:' + name[i] * 100 + ')';
		getStyle: function(elem, styleName) {
			var str,index;
			if(g.getComputedStyle) {
				if(styleName == 'scrollTop' || styleName == 'scrollLeft') {
					return elem[styleName]
				}
				str = g.getComputedStyle(elem, false)[styleName];
			} else if(elem && elem.currentStyle) {
				str = elem.currentStyle[styleName];
				if(styleName == 'opacity' && elem.currentStyle['filter']) {
					str = elem.currentStyle['filter'];
					if(str.indexOf(':') != -1) {
						index = str.indexOf(':');
					} else if(str.indexOf('=') != -1) {
						index = str.indexOf('=');
					}
					str = str.substring(index + 1, str.length - 1) / 100;
					str = isNaN(str) ? 1 : str;
				}
				if(styleName == 'scrollTop' || styleName == 'scrollLeftl') {
					str = elem[styleName]
				}
			}
			if(str && (str == "auto" || str.toString().indexOf('%') != -1) && styleName == 'width') {
				str = elem.offsetWidth;
			}
			if(str && (str == "auto" || str.toString().indexOf('%') != -1) && styleName == "height") {
				str = elem.offsetHeight
			}
			return str
		},
		
		//鼠标按键
		getButton: function(e) {
			if(document.implementation.hasFeature("MouseEvents", "20")) {
				return e.button
			} else {
				switch(e.button) {
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0;
					case 2:
					case 6:
						return 2;
					case 4:
						return 1
				}
			}
		},
		//event事件对象封装
		event: function(event, type) {
			var e = g.event || event;
			var obj = {};
			obj.preventDefault = function() {
				return e.preventDefault ? e.preventDefault() : e.returnValue = false
			}
			obj.stopPropagation = function() {
				return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
			}
			obj.target = e.target || e.srcElement;
			obj.keyCode = e.keyCode || e.which || e.charCode;
			obj.type = type;
			obj.pageX = e.pageX;
			obj.pageY = e.pageY;
			obj.x = e.x;
			obj.y = e.y;
			obj.layerX = e.layerX;
			obj.layerY = e.layerY;
			obj.screenX = e.screenX;
			obj.screenY = e.screenY;
			obj.offsetX = e.offsetX;
			obj.offsetY = e.offsetY;
			obj.clientX = e.clientX;
			obj.clientY = e.clientY;
			obj.ctrlKey = e.ctrlKey;
			obj.altKey = e.altKey;
			obj.shiftKey = e.shiftKey;
			obj.button = G.public.getButton(e);
			obj.originalEvent = e;
			return obj
		},
		
		//添加事件监听
		addEvent: function(element, type, fn, useCapture) {
			if(element.addEventListener) {
				element.addEventListener(type, fn, useCapture)
			} else if(element.attachEvent) {
				element.attachEvent('on' + type, fn)
			}
		},
		//删除事件
		removeEvent: function(element, type, fn) {
			if(element.removeEventListener) {
				element.removeEventListener(type, fn, false)
			} else if(element.detachEvent) {
				element.detachEvent('on' + type, fn)
			}
		},
		//转换html
		parseHtml: function(html) {
			var div = document.createElement('div');
			div.innerHTML = html;
			var arr = div.children;
			var arr2 = [];
			if(arr && arr.length >= 1) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(G.isHTMLElement(arr[i])) {
						arr2.push(arr[i]);
					}
				}
			}
			return arr2
		},
		//群组选择器 逗号隔开
		groupSelector: function(node, selector) {
			var results = [];
			node = node || document;
			var selectors, i, subselector, arr;
			if(!G.isString(selector)) {
				return results
			}
			selectors = selector.split(',');
			G.each(selectors, function(i, ele) {
				subselector = ele.trim();
				//包含选择器
				if(/\s+/.test(subselector)) {
					arr = G.public.descendantSelector(node, subselector);
				} else if(/[A-Za-z0-9]+\./.test(subselector.trim()) && !/\s/.test(subselector.trim()) && !/,/.test(subselector.trim())) {
					arr = G.public.classSelector(subselector);

				} // input[type=button]
				else if(/\w+\[\w+\=\w+\]/g.test(subselector)) {
					var aStr = subselector.split(/\[|\=|\]/g);
					var aRes = node.getElementsByTagName(aStr[0]);
					var arr2 = [];
					G.each(aRes, function(i, ele) {
						if(ele.getAttribute(aStr[1]) == aStr[2]) {
							arr2.push(ele)
						}
					})
					arr = G.unique(arr2)
				} // .div:not() 
				else if(!/\s/.test(subselector.trim()) && !/,/.test(subselector.trim()) && /:/.test(subselector.trim())) {
					arr = G.public.descendantSelector(node, subselector);
				} else {
					// 基本选择器
					arr = G.public.basicSelector(node, subselector);

				}
				if(arr) {
					if(!arr.length) {
						results.push(arr)
					} else {
						for(var i = 0, len = arr.length; i < len; i++) {
							results.push(arr[i])
						}
					}
				}
			});

			return G.unique(results)
		},
		//包含选择器 空格隔开
		descendantSelector: function(node, selector) {
			node = node || document;
			var arr = selector.trim().split(/\s+/g);
			var aChild = [];
			var aParent = [node];
			for(var i = 0, len = arr.length; i < len; i++) {
				aChild = G.public.getByStr(aParent, arr[i]);
				aParent = aChild
			}
			return aChild
		},
		//基本选择器 （#、 . 、* 、标签）
		basicSelector: function(node, selector) {
			var m = G.public.regSelector.exec(selector);
			if(m[1]) { // id选择器
				return document.getElementById(m[1])
			} else if(m[2]) { // class选择器
				return document.getElementsByClassName(m[2], node)
			} else if(m[3]) { //通配符选择器
				return node.getElementsByTagName(m[3])
			} else if(m[4]) { //标签选择器
				return node.getElementsByTagName(m[4])
			}
		},
		//:not
		notSelector: function(node, selector, aParent, pname, arr) {
			var aChild = [];
			var aStr = selector.split(/\:|\(|\)/);
			var aStr2 = selector.split(/\(|\)/);
			if(aStr2[1].indexOf(":") != -1) {
				var n = aStr[4],
					aRes;
				if(node) {
					aRes = aParent.getElementsByTagName(node)
				} else {
					aRes = arr
				}
				var len = aRes.length;
				n = parseInt(n);
				switch(aStr[3]) {
					case 'eq':
						for(var j = 0; j < len; j++) {
							if(j != n) {
								aChild.push(aRes[j])
							}
						}
						break;
					case 'lt':
						for(var j = n; j < len; j++) {
							aChild.push(aRes[j])
						}

						break;
					case 'le':
						n = parseInt(n) + 1;
						for(var j = n; j < len; j++) {
							aChild.push(aRes[j])
						}
						break;
					case 'gt':
						for(var j = 0; j <= n; j++) {
							aChild.push(aRes[j])
						}
						break;
					case 'ge':
						for(var j = 0; j < n; j++) {
							aChild.push(aRes[j])
						}
						break;
					case 'even':
						for(var j = 1; j < len; j += 2) {
							aChild.push(aRes[j])
						}

						break;
					case 'odd':
						for(var j = 0; j < len; j += 2) {
							aChild.push(aRes[j])
						}
						break;
					case 'first':
						for(var j = 0; j < n; j++) {
							if(j != 0) {
								aChild.push(aRes[j])
							}
						}
						break;
					case 'last':
						for(var j = 0; j < n; j++) {
							if(j != (n - 1)) {
								aChild.push(aRes[j])
							}
						}
						break;
				}
			} else {
				if(node) {
					var ele = G.public.basicSelector(aParent, aStr2[1]);
					var children = aParent.children
				} else {
					var children = arr
				}
				var m = G.public.regSelector.exec(aStr2[1]);
				if(m[1]) { // id选择器
					for(var i = 0, len = children.length; i < len; i++) {
						if(children[i].id != aStr2[1].replace("#", "")) {
							aChild.push(children[i])
						}
					}
				} else if(m[2]) { // class选择器
					for(var i = 0, len = children.length; i < len; i++) {
						if(!G.public.regName(aStr2[1].replace(".", "")).test(children[i].className)) {
							aChild.push(children[i])
						}
					}
				} else if(m[4]) { //标签选择器
					for(var i = 0, len = children.length; i < len; i++) {
						if(children[i].tagName.toLowerCase() != aStr2[1]) {
							aChild.push(children[i])
						}
					}
				}
			}
			return G.unique(aChild);
		},
		//进行选择器的操作
		getByStr: function(aParent, selector) {
			var aChild = [];
			for(var i = 0, len = aParent.length; i < len; i++) {
				if(aParent[i]) {
					switch(selector.charAt(0)) {
						//id选择器   #box  
						case '#':
							var obj = document.getElementById(selector.substring(1));
							aChild.push(obj);
							break;
							//类选择器 .box  
						case '.':
							if(selector.indexOf(":") != -1) {
								var index = selector.indexOf(":");
								var aStr = selector.substring(1, index);
								var aStr2 = selector.substring(index, selector.length);
								var aRes = document.getElementsByClassName(aStr, aParent[i]);
								var arr = G.public.isnotSelector(aStr2, aRes, aChild, aParent[i], selector);
								G.each(arr, function(i, ele) {
									aChild.push(ele)
								})
							} else {
								var aRes = document.getElementsByClassName(selector.substring(1), aParent[i]);
								G.each(aRes, function(i, ele) {
									aChild.push(ele)
								})
							}
							break;
						default:
							// li.red  
							if(/\w+\.\w+/g.test(selector)) {
								var aStr = selector.split('.');
								var aRes = aParent[i].getElementsByTagName(aStr[0]);
								var reg = new RegExp('\\b' + aStr[1] + '\\b', 'g');
								G.each(aRes, function(i, ele) {
									if(reg.test(ele.className)) {
										aChild.push(ele)
									}
								})
								//li:eq(2)  li:first  
							} else if(/\w+\:\w+(\(\d+\))?/g.test(selector)) {
								//  [li,eq,2]  [li,first]
								var aStr = selector.split(/\:|\(|\)/);
								var aRes = aParent[i].getElementsByTagName(aStr[0]);
								var arr = G.public.isnotSelector(selector, aRes, aChild, aParent[i], selector);
								G.each(arr, function(i, ele) {
									aChild.push(ele)
								})
							} else if(/\w+\[\w+\=\w+\]/g.test(selector)) {
								var aStr = selector.split(/\[|\=|\]/g);
								var aRes = aParent[i].getElementsByTagName(aStr[0]);
								G.each(aRes, function(i, ele) {
									if(ele.getAttribute(aStr[1]) == aStr[2]) {
										aChild.push(ele)
									}
								})
							} else {
								var aRes = aParent[i].getElementsByTagName(selector);
								G.each(aRes, function(i, ele) {
									aChild.push(ele)
								})
							}
							break;
					}
				}
			}
			return G.unique(aChild);

		},
		// div.abc 、 .div.abc
		classSelector: function(selector) {
			var results = [];
			if(/^\./.test(selector.trim())) {
				var index = selector.replace(/^\./, "").indexOf('.');
				var class1 = selector.substring(1, index + 1);
				var class2 = selector.substring(index + 2);
				var arr = document.getElementsByClassName(class1);
				for(var j = 0, len = arr.length; j < len; j++) {
					var className = arr[j].className;
					if(!className) {
						continue
					}

					if(G.public.regName(class1).test(className) && G.public.regName(class2).test(className)) {
						results.push(arr[j])
					}
				}
			} else {
				var index = selector.indexOf('.');
				var class1 = selector.substring(0, index);
				var class2 = selector.substring(index + 1);
				var arr = document.getElementsByTagName(class1);
				for(var j = 0, len = arr.length; j < len; j++) {
					var className = arr[j].className;
					if(!className) {
						continue
					}
					if(G.public.regName(class2).test(className)) {
						results.push(arr[j])
					}
				}
			}
			return G.unique(results);
		},
		//非 :not
		isnotSelector: function(selector, aRes, aChild, aParent, selector2) {
			var aStr = selector.split(/\:|\(|\)/);
			var n = aStr[2];
			var len = aRes.length;
			switch(aStr[1]) {
				case 'eq':
					aChild.push(aRes[n]);
					break;
				case 'not':
					if(!isNaN(parseInt(n))) {
						n = parseInt(n);
						for(var j = 0; j < len; j++) {
							if(j == n) {
								continue
							}
							aChild.push(aRes[j])
						}

					} else {
						aChild = G.public.notSelector(aStr[0], selector, aParent, aStr[2], aRes);
					}
					break;
				case 'lt':
					for(var j = 0; j < n; j++) {
						aChild.push(aRes[j])
					}
					break;
				case 'le':
					for(var j = 0; j <= n; j++) {
						aChild.push(aRes[j])
					}
					break;
				case 'gt':
					n = parseInt(n) + 1;
					for(var j = n; j < len; j++) {
						aChild.push(aRes[j])
					}
					break;
				case 'ge':
					for(var j = n; j < len; j++) {
						aChild.push(aRes[j])
					}
					break;
				case 'even':
					for(var j = 0; j < len; j += 2) {
						aChild.push(aRes[j])
					}
					break;
				case 'odd':
					for(var j = 1; j < len; j += 2) {
						aChild.push(aRes[j])
					}
					break;
				case 'first':
					aChild.push(aRes[0]);
					break;
				case 'last':
					aChild.push(aRes[len - 1]);
					break;

			}
			return aChild;
		},
		//不足10前面加0
		add0: function(num) {
			return num = num < 10 ? '0' + num : num
		}
	};
	//常用工具
	G.extend({
		//获取浏览器版本
		browser: G.public.getBrowser(),
		//h获取当前时间戳
		now: function() {
			return +new Date();
		},
		isString: function(obj) {
			return G.public.is().String(obj)
		},
		isUndefined: function(obj) {
			return G.public.is().Undefined(obj)
		},
		isNull: function(obj) {
			return G.public.is().Null(obj)
		},
		isNumber: function(obj) {
			return G.public.is().Number(obj)
		},
		isBoolean: function(obj) {
			return G.public.is().Boolean(obj)
		},
		isDate: function(obj) {
			return G.public.is().Date(obj)
		},
		isObject: function(obj) {
			return G.public.is().Object(obj)
		},
		isArray: function(obj) {
			return G.public.is().Array(obj)
		},
		isFunction: function(obj) {
			return G.public.is().Function(obj)
		},
		isRegExp: function(obj) {
			return G.public.is().RegExp(obj)
		},
		isWindow: function(obj) {
			return G.public.is().Window(obj) || obj === g
		},
		isHTMLDocument: function(obj) {
			return G.public.is().HTMLDocument(obj) || G.public.is().Document(obj) || obj === document
		},
		isHTMLElement: function(obj) {
			g.HTMLElement = g.HTMLElement || g.Element;
			if(G.browser.ie && G.browser.ie <= 8) {
				if(obj && obj.scopeName && obj.scopeName == 'HTML') {
					return true
				} else {
					return false
				}

			} else {
				return(obj instanceof HTMLElement)
			}
		},
		isJSON: function(string) {
			if(typeof string == 'string') {
				try {
					JSON.parse(string);
					return true
				} catch(e) {
					var obj = eval('(' + xmlhttp.responseText + ')');
					if(G.isObject(obj) || G.isArray(obj)) {
						return true
					} else {
						return false
					}
				}
			}
		}
	})
	
	//遍历
	G.extend({
		each: function(arr, fn) {
			for(var i = 0, len = arr.length; i < len; i++) {
				var result = fn.call(arr[i], i, arr[i]);
				if(result === true) {
					continue
				} else if(result === false) {
					break
				}
			}
		},
		map: function(arr, fn) {
			var arr2 = [];
			for(var i = 0, len = arr.length; i < len; i++) {
				arr2.push(fn.call(arr[i], i, arr[i]))
			}
			return arr2
		}
	});

	//遍历实例
	G.fn.extend({
		each: function(fn) {
			G.each(this, fn)
			return this
		},
		map: function(fn) {
			G.map(this, fn)
			return this
		}
	})
	
})(typeof window !== 'undefined' ? window : this);
/**gjTool.js
 * ajax异步请求
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	G.extend({
		ajax: function(obj) {
			var xmlhttp, type, url, async, dataType, data, cache, ifModified;
			if(!G.isObject(obj)) {
				return false
			}
			type = obj.type == undefined ? 'get' : obj.type.toUpperCase();
			url = obj.url == undefined ? G.url : obj.url;
			async = obj.async == undefined ? true : obj.type;
			dataType = obj.dataType == undefined ? 'text' : obj.dataType.toUpperCase();
			data = obj.data == undefined ? {} : obj.data;

			var formatParams = function() {
				if(G.isObject(obj)) {
					var str = "";
					for(var pro in data) {
						str += pro + "=" + data[pro] + "&"
					}
					data = str.substr(0, str.length - 1)
				}
				if(type == 'GET' || dataType == 'JSONP') {
					if(url.lastIndexOf('?') == -1) {
						url += '?' + data
					} else {
						url += '&' + data
					}
				}
				if(obj.cache === undefined || obj.cache == false) {
					url += "?t=" + Math.random()
				}
			}
			if(g.XMLHttpRequest) {
				xmlhttp = new XMLHttpRequest()
			} else {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
			}
			if(dataType == 'JSONP') {
				formatParams();
				if(G.isFunction(obj.beforeSend)) {
					obj.beforeSend(xmlhttp)
				}
				var callbackName = ('jsonp_' + Math.random()).replace(".", "");
				var oHead = document.getElementsByTagName('head')[0];
				data.callback = callbackName;
				var ele = document.createElement('script');
				ele.type = "text/javascript";
				ele.src = url;
				oHead.appendChild(ele);
				ele.onerror = function() {
					obj.error && obj.error("请求失败", xmlhttp)
				}
				var start = G.now();
				g[callbackName] = function(json) {
					xmlhttp.time = G.now() - start;
					oHead.removeChild(ele);
					g[callbackName] = null;
					obj.success && obj.success(json, xmlhttp)
				}
				return
			} else {
				formatParams();
				xmlhttp.open(type, url, async);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
				if(G.isFunction(obj.beforeSend)) {
					obj.beforeSend(xmlhttp)
				}
				xmlhttp.send(data);
				var start = G.now();
				xmlhttp.onreadystatechange = function() {
					xmlhttp.time = G.now() - start;
					var res = "";
					if(xmlhttp.readyState != 4) {
						obj.error && obj.error("请求失败", xmlhttp);
						return
					}
					if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						if(dataType == 'JSON') {
							try {
								res = JSON.parse(xmlhttp.responseText)
							} catch(e) {
								if(G.browser.ie && G.browser.ie <= 7) {
									res = eval('(' + xmlhttp.responseText + ')')
								} else {
									res = "返回JSON格式不正确或者请尝试JSONP请求"
								}
							}
						} else if(dataType == 'XML') {
							res = xmlhttp.responseXML
						} else {
							if(url.toLowerCase().indexOf(".json") != -1) {
								try {
									res = JSON.parse(xmlhttp.responseText)
								} catch(e) {
									if(G.browser.ie && G.browser.ie <= 7) {
										res = eval('(' + xmlhttp.responseText + ')')
									} else {
										res = "返回JSON格式不正确或者请尝试JSONP请求"
									}
								}
							} else if(url.toLowerCase().indexOf(".xml") != -1) {
								res = xmlhttp.responseXML
							} else {
								res = xmlhttp.responseText
							}
						}
						obj.success && obj.success(res, xmlhttp)
					}
				}
			}
		},
		get: function(string, data, fn) {
			if(G.isFunction(data)) {
				fn = data;
				data = {}
			}
			this.ajax({
				type: 'get',
				data: data,
				url: string,
				success: function(data, e) {
					fn && fn(data, e)
				},
				error: function(err, e) {
					fn && fn(err, e)
				}
			})
		},
		post: function(string, data, fn) {
			if(G.isFunction(data)) {
				fn = data;
				data = {}
			}
			this.ajax({
				type: 'post',
				data: data,
				url: string,
				success: function(data, e) {
					fn && fn(data, e)
				},
				error: function(err, e) {
					fn && fn(err, e)
				}
			})
		},
		getJSON: function(string, fn) {
			this.ajax({
				type: 'get',
				url: string,
				dataType: 'json',
				success: function(data) {
					fn && fn(data)
				},
				error: function(err) {
					fn && fn(err)
				}
			})
		},
		getXML: function(string, fn) {
			this.ajax({
				type: 'get',
				url: string,
				dataType: 'xml',
				success: function(data) {
					fn && fn(data)
				},
				error: function(err) {
					fn && fn(err)
				}
			})
		}
	});
 })(gjTool)
/**gjTool.js
 * 动画相关
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
 	//封装动画定时器
	if(!g.requestAnimationFrame) {
		var lastTime = 0;
		g.requestAnimationFrame = function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	}
	//封装清除动画定时器
	if(!g.cancelAnimationFrame) {
		g.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
	//动画相关
	G.extend({
		/*
		 t (time) 时间 
		 b (beginning position) 初始位置
		 c (change position) 距离
		 d (duration) 持续时间
		*/
		easing: {
			linear: function(t, b, c, d) { //匀速
				return c * t / d + b;
			},
			easeIn: function(t, b, c, d) { //加速曲线
				return c * (t /= d) * t + b;
			},
			easeOut: function(t, b, c, d) { //减速曲线
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function(t, b, c, d) { //先加速后减速曲线
				if((t /= d / 2) < 1) {
					return c / 2 * t * t + b;
				}
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		animate: function(elem, json, time, easing, fn) {
			var ie = G.browser.ie;
			if(G.isFunction(time)) {
				fn = time;
				time = 400
			}
			if(G.isFunction(easing)) {
				fn = easing;
				easing = 'easeInOut'
			}
			time = time || 400;
			easing = easing || 'easeInOut';
			//获取当前毫秒数
			var startTime = +new Date();
			//获取初始值
			var iCur = {};
			for(var attr in json) {
				if(attr == 'opacity') {
					iCur[attr] = Math.round(G.public.getStyle(elem, attr) * 100);
				} else {
					iCur[attr] = parseInt(G.public.getStyle(elem, attr));
				}
			}
			//清除定时器
			cancelAnimationFrame(elem.animationTimer);
			elem.timer = requestAnimationFrame(function func() {
				var d = time;
				var t = d - Math.max(0, startTime - (+new Date()) + d);
				for(var attr in json) {
					var end;
					if(attr == 'opacity') {
						end = json[attr] * 100;
					} else {
						end = parseInt(json[attr]);
					}
					var b = iCur[attr];
					var c = end - iCur[attr];
					var p = G.easing[easing](t, b, c, d);

					if(attr == 'opacity') {
						elem.style.opacity = p / 100;
						var op = elem.style.filter;
						if(op && op.indexOf(':') != -1) {
							elem.style.filter = 'alpha(opacity:' + p + ')';
						} else if(op && op.indexOf('=') != -1) {
							elem.style.filter = 'alpha(opacity=' + p + ')';
						}

					} else if(attr == 'scrollTop' || attr == 'scrollLeft') {
						elem[attr] = p;
					} else {
						if(json[attr] && json[attr].toString().indexOf('%') != -1) {
							elem.style[attr] = p + "%";
						} else {
							if(json[attr] && json[attr].toString().indexOf('px') != -1) {
								if(ie && ie < 9) {
									elem.style[attr] = p
								} else {
									elem.style[attr] = p + "px";
								}
							} else {
								if(!G.isNumber(json[attr])) {
									continue;
								}
								elem.style[attr] = p + "px";
							}

						}
					}
				}
				elem.animationTimer = requestAnimationFrame(func);
				//达到指定时间
				if(t == d) {
					//清除定时器
					cancelAnimationFrame(elem.animationTimer);
					//回调函数
					fn && fn
				}
			});
		},
		fadeIn: function(ele, speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
				speed = 400;
			}
			if(G.isFunction(speed)) {
				fn = speed;
				speed = 400;
				easying = "easeInOut"
			}
			if(G.public.getStyle(ele, 'opacity') == 1 && ele.style.display == 'block') {
				return;
			}
			var option = {
				opacity: ele.opacity ? Number(ele.opacity) : 1,
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			};
			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity') >= 1 ? 0 : G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			ele.isShow = true;
			ele.isHide = false;
			G(ele).css(option2).animate(option, speed, easying, function() {
				ele.style.display = option.display;
				ele.isShow = false;
				fn && fn();
			});
		},
		fadeOut: function(ele, speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
				speed = 400;
			}
			if(G.isFunction(speed)) {
				fn = speed;
				speed = 400;
				easying = "easeInOut"
			}
			if(ele.style.display != 'none') {
				ele.display = ele.style.display;
			}
			if(!ele.opacity) {
				ele.opacity = G.public.getStyle(ele, 'opacity');
			}
			var option = {
				opacity: 0,
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			};
			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			ele.isShow = false;
			ele.isHide = true;
			G(ele).css(option2).animate(option, speed, easying, function() {
				ele.style.display = "none";
				ele.isHide = false;
				fn && fn();
			});
		},
		fadeTo: function(ele, speed, opacity, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}

			if(ele.style.display != 'none') {
				ele.display = ele.style.display;
			}
			var option = {
				opacity: opacity
			};

			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			G(ele).css(option2).animate(option, speed, easying, function() {
				if(opacity == 0) {
					ele.style.display = 'none';
				}
				fn && fn();
			});
		}
	})

	function oldStyles(ele) {
		return {
			width: G.public.getStyle(ele, 'width'),
			height: G.public.getStyle(ele, 'height'),
			paddingTop: G.public.getStyle(ele, 'paddingTop'),
			paddingBottom: G.public.getStyle(ele, 'paddingBottom'),
			paddingLeft: G.public.getStyle(ele, 'paddingLeft'),
			paddingRight: G.public.getStyle(ele, 'paddingRight'),
			marginTop: G.public.getStyle(ele, 'marginTop'),
			marginBottom: G.public.getStyle(ele, 'marginBottom'),
			marginLeft: G.public.getStyle(ele, 'marginLeft'),
			marginRight: G.public.getStyle(ele, 'marginRight'),
			opacity: ele.opacity ? ele.opacity : G.public.getStyle(ele, 'opacity')
		}
	}

	function startStyles(ele) {
		return {
			width: G.public.getStyle(ele, 'width'),
			height: G.public.getStyle(ele, 'height'),
			paddingTop: G.public.getStyle(ele, 'paddingTop'),
			paddingBottom: G.public.getStyle(ele, 'paddingBottom'),
			paddingLeft: G.public.getStyle(ele, 'paddingLeft'),
			paddingRight: G.public.getStyle(ele, 'paddingRight'),
			marginTop: G.public.getStyle(ele, 'marginTop'),
			marginBottom: G.public.getStyle(ele, 'marginBottom'),
			marginLeft: G.public.getStyle(ele, 'marginLeft'),
			marginRight: G.public.getStyle(ele, 'marginRight'),
			opacity: G.public.getStyle(ele, 'opacity'),
			display: (ele.display && ele.display != 'none') ? ele.display : 'block',
			overflow: "hidden"
		}
	}

	function startStyles2(ele) {
		return {
			width: 0,
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			paddingRight: 0,
			marginTop: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			opacity: 0,
			display: (ele.display && ele.display != 'none') ? ele.display : 'block',
			overflow: "hidden"
		}
	}
	//动画类
	G.fn.extend({
		//显示元素
		show: function(speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}
			if(G.isFunction(speed)) {
				fn = speed;
				easying = "easeInOut"
			}
			speed = speed ? speed : 0;
			return this.each(function(i, ele) {
				if(!ele.oldStyles) {
					ele.oldStyles = oldStyles(ele)
				}
				var start = startStyles(ele);
				if(ele.style.display == 'none') {
					start = startStyles2(ele);
				}
				ele.isShow = true;
				ele.isHide = false;
				if(speed == 0) {
					ele.isShow = false;
					ele.style.display = (ele.display && ele.display != 'none') ? ele.display : 'block';
					fn && fn();
					return;
				}
				G(ele).css(start).animate(ele.oldStyles, speed, easying, function() {
					ele.style.display = (ele.display && ele.display != 'none') ? ele.display : 'block';
					ele.isShow = false;
					fn && fn();
				});
			})
		},
		//隐藏元素
		hide: function(speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}
			if(G.isFunction(speed)) {
				fn = speed;
				easying = "easeInOut"
			}
			speed = speed ? speed : 0;
			return this.each(function(i, ele) {
				if(!ele.oldStyles) {
					ele.oldStyles = oldStyles(ele)
				}
				if(ele.style.display != 'none') {
					ele.display = ele.style.display;
				}
				var start = startStyles(ele);
				var newStyles = startStyles2(ele);
				ele.isHide = true;
				ele.isShow = false;
				if(speed == 0) {
					ele.isHide = false;
					ele.style.display = 'none';
					fn && fn();
					return;
				}
				G(ele).css(start).animate(newStyles, speed, easying, function() {
					ele.style.display = 'none';
					ele.isHide = false;
					fn && fn();
				});
			})
		},
		toggle: function(speed, easing, fn) {
			return this.each(function(i, ele) {
				if(!ele.isHide && !ele.isShow) {
					if(ele.style.display == 'none') {
						G(ele).stop().show(speed, easing, fn)
					} else {
						G(ele).stop().hide(speed, easing, fn)
					}
					return;
				}
				if(ele.isHide) {
					G(ele).stop().show(speed, easing, fn)
				} else if(!ele.isHide) {
					G(ele).stop().hide(speed, easing, fn)
				}
			})
		},
		//淡入显示
		fadeIn: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeIn(ele, speed, easying, fn);
			})
		},
		//淡出隐藏
		fadeOut: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeOut(ele, speed, easying, fn);
			})
		},
		fadeTo: function(speed, opacity, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeTo(ele, speed, opacity, easying, fn);
			})
		},
		fadeToggle: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				if(!ele.isHide && !ele.isShow) {
					if(ele.style.display == 'none') {
						G(ele).stop().fadeIn(speed, easying, fn);
					} else {
						G(ele).stop().fadeOut(speed, easying, fn);
					}
					return;
				}
				if(ele.isHide) {
					G(ele).stop().fadeIn(speed, easying, fn);
				} else if(!ele.isHide) {
					G(ele).stop().fadeOut(speed, easying, fn);
				}
			})

		},
		animate: function(json, time, easing, fn) {
			if(G.isFunction(time)) {
				fn = time;
				time = 400
			}
			if(G.isFunction(easing)) {
				fn = easing;
				easing = 'easeInOut'
			}
			time = time || 400;
			easing = easing || 'easeInOut';
			var self = this;
			var elem = this[0];
			var fx = function() {
				self.each(function(i, elem) {
					cancelAnimationFrame(elem.animationTimer);
					G.animate(elem, json, time, easing)
				})
				elem.callbacTimer = setTimeout(function() {
					fn && fn()
				}, time);
			}
			G.queue(elem, fx).delay(elem, time);
			if(!elem.isdequeue) {
				G.dequeue(elem)
			}
			return this;
		},
		stop: function(stopAll, goToEnd) {
			var elem = this[0];
			//停止队列当前动画,队列其他继续
			if(stopAll === undefined) {
				cancelAnimationFrame(elem.animationTimer); //清除动画定时器
				clearTimeout(elem.callbacTimer); //清除回调函数定时器
				clearTimeout(elem.delayQueueTimer); //清除延时队列定时器
				G.dequeue(elem);
			}
			//停止队列所有动画
			if(stopAll === true && goToEnd === undefined) {
				elem["queueStore"] = [];
				this.each(function(i, elem) {
					cancelAnimationFrame(elem.animationTimer);
					clearTimeout(elem.callbacTimer);
					clearTimeout(elem.delayQueueTimer);
				})
			}
			//允许完成队列当前动画，队列其他停止
			if(stopAll === true && goToEnd === true) {
				elem["queueStore"] = [];
			}
			return this;
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
/**gjTool.js
 * 属性操作方法
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
;(function(G){
	G.fn.extend({
		attr: function(name, value) {
			if(G.isString(name) && (G.isString(value) || G.isBoolean(value) || !isNaN(value))) {
				return this.each(function(i, ele) {
					if(value == false || toString(value).trim() == "") {
						ele.removeAttribute(name)
					} else {
						ele.setAttribute(name, value)
					}

				})
			} else if(!value && G.isObject(name)) {
				return this.each(function(i, ele) {
					for(var i in name) {
						if(name[i] == false || name[i].trim() == "") {
							ele.removeAttribute(name)
						} else {
							ele.setAttribute(i, name[i])
						}
					}
				})
			} else if(!value && G.isString(name)) {
				return this[0].getAttribute(name)
			}
		},
		removeAttr: function(name) {
			if(G.isString(name)) {
				return this.each(function(i, ele) {
					ele.removeAttribute(name)
				})
			}
			return this
		},
		prop: function(name, value) {
			if(!G.isString(name)) {
				if(console && console.error){
					console.error("prop parameter invalid !");
				}
				return this
			}
			if((name == "innerText" || name == "innerHTML") && !name in this[0]) {
				name = "text"
			}
			if(name == "text" && !"text" in this[0]) {
				name = "textContent"
			}
			if(G.isString(name) && (value === false || value === true || value === "" || G.isString(value))) {
				return this.each(function(i, ele) {
					ele[name] = value
				})
			} else {
				return this[0][name]
			}
		},
		data: function(name, value) {
			if(G.isString(name) && name.trim() != "") {
				name = "data-" + name
			}
			return this.attr(name, value)
		},
		val: function(value) {
			return this.prop('value', value)
		},
		html: function(html) {
			return this.prop('innerHTML', html)
		},
		text: function(text) {
			return this.prop('innerText', "" + text)
		},
		empty: function() {
			return this.html('');
		}
	});

})(gjTool)
/**gjTool.js
 * class类名操作
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
 	G.fn.extend({
 		//添加class
		addClass: function(name) {
			return this.each(function(i, ele) {
				if(!ele.className.length) {
					ele.className += '' + name
				} else if(!G.public.regName(name).test(ele.className)) {
					ele.className += ' ' + name
				}
			})
		},
		//移除class
		removeClass: function(name) {
			return this.each(function(i, ele) {
				if(!ele.className) {
					return
				} else if(G.public.regName(name).test(ele.className)) {
					ele.className = ele.className.replace(G.public.regName(name), ' ').trim()
				}
			})
		},
		//判断是否含有class
		hasClass: function(name) {
			return G.public.regName(name).test(this[0].className);
		},
		//移除添加class
		toggleClass: function(name) {
			return this.each(function(i, ele) {
				if(G(this).hasClass(name)) {
					G(this).removeClass(name)
				} else {
					G(this).addClass(name)
				}
			})
		}
 	})
	
 })(gjTool)
/**gjTool.js
 * css类 样式操作
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
;(function(G){
	G.fn.extend({
		/**
		 *	css 获取设置样式
		 *	@param name 样式名
		 *	@param value 样式值
		 */
		css: function(name, value) {
			if(G.isString(name) && G.isString(value)) {
				return this.each(function(i, ele) {
					if(name == 'opacity') {
						elem.style.opacity = value;
						elem.style.filter = 'alpha(opacity:' + value * 100 + ')'
					} else if(name == 'scrollTop' || name == 'scrollLeft') {
						ele[name] = value
					} else {
						ele.style[name] = value
					}
				})
			} else if(!value && G.isObject(name)) {
				return this.each(function(i, ele) {
					for(var i in name) {
						if(i == 'opacity') {
							ele.style.opacity = name[i];
							ele.style.filter = 'alpha(opacity:' + name[i] * 100 + ')'
						} else if(name == 'scrollTop' || name == 'scrollLeft') {
							ele[i] = name[i]
						} else {
							var str = name[i].toString();
							if(str.indexOf('%') == -1 && str.indexOf('px') == -1 && str.indexOf('em') == -1 && str.indexOf('rem') == -1 && str.indexOf('vw') == -1 && str.indexOf('vh') == -1&& str.indexOf('vmin') == -1 && str.indexOf('vmax') == -1) {
								ele.style[i] = name[i] + "px";
							}else {
								ele.style[i] = name[i];
							}
							// if(i == 'width' && name[i].toString().indexOf('%') != -1) {
							// 	ele.style[i] = ele.offsetWidth;
							// } else if(i == 'height' && name[i].toString().indexOf('%') != -1) {
							// 	ele.style[i] = ele.offsetHeight;
							// } else {
							// 	ele.style[i] = name[i]
							// }

						}
					}
				})
			} else if(G.isString(name)) {
				return G.public.getStyle(this[0], name)
			}
		},
		width: function(value) {
			if(value && G.isString(value)) {
				this.css('width', value);
				return this
			}
			if(G.isWindow(this[0])) {
				return document.documentElement.clientWidth
			}
			if(G.isHTMLDocument(this[0])) {
				return document.documentElement.offsetWidth
			}
			return Number(parseFloat(this.css('width')).toFixed(2))
		},
		height: function(value) {
			if(value && G.isString(value)) {
				this.css('height', value);
				return this
			}
			if(G.isWindow(this[0])) {
				return document.documentElement.clientHeight
			}
			if(G.isHTMLDocument(this[0])) {

				return document.documentElement.offsetHeight
			}
			return Number(parseFloat(this.css('height')).toFixed(2))
		},
		offset: function() {
			var elem = this[0];
			var o = {};
			if(!elem) {
				return {
					top: 0,
					left: 0
				}
			}
			o.left = elem.offsetLeft;
			o.top = elem.offsetTop;
			while(elem.offsetParent) {
				elem = elem.offsetParent;
				o.left += elem.offsetLeft;
				o.top += elem.offsetTop
			}
			return o
		},
		scrollTop: function(value) {
			var elem = this[0];

			if(G.isWindow(this.selector) || G.isHTMLDocument(this.selector)) {
				if(value || value == 0) {
					if(document.body.scrollTop) {
						document.body.scrollTop = value
					} else {
						document.documentElement.scrollTop = value;
					}
					return this
				}

				return document.body.scrollTop || document.documentElement.scrollTop;
			}

			if(value || value == 0) {
				elem.scrollTop = value;
				return this
			}
			return elem.scrollTop

		},
		scrollLeft: function(value) {
			var elem = this[0];
			if(G.isWindow(this.selector) || G.isHTMLDocument(this.selector)) {
				if(value || value == 0) {
					if(document.body.scrollLeft) {
						document.body.scrollLeft = value
					} else {
						document.documentElement.scrollLeft = value
					}
					return this
				}
				return document.body.scrollLeft || document.documentElement.scrollLeft
			}
			if(G(elem).css('overflow') != "visible") {
				if(value || value == 0) {
					elem.scrollLeft = value;
					return this
				}
				return elem.scrollLeft
			}
		}
	});
})(gjTool)
/**gjTool.js
 * DOM操作
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	G.fn.extend({
		//在当前元素节点之后插入内容、元素
		after: function(selector, move) {
			return this.each(function(i, elem) {
				var parent = elem.parentNode;
				var children = parent.children;
				for(var i = 0, len = children.length; i < len; i++) {
					if(children[i] == elem) {
						var next = children[i + 1];
						break;
					}
				}
				var lastChild = children[children.length - 1];
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						if(lastChild == elem) {
							parent.appendChild(arr[i].cloneNode(true))
						} else {
							parent.insertBefore(arr[i].cloneNode(true), next)
						}
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					if(lastChild == elem) {
						parent.appendChild(selector)
					} else {
						parent.insertBefore(selector, next)
					}
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						if(lastChild == elem) {
							parent.appendChild(node)
						} else {
							parent.insertBefore(node, next)
						}
					}
				}
			})
		},
		//在当前元素节点之前插入内容、元素
		before: function(selector, move) {
			return this.each(function(i, elem) {
				var parent = elem.parentNode;
				var children = parent.children;
				for(var i = 0, len = children.length; i < len; i++) {
					if(children[i] == elem) {
						var prev = children[i - 1];
						break;
					}
				}
				var firstChild = children[0];
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						if(firstChild == elem) {
							parent.insertBefore(arr[i].cloneNode(true), elem)
						} else {
							parent.insertBefore(arr[i].cloneNode(true), prev)
						}
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					if(firstChild == elem) {
						parent.insertBefore(selector, elem)
					} else {
						parent.insertBefore(selector, prev)
					}
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						if(firstChild == elem) {
							parent.insertBefore(node, elem)
						} else {
							parent.insertBefore(node, prev)
						}
					}
				}
			})
		},
		
		//在被选元素的内部结尾插入内容
		append: function(selector, move) {
			return this.each(function(i, elem) {
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						elem.appendChild(arr[i].cloneNode(true));
					}
				} else if(G.isHTMLElement(selector)) {

					if(!move) {
						selector = selector.cloneNode(true);
					}
					elem.appendChild(selector)
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						elem.appendChild(node)
					}
				}
			})

		},
		//在被选元素的内部开头插入内容
		prepend: function(selector, move) {
			return this.each(function(i, elem) {
				var firstChild = elem.children[0];
				if(G.isString(selector)) {
					arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						elem.insertBefore(arr[i].cloneNode(true), firstChild)
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					elem.insertBefore(selector, firstChild)
				} else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						elem.insertBefore(node, firstChild)
					}
				}
			})
		},
		remove: function() {
			return this.each(function(i, elem) {
				if(G.isHTMLElement(elem) && elem.parentNode) {
					var parentNode = elem.parentNode;
					parentNode.removeChild(elem);
				}
			})
		},
		clone: function(){
			var arr = [];
			this.each(function(i, elem) {
				arr.push(elem.cloneNode(true)) 
			})
			return this.toArray(arr);
		},
		//将被选元素插入selector的内部
		appendTo: function(selector) {
			return this.each(function(i, elem) {
				var node = elem.cloneNode(true);
				G(selector).each(function(i,elem2){
					elem2.appendChild(node)
				})
			})
		}
	});
 })(gjTool)
/**gjTool.js
 * 拖拽插件
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	//拖拽插件
	G.fn.extend({
		drag: function() {
			return this.each(function(i, elem) {
				G(elem).mousedown(function(e) {
					e.preventDefault();
					var o = G(this).offset();
					var disX = e.clientX - o.left;
					var disY = e.clientY - o.top;
					var self = this;
					G(document).mousemove(function(e) {
						if(self.nodrag) {
							return
						}
						e.preventDefault();
						var l = e.clientX - disX;
						var t = e.clientY - disY;

						var wid = document.documentElement.clientWidth;
						var hei = document.documentElement.clientHeight;
						var w = parseFloat(self.style.width);
						var h = parseFloat(self.style.height);
						l = l <= 0 ? 0 : (l >= wid - w ? wid - w : l);
						t = t <= 0 ? 0 : (t >= hei - h ? hei - h : t);
						self.style.left = l + 'px';
						self.style.top = t + 'px'
					});
					G(document).mouseup(function() {
						G(document).off('mousemove')
					})
				})
			})
		},
		nodrag: function(flag) {
			if(G.isUndefined(flag)) {
				flag = true
			}
			return this.each(function(i, elem) {
				elem.nodrag = flag
			})
		}
	})
 })(gjTool)
/**gjTool.js
 * 遍历实例对象
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
 	//获取父级节点
	var getParentNode = function(elem, arr) {
		if(!G.isHTMLElement(elem)) {
			return arr
		}
		if(elem.parentNode == document) {
			return arr
		}
		arr.push(elem.parentNode);
		return getParentNode(elem.parentNode, arr)
	}
	G.fn.extend({
		//eq返回的是gjTool实例
		eq: function(num) {
			num = Number(num);
			if(isNaN(num)) {
				if(console && console.warn){
					console.warn("eq parameter invalid !");
				}
				return this
			}
			return G(this[num])
		},
		index: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return null
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i] == elem) {
						return Number(i)
					}
				}
			}else if(arr){
				return 0;
			}

			return null
		},
		parent: function(selector) {
			var arr = [],
				arr2 = [];
			for(var i = 0, len = this.length; i < len; i++) {
				var elem = this[i];
				arr.push(elem.parentNode)
			}
			arr = G.unique(arr);
			if(G.isString(selector)) {
				for(var j = 0, len = arr.length; j < len; j++) {
					if(arr[j].tagName.toLowerCase() == selector || (selector.indexOf("#") != -1 && arr[j].id == selector.replace('#', "")) || (selector.indexOf(".") != -1 && G(arr[j]).hasClass(selector.replace('.', "")))) {
						arr2.push(arr[j])
					}
				}
				return this.toArray(arr2)
			} else {
				return this.toArray(arr)
			}
		},
		parents: function(selector) {
			var arr = [],
				arr2 = [];
			for(var i = 0, len = this.length; i < len; i++) {
				var elem = this[i];
				arr = getParentNode(elem, arr)
			}
			arr = G.unique(arr);
			if(G.isString(selector)) {
				for(var j = 0, len = arr.length; j < len; j++) {
					if(arr[j].tagName.toLowerCase() == selector || (selector.indexOf("#") != -1 && arr[j].id == selector.replace('#', "")) || (selector.indexOf(".") != -1 && G(arr[j]).hasClass(selector.replace('.', "")))) {
						arr2.push(arr[j])
					}
				}
				return this.toArray(arr2)
			} else {
				return this.toArray(arr)
			}
		},
		children: function(selector) {
			var elem = this[0];
			var m = G.public.regSelector.exec(selector);
			var arr2 = [];

			this.each(function(i, elem) {
				if(!G.isHTMLElement(elem)) {
					return
				}
				var arr = elem.children;
				if(selector === undefined) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(G.isHTMLElement(arr[i])) {
							arr2.push(arr[i]);
						}
					}
				} else if(m) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(G.isHTMLElement(arr[i])) {
							if(m[1]) { // id选择器
								if(arr[i].id == m[1]) {
									arr2.push(arr[i])
								}
							} else if(m[2]) { // class选择器
								if(G.public.regName(m[2]).test(arr[i].className)) {
									arr2.push(arr[i])
								}
							} else if(m[3]) { //通配符选择器
								arr2.push(arr[i])
							} else if(m[4]) { //标签选择器
								if(arr[i].tagName.toLowerCase() == m[4]) {
									arr2.push(arr[i])
								}
							}
						}
					}
				}
			})
			return this.toArray(arr2)
		},
		
		siblings: function(selector) {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			var m = G.public.regSelector.exec(selector);
			var arr2 = [];
			if(selector === undefined) {
				var arr = elem.parentNode.children;
				if(arr && arr.length >= 1) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(arr[i] != elem && G.isHTMLElement(arr[i])) {
							arr2.push(arr[i])
						}
					}
				}

			} else if(m) {
				this.each(function(i, elem) {
					var arr = elem.parentNode.children;
					if(arr && arr.length >= 1) {
						for(var i = 0, len = arr.length; i < len; i++) {
							if(G.isHTMLElement(arr[i]) && arr[i] != elem) {
								if(m[1]) { // id选择器
									if(arr[i].id == m[1]) {
										arr2.push(arr[i])
									}
								} else if(m[2]) { // class选择器
									if(G.public.regName(m[2]).test(arr[i].className)) {
										arr2.push(arr[i])
									}
								} else if(m[3]) { //通配符选择器
									arr2.push(arr[i])
								} else if(m[4]) { //标签选择器
									if(arr[i].tagName.toLowerCase() == m[4]) {
										arr2.push(arr[i])
									}
								}
							}
						}
					}

				})
			}
			return this.toArray(arr2)
		},
		prev: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			if(elem == document || elem == document.body || elem == document.documentElement) {
				return this;
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i + 1] == elem) {
						return this.toArray([arr[i]])
					}
				}
			}
			return this;
		},
		next: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			if(elem == document || elem == document.body || elem == document.documentElement) {
				return this;
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 1, len = arr.length; i < len; i++) {
					if(arr[i - 1] == elem) {
						return this.toArray([arr[i]])
					}
				}
			}
			return this;
		},
		first: function() {
			return this.find(this[0])
		},
		last: function() {
			return this.find(this[this.length - 1])
		}
	})
	
 })(gjTool)
/**gjTool.js
 * 事件相关
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	//DOM事件
	G.fn.extend({
		
		on: function(type, selector, fn, useCapture) {
			if(G.isFunction(selector)) {
				fn = selector;
				selector = null
			}
			useCapture = useCapture || false;
			return this.each(function(i, ele) {
				if(selector) {
					var fnc = function(e) {
						e = G.public.event(e, type);
						G(ele).find(selector).each(function(i, el) {
							if(el === e.target) {
								fn.call(el, e)
							}
						})
					}
				} else {
					var fnc = function(e) {
						fn.call(ele, G.public.event(e, type))
					}
				}
				ele[type + "Event"] = fnc;
				G.public.addEvent(ele, type, fnc, useCapture)
			})
		},
		off: function(type) {
			return this.each(function(i, ele) {
				G.public.removeEvent(ele, type, ele[type + "Event"]);
				ele[type + "Event"] = null
			});
		},
		hover: function(fn1, fn2) {
			this.mouseenter(fn1);
			this.mouseleave(fn2);
			return this
		}
	});
	//DOM其他事件注册
	G.each(G.public.eventsArr, function(i, type) {
		G.fn[type] = function(fn) {
			return this.on(type, null, fn)
		}
	});
 })(gjTool)
/**gjTool.js
 * 函数队列（异步函数同步执行）
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	var dataArr = [];
	G.extend({
		//增加队列
		queue: function(elem, fn) {
			if(G.isFunction(elem)) {
				fn = elem;
				elem = document;
			}
			if(G.isArray(elem)) {
				fn = elem;
				elem = document;
			}
			if(G.isArray(fn)) {
				if(elem["queueStore"]) {
					for(var i = 0, len = fn.length; i < len; i++) {
						elem["queueStore"].push(fn);
					}
				} else {
					elem["queueStore"] = fn; //队列存储
					elem.isdequeue = false; //是否正在触发
				}
			} else if(G.isFunction(fn)) {
				if(elem["queueStore"]) {
					elem["queueStore"].push(fn);
				} else {
					elem["queueStore"] = []; //队列存储
					elem["queueStore"].push(fn)
					elem.isdequeue = false; //是否正在触发
				}
			}
			return this;
		},
		//延时
		delay: function(elem, time) {
			if(G.isNumber(elem)) {
				time = elem;
				elem = document;
			}
			elem["queueStore"].push(time);
			return this;
		},
		//取出队列并执行
		dequeue: function(elem, fn) {
			if(G.isFunction(elem)) {
				fn = elem;
				elem = document;
			}
			var self = this,
				list = elem["queueStore"];
			elem.isdequeue = true;
			if(list) {
				var el = list.shift();
			}
			if(typeof el == "number") {
				elem.delayQueueTimer = setTimeout(function() {
					self.dequeue(elem, fn);
				}, el);
			} else if(typeof el == "function") {
				var data = el.call(this);
				if(data !== undefined) {
					dataArr.push(data)
				}
				if(list.length) {
					self.dequeue(elem, fn);
				} else {
					elem.isdequeue = false;
					fn && fn.call(this, dataArr)
					dataArr = [];
				}
			} else {
				elem.isdequeue = false;
				fn && fn.call(this, dataArr)
				dataArr = [];
			}
			return this;
		}
	});
 })(gjTool)
/**gjTool.js
 * 常用方法工具
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	//工具类 扩展插件、静态方法
	G.extend({
		
		toWeek: function(m) {
			var week = '日一二三四五六';
			return week.substring(m, m + 1)
		},
		getTime: function() {
			var date = new Date(),
				obj = {};
			obj.y = date.getFullYear();
			obj.m = G.public.add0(date.getMonth() + 1);
			obj.d = G.public.add0(date.getDate());
			obj.h = G.public.add0(date.getHours());
			obj.mi = G.public.add0(date.getMinutes());
			obj.s = G.public.add0(date.getSeconds());
			obj.w = G.toWeek(date.getDay());
			return obj
		},
		getDate: function(w) {
			var obj = G.getTime();
			if(w == '-') {
				return obj.y + '-' + obj.m + '-' + obj.d + ' ' + obj.h + ':' + obj.mi + ':' + obj.s
			} else if(w == '/') {
				return obj.y + '/' + obj.m + '/' + obj.d + ' ' + obj.h + ':' + obj.mi + ':' + obj.s
			} else {
				return obj.y + '年' + obj.m + '月' + obj.d + '日' + '星期' + obj.w + ' ' + obj.h + ':' + obj.mi + ':' + obj.s
			}
		},
		/**
		 *	arrSort 数组对象排序     升序
		 *	@param arr 要排序的数组
		 *	@param name 属性名
		 */
		arrSort: function(arr, name, reverse) {
			var arr2 = arr.sort(function(obj1, obj2) {
				var val1 = obj1[name];
				var val2 = obj2[name];
				if(!isNaN(Number(val1)) && !isNaN(Number(val2))) {
					val1 = Number(val1);
					val2 = Number(val2)
				}
				if(val1 < val2) {
					return -1
				} else if(val1 > val2) {
					return 1
				} else {
					return 0
				}
			})
			if(reverse === true) {
				return arr.reverse();
			} else {
				return arr;
			}
		},
		/**
		 *	objSort 对象按键名排序     升序
		 *	@param obj 要排序的对象
		 *	@param f 布尔值 true降序
		 */
		objSort: function(obj, f) {
			var newObj = {},
				newkey = Object.keys(obj).sort();
			if(f == true) {
				newkey = newkey.reverse()
			}
			for(var i = 0, len = newkey.length; i < len; i++) {
				newObj[newkey[i]] = obj[newkey[i]]
			}
			return newObj
		},
		//写cookie
		setCookie: function(name, value, hour) {
			if(location.href.indexOf('http://') == -1) {
				if(console && console.error){
					console.error('setCookie error: no domain http:// is included');
				}
				return
			}
			if(!name || !value) {
				if(console && console.error){
					console.error('setCookie error: no name or value ');
				}
				return
			}
			if(isNaN(hour) || hour < 0) {
				hour = 0
			}
			var exp = new Date();
			exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
			document.cookie = G.encrypt(name) + "=" + G.encrypt(value) + ";expires=" + exp.toGMTString() + ';path=/'
		},
		//读cookie
		getCookie: function(name) {
			if(location.href.indexOf('http://') == -1) {
				if(console && console.error){
					console.error('getCookie error: no domain http:// is included');
				}
				return
			}
			var cookie = document.cookie;
			var arr = cookie.split('; ');
			for(var i = 0, len = arr.length; i < len; i++) {
				var item = arr[i].split('=');
				if(item[0] == G.encrypt(name)) {
					return G.decrypt(item[1])
				} else if(item[0] == name) {
					return item[1]
				}
			}
		},
		//删cookie
		delCookie: function(name) {
			if(G.url.indexOf('http://') == -1) {
				if(console && console.error){
					console.error('No domain http:// is included');
				}
				return
			}
			var exp = new Date();
			exp.setTime(exp.getTime() - 10000);
			var cval = G.getCookie(name);
			if(cval != null) {
				document.cookie = G.encrypt(name) + "=" + G.encrypt(cval) + ";expires=" + exp.toGMTString() + ';path=/'
			}
		},
		//加密
		encrypt: function(value) {
			var result = '';
			value = ("" + value);
			for(var i = 0, len = value.length; i < len; i++) {
				result += "%" + (value.charCodeAt(i) * 11).toString(36)
			}
			return result
		},
		//解密
		decrypt: function(value) {
			var result = '';
			var s = value.split("%");
			for(var i = 1, len = s.length; i < len; i++) {
				result += String.fromCharCode(parseInt(s[i], 36) / 11)
			}
			return result
		},
		//数组去重
		unique: function(arr) {
			var tmp = [];
			for(var i = 0, len = arr.length; i < len; i++) {
				//该元素在tmp内部不存在才允许追加
				if(tmp.indexOf(arr[i]) == -1) {
					tmp.push(arr[i])
				}
			}
			return tmp
		},
		//复制对象
		cloneObj: function(oldObj) {
			if(!G.isObject(oldObj)) {
				return oldObj
			}
			var newObj = {};
			for(var i in oldObj) {
				newObj[i] = G.cloneObj(oldObj[i])
			}
			return newObj
		},
		//复制数组
		cloneArr: function(oldArr) {
			if(!G.isArray(oldArr)) {
				return oldArr
			}
			var newArr = [];
			for(var i = 0, len = oldArr.length; i < len; i++) {
				newArr.push(oldArr[i])
			}
			return newArr
		},
		//扩展数组
		extendArr: function() {
			var args = arguments;
			if(args.length < 2) {
				return
			}
			var temp = G.cloneArr(args[0]);
			for(var n = 1, len = args.length; n < len; n++) {
				for(var i = 0, len = args[n].length; i < len; i++) {
					temp.push(args[n][i])
				}
			}
			return G.unique(temp)
		},
		//获取随机字母数字验证码
		getVerify: function(len) {
			var str = '';
			for(; str.length < len; str += Math.random().toString(36).substr(2));
			str = str.substr(0, len);
			var newStr = '';
			for(var i = 0, len = str.length; i < len; i++) {
				newStr += (Math.random() < 0.5 ? str[i].toUpperCase() : str[i])
			}
			return newStr
		}
	});
	
 })(gjTool)
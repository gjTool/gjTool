/** 个人js类库gjTool.js（方法、插件集合）
 *  @version 1.1.5
 *  @author Gao Jin
 *  @update 2018/03/19 17:53
 */
(function(g, fn) {
	if(typeof define === 'function' && define.amd) {
		define(function() {
			return fn(g)
		})
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = fn(g)
	} else {
		fn(g)
	}
})(typeof window !== 'undefined' ? window : this, function(g) {
	'use strict';
	var gjTool = (function() {
		if(g.console && g.console.info) {
			console.info("gjTool.js v1.1.5. The latest version and API on GitHub:  https://github.com/gjTool/gjTool")
		}
		//定义gjTool类
		var G = function(selector, context) {
			return new G.fn.gjTool(selector, context)
		}
		G.fn = G.prototype = {
			//gjTool基础库
			//选择器 selector gjTool实例 
			gjTool: function(selector, context) {
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
				} else if(G.isString(selector) && G.isString(context)) {
					return G(context).find(selector)
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
				if(!G.isString(selector)){
					return
				}
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
		if(typeof window === 'undefined') {
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
			checkTouch : function(type){
		 		for(var i=0,len=G.public.touchEvents.length;i<len;i++){
		 			if(G.public.touchEvents[i] == type){
		 				return true
		 			}
		 		}
		 		return false
		 	},
			//判断文档加载完成后
			DOMLoaded: function(fn) {
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
					if(ua.match(/(pad|iPad|Tablet|PlayBook)/i) || (android && !/(?:Mobile)/i.test(ua)) || (sys.firefox && /(?:Tablet)/i.test(ua))) {
						sys.tablet = true;
					} else {
						sys.phone = true;
					}
				} else {
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
				var str, index;
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
			//添加事件监听
			addEvent: function(el, type, fn, capture) {
				if (window.addEventListener) {
		            el.addEventListener(type, fn, capture);

		            var ev = document.createEvent("HTMLEvents");
		            ev.initEvent(type, capture || false, false);
		            // 在元素上存储创建的事件，方便自定义触发
		            if (!el["ev" + type]) {
		                el["ev" + type] = ev;
		            }
		            
		        } else if (window.attachEvent) {
		            el.attachEvent("on" + type, fn);    
		            if (isNaN(el["cu" + type])) {
		                // 自定义属性，触发事件用
		                el["cu" + type] = 0; 
		            }
		            
		            var fnEv = function(event) {
		                if (event.propertyName == "cu" + type) {
		                    fn.call(el);
		                }
		            };
		            
		            el.attachEvent("onpropertychange", fnEv);
		            
		            // 在元素上存储绑定的propertychange事件，方便删除
		            if (!el["ev" + type]) {
		                el["ev" + type] = [fnEv];
		            } else {
		                el["ev" + type].push(fnEv);    
		            }
		        }
			},
			//触发事件
		    trigger: function(el,type) {
		        if (typeof type === "string") {
		            if (document.dispatchEvent) {
		                if (el["ev" + type]) {
		                    el.dispatchEvent(el["ev" + type]);
		                }
		            } else if (document.attachEvent) {
		            	// 改变对应自定义属性，触发自定义事件
		                el["cu" + type]++;
		            }    
		        }    
		    },
			//删除事件
			removeEvent: function(el, type, fn,capture) {
				if (window.removeEventListener) {
		            el.removeEventListener(type, fn, capture || false);
		        } else if (document.attachEvent) {
		            el.detachEvent("on" + type, fn);
		            var arrEv = el["ev" + type];
		            if (arrEv instanceof Array) {
		                for (var i=0; i<arrEv.length; i+=1) {
		                    // 删除该方法名下所有绑定的propertychange事件
		                    el.detachEvent("onpropertychange", arrEv[i]);
		                }
		            }
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
			url: window.location.href,
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
						var obj = eval('(' + string + ')');
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
		
		//class类名操作
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
		return G
	})();
	g.gjTool = gjTool;
	g.$ === undefined && (g.$ = gjTool);
	return gjTool;
})
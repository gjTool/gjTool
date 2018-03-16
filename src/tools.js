/**gjTool.js
 * 常用方法工具
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
	//工具类 扩展插件、静态方法
	G.extend({
		//获取浏览器的版本
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
		},
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
				console.error('setCookie error: no domain http:// is included');
				return
			}
			if(!name || !value) {
				console.error('setCookie error: no name or value ');
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
				console.error('getCookie error: no domain http:// is included');
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
				console.error('No domain http:// is included');
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
	
 })(gjTool,typeof window !== 'undefined' ? window : this)
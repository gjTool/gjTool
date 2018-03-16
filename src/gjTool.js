/**
 * 个人js类库gjTool.js（方法、插件集合）
 * @version 1.1
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
;(function(g) {
	"use strict";
	//定义gjTool类
	function G(selector) {
		return new G.fn.gjTool(selector)
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
	G.fn = G.prototype = {
		version: "gjTool.js v1.1 by Gao Jin && Mail:861366490@qq.com",
		//gjTool实例选择器
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
		/**
		 *	toArray  返回元素集合 转化gjTool实例
		 &	@param arr Dom元素对象集合
		 */
		toArray: function(arr) {
			for(var i = 0, len = this.length; i < len; i++) {
				[].pop.apply(this)
			}
			this.length = 0;
			[].push.apply(this, arr);
			return this
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
	
})(typeof window !== 'undefined' ? window : this);
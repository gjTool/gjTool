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
							ele.style[i] = name[i];
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
/**gjTool.js
 * class类名操作
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
	G.fn.extend({
		/**
		 *	addClass 添加class
		 *	@param string 字符串class名
		 */
		addClass: function(name) {
			return this.each(function(i, ele) {
				if(!ele.className.length) {
					ele.className += '' + name
				} else if(!G.public.regName(name).test(ele.className)) {
					ele.className += ' ' + name
				}
			})
		},
		/**
		 *	removeClass 移除class
		 *	@param string 字符串class名
		 */
		removeClass: function(name) {
			return this.each(function(i, ele) {
				if(!ele.className) {
					return
				} else if(G.public.regName(name).test(ele.className)) {
					ele.className = ele.className.replace(G.public.regName(name), ' ').trim()
				}
			})
		},
		/**
		 *	hasClass 判断是否含有class
		 *	@param string 字符串class名
		 */
		hasClass: function(name) {
			return G.public.regName(name).test(this[0].className);
		},
		/**
		 *	toggleClass 移除添加class
		 *	@param string 字符串class名
		 */
		toggleClass: function(name) {
			return this.each(function(i, ele) {
				if(G(this).hasClass(name)) {
					G(this).removeClass(name)
				} else {
					G(this).addClass(name)
				}
			})
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
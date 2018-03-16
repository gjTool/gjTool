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
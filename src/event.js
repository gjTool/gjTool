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
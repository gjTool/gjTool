/**gjTool.js
 * 事件相关
 * @author Gao Jin
 * @update 2018/03/19 17:53
 */
 ;(function(G,g){
 	var n = {};
 	//鼠标按键
 	n.getButton = function(e) {
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
	}
	//event事件对象封装
	n.Event = function (event,type){
		var e = g.event || event;
		this.preventDefault = function() {
			e.preventDefault ? e.preventDefault() : e.returnValue = false
		}
		this.stopPropagation = function() {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
		}
		this.target = e.target || e.srcElement;
		this.srcElement = e.srcElement;
		this.keyCode = e.keyCode != undefined ? e.keyCode : ( e.which != undefined ? e.which : (e.charCode != undefined ? e.charCode : undefined));
		this.which = e.which;
		this.returnValue = e.returnValue;
		this.cancelBubble = e.cancelBubble;
		this.bubbles = e.bubbles;
		this.type = type;
		this.pageX = e.pageX;
		this.pageY = e.pageY;
		this.x = e.x;
		this.y = e.y;
		this.layerX = e.layerX;
		this.layerY = e.layerY;
		this.screenX = e.screenX;
		this.screenY = e.screenY;
		this.offsetX = e.offsetX;
		this.offsetY = e.offsetY;
		this.clientX = e.clientX;
		this.clientY = e.clientY;
		this.ctrlKey = e.ctrlKey;
		this.altKey = e.altKey;
		this.shiftKey = e.shiftKey;
		this.button = n.getButton(e);
		this.originalEvent = e;
		this.touches = e.touches;
		this.targetTouches = e.targetTouches;
		this.changedTouches = e.changedTouches;
	}
	//DOM事件
	G.fn.extend({
		on: function(type, selector, fn, useCapture) {
			if(G.public.checkTouch(type)){
				return this.touch(type, selector, fn, useCapture);
			}
			if(G.isFunction(selector)) {
				fn = selector;
				selector = null
			}
			useCapture = useCapture || false;
			return this.each(function(i, ele) {
				if(selector) {
					var fnc = function(e) {
						e = new n.Event(e, type);
						G(ele).find(selector).each(function(i, el) {
							if(el === e.target) {
								fn.call(el, e)
							}
						})
					}
				} else {
					var fnc = function(e) {
						fn.call(ele, new n.Event(e, type))
					}
				}
				if(!ele[type+"Event"]){
            		ele[type+"Event"] = [];
            	}
				ele[type + "Event"].push(fnc);
				G.public.addEvent(ele, type, fnc, useCapture)
			})
		},
		off: function(type) {
			if(G.public.checkTouch(type)){
				return this.untouch(type);
			}
			return this.each(function(i, elem) {
				if(elem[type+"Event"] && elem[type+"Event"].length){
					for(var i=0,len =elem[type+"Event"].length;i<len;i++ ){
						if(typeof elem[type+"Event"][i] === 'function' ){
							G.public.removeEvent(elem, type,elem[type+"Event"][i]);
							delete elem[type+"Event"][i];
							elem[type+"Event"].length--;
						}
					}
				}
			});
		},
		hover: function(fn1, fn2) {
			this.mouseenter(fn1);
			this.mouseleave(fn2);
			return this
		},
		//触发自定义事件
		trigger: function(type) {
	        return this.each(function(i,elem){
				G.public.trigger(elem,type)
			})
	    }
	});
	//DOM其他事件
	var	domEvents = ("blur focus input focusin focusout load resize scroll unload click dblclick " +
					"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
					"change select submit keydown keypress keyup error contextmenu").split(' ');
	//DOM其他事件注册
	G.each(domEvents, function(i, type) {
		G.fn[type] = function(fn) {
			return this.on(type, null, fn)
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
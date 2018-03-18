/**gjTool.js
 * 移动端事件相关 touch.js
 * @author Gao Jin
 * @update 2018/03/17 17:53
 */
 ;(function(G,g){
 	//event事件对象封装
 	var n = {};
	n.TouchEvent = function (event,type){
		var e = g.event || event;
		this.preventDefault = function() {
			return e.preventDefault ? e.preventDefault() : e.returnValue = false
		}
		this.stopPropagation = function() {
			return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
		}
		this.target = e.target || e.srcElement;
		this.srcElement = e.srcElement;
		this.keyCode = e.keyCode != undefined ? e.keyCode : ( e.which != undefined ? e.which : (e.charCode != undefined ? e.charCode : undefined));
		this.which = e.which;
		this.type = type;
		this.returnValue = e.returnValue;
		this.cancelBubble = e.cancelBubble;
		this.bubbles = e.bubbles;
		this.ctrlKey = e.ctrlKey;
		this.altKey = e.altKey;
		this.shiftKey = e.shiftKey;
		this.touches = e.touches;
		this.targetTouches = e.targetTouches;
		this.changedTouches = e.changedTouches;
		this.originalType = e.type;
		this.originalEvent = e;
	}
 	
 	// touch事件封装
 	var touchEvent = {};
 	//点按事件
 	touchEvent.tap = function(ele,fnc){
 		var startTime = 0,   
	    	delayTime = 200,   
	   		isMove = false;  
		ele.addEventListener("touchstart", function(e){
			startTime = Date.now();  
		})
		ele.addEventListener("touchmove", function(e){
			isMove = true;   
		})
		ele.addEventListener("touchend", function(e){
        	if(isMove) return isMove = false;    
        	if(Date.now()-startTime>delayTime) return;    
        	fnc(new n.TouchEvent(e,'tap'));   
		})
 	}
 	function  attr(elem,attrName,value){
		if(arguments.length < 2) return;
		if(arguments.length == 2){
			return elem.getAttribute(attrName);
		}
		elem.setAttribute(attrName,value);
	}
	var eventStore={};
	var eventId='eventId'+new Date().getTime();
	var uuid=0;
	function addEvent (elem,type,func){
		if(elem && type && func){
			var eId=attr(elem,eventId);
			if(!eId){
				eId='eid'+(++uuid);
				attr(elem,eventId,eId);
				eventStore[eId]={};
			}
			var fArr=eventStore[eId][type];
			if(!fArr){
				fArr=eventStore[eId][type]=[];
			}
			fArr.push(func);
		}
	}

	function removeEvent (elem,type){
		var event = elem[type+"Event"];
		var eId=attr(elem,eventId);
		if(elem && type && event && eId){
			var fArr=eventStore[eId][type];
			if(fArr){					 
				for(var i=0;i<fArr.length;i++){
					if(event == fArr[i]){
						delete fArr[i];
						fArr.length--;
						elem[type+"Event"] = null;
					}
				}
			}
		}
	}
	function triggerEvent (elem,type){
		var eId=attr(elem,eventId);
		if(elem && type && eId){
			var fArr=eventStore[eId][type];
			if(fArr){					 
				for(var i=0;i<fArr.length;i++){
					if(typeof fArr[i]=='function'){
						fArr[i].call(elem);
					}
				}
			}
		}
	}
 	G.fn.extend({
 		touch: function(type, selector, fn){
 			if(G.isFunction(selector)) {
				fn = selector;
				selector = null
			}
			return this.each(function(i, ele) {
				if(!checkTouch(type)){
					return;
				}
				if(selector) {
					var fnc = function(e) {
						G(ele).find(selector).each(function(i, el) {
							if(el === e.target) {
								fn.call(el, e)
							}
						})
					}
				} else {
					var fnc = function(e) {
						fn.call(ele, e)
					}
				}
				ele[type+'Event'] = function(){
					touchEvent[type](ele,fnc);
				}
				addEvent(ele,type,ele[type+'Event'])
				triggerEvent(ele,type)
			})
 		},
 		untouch: function(type){
 			return this.each(function(i, ele) {
				removeEvent(ele,type)
			});
 		}
 	})

 	var touchEvents = ("tap longTap singleTap doubleTap swipe swipeLeft swipeRight swipeUp swipeDown gesturestart gesturechange gestureend").split(' ');
 	var checkTouch = function(type){
 		for(var i=0,len=touchEvents.length;i<len;i++){
 			if(touchEvents[i] == type){
 				return true
 			}
 		}
 		return false
 	}
 })(gjTool,typeof window !== 'undefined' ? window : this)

// 手势事件只是概念型，目前还没有浏览器原生支持，按照概念可分为gesturestart gesturechange gestureend 三种事件

// gesturestart：当有两根或多根手指放到屏幕上的时候触发

// gesturechange：当有两根或多根手指在屏幕上，并且有手指移动的时候触发

// gestureend：当倒数第二根手指提起的时候触发，结束gesture

 

// 按照定义，当分别将两根手指放到屏幕上的时候，会有如下顺序的事件触发：

// 1、第一根手指放下，触发touchstart

// 2、第二根手指放下，触发gesturestart

// 3、触发第二根手指的touchstart

// 4、立即触发gesturechange

// 5、手指移动，持续触发gesturechange

// 6、第二根手指提起，触发gestureend，以后将不会再触发gesturechange

// 7、触发第二根手指的touchend

// 8、触发touchstart（多根手指在屏幕上，提起一根，会刷新一次全局 touch，重新触发第一根手指的touchstart）

// 9、提起第一根手指，触发touchend
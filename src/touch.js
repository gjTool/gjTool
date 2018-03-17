/**gjTool.js
 * 移动端事件相关 touch.js
 * @author Gao Jin
 * @update 2018/03/18 23:53
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
 	var touchstart, touchmove,touchend;    
    if (typeof(g.ontouchstart) != 'undefined') {    
        touchstart = 'touchstart';    
        touchmove = 'touchmove';    
        touchend='touchend';    
    } else if (typeof(g.onmspointerdown) != 'undefined') {    
        touchstart = 'MSPointerDown';    
        touchmove = 'MSPointerMove';    
        touchend=  'MSPointerUp'; 
    } else {    
        touchstart = 'mousedown';    
        touchmove =  'mousemove';   
        touchend =  'mouseup';  
    } 
 	// touch事件封装
 	var touchEvent = {
 		touchstart : function(ele,fnc){
	 		ele.addEventListener(touchstart, function(e){
	 			e.preventDefault ? e.preventDefault() : e.returnValue = false
				fnc(new n.TouchEvent(e,touchstart));  
			})
	 	},
	 	touchmove :function(ele,fnc){
	 		ele.addEventListener(touchmove, function(e){
	 			e.preventDefault ? e.preventDefault() : e.returnValue = false
				fnc(new n.TouchEvent(e,touchmove));  
			})
	 	}, 
	 	touchend: function(ele,fnc){
	 		ele.addEventListener(touchend, function(e){
	 			e.preventDefault ? e.preventDefault() : e.returnValue = false
				fnc(new n.TouchEvent(e,touchend));  
			})
	 	},
	 	touchcancel: function(ele,fnc){
	 		ele.addEventListener("touchcancel", function(e){
				fnc(new n.TouchEvent(e,'touchcancel'));  
			})
	 	} 
 	};
 	
 	//长按事件
 	touchEvent.longTap = function(ele,fnc){
 		var startTime = 0,   
	   		isMove = false,
	   		delayTime = 250,
	   		startPos,
	   		movePos,
	   		endPos; 
   		touchEvent.touchstart(ele,function(e){
   			var touch = event.targetTouches[0];
   			startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};  
   			startTime = Date.now(); 
   			isMove = false; 
   		})
		touchEvent.touchmove(ele,function(e){
			var touch = event.targetTouches[0];
			movePos = {x:touch.pageX,y:touch.pageY,time:+new Date}; 
			if(Math.abs(startPos.x-movePos.x) > 10 || Math.abs(startPos.y-movePos.y) > 10){
				isMove = true; 
			}
   		})
		touchEvent.touchend(ele,function(e){
			if(isMove) return;
        	if(Date.now()-startTime>delayTime && startTime!=0){
        		fnc(e);  
        	};   
        	
   		})
 	}
	//点按事件
 	touchEvent.tap = function(ele,fnc){
 		var startTime = 0,   
	   		delayTime = 200;
   		touchEvent.touchstart(ele,function(e){
   			startTime = Date.now();  
   		})
		touchEvent.touchend(ele,function(e){
        	if(Date.now()-startTime>delayTime) return;   
        	fnc(e);
   		})
 	}
 	//轻按事件
 	touchEvent.singleTap = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	
 	//双击事件
 	touchEvent.doubleTap = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	//滑动事件
 	touchEvent.swipe = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	//左滑
 	touchEvent.swipeLeft = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	//右滑
 	touchEvent.swipeRight = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	//上滑
 	touchEvent.swipeUp = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	//下滑
 	touchEvent.swipeDown = function(ele,fnc){
 		this.tap(ele,fnc)
 	}
 	G.fn.extend({
 		touch: function(type, selector, fn){
 			if(!checkTouch(type)){
				return;
			}
 			if(G.isFunction(selector)) {
				fn = selector;
				selector = null
			}
			return this.each(function(i, ele) {
				var fnc;
				if(selector) {
					fnc = function(e) {
						G(ele).find(selector).each(function(i, el) {
							if(el === e.target) {
								e.preventDefault();
								e.stopPropagation();
								fn.call(el, e)
							}
						})
					}
				} else {
					fnc = function(e) {
						e.preventDefault();
						e.stopPropagation();
						fn.call(ele, e)
					}
				}
				ele[type+'Event'] = function (){
					if(touchEvent[type]){
						touchEvent[type](ele,fnc);
					}
				}
				G.public.addEvent(ele, type, ele[type+'Event'])
				G.public.trigger(ele,type)
			})
 		}
 	})

 	var touchEvents = ("touchstart touchmove touchend touchcancel  tap longTap singleTap doubleTap swipe swipeLeft swipeRight swipeUp swipeDown").split(' ');
 	var checkTouch = function(type){
 		for(var i=0,len=touchEvents.length;i<len;i++){
 			if(touchEvents[i] == type){
 				return true
 			}
 		}
 		return false
 	}
 	//touch事件注册
	G.each(touchEvents, function(i, type) {
		G.fn[type] = function(fn) {
			return this.touch(type, null, fn)
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
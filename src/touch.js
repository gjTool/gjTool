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
			e.preventDefault ? e.preventDefault() : e.returnValue = false
		}
		this.stopPropagation = function() {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
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
    var addEvent = function(elem,type,handles){
    	if(!elem[type+"Touch"]){
    		elem[type+"Touch"] = {};
    	}
        for(var item in handles){
        	elem[type+"Touch"][item] = handles[item];
        	G.public.addEvent(elem,item,handles[item]);
        }
    }
 	// touch事件封装
 	var touchEvent = {
 		touchstart : function(elem,type,fnc){
           var handles = {
                touchstart : function( e ){
                	e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    fnc(new n.TouchEvent(e,touchstart)); 
                }
            };
           addEvent(elem,type,handles);
	 	},
	 	touchmove :function(elem,type,fnc){
	 		var handles = {
                touchmove : function( e ){
                	e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    fnc(new n.TouchEvent(e,touchmove)); 
                }
            };
            addEvent(elem,type,handles);
	 	}, 
	 	touchend: function(elem,type,fnc){
	 		var handles = {
                touchend : function( e ){
                    fnc(new n.TouchEvent(e,touchend)); 
                }
            };
            addEvent(elem,type,handles);
	 	},
	 	touchcancel: function(elem,type,fnc){
	 		var handles = {
                touchcancel : function( e ){
                    fnc(new n.TouchEvent(e,touchcancel)); 
                }
            };
            addEvent(elem,type,handles);
	 	} 
 	};
 	
 	//长按事件
 	touchEvent.longTap = function(elem,type,fnc1,fnc2){

 		var startTx, startTy, lTapTimer,isMove = false,startTime = 0, delayTime = 750,

            clearTimer = function(){
                clearTimeout( lTapTimer );
                lTapTimer = null;
            },
	   	handles = {
	   		touchstart : function( e ){
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
                if( lTapTimer ){
                    clearTimer();
                }
                startTime = Date.now();
                var touches = e.targetTouches[0],
                    self = this;

                startTx = touches.clientX;
                startTy = touches.clientY;

                lTapTimer = setTimeout(function(){
                    fnc1.call( self, new n.TouchEvent(e,type) );
                }, delayTime );

            },

            touchmove : function( e ){
	   			e.preventDefault ? e.preventDefault() : e.returnValue = false;
                var touches = e.targetTouches[0],
                    moveTx = touches.clientX,
                    moveTy = touches.clientY;

                if( lTapTimer && (Math.abs(moveTx - startTx) > 5 || Math.abs(moveTy - startTy) > 5) ){
                    clearTimer();
                    isMove = true;
                }
            },

            touchend : function(e){
                if( lTapTimer ){
                    clearTimer();
                }
                var endTime = Date.now();
                if(endTime-startTime >= delayTime && startTime!=0 && !isMove ){
                	fnc2.call( this, new n.TouchEvent(e,type) );
                	startTime = 0;
                	isMove = false;
                }
            }
	   	}
	   	addEvent(elem,type,handles);
 	}
  	//点按事件
 	touchEvent.tap =  function(elem,type,fnc){
      var handles,startTx, startTy,startTime = 0, delayTime = 150;
        handles = {
            touchstart : function( e ){
            	e.preventDefault ? e.preventDefault() : e.returnValue = false;
                startTime = Date.now(); 
				var touches = e.targetTouches[0];
			    startTx = touches.clientX;
			    startTy = touches.clientY;
            },
            touchend : function( e ){
            	e.preventDefault ? e.preventDefault() : e.returnValue = false;
                var touches = e.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY,
                    endTime = Date.now();
                if(endTime-startTime < delayTime && startTime!=0 && ( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 )){
                    fnc.call( this, new n.TouchEvent(e,type));
                    startTime = 0;
	        		startTx = 0;
			    	startTy = 0;
                }
            }
        };
        addEvent(elem,type,handles);
 	}

 	//双击事件
 	touchEvent.doubleTap = function(elem,type,fnc){
 		var firstTouchEnd = true,
            lastTime = 0,
            lastTx = null,
            lastTy = null,
            startTx, startTy, dTapTimer, delayTime = 501,

            handles = {

                touchstart : function( e ){
                	e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    if( dTapTimer ){
                        clearTimeout( dTapTimer );
                        dTapTimer = null;
                    }

                    var touches = e.targetTouches[0];

                    startTx = touches.clientX;
                    startTy = touches.clientY;
                },

                touchend : function( e ){
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        now = Date.now(),
                        duration = now - lastTime;


                    if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
                        if( duration < delayTime ){
                            if( lastTx !== null && Math.abs(lastTx - endTx) < 45 && Math.abs(lastTy - endTy) < 45  ){
                                firstTouchEnd = true;
                                lastTx = lastTy = null;
                                fnc.call( e.target, new n.TouchEvent(e,type));
                                startTx = 0;
                    			startTy = 0;
                    			lastTime = 0;
                            }
                        }
                        else{
                            lastTx = endTx;
                            lastTy = endTy;
                        }
                    }
                    else{
                        firstTouchEnd = true;
                        lastTx = lastTy = null;
                    }

                    lastTime = now;
                }

            };
           addEvent(elem,type,handles);
 	}
 	
 	//滑动事件
 	touchEvent.swipe = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//左滑
 	touchEvent.swipeLeft = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//右滑
 	touchEvent.swipeRight = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//上滑
 	touchEvent.swipeUp = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//下滑
 	touchEvent.swipeDown = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	var swipeEvent = function(elem,type,fnc){
 		var startTx, startTy, isTouchMove,
 		 handles = {

                touchstart : function( e ){
                    var touches = e.touches[0];

                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                },

                touchmove : function( e ){
                    isTouchMove = true;
                },

                touchend : function( e ){
                    if( !isTouchMove ){
                        return;
                    }

                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx,
                        distanceY = startTy - endTy,
                        isSwipe = false;

                    if( Math.abs(distanceX) >= Math.abs(distanceY) ){
                        if( distanceX > 20 ){
                            isSwipe = true;
                            if( type === 'swipeLeft' ){
                                fnc.call( this, new n.TouchEvent(e,type) );
                            }
                        }
                        else if( distanceX < -20 ){
                            isSwipe = true;
                            if( type === 'swipeRight' ){
                                fnc.call( this, new n.TouchEvent(e,type));
                            }
                        }
                    }
                    else{
                        if( distanceY > 20 ){
                            isSwipe = true;
                            if( type === 'swipeUp' ){
                                fnc.call( this, new n.TouchEvent(e,type) );
                            }
                        }
                        else if( distanceY < -20 ){
                            isSwipe = true;
                            if( type === 'swipeDown' ){
                                fnc.call( this, new n.TouchEvent(e,type));
                            }
                        }
                    }

                    if( isSwipe && type === 'swipe' ){
                        fnc.call( this, new n.TouchEvent(e,type));
                    }
                }

            };
        addEvent(elem,type,handles);
 	}
 	G.fn.extend({
 		touch: function(type, selector, fn1,fn2){
 			
 			if(!checkTouch(type)){
				return;
			}
			if(G.isFunction(selector) && G.isFunction(fn1) ){
				fn2 = fn1;
				fn1 = selector;
				selector = null;
			}
 			if(G.isString(selector) && G.isFunction(fn1)  && G.isUndefined(fn2)) {
				fn2 = function(){}
			}
			if(G.isFunction(selector)  && G.isUndefined(fn1)  &&  G.isUndefined(fn2)) {
				fn1 = selector;
				selector = null;
				fn2 = function(){}
			}
			return this.each(function(i, elem) {
				if(G.isString(selector)) {
					G(elem).find(selector).each(function(i, ele) {
						if(ele === e.target) {
							if(touchEvent[type]){
								touchEvent[type](elem,type,fn1,fn2);
							}
						}
					})
					
				} else {
					if(touchEvent[type]){
						touchEvent[type](elem,type,fn1,fn2);
					}
				}
			})
 		},
 		untouch: function(type){
			return this.each(function(i,elem){
				if(elem[type+"Touch"]){
					for(var i in elem[type+"Touch"] ){
						if(typeof elem[type+"Touch"][i] === 'function' ){
							G.public.removeEvent(elem, i, elem[type+"Touch"][i]);
							delete elem[type+"Touch"][i];
						}
					}
				}
			})
	 	}
 	})

 	var touchEvents = ("touchstart touchmove touchend touchcancel  tap longTap doubleTap swipe swipeLeft swipeRight swipeUp swipeDown").split(' ');
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
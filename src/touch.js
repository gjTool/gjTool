/**gjTool.js
 * 移动端事件相关 touch.js
 * @author Gao Jin
 * @update 2018/04/20 23:53
 */
 ;(function(G,g){
 	//event事件对象封装
 	var n = {};
	n.TouchEvent = function (event,type,scale,rotate){
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
		this.rotate = rotate;
		this.scale = scale;
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
        	if((type === "pinch" || type === "pinchin" || type === "pinchout" || type === "pinchend" ) && item === "touchstart"  ){
        		G.public.addEvent(document,item,handles[item],false);
        	}else {
        		G.public.addEvent(elem,item,handles[item]);
        	}
        }
    }
 	// touch事件封装
 	var touchEvent = {
 		touchstart : function(elem,type,fnc){
           var handles = {
                touchstart : function( e ){
                    fnc(new n.TouchEvent(e,touchstart)); 
                }
            };
           addEvent(elem,type,handles);
	 	},
	 	touchmove :function(elem,type,fnc){
	 		var handles = {
                touchmove : function( e ){
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
 	touchEvent.press = function(elem,type,fnc1,fnc2){

 		var startTx, startTy, lTapTimer,isMove = false,startTime = 0, delayTime = 750,

            clearTimer = function(){
                clearTimeout( lTapTimer );
                lTapTimer = null;
            },
	   	handles = {
	   		touchstart : function( e ){
	   			
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
      var handles,startTx, startTy,startTime = 0, delayTime = 200;
        handles = {
            touchstart : function( e ){
            
                startTime = Date.now(); 
				var touches = e.targetTouches[0];
			    startTx = touches.clientX;
			    startTy = touches.clientY;
            },
            touchend : function( e ){
            	
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
 	touchEvent.doubletap = function(elem,type,fnc){
 		var firstTouchEnd = true,
            lastTime = 0,
            lastTx = null,
            lastTy = null,
            startTx, startTy, dTapTimer, delayTime = 501,

            handles = {

                touchstart : function( e ){
                	
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
 	touchEvent.swipeleft = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//右滑
 	touchEvent.swiperight = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//上滑
 	touchEvent.swipeup = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//下滑
 	touchEvent.swipedown = function(elem,type,fnc){
 		swipeEvent(elem,type,fnc)
 	}
 	//滑动事件
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
                            if( type === 'swipeleft' ){
                                fnc.call( this, new n.TouchEvent(e,type) );
                            }
                        }
                        else if( distanceX < -20 ){
                            isSwipe = true;
                            if( type === 'swiperight' ){
                                fnc.call( this, new n.TouchEvent(e,type));
                            }
                        }
                    }
                    else{
                        if( distanceY > 20 ){
                            isSwipe = true;
                            if( type === 'swipeup' ){
                                fnc.call( this, new n.TouchEvent(e,type) );
                            }
                        }
                        else if( distanceY < -20 ){
                            isSwipe = true;
                            if( type === 'swipedown' ){
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
 	
 	//捏合手势开始
 	touchEvent.pinchstart = function(elem,type,fnc){
 		pinchEvent(elem,type,fnc)
 	}
 	//捏合手势结束
 	touchEvent.pinchend = function(elem,type,fnc){
 		pinchEvent(elem,type,fnc)
 	}
 	//捏合手势
 	touchEvent.pinch = function(elem,type,fnc){
 		pinchEvent(elem,type,fnc)
 	}
 	//捏合手势放大
 	touchEvent.pinchout = function(elem,type,fnc){
 		pinchEvent(elem,type,fnc)
 	}
 	//捏合手势缩小
 	touchEvent.pinchin = function(elem,type,fnc){
 		pinchEvent(elem,type,fnc)
 	}
 
 	//捏合手势事件
 	var pinchEvent =  function(elem,type,fnc){
 		var istouch = false;
		var start = [];
		var $scale = 1;
		var $rotation = 0;
		function getDistance(p1, p2) {
			var x = p2.pageX - p1.pageX,
				y = p2.pageY - p1.pageY;
			return Math.sqrt((x * x) + (y * y));
		};
		function getAngle(p1, p2) {
			var x = p1.pageX - p2.pageX,
				y = p1.pageY - p2.pageY;
			return Math.atan2(y, x) * 180 / Math.PI;
		};
        handles = {
            touchstart : function( e ){
            	if(e.targetTouches.length >= 2) { //判断是否有两个点在屏幕上
            		e.preventDefault ? e.preventDefault() : e.returnValue = false
					istouch = true;
					start = e.targetTouches; //得到第一组两个点
					e.scale = $scale;
					e.rotation = $rotation;
					if( type === 'pinchstart' ){
                        fnc.call( this, new n.TouchEvent(e,type,e.scale,e.rotation) );
                    }
				};
            },
            touchmove : function( e ){
            	if(e.targetTouches.length >= 2 && istouch) {
            		e.preventDefault ? e.preventDefault() : e.returnValue = false
					var now = e.targetTouches; //得到第二组两个点
					var scale = getDistance(now[0], now[1]) / getDistance(start[0], start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
					var rotation = getAngle(now[0], now[1]) - getAngle(start[0], start[1]); //得到旋转角度，getAngle是得到夹角的一个方法
					e.scale = scale.toFixed(2);
					e.rotation = rotation.toFixed(2);
					if( type === 'pinch' ){
                        fnc.call( this, new n.TouchEvent(e,type,e.scale,e.rotation) );
                    }
                    if($scale < e.scale){
                    	if( type === 'pinchout' ){
	                        fnc.call( this, new n.TouchEvent(e,type,e.scale,e.rotation) );
	                    }
                    }
                    if($scale > e.scale){
                    	if( type === 'pinchin' ){
	                        fnc.call( this, new n.TouchEvent(e,type,e.scale,e.rotation) );
	                    }
                    }
                    $scale = e.scale;
                    $rotation = e.rotation;
				};
            },
            touchend : function( e ){
            	if(istouch) {
					istouch = false;
					e.scale = $scale;
					e.rotation = $rotation;
					if( type === 'pinchend' ){
                        fnc.call( this, new n.TouchEvent(e,type,e.scale,e.rotation) );
                    }
				};
            }
        };
        addEvent(elem,type,handles);
 	}
 	

 	G.fn.extend({
 		touch: function(type, selector, fn1,fn2){
 			if(!G.public.checkTouch(type)){
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
							if((type === "pinch" || type === "pinchin" || type === "pinchout" || type === "pinchend" ) && item === "touchstart"  ){
				        		G.public.removeEvent(document,item,handles[item],false);
				        		delete document[type+"Touch"][i];
				        	}else {
				        		G.public.removeEvent(elem,item,handles[item]);
				        		delete elem[type+"Touch"][i];
				        	}
						}
					}
				}
			})
	 	}
 	})
 	//touch模块事件
    G.public.touchEvents = ("touchstart touchmove touchend touchcancel press tap doubletap swipe swipeleft swiperight swipeup swipedown pinchend pinchstart pinchin pinchout pinch").split(' '),
 	// touch事件注册
	G.each(G.public.touchEvents, function(i, type) {
		G.fn[type] = function(fn) {
			return this.touch(type, null, fn)
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
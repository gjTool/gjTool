/**gjTool.js
 * 动画相关
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
 	//封装动画定时器
	if(!g.requestAnimationFrame) {
		var lastTime = 0;
		g.requestAnimationFrame = function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	}
	//封装清除动画定时器
	if(!g.cancelAnimationFrame) {
		g.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
	//动画相关
	G.extend({
		/*
		 t (time) 时间 
		 b (beginning position) 初始位置
		 c (change position) 距离
		 d (duration) 持续时间
		*/
		easing: {
			linear: function(t, b, c, d) { //匀速
				return c * t / d + b;
			},
			easeIn: function(t, b, c, d) { //加速曲线
				return c * (t /= d) * t + b;
			},
			easeOut: function(t, b, c, d) { //减速曲线
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function(t, b, c, d) { //先加速后减速曲线
				if((t /= d / 2) < 1) {
					return c / 2 * t * t + b;
				}
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		animate: function(elem, json, time, easing, fn) {
			var ie = G.browser.ie;
			if(G.isFunction(time)) {
				fn = time;
				time = 400
			}
			if(G.isFunction(easing)) {
				fn = easing;
				easing = 'easeInOut'
			}
			time = time || 400;
			easing = easing || 'easeInOut';
			//获取当前毫秒数
			var startTime = +new Date();
			//获取初始值
			var iCur = {};
			for(var attr in json) {
				if(attr == 'opacity') {
					iCur[attr] = Math.round(G.public.getStyle(elem, attr) * 100);
				} else {
					iCur[attr] = parseInt(G.public.getStyle(elem, attr));
				}
			}
			//清除定时器
			cancelAnimationFrame(elem.animationTimer);
			elem.timer = requestAnimationFrame(function func() {
				var d = time;
				var t = d - Math.max(0, startTime - (+new Date()) + d);
				for(var attr in json) {
					var end;
					if(attr == 'opacity') {
						end = json[attr] * 100;
					} else {
						end = parseInt(json[attr]);
					}
					var b = iCur[attr];
					var c = end - iCur[attr];
					var p = G.easing[easing](t, b, c, d);

					if(attr == 'display'){
						elem.style.display = json[attr];
					}else if(attr == 'opacity') {
						elem.style.opacity = p / 100;
						var op = elem.style.filter;
						if(op && op.indexOf(':') != -1) {
							elem.style.filter = 'alpha(opacity:' + p + ')';
						} else if(op && op.indexOf('=') != -1) {
							elem.style.filter = 'alpha(opacity=' + p + ')';
						}

					} else if(attr == 'scrollTop' || attr == 'scrollLeft') {
						elem[attr] = p;
					} else {
						if(json[attr] && json[attr].toString().indexOf('%') != -1) {
							elem.style[attr] = p + "%";
						} else {
							if(json[attr] && json[attr].toString().indexOf('px') != -1) {
								if(ie && ie < 9) {
									elem.style[attr] = p
								} else {
									elem.style[attr] = p + "px";
								}
							} else {
								if(!G.isNumber(json[attr])) {
									continue;
								}
								elem.style[attr] = p + "px";
							}

						}
					}
				}
				elem.animationTimer = requestAnimationFrame(func);
				//达到指定时间
				if(t == d) {
					//清除定时器
					cancelAnimationFrame(elem.animationTimer);
					//回调函数
					fn && fn
				}
			});
		},
		fadeIn: function(ele, speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
				speed = 400;
			}
			if(G.isFunction(speed)) {
				fn = speed;
				speed = 400;
				easying = "easeInOut"
			}
			if(G.public.getStyle(ele, 'opacity') == 1 && ele.style.display == 'block') {
				return;
			}
			var option = {
				opacity: ele.opacity ? Number(ele.opacity) : 1,
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			};
			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity') >= 1 ? 0 : G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			ele.isShow = true;
			ele.isHide = false;
			G(ele).css(option2).animate(option, speed, easying, function() {
				ele.style.display = option.display;
				ele.isShow = false;
				fn && fn();
			});
		},
		fadeOut: function(ele, speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
				speed = 400;
			}
			if(G.isFunction(speed)) {
				fn = speed;
				speed = 400;
				easying = "easeInOut"
			}
			if(ele.style.display != 'none') {
				ele.display = ele.style.display;
			}
			if(!ele.opacity) {
				ele.opacity = G.public.getStyle(ele, 'opacity');
			}
			var option = {
				opacity: 0,
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			};
			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			ele.isShow = false;
			ele.isHide = true;
			G(ele).css(option2).animate(option, speed, easying, function() {
				ele.style.display = "none";
				ele.isHide = false;
				fn && fn();
			});
		},
		fadeTo: function(ele, speed, opacity, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}

			if(ele.style.display != 'none') {
				ele.display = ele.style.display;
			}
			var option = {
				opacity: opacity
			};

			var option2 = {
				opacity: G.public.getStyle(ele, 'opacity'),
				display: (ele.display && ele.display != 'none') ? ele.display : 'block'
			}
			G(ele).css(option2).animate(option, speed, easying, function() {
				if(opacity == 0) {
					ele.style.display = 'none';
				}
				fn && fn();
			});
		}
	})

	function oldStyles(ele) {
		return {
			width: G.public.getStyle(ele, 'width'),
			height: G.public.getStyle(ele, 'height'),
			paddingTop: G.public.getStyle(ele, 'paddingTop'),
			paddingBottom: G.public.getStyle(ele, 'paddingBottom'),
			paddingLeft: G.public.getStyle(ele, 'paddingLeft'),
			paddingRight: G.public.getStyle(ele, 'paddingRight'),
			marginTop: G.public.getStyle(ele, 'marginTop'),
			marginBottom: G.public.getStyle(ele, 'marginBottom'),
			marginLeft: G.public.getStyle(ele, 'marginLeft'),
			marginRight: G.public.getStyle(ele, 'marginRight'),
			opacity: ele.opacity ? ele.opacity : G.public.getStyle(ele, 'opacity')
		}
	}

	function startStyles(ele) {
		return {
			width: G.public.getStyle(ele, 'width'),
			height: G.public.getStyle(ele, 'height'),
			paddingTop: G.public.getStyle(ele, 'paddingTop'),
			paddingBottom: G.public.getStyle(ele, 'paddingBottom'),
			paddingLeft: G.public.getStyle(ele, 'paddingLeft'),
			paddingRight: G.public.getStyle(ele, 'paddingRight'),
			marginTop: G.public.getStyle(ele, 'marginTop'),
			marginBottom: G.public.getStyle(ele, 'marginBottom'),
			marginLeft: G.public.getStyle(ele, 'marginLeft'),
			marginRight: G.public.getStyle(ele, 'marginRight'),
			opacity: G.public.getStyle(ele, 'opacity'),
			display: (ele.display && ele.display != 'none') ? ele.display : 'block',
			overflow: "hidden"
		}
	}

	function startStyles2(ele) {
		return {
			width: 0,
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			paddingRight: 0,
			marginTop: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			opacity: 0,
			display: (ele.display && ele.display != 'none') ? ele.display : 'block',
			overflow: "hidden"
		}
	}
	//动画类
	G.fn.extend({
		//显示元素
		show: function(speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}
			if(G.isFunction(speed)) {
				fn = speed;
				easying = "easeInOut"
			}
			speed = speed ? speed : 0;
			return this.each(function(i, ele) {
				if(!ele.oldStyles) {
					ele.oldStyles = oldStyles(ele)
				}
				var start = startStyles(ele);
				if(ele.style.display == 'none') {
					start = startStyles2(ele);
				}
				ele.isShow = true;
				ele.isHide = false;
				if(speed == 0) {
					ele.isShow = false;
					ele.style.display = (ele.display && ele.display != 'none') ? ele.display : 'block';
					fn && fn();
					return;
				}
				ele.oldStyles.display = (ele.display && ele.display != 'none') ? ele.display : 'block';
				
				G(ele).css(start).animate(ele.oldStyles, speed, easying, function() {
					ele.style.display = (ele.display && ele.display != 'none') ? ele.display : 'block';
					ele.isShow = false;
					fn && fn();
				});
			})
		},
		//隐藏元素
		hide: function(speed, easying, fn) {
			if(G.isFunction(easying)) {
				fn = easying;
				easying = "easeInOut";
			}
			if(G.isFunction(speed)) {
				fn = speed;
				easying = "easeInOut"
			}
			speed = speed ? speed : 0;
			return this.each(function(i, ele) {
				if(!ele.oldStyles) {
					ele.oldStyles = oldStyles(ele)
				}
				if(ele.style.display != 'none') {
					ele.display = ele.style.display;
				}
				var start = startStyles(ele);
				var newStyles = startStyles2(ele);
				ele.isHide = true;
				ele.isShow = false;
				if(speed == 0) {
					ele.isHide = false;
					ele.style.display = 'none';
					fn && fn();
					return;
				}
				G(ele).css(start).animate(newStyles, speed, easying, function() {
					ele.style.display = 'none';
					ele.isHide = false;
					fn && fn();
				});
			})
		},
		toggle: function(speed, easing, fn) {
			return this.each(function(i, ele) {
				if(!ele.isHide && !ele.isShow) {
					if(ele.style.display == 'none') {
						G(ele).stop().show(speed, easing, fn)
					} else {
						G(ele).stop().hide(speed, easing, fn)
					}
					return;
				}
				if(ele.isHide) {
					G(ele).stop().show(speed, easing, fn)
				} else if(!ele.isHide) {
					G(ele).stop().hide(speed, easing, fn)
				}
			})
		},
		//淡入显示
		fadeIn: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeIn(ele, speed, easying, fn);
			})
		},
		//淡出隐藏
		fadeOut: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeOut(ele, speed, easying, fn);
			})
		},
		fadeTo: function(speed, opacity, easying, fn) {
			return this.each(function(i, ele) {
				G.fadeTo(ele, speed, opacity, easying, fn);
			})
		},
		fadeToggle: function(speed, easying, fn) {
			return this.each(function(i, ele) {
				if(!ele.isHide && !ele.isShow) {
					if(ele.style.display == 'none') {
						G(ele).stop().fadeIn(speed, easying, fn);
					} else {
						G(ele).stop().fadeOut(speed, easying, fn);
					}
					return;
				}
				if(ele.isHide) {
					G(ele).stop().fadeIn(speed, easying, fn);
				} else if(!ele.isHide) {
					G(ele).stop().fadeOut(speed, easying, fn);
				}
			})

		},
		animate: function(json, time, easing, fn) {
			if(G.isFunction(time)) {
				fn = time;
				time = 400
			}
			if(G.isFunction(easing)) {
				fn = easing;
				easing = 'easeInOut'
			}
			time = time || 400;
			easing = easing || 'easeInOut';
			var self = this;
			var elem = this[0];
			var fx = function() {
				self.each(function(i, elem) {
					cancelAnimationFrame(elem.animationTimer);
					G.animate(elem, json, time, easing)
				})
				elem.callbacTimer = setTimeout(function() {
					fn && fn()
				}, time);
			}
			G.queue(elem, fx).delay(elem, time);
			if(!elem.isdequeue) {
				G.dequeue(elem)
			}
			return this;
		},
		stop: function(stopAll, goToEnd) {
			var elem = this[0];
			//停止队列当前动画,队列其他继续
			if(stopAll === undefined) {
				cancelAnimationFrame(elem.animationTimer); //清除动画定时器
				clearTimeout(elem.callbacTimer); //清除回调函数定时器
				clearTimeout(elem.delayQueueTimer); //清除延时队列定时器
				G.dequeue(elem);
			}
			//停止队列所有动画
			if(stopAll === true && goToEnd === undefined) {
				elem["queueStore"] = [];
				this.each(function(i, elem) {
					cancelAnimationFrame(elem.animationTimer);
					clearTimeout(elem.callbacTimer);
					clearTimeout(elem.delayQueueTimer);
				})
			}
			//允许完成队列当前动画，队列其他停止
			if(stopAll === true && goToEnd === true) {
				elem["queueStore"] = [];
			}
			return this;
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
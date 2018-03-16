/**gjTool.js
 * 函数队列（异步函数同步执行）
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
	var dataArr = [];
	G.extend({
		//增加队列
		queue: function(elem, fn) {
			if(G.isFunction(elem)) {
				fn = elem;
				elem = document;
			}
			if(G.isArray(elem)) {
				fn = elem;
				elem = document;
			}
			if(G.isArray(fn)) {
				if(elem["queueStore"]) {
					for(var i = 0, len = fn.length; i < len; i++) {
						elem["queueStore"].push(fn);
					}
				} else {
					elem["queueStore"] = fn; //队列存储
					elem.isdequeue = false; //是否正在触发
				}
			} else if(G.isFunction(fn)) {
				if(elem["queueStore"]) {
					elem["queueStore"].push(fn);
				} else {
					elem["queueStore"] = []; //队列存储
					elem["queueStore"].push(fn)
					elem.isdequeue = false; //是否正在触发
				}
			}
			return this;
		},
		//延时
		delay: function(elem, time) {
			if(G.isNumber(elem)) {
				time = elem;
				elem = document;
			}
			elem["queueStore"].push(time);
			return this;
		},
		//取出队列并执行
		dequeue: function(elem, fn) {
			if(G.isFunction(elem)) {
				fn = elem;
				elem = document;
			}
			var self = this,
				list = elem["queueStore"];
			elem.isdequeue = true;
			if(list) {
				var el = list.shift();
			}
			if(typeof el == "number") {
				elem.delayQueueTimer = setTimeout(function() {
					self.dequeue(elem, fn);
				}, el);
			} else if(typeof el == "function") {
				var data = el.call(this);
				if(data !== undefined) {
					dataArr.push(data)
				}
				if(list.length) {
					self.dequeue(elem, fn);
				} else {
					elem.isdequeue = false;
					fn && fn.call(this, dataArr)
					dataArr = [];
				}
			} else {
				elem.isdequeue = false;
				fn && fn.call(this, dataArr)
				dataArr = [];
			}
			return this;
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
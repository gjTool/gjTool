/**gjTool.js
 * DOM操作
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
	G.fn.extend({
		//在当前元素节点之后插入内容、元素
		after: function(selector, move) {
			return this.each(function(i, elem) {
				var parent = elem.parentNode;
				var children = parent.children;
				for(var i = 0, len = children.length; i < len; i++) {
					if(children[i] == elem) {
						var next = children[i + 1];
						break;
					}
				}
				var lastChild = children[children.length - 1];
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						if(lastChild == elem) {
							parent.appendChild(arr[i].cloneNode(true))
						} else {
							parent.insertBefore(arr[i].cloneNode(true), next)
						}
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					if(lastChild == elem) {
						parent.appendChild(selector)
					} else {
						parent.insertBefore(selector, next)
					}
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						if(lastChild == elem) {
							parent.appendChild(node)
						} else {
							parent.insertBefore(node, next)
						}
					}
				}
			})
		},
		//在当前元素节点之前插入内容、元素
		before: function(selector, move) {
			return this.each(function(i, elem) {
				var parent = elem.parentNode;
				var children = parent.children;
				for(var i = 0, len = children.length; i < len; i++) {
					if(children[i] == elem) {
						var prev = children[i - 1];
						break;
					}
				}
				var firstChild = children[0];
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						if(firstChild == elem) {
							parent.insertBefore(arr[i].cloneNode(true), elem)
						} else {
							parent.insertBefore(arr[i].cloneNode(true), prev)
						}
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					if(firstChild == elem) {
						parent.insertBefore(selector, elem)
					} else {
						parent.insertBefore(selector, prev)
					}
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						if(firstChild == elem) {
							parent.insertBefore(node, elem)
						} else {
							parent.insertBefore(node, prev)
						}
					}
				}
			})
		},
		
		//在被选元素的内部结尾插入内容
		append: function(selector, move) {
			return this.each(function(i, elem) {
				if(G.isString(selector)) {
					var arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						elem.appendChild(arr[i].cloneNode(true));
					}
				} else if(G.isHTMLElement(selector)) {

					if(!move) {
						selector = selector.cloneNode(true);
					}
					elem.appendChild(selector)
				}else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						elem.appendChild(node)
					}
				}
			})

		},
		//在被选元素的内部开头插入内容
		prepend: function(selector, move) {
			return this.each(function(i, elem) {
				var firstChild = elem.children[0];
				if(G.isString(selector)) {
					arr = G.public.parseHtml(selector);
					for(var i = 0, len = arr.length; i < len; i++) {
						elem.insertBefore(arr[i].cloneNode(true), firstChild)
					}
				} else if(G.isHTMLElement(selector)) {
					if(!move) {
						selector = selector.cloneNode(true)
					}
					elem.insertBefore(selector, firstChild)
				} else if(selector.length){
					for(var i=0,len=selector.length;i<len;i++){
						var node = selector[i];
						if(!move) {
							node = node.cloneNode(true);
						}
						elem.insertBefore(node, firstChild)
					}
				}
			})
		},
		remove: function() {
			return this.each(function(i, elem) {
				if(G.isHTMLElement(elem) && elem.parentNode) {
					var parentNode = elem.parentNode;
					parentNode.removeChild(elem);
				}
			})
		},
		clone: function(){
			var arr = [];
			this.each(function(i, elem) {
				arr.push(elem.cloneNode(true)) 
			})
			return this.toArray(arr);
		},
		//将被选元素插入selector的内部
		appendTo: function(selector) {
			return this.each(function(i, elem) {
				var node = elem.cloneNode(true);
				G(selector).each(function(i,elem2){
					elem2.appendChild(node)
				})
			})
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
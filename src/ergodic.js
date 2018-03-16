/**gjTool.js
 * 遍历实例对象
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
 	//获取父级节点
	var getParentNode = function(elem, arr) {
		if(!G.isHTMLElement(elem)) {
			return arr
		}
		if(elem.parentNode == document) {
			return arr
		}
		arr.push(elem.parentNode);
		return getParentNode(elem.parentNode, arr)
	}
	G.fn.extend({
		//eq返回的是gjTool实例
		eq: function(num) {
			num = Number(num);
			if(isNaN(num)) {
				if(console && console.warn){
					console.warn("eq parameter invalid !");
				}
				return this
			}
			return G(this[num])
		},
		index: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return null
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i] == elem) {
						return Number(i)
					}
				}
			}else if(arr){
				return 0;
			}

			return null
		},
		parent: function(selector) {
			var arr = [],
				arr2 = [];
			for(var i = 0, len = this.length; i < len; i++) {
				var elem = this[i];
				arr.push(elem.parentNode)
			}
			arr = G.unique(arr);
			if(G.isString(selector)) {
				for(var j = 0, len = arr.length; j < len; j++) {
					if(arr[j].tagName.toLowerCase() == selector || (selector.indexOf("#") != -1 && arr[j].id == selector.replace('#', "")) || (selector.indexOf(".") != -1 && G(arr[j]).hasClass(selector.replace('.', "")))) {
						arr2.push(arr[j])
					}
				}
				return this.toArray(arr2)
			} else {
				return this.toArray(arr)
			}
		},
		parents: function(selector) {
			var arr = [],
				arr2 = [];
			for(var i = 0, len = this.length; i < len; i++) {
				var elem = this[i];
				arr = getParentNode(elem, arr)
			}
			arr = G.unique(arr);
			if(G.isString(selector)) {
				for(var j = 0, len = arr.length; j < len; j++) {
					if(arr[j].tagName.toLowerCase() == selector || (selector.indexOf("#") != -1 && arr[j].id == selector.replace('#', "")) || (selector.indexOf(".") != -1 && G(arr[j]).hasClass(selector.replace('.', "")))) {
						arr2.push(arr[j])
					}
				}
				return this.toArray(arr2)
			} else {
				return this.toArray(arr)
			}
		},
		children: function(selector) {
			var elem = this[0];
			var m = G.public.regSelector.exec(selector);
			var arr2 = [];

			this.each(function(i, elem) {
				if(!G.isHTMLElement(elem)) {
					return
				}
				var arr = elem.children;
				if(selector === undefined) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(G.isHTMLElement(arr[i])) {
							arr2.push(arr[i]);
						}
					}
				} else if(m) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(G.isHTMLElement(arr[i])) {
							if(m[1]) { // id选择器
								if(arr[i].id == m[1]) {
									arr2.push(arr[i])
								}
							} else if(m[2]) { // class选择器
								if(G.public.regName(m[2]).test(arr[i].className)) {
									arr2.push(arr[i])
								}
							} else if(m[3]) { //通配符选择器
								arr2.push(arr[i])
							} else if(m[4]) { //标签选择器
								if(arr[i].tagName.toLowerCase() == m[4]) {
									arr2.push(arr[i])
								}
							}
						}
					}
				}
			})
			return this.toArray(arr2)
		},
		
		siblings: function(selector) {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			var m = G.public.regSelector.exec(selector);
			var arr2 = [];
			if(selector === undefined) {
				var arr = elem.parentNode.children;
				if(arr && arr.length >= 1) {
					for(var i = 0, len = arr.length; i < len; i++) {
						if(arr[i] != elem && G.isHTMLElement(arr[i])) {
							arr2.push(arr[i])
						}
					}
				}

			} else if(m) {
				this.each(function(i, elem) {
					var arr = elem.parentNode.children;
					if(arr && arr.length >= 1) {
						for(var i = 0, len = arr.length; i < len; i++) {
							if(G.isHTMLElement(arr[i]) && arr[i] != elem) {
								if(m[1]) { // id选择器
									if(arr[i].id == m[1]) {
										arr2.push(arr[i])
									}
								} else if(m[2]) { // class选择器
									if(G.public.regName(m[2]).test(arr[i].className)) {
										arr2.push(arr[i])
									}
								} else if(m[3]) { //通配符选择器
									arr2.push(arr[i])
								} else if(m[4]) { //标签选择器
									if(arr[i].tagName.toLowerCase() == m[4]) {
										arr2.push(arr[i])
									}
								}
							}
						}
					}

				})
			}
			return this.toArray(arr2)
		},
		prev: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			if(elem == document || elem == document.body || elem == document.documentElement) {
				return this;
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i + 1] == elem) {
						return this.toArray([arr[i]])
					}
				}
			}
			return this;
		},
		next: function() {
			var elem = this[0];
			if(!G.isHTMLElement(elem)) {
				return this
			}
			if(elem == document || elem == document.body || elem == document.documentElement) {
				return this;
			}
			var arr = elem.parentNode.children;
			if(arr && arr.length >= 1) {
				for(var i = 1, len = arr.length; i < len; i++) {
					if(arr[i - 1] == elem) {
						return this.toArray([arr[i]])
					}
				}
			}
			return this;
		},
		first: function() {
			return this.find(this[0])
		},
		last: function() {
			return this.find(this[this.length - 1])
		}
	})
	
 })(gjTool)
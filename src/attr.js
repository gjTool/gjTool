/**gjTool.js
 * 属性操作方法
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
;(function(G){
	G.fn.extend({
		attr: function(name, value) {
			if(G.isString(name) && (G.isString(value) || G.isBoolean(value) || !isNaN(value))) {
				return this.each(function(i, ele) {
					if(value == false || toString(value).trim() == "") {
						ele.removeAttribute(name)
					} else {
						ele.setAttribute(name, value)
					}

				})
			} else if(!value && G.isObject(name)) {
				return this.each(function(i, ele) {
					for(var i in name) {
						if(name[i] == false || name[i].trim() == "") {
							ele.removeAttribute(name)
						} else {
							ele.setAttribute(i, name[i])
						}
					}
				})
			} else if(!value && G.isString(name)) {
				return this[0].getAttribute(name)
			}
		},
		removeAttr: function(name) {
			if(G.isString(name)) {
				return this.each(function(i, ele) {
					ele.removeAttribute(name)
				})
			}
			return this
		},
		prop: function(name, value) {
			if(!G.isString(name)) {
				if(console && console.error){
					console.error("prop parameter invalid !");
				}
				return this
			}
			if((name == "innerText" || name == "innerHTML") && !name in this[0]) {
				name = "text"
			}
			if(name == "text" && !"text" in this[0]) {
				name = "textContent"
			}
			if(G.isString(name) && (value === false || value === true || value === "" || G.isString(value))) {
				return this.each(function(i, ele) {
					ele[name] = value
				})
			} else {
				return this[0][name]
			}
		},
		data: function(name, value) {
			if(G.isString(name) && name.trim() != "") {
				name = "data-" + name
			}
			return this.attr(name, value)
		},
		val: function(value) {
			return this.prop('value', value)
		},
		html: function(html) {
			return this.prop('innerHTML', html)
		},
		text: function(text) {
			return this.prop('innerText', "" + text)
		},
		empty: function() {
			return this.html('');
		}
	});

})(gjTool)
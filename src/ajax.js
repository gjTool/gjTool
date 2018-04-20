/**gjTool.js
 * ajax异步请求
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G,g){
	G.extend({
		ajax: function(obj) {
			var xmlhttp, type, url, async, dataType, data, cache, ifModified,timeout,mimeType,status;
			if(!G.isObject(obj)) {
				return false
			}
			type = obj.type == undefined ? 'get' : obj.type.toUpperCase();
			url = obj.url == undefined ? G.url : obj.url;
			async = obj.async == undefined ? true : obj.async;
			dataType = obj.dataType == undefined ? 'text' : obj.dataType.toUpperCase();
			data = obj.data == undefined ? {} : obj.data;
			timeout = obj.timeout == undefined ? "" : obj.timeout;
			mimeType = obj.mimeType == undefined ? "" : obj.mimeType; // 'text/plain; charset=x-user-defined'
			
			var formatParams = function() {
				if(G.isObject(obj)) {
					var str = "";
					for(var pro in data) {
						str += pro + "=" + data[pro] + "&"
					}
					data = str.substr(0, str.length - 1)
				}
				if(type == 'GET' || dataType == 'JSONP') {
					if(url.lastIndexOf('?') == -1) {
						url += '?' + data
					} else {
						url += '&' + data
					}
				}
				if(obj.cache === undefined || obj.cache == false) {
					url += "?t=" + Math.random()
				}
			}
			if(g.XMLHttpRequest) {
				xmlhttp = new XMLHttpRequest()
			} else {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
			}
			if(dataType == 'JSONP') {
				formatParams();
				if(G.isFunction(obj.beforeSend)) {
					obj.beforeSend(xmlhttp)
				}
				var callbackName = ('jsonp_' + Math.random()).replace(".", "");
				var oHead = document.getElementsByTagName('head')[0];
				data.callback = callbackName;
				var ele = document.createElement('script');
				ele.type = "text/javascript";
				ele.src = url;
				oHead.appendChild(ele);
				ele.onerror = function() {
					obj.error && obj.error("请求失败", xmlhttp)
				}
				var start = G.now();
				g[callbackName] = function(json) {
					xmlhttp.time = G.now() - start;
					oHead.removeChild(ele);
					g[callbackName] = null;
					status = 'success';
					obj.success && obj.success(json, xmlhttp)
					obj.complete && obj.complete(json, xmlhttp,status)
				}
				return
			} else {
				formatParams();
				if(mimeType !== ""){
					xmlhttp.open(type, url, true);
					xmlhttp.overrideMimeType(mimeType);
				}else {
					xmlhttp.open(type, url, async);
					xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
				}
				if(G.isFunction(obj.beforeSend)) {
					obj.beforeSend(xmlhttp)
				}
				//超时
				if(timeout !== ""){
					xmlhttp.ontimeout = function(){
					    status = 'timeout';
					}
					xmlhttp.timeout = timeout;
				}
				
				xmlhttp.send(data);
				var start = G.now();
				xmlhttp.onreadystatechange = function() {
					xmlhttp.time = G.now() - start;
					var res = "";
					if(xmlhttp.readyState != 4) {
						status = 'error';
						obj.error && obj.error("请求失败", xmlhttp);
						obj.complete && obj.complete("请求失败", xmlhttp,status)
						return
					}
					if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						if(dataType == 'JSON') {
							try {
								res = JSON.parse(xmlhttp.responseText)
							} catch(e) {
								if(G.browser.ie && G.browser.ie <= 7) {
									res = eval('(' + xmlhttp.responseText + ')')
								} else {
									res = "返回JSON格式不正确或者请尝试JSONP请求"
								}
							}
						} else if(dataType == 'XML') {
							res = xmlhttp.responseXML
						} else {
							if(url.toLowerCase().indexOf(".json") != -1) {
								try {
									res = JSON.parse(xmlhttp.responseText)
								} catch(e) {
									if(G.browser.ie && G.browser.ie <= 7) {
										res = eval('(' + xmlhttp.responseText + ')')
									} else {
										res = "返回JSON格式不正确或者请尝试JSONP请求"
									}
								}
							} else if(url.toLowerCase().indexOf(".xml") != -1) {
								res = xmlhttp.responseXML
							} else {
								res = xmlhttp.responseText
							}
						}
						status = 'success';
						obj.success && obj.success(res,xmlhttp)
						obj.complete && obj.complete(res,xmlhttp,status)
					}
				}
			}
		},
		get: function(string, data, fn) {
			if(G.isFunction(data)) {
				fn = data;
				data = {}
			}
			this.ajax({
				type: 'get',
				data: data,
				url: string,
				success: function(data, e) {
					fn && fn(data, e)
				},
				error: function(err, e) {
					fn && fn(err, e)
				}
			})
		},
		post: function(string, data, fn) {
			if(G.isFunction(data)) {
				fn = data;
				data = {}
			}
			this.ajax({
				type: 'post',
				data: data,
				url: string,
				success: function(data, e) {
					fn && fn(data, e)
				},
				error: function(err, e) {
					fn && fn(err, e)
				}
			})
		},
		getJSON: function(string, fn) {
			this.ajax({
				type: 'get',
				url: string,
				dataType: 'json',
				success: function(data) {
					fn && fn(data)
				},
				error: function(err) {
					fn && fn(err)
				}
			})
		},
		getXML: function(string, fn) {
			this.ajax({
				type: 'get',
				url: string,
				dataType: 'xml',
				success: function(data) {
					fn && fn(data)
				},
				error: function(err) {
					fn && fn(err)
				}
			})
		}
	});
 })(gjTool,typeof window !== 'undefined' ? window : this)
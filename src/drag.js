/**gjTool.js
 * 拖拽插件
 * @author Gao Jin
 * @update 2018/03/16 17:53
 */
 ;(function(G){
	//拖拽插件
	G.fn.extend({
		drag: function() {
			return this.each(function(i, elem) {
				G(elem).mousedown(function(e) {
					e.preventDefault();
					var o = G(this).offset();
					var disX = e.clientX - o.left;
					var disY = e.clientY - o.top;
					var self = this;
					G(document).mousemove(function(e) {
						if(self.nodrag) {
							return
						}
						e.preventDefault();
						var l = e.clientX - disX;
						var t = e.clientY - disY;

						var wid = document.documentElement.clientWidth;
						var hei = document.documentElement.clientHeight;
						var w = parseFloat(self.style.width);
						var h = parseFloat(self.style.height);
						l = l <= 0 ? 0 : (l >= wid - w ? wid - w : l);
						t = t <= 0 ? 0 : (t >= hei - h ? hei - h : t);
						self.style.left = l + 'px';
						self.style.top = t + 'px'
					});
					G(document).mouseup(function() {
						G(document).off('mousemove')
					})
				})
			})
		},
		nodrag: function(flag) {
			if(G.isUndefined(flag)) {
				flag = true
			}
			return this.each(function(i, elem) {
				elem.nodrag = flag
			})
		}
	})
 })(gjTool)
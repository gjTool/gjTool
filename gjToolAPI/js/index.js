"use strict";
//var Gj = $;
Gj(function() {
	var width = Gj(window).width();
	var height = Gj(window).height();
	var hw = Gj('.bar-left').width();
	var hh = Gj('.header').height();
	Gj('.type-con').css({
		width: (width-hw-20)+'px',
		height:  (height-hh)+'px'
	})
	Gj(".container").css({
		maxWidth: (width-hw)+'px',
		maxHeight: (height-hh)+'px',
		overflow: "hidden"
	})
	var ie = Gj.browser.ie;
	if(ie && ie == 8){
		Gj(".container").css('marginLeft',"0px")
	}
	
	
	Gj.get("view/bar-left/nav.html", function(html) {
		Gj('.bar-left .nav').html(html)
	})
	Gj.get("view/container/introduce-nav.html", function(html) {
		Gj('.type-con .sub-nav').html(html)
	})
	Gj.get("view/container/introduce-content.html", function(html) {
		Gj('.type-con .content').html(html)
	})
	Gj('.nav ').on("click", ".type", function() {
		var self = Gj(this),
			id = self.data("id");
		if(id == 'introduce'){
			Gj(".sub-nav").css({
				border: 'none'
			})
		}else {
			Gj(".sub-nav").css({
				borderBottom: '2px solid #c33'
			})
		}
		self.addClass('active').siblings().removeClass('active');
		if(id == "introduce"){
			Gj('.type-con').css({
				height:  (height-hh)+'px'
			})
			Gj(".container").css({
				overflowY: "hidden"
			})
		}else {
			Gj('.type-con').css({
				height: '100%'
			})
			Gj(".container").css({
				overflowY: "auto"
			})
		}
		Gj.get("view/container/" + id + "-nav.html", function(html) {
			Gj('.type-con .sub-nav').html(html)
		})
		Gj.get("view/container/" + id + "-content.html", function(html) {
			Gj('.type-con .content').html(html)
		})
	})
	Gj(".type-con ").on("click", ".sub-nav li", function() {
		var self = Gj(this),index = self.index();
		self.addClass('active').siblings().removeClass('active');
		var top = Gj(".content li").eq(index).offset().top;
		Gj(".container").animate({
			scrollTop: top-110
		});
	})
	Gj('.container').scroll(function() {
		var top = Gj('.container').scrollTop();
		if(top >= 40) {
			Gj('#backTop').stop().fadeIn(500);
		} else {
			Gj('#backTop').stop().fadeOut(500);
			Gj(".type-con .sub-nav li").removeClass('active')
		}
	})
	Gj('#backTop').on('click', function() {
		Gj('.container').animate({
			scrollTop: 0
		})
		Gj(".type-con .sub-nav li").removeClass('active')
	});
});
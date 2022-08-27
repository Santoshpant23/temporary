(function($) {	
	"use strict";
	
	/* Default Variables */
	var AxenOptions = {
		loader:true,
		security:""
	};
	
	if (typeof Axen!=="undefined") {
		jQuery.extend(AxenOptions, Axen);
	}
	
	$.Axen_Theme = {
	
		//Initialize
		init:function() {
			this.loader();
			this.menu();
			this.intro();
			this.textSlider();
			this.portfolio();
			this.testimonials();
			this.animation();
			this.blog();
			this.scroll();
		},
		
		//Page Loader
		loader:function() {
			if (AxenOptions.loader) {
				jQuery(window).on("load", function() {
					jQuery(".page-loader").fadeOut();
					jQuery(window).trigger("axen.complete");
				});
			} else {
				jQuery(document).ready(function() {
					jQuery(window).trigger("axen.complete");
				});
				
				jQuery(window).on("load", function() {
					jQuery(window).trigger("axen.complete");
				});
			}
		},
		
		//Menu
		menu:function() {
			//Open menu
			jQuery(".menu-btn-open").on("click", function(e) {
				e.preventDefault();
				
				jQuery(".menu-lightbox").fadeIn("normal", function() {
					jQuery(this).addClass("active");
				});
				
				jQuery(".menu-btn-close").addClass("loaded");
			});
			
			//Close menu
            var h = parseInt(jQuery(".menu-btn-close").data("height"), 10);
            var top = 60+h/2-11;
            
            jQuery(".menu-btn-close").css("top", top+"px");
            
			jQuery(".menu-btn-close").on("click", function(e) {
				e.preventDefault();
				
				jQuery(".menu-lightbox").delay(100).removeClass("active").delay(200).fadeOut("slow");
				jQuery(".menu-btn-close").removeClass("loaded");
			});
			
			//Menu item
			jQuery(".menu li a").on("click", function() {
				jQuery(".menu-btn-close").trigger("click");
			});
			
			//Submenu
			jQuery(".menu-lightbox").find(".menu > li.page_item_has_children > a").after('<i class="fa fa-angle-down"></i>');
			
			jQuery(".menu-lightbox").find("i").on("click", function(e) {
				e.preventDefault();
				var btn = jQuery(this);
				
				if (btn.hasClass("open")) {
					//Close submenu
					btn.removeClass("open");
					btn.css("transform", "rotate(0deg)");
					btn.next().slideUp();
				} else {
					//Close opened submenu
					var btn_old = jQuery(".menu-lightbox").find("i");
					
					if (btn_old.hasClass("open")) {
						btn_old.removeClass("open");
						btn_old.css("transform", "rotate(0deg)");
						btn_old.next().slideUp();
					}
					
					//Open submenu
					btn.addClass("open");
					btn.css("transform", "rotate(180deg)");
					btn.next().slideDown();
				}				
			});
		},
		
		//Intro
		intro:function() {
			if (jQuery(".intro").length===0) {return;}
			
			var bgImg, src, delay, arr;
			
			//Image background
			if (jQuery(".intro.image-bg").length>0) {
				bgImg = jQuery(".intro.image-bg");
				src = bgImg.data("source");
				
				if (src!==undefined && src!=="") {
					bgImg.backstretch(src);
				}
			}
			
			//Slide background
			if (jQuery(".intro.slide-bg").length>0) {
				bgImg = jQuery(".intro.slide-bg");
				src = bgImg.data("source");
				
				if (src!==undefined && src!=="") {
					delay = bgImg.data("delay") * 1000;		
					arr = src.split(",");
					bgImg.backstretch(arr, {duration:delay, fade:750});
				}
			}
			
			//Video background
			if (jQuery(".intro.video-bg").length>0) {
				//Hide loader on mobile
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
					jQuery(".player").hide();
					jQuery(".player-controls").hide();
				}
				
				//Youtube player
				jQuery(".player").mb_YTPlayer();
			
				//Player controls
				jQuery("#play").on("click", function() {
					jQuery(".player").playYTP();
				});
			
				jQuery("#pause").on("click", function() {
					jQuery(".player").pauseYTP();
				});
			}
		},
		
		//Text slider
		textSlider:function() {
			if (jQuery(".type-wrap").length===0) {return;}
			
			var arr = [];
			var i = 0;
			
			jQuery(".type-wrap > b").each(function() {
				arr[i] = jQuery(this).text();
				i++;
			});
			
			document.addEventListener('DOMContentLoaded', function() {
				var typed = new Typed("#typed", {
					strings:arr,
					typeSpeed:90,
					backSpeed:50,
					startDelay:1000,
					loop:true,
					loopCount:Infinity,
				});
			});
		},
		
		//Portfolio
		portfolio:function() {
			//Filters
			if (jQuery(".works-filters").length>0) {
				jQuery(".works-filters li").on("click", function(e) {
					e.preventDefault();
					
					var $that = jQuery(this);
					
					jQuery(".works-filters li").removeClass("active");
					$that.addClass("active");	
				});
			}
			
			//Mixitup
			if (jQuery(".works").length>0) {
				var $works = document.querySelector(".works");
				var mixer = mixitup($works, {
					selectors:{
						control:"[data-mixitup-control]"
					}
				});
			}
			
			//Portfolio item
			jQuery(".portfolio-item a").on("click", function(e) {
				e.preventDefault();
				
				var $that = jQuery(this);				
				
				if ($that.parent().find(".loading").length===0) {
					jQuery("<div />").addClass("loading").appendTo($that.parent());
					$that.parent().addClass("active");
		
					var $loading = jQuery(this).parent().find(".loading"),
						$container = jQuery("#portfolio-details"),
						$parent = $container.parent(), 
						timer = 1;
		
					if ($container.is(":visible")) {
						closeProject();
						timer = 800;
						$loading.animate({width:"70%"}, {duration:2000, queue:false});
					}
					
					setTimeout(function() {
						$loading.stop(true, false).animate({width:"70%"}, {duration:6000, queue:false});
						
						//Add AJAX query to the url
						var url = $that.attr("href")+"?ajax=1";
						
						jQuery.get(url).done(function(response) {
							$container.html(response);
                            
							$container.waitForImages(function() {
                                $loading.stop(true, false).animate({width:"100%"}, {duration:500, queue:true});

                                $loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
                                    $that.parent().removeClass('active');
                                    jQuery(this).remove();

                                    $container.css({opacity:0});
                                    $container.show().animate({opacity:1}, {duration:600, queue:false});

                                    jQuery(document).scrollTo($container, 600, {offset:{top:0, left:0}});
                                    $container.attr("data-current", $that.data("rel"));
                                }});
                            });
						}).fail(function() {
							$that.parent().removeClass("active");
							$loading.remove();
						});
					}, timer);
				}
			});
		
			//Close project
			var closeProject = function() {
				jQuery("#portfolio-details").animate({opacity:0}, {duration:600, queue:false, complete:function() {
					jQuery(this).hide().html("").removeAttr("data-current");
				}});
			};
			
			jQuery(document.body).on("click", "#portfolio-details .icon.close i", function() {
				closeProject();
			});
			
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = jQuery('[data-rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo("#portfolio", 0, {offset:{top:0, left:0}});
					
					jQuery(window).on("axen.complete", function() {
						$item.trigger("click");
					});
				}
			}
	
			jQuery('a[href^="#view-"]').on("click", function() {
				var $item = jQuery('[data-rel="'+jQuery(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo("#portfolio", AxenOptions.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger("click");
					}});
				}
			});
		},
		
		//Testimonials
		testimonials:function() {
			if (jQuery('.loop-testi').length===0) {return;}
			
			jQuery(".loop-testi").owlCarousel({
				center:true,
				loop:true,
				smartSpeed:600,
				responsive:{
					300:{
						items:1
					}
				}
			});
		},
		
		//Animation
		animation:function() {
			new WOW().init();
		},
		
		//Blog
		blog:function() {
			if (jQuery(".intro.blog").length>0) {
				var intro = jQuery(".intro.blog");
				var src = intro.data("source");
				
				if (src!==undefined && src!=="") {
					intro.backstretch(src);
				}
			}
		},
		
		//Scroll
		scroll:function() {
			
			var onScroll = function() {
				try {
					var pos = jQuery(document).scrollTop();
					
					jQuery(".menu a").each(function() {
						var that = jQuery(this);
						var target = jQuery(that.attr("href"));
						
						if (target.position() && target.position().top<=pos && (target.position().top+target.height())>pos) {
							jQuery(".menu li a").removeClass("active");
							that.addClass("active");
						} else {
							that.removeClass("active");
						}
					});
				} catch(err) {}
			};
			
			jQuery(document).on("scroll", onScroll);
			
			jQuery('.menu li a[href^="#"], .scroll-btn a[href^="#"]').on("click", function(e) {
				try {
					e.preventDefault();
					jQuery(document).off("scroll");
					
					jQuery("a").each(function() {
						jQuery(this).removeClass("active");
					});
					
					jQuery(this).addClass("active");
			
					var target = this.hash;
					var $target = jQuery(target);
					
					jQuery("html, body").stop().animate({
						"scrollTop":($target.offset().top+2)
					}, 500, "swing", function() {
						window.location.hash = target;
						jQuery(document).on("scroll", onScroll);
					});
				} catch(err) {}
			});
		},
	
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = "width="+w+", height="+h+", resizable=1";
	
			//Title
			if (typeof title==="undefined") {
				title = jQuery("title").text();
			} else if (typeof title==="string") {
				if (jQuery(title).length>0) {
					title = jQuery(title).text();
				}
			}
			
			//Image
			if (typeof image==="undefined") {
				image = "";
			} else if (typeof image==="string") {
				if (!/http/i.test(image)) {
					if (jQuery(image).length>0) {
						if (jQuery(image).is("img")) {
							image = jQuery(image).attr("src");
						} else {
							image = jQuery(image).find("img").eq(0).attr("src");
						}
					} else {
						image = "";
					}
				}
			}
			
			//Url
			if (typeof url==="undefined" || url==="") {
				url = document.location.href;
			} else {
				if (url==="single-portfolio") {
					url = document.location.protocol+"//"+document.location.host+document.location.pathname+"#view-"+jQuery("#portfolio-details").attr("data-current");
				} else {
					url = document.location.protocol+"//"+document.location.host+document.location.pathname+url;
				}
			}
			
			//Share
			if (network==="twitter") {
				return window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(title+" "+url), "share", params);
			} else if (network==="facebook") {
				return window.open("https://www.facebook.com/sharer/sharer.php?s=100&p[url]="+encodeURIComponent(url)+"&p[title]="+encodeURIComponent(title)+"&p[images][0]="+encodeURIComponent(image), "share", params);
			} else if (network==="pinterest") {
				return window.open("https://pinterest.com/pin/create/bookmarklet/?media="+image+"&description="+title+" "+encodeURIComponent(url), "share", params);
			} else if (network==="google") {
				return window.open("https://plus.google.com/share?url="+encodeURIComponent(url), "share", params);
			} else if (network==="linkedin") {
				return window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(url)+"&title="+title, "share", params);
			}
			
			return;
		}	
		
	};
	
	//Initialize
	$.Axen_Theme.init();

})(jQuery);

//Share Functions
function shareTo(network, title, image, url) {
	return jQuery.Axen_Theme.share(network, title, image, url);
}


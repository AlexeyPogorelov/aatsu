
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function ($) {
      return factory($);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node-like environment
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function(jQuery) {
  "use strict";

  function uaMatch( ua ) {
    // If an UA is not provided, default to the current browser UA.
    if ( ua === undefined ) {
      ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec( ua ) ||
        /(opr)[\/]([\w.]+)/.exec( ua ) ||
        /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(iemobile)[\/]([\w.]+)/.exec( ua ) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var platform_match = /(ipad)/.exec( ua ) ||
        /(ipod)/.exec( ua ) ||
        /(windows phone)/.exec( ua ) ||
        /(iphone)/.exec( ua ) ||
        /(kindle)/.exec( ua ) ||
        /(silk)/.exec( ua ) ||
        /(android)/.exec( ua ) ||
        /(win)/.exec( ua ) ||
        /(mac)/.exec( ua ) ||
        /(linux)/.exec( ua ) ||
        /(cros)/.exec( ua ) ||
        /(playbook)/.exec( ua ) ||
        /(bb)/.exec( ua ) ||
        /(blackberry)/.exec( ua ) ||
        [];

    var browser = {},
        matched = {
          browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
          version: match[ 2 ] || match[ 4 ] || "0",
          versionNumber: match[ 4 ] || match[ 2 ] || "0",
          platform: platform_match[ 0 ] || ""
        };

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
      browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    if ( matched.platform ) {
      browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
      browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
      browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
      browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
      browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if ( browser.rv || browser.iemobile) {
      var ie = "msie";

      matched.browser = ie;
      browser[ie] = true;
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if ( browser.edge ) {
      delete browser.edge;
      var msedge = "msedge";

      matched.browser = msedge;
      browser[msedge] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if ( browser.safari && browser.blackberry ) {
      var blackberry = "blackberry";

      matched.browser = blackberry;
      browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if ( browser.safari && browser.playbook ) {
      var playbook = "playbook";

      matched.browser = playbook;
      browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if ( browser.bb ) {
      var bb = "blackberry";

      matched.browser = bb;
      browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr ) {
      var opera = "opera";

      matched.browser = opera;
      browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android ) {
      var android = "android";

      matched.browser = android;
      browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if ( browser.safari && browser.kindle ) {
      var kindle = "kindle";

      matched.browser = kindle;
      browser[kindle] = true;
    }

     // Kindle Silk browsers are marked as Safari on Kindle
    if ( browser.safari && browser.silk ) {
      var silk = "silk";

      matched.browser = silk;
      browser[silk] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
  }

  // Run the matching process, also assign the function to the returned object
  // for manual, jQuery-free use if desired
  window.jQBrowser = uaMatch( window.navigator.userAgent );
  window.jQBrowser.uaMatch = uaMatch;

  // Only assign to jQuery.browser if jQuery is loaded
  if ( jQuery ) {
    jQuery.browser = window.jQBrowser;
  }

  return window.jQBrowser;
}));

// crossbrowser
var htmlBody = 'body';
if (jQuery.browser.name === 'mozilla' ) {
	htmlBody = 'html';
} else if (jQuery.browser.name == 'msie') {
	htmlBody = 'html';
}


	/* GLOBAL */
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
if (isTouchDevice || isTouch) {
	// $('body').css('overflow', 'auto');
};

var pagesState = {},
	touchState = {
		touchStart: {},
		touchEnd: {}
	};

pagesState.lastScrollTime = new Date().getTime() - 1000;
var pagesAnimation = (function  (id) {
	var $foreground = $('.foreground-holder');
	var plg = function (id) {
		if (id > 1) {
			$foreground.hide();
		} else {
			$foreground.show();
		}
	}
	return plg;
})();

var windowWidth = $(window).width();
var windowHeight = $(window).height();
var cacheDom = {};
$(window).load(function(){
	scrollPages.init();
	scrollPages.resize(true);
});

/* CACHE DOM */
cacheDom.$sections = $('.full-height');
cacheDom.$menu = $('#main-navigation');

/* IF RESIZE */
$(window).resize(function () {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	scrollPages.resize(pagesState.currentPage, true);
});

$(window).on('mousewheel', function (e) {
	e.preventDefault();
	e.stopPropagation();
	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
	// console.log(e)
	// console.log(delta)
	// console.log(e.originalEvent.wheelDelta)
	// console.info(e.originalEvent.wheelDeltaY)
	// console.log(pagesState.lastScrollTime - 50 < new Date().getTime())
	// console.log(pagesState.animatedBool)
	// console.log(" --- ")
	if ( !pagesState.animatedBool && pagesState.lastScrollTime - 50 < new Date().getTime() ) {
		if (delta > 40) {
			scrollPages.prevPage();
		} else if (delta < -40) {
			scrollPages.nextPage();
		}
	}
	pagesState.lastScrollTime = new Date().getTime();
});

$(window).on('DOMMouseScroll wheel', function (e) {
	e.preventDefault();
	e.stopPropagation();
	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;
	// console.log(e)
	// console.log(delta)
	// console.log(e.originalEvent.wheelDelta)
	// console.info(e.originalEvent.wheelDeltaY)
	if (!pagesState.animatedBool && pagesState.lastScrollTime - 50 < new Date().getTime()) {
		if (delta > 0) {
			scrollPages.prevPage();
		} else if (delta < 0) {
			scrollPages.nextPage();
		}
	}
	pagesState.lastScrollTime = new Date().getTime();
});

// 
$('body').on('touchstart', function (e) {
	// touchState.touchStart.xPos = e.originalEvent.touches[0].clientX;
	// touchState.touchStart.yPos = e.originalEvent.touches[0].clientY;
	touchState.touchStart.timeStamp = e.timeStamp;
	// console.log('-----');
});
$('body').on('touchmove', function (e) {
	e.preventDefault();
	touchState.touchEnd.xPos = e.originalEvent.touches[0].clientX;
	touchState.touchEnd.yPos = e.originalEvent.touches[0].clientY;

	if (!touchState.touchStart.xPos) {
		touchState.touchStart.xPos = touchState.touchEnd.xPos;
	}
	if (!touchState.touchStart.yPos) {
		touchState.touchStart.yPos = touchState.touchEnd.yPos;
	}
	// console.log('-----');
});
$('body').on('touchend', function (e) {
	if (pagesState.animatedBool) {
		return;
	}
	var distance = 70,
		speed = 200,
		deltaX = touchState.touchEnd.xPos - touchState.touchStart.xPos,
		deltaY = touchState.touchEnd.yPos - touchState.touchStart.yPos;

	// if (!deltaX || !deltaY) {
	// 	return;
	// }
		// time = e.timeStamp - touchState.touchStart.timeStamp;
	// console.log('-----');
	// console.log(time);
	// console.log(deltaX);
	// console.log(deltaY);
	// console.log(touchState.touchEnd.xPos);
	// console.log(touchState.touchEnd.yPos);

	if (deltaY > distance || deltaY < -distance) {
		if (deltaY < 0) {
			scrollPages.nextPage();
		} else {
			scrollPages.prevPage();
		}
	}

	touchState.touchEnd.xPos = null;
	touchState.touchEnd.yPos = null;
	touchState.touchStart.xPos = null;
	touchState.touchStart.yPos = null;
	deltaX = null;
	deltaY = null;

});

$('.modal-container, .col-left, .col-right, .col-full').on('DOMMouseScroll wheel mousewheel touchmove', function (e) {
	e.stopPropagation();
});

$(document).on('keydown', function (e) {
	switch (e.which) {
		case 38:
			e.preventDefault();
			if (!pagesState.animatedBool) {
				scrollPages.prevPage();
			}
			break;
		case 40:
			e.preventDefault();
			if (!pagesState.animatedBool) {
				scrollPages.nextPage();
			}
			break;
		case 33:
			e.preventDefault();
			if (!pagesState.animatedBool) {
				scrollPages.prevPage();
			}
			break;
		case 34:
			e.preventDefault();
			if (!pagesState.animatedBool) {
				scrollPages.nextPage();
			}
			break;
	}
});

var scrollPages = (function () {
	pagesState.currentPage;
	pagesState.pages = [];
	speed = 1000;
	var plg = {
		init: function () {
			this.definePages();
			this.resize();
		},
		definePages: function () {
			pagesState.pagesCount = 0;
			for (var i = 0; i < cacheDom.$sections.length; i++) {
				pagesState.pages.push({
					'id': cacheDom.$sections[i].id,
					'classes': cacheDom.$sections[i].classList,
					'top': cacheDom.$sections[i].offsetTop,
					'leave': cacheDom.$sections.eq(i).attr('data-leave'),
					'before': cacheDom.$sections.eq(i).attr('data-before'),
					'after': cacheDom.$sections.eq(i).attr('data-after')
				});
				pagesState.pagesCount++;
			}
		},
		toPage: function (id, resize) {

			var before, after, top;

			if (!pagesState.pages.length || pagesState.animatedBool) {
				return;
			}

			// console.log(id)

			if (id === undefined) {
				id = this.getIdFromHash();
				if (pagesState.pages[id] && pagesState.pages[id].before ) {
					window[ pagesState.pages[id].before ]();
				}
			}

			if (pagesState.pages[id] === undefined) {
				top = pagesState.pages[0].top + windowHeight;
				pagesState.currentPage = 0;
			} else {
				top = pagesState.pages[id].top;
			}

			if (pagesState.pages[id] && typeof pagesState.leave === 'function' ) {
				pagesState.leave();
				pagesState.leave = false;
			}
			if (pagesState.pages[id] && pagesState.pages[id].leave ) {
				pagesState.leave = window[ pagesState.pages[id].leave ];
			}

			if (pagesState.pages[id] && pagesState.pages[id].before) {
				before = window[ pagesState.pages[id].before ];
			}

			if (pagesState.pages[id] && pagesState.pages[id].after) {
				after = window[ pagesState.pages[id].after ];
			}

			if (!pagesState.animatedBool) {

				pagesState.animatedBool = true;

				if (typeof before === 'function') {
					before();
				}

				plg.makeActiveNav(pagesState.pages[id].id);

				$(htmlBody)
					.stop(false, false)
					.animate({'scrollTop': top}, speed, function () {
						pagesState.animatedBool = false;
						pagesState.currentPage = id;
						pagesAnimation(id);
						// document.location.hash = '#' + pagesState.pages[id].id;
						history.pushState({id: pagesState.pages[id].id}, pagesState.pages[id].id, '#' + pagesState.pages[id].id)
						if (typeof after === 'function') {
							after();
						}
					});

			}

		},
		nextPage: function () {
			if (pagesState.currentPage + 1 < pagesState.pagesCount) {
				this.toPage(++pagesState.currentPage);
			}
		},
		prevPage: function () {
			if (pagesState.currentPage > 0) {
				this.toPage(--pagesState.currentPage);
			}
		},
		getIdFromHash: function (hash) {
			var id = 0,
				curHash = hash || window.location.hash.substr(1);
			for (var i = 0; i < pagesState.pages.length; i++) {
				if (pagesState.pages[i].id == curHash) {
					pagesState.currentPage = i;
					return i;
				} else {
					id = 0;
					pagesState.currentPage = 0;
				}
			};
			return id;
		},
		navigation: function ($self) {
			if ( $self.attr('href') ) {
				if ( document.location.hash != $self.attr('href') ) {
					var id = plg.getIdFromHash($self.attr('href').substr(1));
					plg.toPage(id);
				}
			}
		},
		makeActiveNav: function (hash) {
			cacheDom.$menu.find('.active').removeClass('active');
			cacheDom.$menu.find('a').each(function () {
				var $self = $(this);
				if ($self.attr('href') == "#" + hash) {
					$self
						.parent()
						.addClass('active')
						.siblings()
						.removeClass('active');
					return false;
				}
			});
		},
		getCurrent: function () {
			return pagesState.currentPage;
		},
		resize: function () {
			for (var i = 0; i < pagesState.pages.length; i++) {
				pagesState.pages[i].top = cacheDom.$sections[i].offsetTop;
				if (pagesState.pages[i].full) {
					cacheDom.$sections.eq(i).height(windowHeight);
				}
			}
			this.toPage(pagesState.currentPage, true);
		}
	};

	$(window).on('resize', function () {
		plg.resize();
	})

	// $(window).on('popstate', function (e) {
	// 	e.preventDefault();
	// 	// history.go(-1);
	// 	plg.toPage();
	// });

	cacheDom.$menu.find('a').on('click', function (e) {
		e.preventDefault();
		if (/[#][\s]+/.test( $(this).attr('href') ) ) {
			alert();
		}
		plg.navigation($(this));
	})

	return plg;
})();


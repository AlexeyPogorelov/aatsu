	/* GLOBAL */
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
if (isTouchDevice || isTouch) {
	$('body').css('overflow', 'auto');
};

var pagesState = {};
var windowWidth = $(window).width();
var windowHeight = $(window).height();
var cacheDom = {};
$(window).load(function(){
	scrollPages.init();
	scrollPages.resize(true);
});


/* CACHE DOM */
cacheDom.$sections = $('.full-height');

/* IF RESIZE */
$(window).resize(function () {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	scrollPages.resize(pagesState.currentPage, true);
});

$(window).on('mousewheel DOMMouseScroll', function (e) {
	e.preventDefault();
	e.stopPropagation();
	// console.log(e)
	if (!pagesState.animatedBool) {
		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
			scrollPages.prevPage();
		} else {
			scrollPages.nextPage();
		}
	}
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
	speed = 800;
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
					'top': cacheDom.$sections[i].offsetTop
				});
				pagesState.pagesCount++;
			}
		},
		toPage: function (id, resize) {
			if (id === undefined) {
				id = this.getIdFromHash();
			}
			var top;
			if (pagesState.pages[id] === undefined && pagesState.pages.length > 0) {
				top = pagesState.pages[0].top + windowHeight;
				pagesState.currentPage = pagesState.pages.length;
			} else if (pagesState.pages.length > 0) {
				top = pagesState.pages[id].top;
			} else {
				top = 0;
			}
			if (resize) {
				pagesState.animatedBool = true;
				$('html, body')
					.stop(false, false)
					.animate({'scrollTop': top}, speed, function () {
						pagesState.animatedBool = false;
					});
			} else {
				pagesState.animatedBool = true;
				$('html, body')
					.stop(false, false)
					.animate({'scrollTop': top}, speed, function () {
						if (pagesState.pages[id]) {
							window.location.hash = pagesState.pages[id].id;
						}
						pagesState.animatedBool = false;
					});
			};
		},
		nextPage: function () {
			if (pagesState.currentPage + 1 < pagesState.pagesCount) {
				this.toPage(++pagesState.currentPage);
			}
		},
		prevPage: function () {
			if (pagesState.currentPage - 1 > 0) {
				this.toPage(--pagesState.currentPage);
			}
		},
		getIdFromHash: function (hash) {
			var id,
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
	return plg;
})();


	/* GLOBAL */
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
if (isTouchDevice || isTouch) {
	$('body').css('overflow', 'auto');
};

var pagesState = {};
pagesState.lastScrollTime = new Date().getTime() - 1000;

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

$(window).on('mousewheel wheel', function (e) {
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

$(window).on('DOMMouseScroll', function (e) {
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
		} else if (delta < -0) {
			scrollPages.nextPage();
		}
	}
	pagesState.lastScrollTime = new Date().getTime();
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

			if (!pagesState.pages.length) {
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

				$('body')
					.stop(false, false)
					.animate({'scrollTop': top}, speed, function () {
						pagesState.animatedBool = false;
						pagesState.currentPage = id;
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
			cacheDom.$menu.find('a').each(function () {
				var $self = $(this);
				if ($self.attr('href') == "#" + hash) {
					$self
						.parent()
						.addClass('active')
						.siblings()
						.removeClass('active');
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


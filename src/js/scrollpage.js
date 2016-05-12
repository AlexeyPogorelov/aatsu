
/* GLOBAL */
var animationPrefix = (function () {
		var t,
			el = document.createElement("fakeelement"),
			transitions = {
				"WebkitTransition": "webkitAnimationEnd",
				"transition": "animationend",
				"OTransition": "oAnimationEnd",
				"MozTransition": "animationend"
			};

		for (t in transitions){

			if (el.style[t] !== undefined){

				return transitions[t];

			}

		}

	})(),
	transitionPrefix = (function () {
		var t,
			el = document.createElement("fakeelement"),
			transitions = {
				"WebkitTransition": "webkitTransitionEnd",
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend"
			};

			for (t in transitions){

				if (el.style[t] !== undefined){

					return transitions[t];

				}

			}

	})(),
	pagesState = {},
	touchState = {
		touchStart: {},
		touchEnd: {}
	},
	windowWidth = $(window).width(),
	windowHeight = $(window).height(),
	cacheDom = {};

if ( jQuery.browser.mobile ) {
	$('body').addClass('mobile');
}


pagesState.lastScrollTime = new Date().getTime() - 1000;

var pagesAnimation = (function () {

	var $presentation = $('#presentation'),
		$foreground = $presentation.find('> .foreground-holder'),
		$background = $presentation.find('> .background-holder'),
		$socials = $('.socials-holder'),
		plg = function (id) {

			if ( id > 0 ) {

				$foreground.hide();

			} else {

				$foreground.show();

			}

			if ( id > 3 ) {

				$socials.removeClass('deactive');

			} else {

				$socials.addClass('deactive');

			}

		};

	return plg;

})();

$(window).load(function(){

	scrollPages.init();
	scrollPages.resize(true);

});

/* CACHE DOM */
cacheDom.$verticalViewport = $('#vertical-viewport');
cacheDom.$horizontalViewport = $('#horizontal-viewport');
cacheDom.$sections = cacheDom.$verticalViewport.find(' > .full-height');
cacheDom.$horizontal = cacheDom.$horizontalViewport.find(' > .full-height');
cacheDom.$menu = $('#main-navigation');

/* IF RESIZE */
$(window).on('resize', function () {

	windowWidth = $(window).width();
	windowHeight = $(window).height();

}).on('mousewheel', function (e) {

	e.preventDefault();
	e.stopPropagation();

	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

	if ( !pagesState.animatedBool && pagesState.lastScrollTime + 200 < new Date().getTime() ) {

		if (delta > 40) {

			scrollPages.prevPage();

		} else if (delta < -40) {

			scrollPages.nextPage();

		}

	}

	pagesState.lastScrollTime = new Date().getTime();

}).on('DOMMouseScroll wheel', function (e) {

	e.preventDefault();
	e.stopPropagation();

	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;

	if ( !pagesState.animatedBool && pagesState.lastScrollTime + 200 < new Date().getTime() ) {

		if (delta > 0) {

			scrollPages.prevPage();

		} else if (delta < 0) {

			scrollPages.nextPage();

		}

	}
	pagesState.lastScrollTime = new Date().getTime();

});

$('body').on('touchstart', function (e) {

	touchState.touchStart.timeStamp = e.timeStamp;

}).on('touchmove', function (e) {

	e.preventDefault();
	touchState.touchEnd.xPos = e.originalEvent.touches[0].clientX;
	touchState.touchEnd.yPos = e.originalEvent.touches[0].clientY;

	if (!touchState.touchStart.xPos) {
		touchState.touchStart.xPos = touchState.touchEnd.xPos;
	}
	if (!touchState.touchStart.yPos) {
		touchState.touchStart.yPos = touchState.touchEnd.yPos;
	}

}).on('touchend', function (e) {
	if (pagesState.animatedBool) {
		return;
	}
	var distance = 70,
		speed = 200,
		deltaX = touchState.touchEnd.xPos - touchState.touchStart.xPos,
		deltaY = touchState.touchEnd.yPos - touchState.touchStart.yPos;

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

// $('.modal-container, .col-left, .col-right, .col-full').on('DOMMouseScroll wheel mousewheel touchmove', function (e) {
$('.modal-container').on('DOMMouseScroll wheel mousewheel touchmove', function (e) {

	e.stopPropagation();

});

$(document).on('keydown', function (e) {

	if (pagesState.animatedBool) return;

	switch (e.which) {
		case 38:
			e.preventDefault();
			scrollPages.prevPage();
			break;
		case 40:
			e.preventDefault();
			scrollPages.nextPage();
			break;
		case 33:
			e.preventDefault();
			scrollPages.prevPage();
			break;
		case 34:
			e.preventDefault();
			scrollPages.nextPage();
			break;
	}

});

var scrollPages = (function () {
	pagesState.pages = [];
	speed = 1700;
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
					// 'left': cacheDom.$sections[i].offsetLeft,
					'leave': cacheDom.$sections.eq(i).attr('data-leave'),
					'before': cacheDom.$sections.eq(i).attr('data-before'),
					'after': cacheDom.$sections.eq(i).attr('data-after')
				});

				pagesState.pagesCount++;

			}
			// TODO remove it
			// console.log(pagesState.pages);
		},
		toPage: function (id, callback) {

			var before, after, top, left;

			// console.log(pagesState.animatedBool)
			// console.log(id)

			if (!pagesState.pages.length || pagesState.animatedBool) {

				return;

			}

			if (id === undefined) {

				id = this.getIdFromHash();

				if (pagesState.pages[id] && typeof pagesState.pages[id].before === 'function' ) {

					window[ pagesState.pages[id].before ]();

				}

			}

			if (pagesState.pages[id] === undefined) {

				top = pagesState.pages[0].top + windowHeight;
				pagesState.currentPage = 0;

			} else {

				top = pagesState.pages[id].top;
				left = pagesState.pages[id].left;

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

			if (typeof before === 'function') {

				before();

			}

			plg.makeActiveNav( pagesState.pages[id].id );

			this.blockScroll(true);

			cacheDom.$verticalViewport
				.off(transitionPrefix)
				.css({
					'-webkit-transform': 'translateY(' + -top + 'px)',
					'transform': 'translateY(' + -top + 'px)'
				})
				.one(transitionPrefix, this.animationDone.bind(this, id, after, callback));

			// pagesAnimation( id );

			pagesState.animatedBoolTimeout = setTimeout(this.animationDone.bind(this, id, after, callback), speed);

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

			}

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
		animationDone: function (id, after, callback) {

			pagesAnimation( id );
			pagesState.currentPage = id;
			clearTimeout( pagesState.animatedBoolTimeout );
			history.pushState({id: pagesState.pages[id].id}, pagesState.pages[id].id, '#' + pagesState.pages[id].id);

			setTimeout(function () {

				plg.blockScroll( false );

				// document.location.hash = '#' + pagesState.pages[id].id;

				if (typeof after === 'function') {

					after();

				}

				if (typeof callback === 'function') {

					callback();

				}

			}, 300);

		},
		blockScroll: function ( boolean, lock ) {

			if ( pagesState.lockedScroll && !lock ) {

				return;

			}

			if ( typeof lock === "boolean" ) {

				pagesState.lockedScroll = boolean;

			}

			cacheDom.$verticalViewport.off(transitionPrefix);
			clearTimeout( pagesState.animatedBoolTimeout );
			pagesState.animatedBool = boolean;

		},
		resize: function () {

			for (var i = 0; i < pagesState.pages.length; i++) {

				pagesState.pages[i].top = cacheDom.$sections[i].offsetTop;

				if (pagesState.pages[i].full) {

					cacheDom.$sections.eq(i).height(windowHeight);

				}

			}

			plg.toPage(pagesState.currentPage, true);
			// this.blockScroll(false);

		}
	};

	$(window).on('resize', function () {
		clearTimeout(pagesState.resizeTimeout);
		pagesState.resizeTimeout = setTimeout(plg.resize, 300);
	});

	// $(window).on('popstate', function (e) {
	// 	e.preventDefault();
	// 	// history.go(-1);
	// 	plg.toPage();
	// });

	return plg;
})();

// horizontal slider
var horizontalSlider = (function () {

	var pagesState, plg, speed;

	pagesState = {};
	pagesState.pages = [];
	speed = 1000;

	plg = {
		init: function () {

			this.definePages();
			this.resize();

		},
		definePages: function () {
			pagesState.pagesCount = 0;
			for (var i = 0; i < cacheDom.$horizontal.length; i++) {
				pagesState.pages.push({
					'id': cacheDom.$horizontal[i].id,
					'classes': cacheDom.$horizontal[i].classList,
					'$el': $(cacheDom.$horizontal[i]),
					'left': cacheDom.$horizontal[i].offsetLeft,
					'leave': cacheDom.$horizontal.eq(i).attr('data-leave'),
					'before': cacheDom.$horizontal.eq(i).attr('data-before'),
					'after': cacheDom.$horizontal.eq(i).attr('data-after')
				});
				pagesState.pagesCount++;
			}
		},
		toPage: function (id, resize) {

			var before, after, left, top;

			if (!pagesState.pages.length || pagesState.animatedBool) {
				return;
			}

			// console.log(id);
			// console.log(pagesState.pages[id])

			if (id === undefined) {
				id = this.getIdFromHash();
				if (pagesState.pages[id] && typeof pagesState.pages[id].before === 'function' ) {
					window[ pagesState.pages[id].before ]();
				}
			}

			if (pagesState.pages[id] === undefined) {
				left = pagesState.pages[0].left + windowHeight;
				pagesState.currentPage = 0;
			} else {
				left = windowWidth * id;
			}

			if (resize) {

				cacheDom.$horizontalViewport
					.off(transitionPrefix)
					.css({
						'-webkit-transform': 'translateX(' + -left + 'px)',
						'transform': 'translateX(' + -left + 'px)'
					});

			} else {

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


				pagesState.animatedBool = true;

				if (typeof before === 'function') {

					before();

				}

				plg.makeActiveNav( pagesState.pages[id].id );

				cacheDom.$horizontalViewport
					.addClass('translating');
				cacheDom.$horizontal.removeClass('active');

				cacheDom.$horizontalViewport
					.off(transitionPrefix)
					.one(transitionPrefix, function () {

						if ( !pagesState.pages[id].$el.data('visited') ) {

							pagesState.pages[id].$el.data('visited', true);
							// console.log( pagesState.pages[id].$el.find('[data-src]') )

							if ($(window).width() > 960) {

								pagesState.pages[id].$el.find('[data-src]').each(function () {
									var $self = $(this);
										$self.attr('src', $self.data('src'));
								});

							} else {

								pagesState.pages[id].$el.find('[data-src-small]').each(function () {
									var $self = $(this);
										$self.attr('src', $self.data('src'));
								});

							}

						}

						pagesState.pages[id].$el.addClass('active');

						cacheDom.$horizontalViewport
							.off(transitionPrefix)
							.css({
								'-webkit-transform': 'translateX(' + -left + 'px)',
								'transform': 'translateX(' + -left + 'px)'
							});

						plg.animationDone(id, after);

					});

			}

		},
		nextPage: function () {

			if (pagesState.currentPage + 1 < pagesState.pagesCount) {

				this.toPage(++pagesState.currentPage);

			}

		},
		prevPage: function () {

			if (pagesState.currentPage > 1) {

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

			}

			return id;

		},
		navigation: function ($self) {

			if ( $self.attr('href') ) {

				if ( document.location.hash != $self.attr('href') ) {

					var id = plg.getIdFromHash( $self.attr('href').substr(1) );
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
		animationDone: function (id, callback) {

			pagesState.animatedBool = false;
			pagesState.currentPage = id;
			clearTimeout( this.animatedBoolTimeout );

			cacheDom.$horizontalViewport.off(transitionPrefix);
			cacheDom.$horizontalViewport.removeClass('translating');
			// document.location.hash = '#' + pagesState.pages[id].id;
			// history.pushState({id: pagesState.pages[id].id}, pagesState.pages[id].id, '#' + pagesState.pages[id].id);

			if (typeof callback === 'function') {

				callback();

			}

		},
		resize: function () {

			windowWidth = $(window).width();

			if ( cacheDom.$horizontal.length ) {

				cacheDom.$horizontalViewport.width( cacheDom.$horizontal.length * windowWidth + 20000 );
				// cacheDom.$horizontal.width( windowWidth );

			}

			// for (var i = 0; i < pagesState.pages.length; i++) {

				// pagesState.pages[i].left = cacheDom.$horizontal[i].offsetLeft;

				// if (pagesState.pages[i].full) {

				// 	cacheDom.$sections.eq(i).height( windowHeight );

				// }

			// }

			plg.toPage(pagesState.currentPage, true);

		}
	};

	plg.init();

	$(window).on('resize', function () {
		clearTimeout(pagesState.resizeTimeout);
		pagesState.resizeTimeout = setTimeout(plg.resize, 300);
	});

	// main menu click
	cacheDom.$menu.find('a').on('click', function (e) {

		e.preventDefault();
		var $self = $(this);

		modals.closeModal();

		if (!$self.parent().hasClass('active')) {

			plg.toPage( $self.data('page') );
			plg.navigation( $self );

		}


	});

	return plg;

})();
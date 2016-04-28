var domain = 'http://pogorelov.cc.ua/aatsu/src/',
backgrounds = [
	[2, 1],
	[4, 3],
	[6, 5],
	[7, 8],
	[9, 10],
	[12, 11],
	[14, 13]
];
// $(window).on('touchend', function (e) {
// 	alert( e.target.className )
// });
function randomInteger(min, max) {

	var rand = min + Math.random() * (max - min);
	rand = Math.round(rand);

	return rand;

}
function hideControls () {

	$('#main-navigation').addClass('closed');
	$('#main-navigation').addClass('invisible');

	scrollPages.blockScroll(false, true);

	setTimeout(function () {

		scrollPages.blockScroll(false, true);

	}, 1000);

	pagesState.horizontal = false;

}
function showControls () {

	$('#main-navigation').removeClass('closed');
	$('#main-navigation').removeClass('invisible');

	scrollPages.blockScroll(true, true);

	pagesState.horizontal = true;

}
function state1 () {

	$('#main-navigation').addClass('invisible');
	$('#presentation').removeClass('blured');
	hideControls();

}
function state2 () {

	$('#presentation').addClass('blured');

}
function state3 () {

	blurMaxStatus();

}

function visibleControls () {

	$('#main-navigation').removeClass('invisible');

}

var preloader = {
			avgTime: 3000,
			trg: 1,
			state: 0,
			preloader: $('body > .preloader'),
			loaded: function () {
				// console.log('trg: ' + preloader.trg);
				// console.log('state: ' + preloader.state);
				if(++preloader.state >= preloader.trg) {
					preloader.status(1);
					setTimeout(preloader.ready, 500);
				} else {
					preloader.status(preloader.state / preloader.trg / 1.1);
				}
			},
			status: function (mult) {

				// console.info(mult);
				preloader.preloader.find('> .after').css({
					'width': mult * 100 + '%'
				});

			},
			showPreloader: function (callback) {

				preloader.preloader.css({opacity: 0}).insertBefore('body').animate({
					'opacity': 1
				}, 600, function () {

					preloader.status(0);

					if (typeof callback === 'function') {

						callback();

					}

				});

			},
			hidePreloader: function (callback, manualDelay) {

				var delay = 600; // default delay

				// TODO remove it
				preloader.preloader.css({
					opacity: 1
				}).animate({
					opacity: 1
				}, 10).delay(delay).animate({
					'opacity': 0
				}, 600, function () {

					preloader.status(0);
					$(this).detach();
					preloader.finished = true;

					if (typeof callback === 'function') {

						if (manualDelay) {

							setTimeout(callback, manualDelay);

						} else {

							callback();

						}

					}

				});

			},
			ready: function () {

				if (preloader.finished) {

					return;

				}

				// init custum scroller
				// $('.modal-container').mCustomScrollbar();

				// picturefill({
				// 	elements: [ document.getElementsByTagName( "img" ) ]
				// });

				$('#contact').on('touchmove', function (e) {
					e.stopPropagation();
				});

				$(window).trigger('resize').trigger('scroll');

				// hide preloader
				preloader.hidePreloader(function () {

					$('#main-navigation').removeClass('stop-animation');
					$(window).trigger('resize').trigger('scroll');

				});

			}

		},
		bodyOverflow = {
			fixBody: function () {
				$('body').width($('body').width())
					.addClass('fixed');
			},
			unfixBody: function () {
				$('body')
					.css({
						'width': 'auto'
					})
					.removeClass('fixed');
			},
			resize: function () {

				bodyOverflow.unfixBody();

			}
		},
		modals = {
			opened: [],
			openModal: function ($modal) {

				$modal.addClass('opened');
				$modal.parent().addClass('opened');

				$('#main-navigation').addClass('disabled');

				$('#horizontal-viewport').addClass('translating');

				$modal.find('[data-src]').each(function () {

					var $self = $(this);

					if ($(window).width() > 960) {

						$self.attr( 'src', $self.attr('data-src') );

					} else {

						$self.attr( 'src', $self.attr('data-src-small') );

					}

				});

				// var $modalContent = $modal.find('.modal-container > .container');
				// if ($modalContent.length) {

				// 	$('#application-holder').css({
				// 		'height': $modalContent.height() + 200
				// 	}).height( $modalContent.height() + 200 );

				// }

				// scrollPages.blockScroll(true);

				this.opened.push($modal);

			},
			closeModal: function ($modal) {

				if ($modal instanceof jQuery) {

					$('#main-navigation').removeClass('disabled');

					$modal.removeClass('opened');
					$modal.parent().removeClass('opened');
					$('#horizontal-viewport').removeClass('translating');
					setTimeout(function () {

						$('.slider-holder').trigger(transitionPrefix);

					}, 600);

					// scrollPages.blockScroll(false);

				} else if ( $modal && $($modal).length ) {

					modals.closeModal( $($modal) );

				} else {

					for (var m = 0; m < modals.opened.length; m++) {

						// console.log(modals.opened[m])
						modals.closeModal( modals.opened[m] );

					}

					this.opened = [];

				}

			}
		};

$('body').on('load', function () {

	preloader.status(1);
	setTimeout(preloader.ready, 500);

});

setTimeout(function () {

	preloader.status(1);
	setTimeout(preloader.ready, 500);

}, 10000);

$('img').each(function () {

	if (!this.naturalWidth && $(this).attr('src')) {

		preloader.trg++;
		$(this).one('load error', preloader.loaded);

	}

});

$(document).on('ready', function () {

	var $window = $(window),
		$presentation = $('#presentation'),
		$foreground = $presentation.find('> .foreground-holder'),
		$background = $presentation.find('> .background-holder'),
		$body = $('body'),
		winWidth = $window.width(),
		winHeight = $window.height();

	// scroll wheel horizontal
	// TODO
	(function () {

		var $scrollElements = $('.modal-container');

		// $scrollElements.on('')

	})();

	(function () {

		var scrollStarted = false,
			blurStatus = 0,
			blurMax = 12,
			max = 20;

			if ($.browser.platform === "win") {

				max = 10;

			}

		function convertBlur (stat) {

			stat = stat || 0;
			return stat / max * blurMax;

		}

		function increaseBlur (e) {

			if (blurStatus >= max) {

				return false;

			} else {

				e.preventDefault();
				e.stopPropagation();
				setBlur( convertBlur( ++blurStatus ) );

			}

		}

		function decreaseBlur (e) {

			if (blurStatus < 1) {

				return false;

			} else {

				e.preventDefault();
				e.stopPropagation();
				setBlur( convertBlur( --blurStatus ) );

			}

		}

		function setBlur (blur) {

			$presentation.css({
				'-webkit-filter': 'blur(' + blur + 'px)',
				'filter': 'blur(' + blur + 'px)'
			});

		}

		window.blurMaxStatus = function () {

			blurStatus = max;
			setBlur( convertBlur ( blurStatus ) );

		};

		window.blurMinStatus = function () {

			blurStatus = 0;
			setBlur( convertBlur ( blurStatus ) );

		};

		$('#start').on('mousewheel', function (e) {

			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

			if (delta > 40) {

				decreaseBlur(e);

			} else if (delta < -40) {

				increaseBlur(e);

			}

		});

		$('#start').on('DOMMouseScroll wheel', function (e) {

			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;

			if (delta > 0) {

				decreaseBlur(e);

			} else if (delta < 0) {

				increaseBlur(e);

			}

		});

	})();

	// randomize background
	var randomBackground = (function () {

			var randomBgIndex,
				bgLoaded = 0,
				localTimeout;

			function bgReady ( callback, force ) {

				preloader.status(0);

				if ( ++bgLoaded >= 2 || force === 1 ) {

					preloader.loaded();

					bgLoaded = 0;

					// TODO review it
					clearTimeout( localTimeout );
					// console.log('clear')
					// console.log(bgReady.caller)

					if ( typeof callback === 'function' ) {

						callback();

					}

				}

			}

			return function ( callback ) {

				randomBgIndex = randomInteger(0, backgrounds.length - 1);
				bgLoaded = 0;

				if ( pagesState.randomBgIndex === randomBgIndex ) {

					randomBackground( callback );
					return;

				}

				pagesState.randomBgIndex = randomBgIndex;

				$foreground.find('img').attr('src', domain + 'img/bg/' + backgrounds[randomBgIndex][0] + '.jpg').on('load error', function () {

					bgReady( callback );

				});

				$background.find('img').attr('src', domain + 'img/bg/' + backgrounds[randomBgIndex][1] + '.jpg').on('load error', function () {

					bgReady( callback );

				});

				localTimeout = setTimeout(function () {

					// console.log(typeof callback)
					if ( typeof callback === 'function' ) {

						callback();

					}

				}, 4000);

			};

		})();
	randomBackground();

	function fillPresentation () {
		if (winHeight > winWidth) {

			// TODO
			$foreground.parent().height(winHeight);
			$foreground.height(winHeight);
			$background.height(winHeight);
			$foreground.find('img').css({
				'width': 'auto',
				'height': '100%'
			});
			$background.find('img').css({
				'width': 'auto',
				'height': '100%'
			});

		} else {

			$foreground.parent().height(winHeight);
			$foreground.height(winWidth);
			$background.height(winWidth);
			$foreground.find('img').css({
				'height': 'auto',
				'width': '100%'
			});
			$background.find('img').css({
				'height': 'auto',
				'width': '100%'
			});

		}

	}

	fillPresentation ();

	// placing image middle
	function middlindImage ($child, $parent, offset) {

		if (!$child.jquery) {

			$child = $($child);

		}

		if (!$parent) {

			$parent = $child.parent();

		}

		if (!offset) {

			offset = 0;

		}

		$child.css({
			'margin-top': -(($child.height() - $parent.height()) / 2),
			'margin-left': 0
		});

		if (winHeight > winWidth) {

			$child.css({
				'margin-left': -(($child.width() - $parent.width()) / 2)
			});

		}

	}

	middlindImage ($foreground.find('img'), $window, -60);
	middlindImage ($background.find('img'), $window, -60);

	if (winWidth > 800) {

		// mouse move
		$window.on('mousemove', function (e) {
			// console.log(e);
			if (winHeight > winWidth) {

				$foreground.css({
					'-webkit-mask-position-x': e.clientX - winWidth / 2,
					'-webkit-mask-position-y': e.clientY - winHeight / 2,
					'mask-position-x': e.clientX - winWidth / 2,
					'mask-position-y': e.clientY - winHeight / 2
				});

			} else {

				$foreground.css({
					'-webkit-mask-position-x': e.clientX - winWidth / 2,
					'-webkit-mask-position-y': e.clientY - winWidth / 2,
					'mask-position-x': e.clientX - winWidth / 2,
					'mask-position-y': e.clientY - winWidth / 2
				});

			}

		});

		// touch move
		$window.on('trg', function (e) {

			if (winHeight > winWidth) {

				$foreground.css({
					'-webkit-mask-position-x': e.originalEvent.touches[0].pageX - winWidth / 2,
					'-webkit-mask-position-y': e.originalEvent.touches[0].pageY - winHeight / 2,
					'mask-position-x': e.originalEvent.touches[0].pageX - winWidth / 2,
					'mask-position-y': e.originalEvent.touches[0].pageY - winHeight / 2
				});

			} else {

				$foreground.css({
					'-webkit-mask-position-x': e.originalEvent.touches[0].pageX - winWidth / 2,
					'-webkit-mask-position-y': e.originalEvent.touches[0].pageY - winWidth / 2,
					'mask-position-x': e.originalEvent.touches[0].pageX - winWidth / 2,
					'mask-position-y': e.originalEvent.touches[0].pageY - winWidth / 2
				});

			}

		});

		// touch end
		$window.on('trg', function (e) {

			if (winHeight > winWidth) {

				$foreground.css({
					'-webkit-mask-position-x': -3000,
					'-webkit-mask-position-y': -3000,
					'mask-position-x': -3000,
					'mask-position-y': -3000
				});

			} else {

				$foreground.css({
					'-webkit-mask-position-x': -3000,
					'-webkit-mask-position-y': -3000,
					'mask-position-x': -3000,
					'mask-position-y': -3000
				});

			}

		});

	}

	// resize
	$window.on('resize', function () {

		winWidth = $window.width();
		winHeight = $window.height();
		fillPresentation ();
		middlindImage ($foreground.find('img'), $window, -60);
		middlindImage ($background.find('img'), $window, -60);
		bodyOverflow.resize();
		// modals.closeModal();

	});

	// logo click
	$('#main-navigation').find('.logo').on('click', function () {

		if (scrollPages.getCurrent() > 0) {

			horizontalSlider.toPage(0);

			modals.closeModal();

			preloader.showPreloader( function () {

					randomBackground( function () {

						blurMinStatus();

						scrollPages.blockScroll(false, true);
						scrollPages.toPage(0, function () {

							preloader.hidePreloader();

						});

					} );
				}
			);

		}

	});

	// modals

	$('[data-modal]').on('mousedown', function (e) {

		e.preventDefault();

		$(this).data('down', {
			'time': e.timeStamp,
			'x': e.originalEvent.clientX,
			'y': e.originalEvent.clientY
		});

	}).on('mouseup', function (e) {

		e.preventDefault();

		// console.log( e.originalEvent );
		// console.log( Math.abs(e.originalEvent.clientX - $(this).data('down').x) );
		if ( !$(this).data('down') ) {

			return;

		}

		if ( e.timeStamp - $(this).data('down').time < 300 && Math.abs(e.originalEvent.clientX - $(this).data('down').x) < 20 && Math.abs(e.originalEvent.clientY - $(this).data('down').y) < 20 ) {

			var $self = $( this ),
				target = $self.attr( 'data-modal' ),
				$target = $( target );

			if ( $target.length ) {

				modals.openModal( $target );

			}

		}

	});

	// $('[data-close]').on('click', function (e) {

	// 	e.preventDefault();

	// 	var $self = $(this),
	// 		target = $self.attr('data-close'),
	// 		$target;

	// 	if (target) {

	// 		$target = $(target);

	// 		if ($target.length) {

	// 			$target.removeClass('opened');

	// 		}

	// 	} else {

	// 		$self.closest('.opened').removeClass('opened');

	// 	}

	// });

	// $('.modal-holder').on('click', function (e) {

	// 	if (e.target === this) {

	// 		modals.closeModal( $(this).find('.opened') );

	// 	}

	// });

	// modal image
	$('.modal-container').on('click', function (e) {

		if ( e.target.nodeName.toLowerCase() === 'img' ) {

			var $body = $('body'),
				$modal = $(this),
				$target = $(e.target),
				$clone = $target.clone(),
				origTop = $target.offset().top,
				origLeft = $target.offset().left,
				origWidth = $target.width(),
				origHeight = $target.height();

			var closeModal = function () {

					$tint.removeClass('active');
					$clone.css( stylesStack ).one(transitionPrefix, function () {

						$clone.off().remove();
						$tint.off().remove();

					});

				};

			var stylesStack = {
					'position': 'fixed',
					'z-index': '20',
					'transform': 'scale(1)',
					'opacity': 0,
					'left': origLeft,
					'top': origTop,
					'height': origHeight,
					'width': origWidth
				},
				$tint = $('<div>')
					.addClass('tint')
					.one('DOMMouseScroll wheel mousewheel touchstart click', closeModal)
					.appendTo( $body );

			var stylesTarget = {
				'transform': 'scale(1) translate(-50%, -50%)',
				'-webkit-transform': 'scale(1) translate(-50%, -50%)',
				'opacity': 1,
				'left': '50%',
				'top': '50%',
				'height': e.target.naturalHeight,
				'width': e.target.naturalWidth
			};

			if (e.target.naturalWidth > winWidth / 1.5) {

				var ratio = e.target.naturalWidth / e.target.naturalHeight;
				stylesTarget.width = winWidth / 1.5;
				stylesTarget.height = stylesTarget.width / ratio;

			}

			$clone
				.addClass( 'modal-image' )
				.css( stylesStack )
				.one('DOMMouseScroll wheel mousewheel touchstart click', closeModal)
				.appendTo( $body );

			setTimeout(function () {

				$clone.css( stylesTarget );

				$tint.addClass('active');

			}, 10);

		}

		//

	});

	// init plugins
	$('.gallery-slider').simpleSlider();

});

(function ($) {

	$.fn.simpleSlider = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {
					'touchStart': {},
					'touchEnd': {}
				},
				self = this,
				$window = $(window);

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
				'loop': true,
				'interval': false,
				'easing': 'swing',
				'prevClass': 'arrow-left-1',
				'nextClass': 'arrow-right-1',
				'holderClass': '.slides-holder',
				'slideClass': '.slide',
				'nameClass': '.slide-name',
				'imageClass': '.slide-image',
				'pagination': false,
				'clickToNext': false,
				'startSlide': 0,
				'autoHeight': false,
				'slidesOnPage': 1
			}, opt);

			// methods
			var plg = {
				cacheDOM: function () {
					DOM.$slider = $(self);
					DOM.$section = $(self).closest('section');
					DOM.$preloader = DOM.$slider.find('.slider-preloader');
					DOM.$viewport = DOM.$slider.find('.slider-viewport');
					DOM.$sliderHolder = DOM.$viewport.find('.slider-holder');
					DOM.$slides = DOM.$sliderHolder.find('.slide');
					DOM.$slides.eq(0).addClass('active');
				},
				init: function () {
					state.cur = state.cur || 0;
					state.slides = DOM.$slides.length;
					state.pages = Math.ceil(DOM.$slides.length / opt.slidesOnPage);
					DOM.$preloader.fadeOut(150);
				},
				resize: function () {

					state.sliderWidth = DOM.$viewport.width();

					if ($window.width() > 300 && opt.slidesOnPage > 1 && $window.width() <= 700) {

						opt.slidesOnPage = Math.floor( opt.slidesOnPage / 2 );
						plg.init();

					}

					DOM.$slides.width( DOM.$viewport.width() / opt.slidesOnPage);

					if (opt.autoHeight) {

						DOM.$slides.height(
								(function ($slides) {
									var max = 1;
									$slides.each(function () {
										var height = $(this).find('> div').outerHeight();
										if (height > max) {
											max = height;
										}
									});
									return max;
								})(DOM.$slides)
							);

					}

					state.slideWidth = DOM.$slides.eq(0).outerWidth();
					DOM.$sliderHolder.width(state.slideWidth * state.slides);
					plg.toSlide(opt.startSlide);
				},
				prevSlide: function () {

					var id = state.cur - 1;
					if (id < 0) {

						// this.toSlide(state.pages - 1);
						this.toSlide(0);

						// horizontalSlider.prevPage();

						return;

					}

					this.toSlide(id);

				},
				nextSlide: function () {

					var id = state.cur + 1;
					if (id >= state.pages) {
						// this.toSlide(0);
						this.toSlide(state.pages - 1);

						// TODO test it
						// horizontalSlider.nextPage();

						return;
					}

					this.toSlide(id);

				},
				toSlide: function (id) {

					if ( id < 0 || id >= state.pages ) {
						return;
					}
					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + (state.sliderWidth * id) + 'px) translateZ(0)',
						'transform': 'translateX( -' + (state.sliderWidth * id) + 'px) translateZ(0)'
					});
					DOM.$slides.eq(id).addClass('active').siblings().removeClass('active');
					DOM.$pagination.find('.page').eq(id).addClass('active').siblings().removeClass('active');
					state.cur = id;

				},
				createPagination: function () {

					if (DOM.$pagination) {

						DOM.$pagination.empty();

					} else {

						DOM.$pagination = $('<div>').addClass('paginator-holder');

						if (opt.pagination || true) {

							DOM.$pagination.appendTo(DOM.$slider);

						}

					}

					$('<div>')
						.addClass('prev-slide')
						.appendTo(DOM.$pagination);

					for (var i = 0; i < state.pages / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');

						if (!i) {

							page.addClass('active');

						}

						DOM.$pagination.append(page);
					}

					$('<div>')
						.addClass('next-slide')
						.appendTo(DOM.$pagination);

				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();

			// resize
			$window.on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {

				var $target = $(e.target);

				if ($target.hasClass('page')) {

					plg.toSlide($(e.target).data('page'));

				} else if ($target.hasClass('prev-slide')) {

					plg.prevSlide();

				} else if ($target.hasClass('next-slide')) {

					plg.nextSlide();

				} else if (opt.clickToNext && $target.parents('.slide').length) {

					plg.nextSlide();

				}

			}).on('DOMMouseScroll wheel', function (e) {

				e.preventDefault();
				e.stopPropagation();

				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;

				if ( pagesState.lastScrollTime + 150 < e.timeStamp ) {
					if (delta > 0) {

						plg.prevSlide();

					} else if (delta < 0) {

						plg.nextSlide();

					}
				}

				pagesState.lastScrollTime = e.timeStamp;

			}).on('mousewheel', function (e) {

				e.preventDefault();
				e.stopPropagation();

				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;

				if ( pagesState.lastScrollTime + 150 < e.timeStamp ) {
					if (delta > 0) {

						plg.prevSlide();

					} else if (delta < 0) {

						plg.nextSlide();

					}
				}

				pagesState.lastScrollTime = e.timeStamp;

			});

			// drag events
			DOM.$slider.on('touchstart', function (e) {
				// state.touchStart.xPos = e.originalEvent.touches[0].clientX;
				// state.touchStart.yPos = e.originalEvent.touches[0].clientY;
				state.touchStart.timeStamp = e.timeStamp;
				// console.log('-----');
			});
			DOM.$slider.on('touchmove', function (e) {
				state.touchEnd.xPos = e.originalEvent.touches[0].clientX;
				state.touchEnd.yPos = e.originalEvent.touches[0].clientY;

				if (!state.touchStart.xPos) {

					state.touchStart.xPos = e.originalEvent.touches[0].clientX;

				}

				if (!state.touchStart.yPos) {

					state.touchStart.yPos = e.originalEvent.touches[0].clientY;

				}

				// console.log('-----');
			});
			DOM.$slider.on('touchend', function (e) {
				var distance = 70,
					speed = 200,
					deltaX = state.touchEnd.xPos - state.touchStart.xPos,
					deltaY = Math.abs(state.touchEnd.yPos - state.touchStart.yPos);
				state.touchEnd.xPos = 0;
				state.touchEnd.yPos = 0;
					// time = e.timeStamp - state.touchStart.timeStamp;
				// console.log('-----');
				// console.log(time);
				// console.log(deltaX);
				// console.log((deltaY));
				// console.log(state.touchEnd.originalEvent.touches[0].clientX);
				// console.log(state.touchStart.originalEvent.touches[0].clientX);
				if (deltaX > distance || -deltaX > distance) {
					if (deltaX < 0) {
						plg.nextSlide();
					} else {
						plg.prevSlide();
					}
				}
				deltaX = null;
				deltaY = null;
				state.touchEnd.xPos = null;
				state.touchEnd.yPos = null;
				state.touchStart.xPos = null;
				state.touchStart.yPos = null;
			});
			// DOM.$slider.on('ondragstart', function (e) {
			// 	e.preventDefault();
			// 	return false;
			// });
			DOM.$slider.find('img').each(function () {
				this.ondragstart = function() {
					return false;
				};
			});
			// DOM.$slides.on('ondragstart', function (e) {
			// });
			DOM.$section.on('mousedown', function (e) {
				DOM.$sliderHolder.addClass('touched');
				state.touchStart.xPos = e.pageX;
				state.touchStart.yPos = e.pageY;
				state.touchStart.trfX = -parseInt( DOM.$sliderHolder.css('transform').split(',')[4] );
					// console.log( state.touchStart.trfX );

			});

			DOM.$section.on('mousemove', function (e) {
				if (e.buttons < 1) {
					touchendCleaner ();
				} else if (state.touchStart.xPos) {

					state.shiftD = state.touchStart.xPos - e.pageX;
					state.shiftX = state.touchStart.trfX + state.shiftD;

					// console.log( state.shiftX );
					// console.log( state.touchStart.trfX );
					// console.log( state.touchStart.xPos - e.pageX );

					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( ' + -state.shiftX + 'px) translateZ(0)',
						'transform': 'translateX( ' + -state.shiftX + 'px) translateZ(0)'
					});

				}
			});

			DOM.$section.on('mouseup mouseleave', function (e) {
				// console.log(state.shiftD);
				if ( Math.abs(state.shiftD) > 40 ) {
					if (state.shiftD > 0) {
						plg.nextSlide();
					} else {
						plg.prevSlide();
					}
				} else {
					plg.toSlide(state.cur);
				}
				touchendCleaner ();
			});

			function touchendCleaner () {
				DOM.$sliderHolder.removeClass('touched');
				state.touchStart.yPos = 0;
				state.touchStart.xPos = 0;
				state.shiftX = 0;
				state.shiftD = 0;
			}

			$window.on( 'resize', plg.resize.bind(plg) );
			plg.init();

			return plg;
		});
	};

})(jQuery);

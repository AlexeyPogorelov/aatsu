

var backgrounds = [
	[2, 1],
	[4, 3],
	[6, 5],
	[7, 8],
	[9, 10],
	[12, 11],
	[14, 13]
];
function randomInteger(min, max) {
	var rand = min + Math.random() * (max - min);
	rand = Math.round(rand);
	return rand;
}
function hideControls () {
	$('#main-navigation').addClass('closed');
}
function showControls () {
	$('#main-navigation').removeClass('closed');
}
function invisibleControls () {
	$('#main-navigation').addClass('invisible');
	$('#main-navigation').addClass('closed');
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
				if(++preloader.state == preloader.trg) {
					preloader.status(1);
					setTimeout(preloader.ready, 500);
				} else {
					preloader.status(preloader.state / preloader.trg / 1.1);
				}
			},
			status: function (mult) {
				// console.log(mult);
				preloader.preloader.find('> .after').css({
					'width': mult * 100 + '%'
				});
			},
			ready: function () {
				if (preloader.finished) {
					return;
				}

				$(window).trigger('resize').trigger('scroll');

				// hide preloader
				preloader.preloader.css({opacity: 1}).animate({opacity: 1}, 100).delay(600).animate({
					'opacity': 0
				}, 600, function () {
					preloader.status(0);
					$(this).detach();
					preloader.finished = true;
					$('#main-navigation').removeClass('stop-animation');
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
				this.unfixBody();
			}.bind(this)
		};

$(window).on('load', function () {
	preloader.status(1);
	setTimeout(preloader.done, 500);
});
$('img').each(function () {
	if (!this.naturalWidth || true) {
		preloader.trg ++;
		$(this).one('load', preloader.loaded)
	}
});

$(document).on('ready', function () {
	var $presentation = $('#presentation'),
		$foreground = $('.foreground-holder'),
		$background = $('.background-holder'),
		$body = $('body'),
		winWidth = $(window).width(),
		winHeight = $(window).height(),
		randomBgIndex = randomInteger(0, backgrounds.length - 1),
		deviceInspector = (function () {
			var newDevice;
			function deviseChanged (device) {
				switch (device) {
					case 'mobile':
						break;
					case 'tablet':
						break;
					case 'pc':
						break;
					case 'large':
						break;
				}
			}
			return function (){
				var currentWidth = winWidth;
				if (currentWidth <= 780){
					newDevice = 'mobile';
				} else if (currentWidth <= 1000) {
					newDevice = 'tablet';
				} else if (currentWidth <= 1278) {
					newDevice = 'pc';
				} else {
					newDevice = 'large';
				}
				if (!window._currentDevice){
					window._currentDevice = newDevice;
					deviseChanged(newDevice);
				}
				if (newDevice != window._currentDevice) {
					window._currentDevice = newDevice;
					deviseChanged(newDevice);
				}
			}
		})();
	$foreground.find('img').attr('src', 'img/bg/' + backgrounds[randomBgIndex][0] + '.jpg').on('load', function () {
		$(window).trigger('resize');
		preloader.ready();
	});
	$background.find('img').attr('src', 'img/bg/' + backgrounds[randomBgIndex][1] + '.jpg').on('load', function () {
		$(window).trigger('resize');
		preloader.ready();
	});

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
	middlindImage ($foreground.find('img'), $(window), -60);
	middlindImage ($background.find('img'), $(window), -60);

	// mouse move
	$(window).on('mousemove', function (e) {
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
	$(window).on('touchmove', function (e) {
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
	$(window).on('touchend', function (e) {
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

	// resize
	$(window).on('resize', function () {
		winWidth = $(window).width();
		winHeight = $(window).height();
		fillPresentation ();
		middlindImage ($foreground.find('img'), $(window), -60);
		middlindImage ($background.find('img'), $(window), -60);
		deviceInspector();
		bodyOverflow.unfixBody();
	});

	// scroll
	$(document).on('scroll', function (e) {
		var top = $(e.target).scrollTop();

		// animation blur
		if (top < winHeight) {
			$presentation.css({
				'-webkit-filter': 'blur(' + ( top / winHeight * 20 ) + 'px)',
				'filter': 'blur(' + ( top / winHeight * 20 ) + 'px)'
			});
		} else {
			$presentation.css({
				'-webkit-filter': 'blur(20px)',
				'filter': 'blur(20px)'
			});
		}
	});

	// logo click
	$('#main-navigation').find('.logo').on('click', function () {
		if (scrollPages.getCurrent() > 0) {
			scrollPages.toPage(0);
		}
	})

	// modals

	var modals = {
		openModal: function ($modal) {

			$modal.addClass('opened');
			$modal.parent().addClass('opened');

			$('#main-navigation').addClass('disabled');

			$('section').addClass('invisible');

			pagesState.animatedBool = true;

		},
		closeModal: function ($modal) {

			$('#main-navigation').removeClass('disabled');

			$modal.removeClass('opened');
			$modal.parent().removeClass('opened');
			$('section').removeClass('invisible');

			pagesState.animatedBool = false;

		}
	}

	$('[data-modal]').on('mousedown', function (e) {
		e.preventDefault();

		$(this).data('down', {
			'time': e.timeStamp,
			'x': e.originalEvent.clientX,
			'y': e.originalEvent.clientY
		})

	}).on('mouseup', function (e) {
		e.preventDefault();

		// console.log( e.originalEvent );
		// console.log( Math.abs(e.originalEvent.clientX - $(this).data('down').x) );

		if (e.timeStamp - $(this).data('down').time < 250 && Math.abs(e.originalEvent.clientX - $(this).data('down').x) < 20 && Math.abs(e.originalEvent.clientY - $(this).data('down').y) < 20 ) {

			var $self = $(this),
				target = $self.attr('data-modal'),
				$target = $(target);

			if ($target.length) {

				modals.openModal($target);

			}
		
		}

	});

	$('[data-close]').on('click', function (e) {
		e.preventDefault();
		var $self = $(this),
			target = $self.attr('data-close'),
			$target;

		if (target) {

			$target = $(target);

			if ($target.length) {

				$target.removeClass('opened');

			}

		} else {

			$self.closest('.opened').removeClass('opened');

		}

	});

	$('.modal-holder').on('click', function (e) {
		if (e.target === this) {
			modals.closeModal( $(this).find('.opened') );
		}
	})

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
				self = this;

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
					if ($(window).width() > 300 && opt.slidesOnPage > 1 && $(window).width() <= 700) {
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
						return;
					}
					this.toSlide(id);
				},
				nextSlide: function () {
					var id = state.cur + 1;
					if (id >= state.pages) {
						// this.toSlide(0);
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
			$(window).on('resize', function () {
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
			});

			// drag events
			DOM.$slider.on('touchstart', function (e) {
				state.touchStart.xPos = e.originalEvent.touches[0].clientX;
				state.touchStart.yPos = e.originalEvent.touches[0].clientY;
				state.touchStart.timeStamp = e.timeStamp;
				// console.log('-----');
			});
			DOM.$slider.on('touchmove', function (e) {
				state.touchEnd.xPos = e.originalEvent.touches[0].clientX;
				state.touchEnd.yPos = e.originalEvent.touches[0].clientY;
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
				if (deltaX > distance || -deltaX > distance && deltaY < 30) {
					if (deltaX < 0) {
						plg.nextSlide();
					} else {
						plg.prevSlide();
					}
				}
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
					state.shiftX = state.touchStart.trfX + state.touchStart.xPos - e.pageX;

					// console.log( state.shiftX );
					// console.log( state.touchStart.trfX );
					// console.log( state.touchStart.xPos - e.pageX );

					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + state.shiftX + 'px) translateZ(0)',
						'transform': 'translateX( -' + state.shiftX + 'px) translateZ(0)'
					});
				}
			});

			DOM.$section.on('mouseup mouseleave', function (e) {
				// console.log(state.shiftX);
				if (Math.abs(state.touchStart.xPos - e.pageX) > 40 && state.shiftX > 10) {
					if (state.touchStart.xPos - e.pageX > 0) {
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
			}

			$(window).on('resize', plg.resize.bind(plg));
			plg.init();

			return plg;
		});
	};

})(jQuery);

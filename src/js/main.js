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
var preloader = {
		stages: 2,
		pgogress: 0,
		ready: function () {
			if (++this.pgogress == this.stages) {
				// hide preloader
				$('.preloader').animate({
					'opacity': 0
				}, 800, function () {
					$(this).remove();
				});
			}
		}
	},
	bodyOverflow = {
		fixBody: function () {
			$('body').width($('body').width())
				.css({
					'overflow': 'hidden'
				});
		},
		unfixBody: function () {
			$('body')
				.css({
					'overflow': 'auto',
					'overflow-y': 'scroll',
					'width': 'initial'
				});
		},
		resize: function () {
			this.unfixBody();
		}.bind(this)
	};


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
		$('.full-height').css({
			'min-height': winHeight
		});
		bodyOverflow.unfixBody();
	});

	// scroll
	$(document).on('scroll', function (e) {
		var top = $(e.target).scrollTop();
		if (top + winHeight >= $body.height()) {
			bodyOverflow.fixBody();
		}
		if (top < 400) {
			$presentation.css({
				'-webkit-filter': 'blur(' + ( top / 20 ) + 'px)',
				'filter': 'blur(' + ( top / 20 ) + 'px)'
			});
		} else {
			$presentation.css({
				'-webkit-filter': 'blur(20px)',
				'filter': 'blur(20px)'
			});
		}
	});
});

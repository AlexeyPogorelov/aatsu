var backgrounds = [
	[1, 2],
	[3, 4],
	[5, 6],
	[7, 8],
	[9, 10],
	[11, 12],
	[13, 14]
];
function randomInteger(min, max) {
	var rand = min + Math.random() * (max - min);
	rand = Math.round(rand);
	return rand;
}

$(document).on('ready', function () {
	var $foreground = $('.foreground-holder'),
		$background = $('.background-holder'),
		winWidth = $(window).width(),
		winHeight = $(window).height(),
		randomBgIndex = randomInteger(0, backgrounds.length - 1);
	$foreground.find('img').attr('src', 'img/bg/' + backgrounds[randomBgIndex][0] + '.jpg');
	$background.find('img').attr('src', 'img/bg/' + backgrounds[randomBgIndex][1] + '.jpg');

	if (winHeight > winWidth) {}

	// hide preloader
	$('.preloader').animate({
		'opacity': 0
	}, 800, function () {
		$(this).remove();
	});

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
			'margin-top': ($child.height() - $parent.height()) / 2 + offset
		});
	}
	middlindImage ($foreground.find('img'), null, -60);
	middlindImage ($background.find('img'), null, -60);

	// mouse move
	$(window).on('mousemove', function (e) {
		$foreground.css({
			'-webkit-mask-position-x': e.pageX - winWidth / 2,
			'-webkit-mask-position-y': e.pageY - winHeight / 2,
			'mask-position-x': e.pageX - winWidth / 2,
			'mask-position-y': e.pageY - winHeight / 2
		});
	});

	// resize
	$(window).on('resize', function (e) {
		winWidth = $(window).width();
		winHeight = $(window).height();
		middlindImage ($foreground.find('img'), null, -60);
		middlindImage ($background.find('img'), null, -60);
	});
});

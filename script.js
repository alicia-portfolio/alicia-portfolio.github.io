var current_section = 'intro'
var UPDATE_NAVBAR = 1

var icon_dict = {
	'#digital-art': 'teal',
	'#animation': 'red',
	'#design': 'blue',
	'#about': 'yellow',
}

// get key with lowest value for a given dict
function getLowestKey(obj) {
	if (Object.keys(obj).length == 0) return 0
	var [lowestItems] = Object.entries(obj).sort(([ ,v1], [ ,v2]) => v1 - v2);
	return lowestItems[0]
}

// add typing animations to section 
new TypeIt("#digital-art .section-header", {
	speed: 60,
	waitUntilVisible: true,
	cursor: false,
}).go()
new TypeIt("#animation .section-header", {
	speed: 60,
	waitUntilVisible: true,
	cursor: false,
}).go()
new TypeIt("#design .section-header", {
	speed: 60,
	waitUntilVisible: true,
	cursor: false,
}).go()
new TypeIt("#about .section-header", {
	speed: 60,
	waitUntilVisible: true,
	cursor: false,
}).go()

// animated scroll to selected section
function scrollToSection() {
	var current_navlink = $(`.nav-link[href="${$(this).attr('href')}"]`)

	// show colored icons for all navlinks
	$('.navbar .nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})
	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon.svg')

	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top - 120
	}, 1000, function() {
		UPDATE_NAVBAR = 1
	})
}
$('.navbar a').on('click', scrollToSection)

// scroll function
// show stickied navbar once scroll past header
// update current section in navbar
$(window).scroll(function() {
	// show stickied navbar once scroll past header
	if (
		// if scroll past header
		$(this).scrollTop() >
		$("#before-sticky").outerHeight((includeMargin = true))
	) {
		// show sticky navbar
		$("#navbar-sticky").css("display", "block")
	} else {
		// hide sticky navbar
		$("#navbar-sticky").css("display", "none")
	}

	// update current section in navbar
	if (!UPDATE_NAVBAR) return
	var pageTop = $(document).scrollTop()
	var pageBottom = pageTop + $(window).height()
	var pageMiddle = pageTop + ($(window).height() / 2)
	var tags = $('.section')
	var visible = {}
	// check position of each section
	for (var i = 0; i < tags.length; i++) {
		var tag = tags[i]
		var tag_top = $(tag).position().top + 220
		var tag_bottom = $(tag).position().top + 220 + $(tag).height()
		if (tag_top < pageBottom & tag_top > pageTop) {
			visible[$(tag).attr('id')] = $(tag).position().top
		}
		else if (tag_bottom < pageBottom & tag_bottom > pageTop) {
			visible[$(tag).attr('id')] = tag_bottom
		}
	}
	// get highest section currently visible
	var temp = getLowestKey(visible)
	current_section = temp != 0 ? temp : current_section

	// update current section in navbar
	var current_navlink = $(`.nav-link[href="#${current_section}"]`)
	// show colored icons for all navlinks
	$('.navbar .nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})
	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon.svg')
})




var current_section = 'intro'
var current_navlink = $('.nav-link')[0]
var current_navlink_dom = document.querySelector(`.nav-link`)
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
	var [lowestItems] = Object.entries(obj).sort(([ ,v1], [ ,v2]) => v1 - v2)
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
	current_navlink = $(`.nav-link[href="${$(this).attr('href')}"]`)

	// show colored icons for all navlinks
	$('.nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})
	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon.svg')
	$('.nav-link').removeClass('current')
	$('img', current_navlink).parent().addClass('current')

	console.log(this, $(this).attr('href'), $($(this).attr('href')).offset())

	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top - 120
	}, 1000, function() {
		UPDATE_NAVBAR = 1
	})

	// check if hamburger is showing
	if ($('.hamburger').css('display') == 'block') {
		$('.navbar-collapse').removeClass('show')
		$('.hamburger').addClass('collapsed')
	}
}
$('.nav-link').on('click', scrollToSection)
// animate scroll for arrow linking to top
$('.up-arrow').on('click', function() {
	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: 0
	}, 1000, function() {
		setTimeout(function() {
			UPDATE_NAVBAR = 1
			// show colored icons for all navlinks
			$('.nav-link').each(function() {
				var color = icon_dict[$(this).attr('href')]
				$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
			})

			// update active and current class
			$(`.nav-link`).removeClass('current')
			$('.nav-item').removeClass('active')
			target.css('width', 0)
		}, 50)
	})
})

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
		$('.up-arrow').css('opacity', 1)
	} else {
		// hide sticky navbar
		$("#navbar-sticky").css("display", "none")
		$('.up-arrow').css('opacity', 0)
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
	current_navlink = $(`.nav-link[href="#${current_section}"]`)
	// show colored icons for all navlinks
	$('.navbar .nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})
	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon.svg')
	$('.nav-link').removeClass('current')
	$('img', current_navlink).parent().addClass('current')

	// move navbar-underline
	// get dimensions
	current_navlink_dom = document.querySelector(`.nav-link.current`)
	if (current_navlink_dom == null) return
	var width = current_navlink_dom.getBoundingClientRect().width
	var height = current_navlink_dom.getBoundingClientRect().height
	var left = current_navlink_dom.getBoundingClientRect().left + window.pageXOffset
	// var top = this.getBoundingClientRect().top + window.pageYOffset
	var top = 0

	// update dimensions
	target.css('width', `${width}px`)
	target.css('height', `${height}px`)
	target.css('left', `${left}px`)
	target.css('top', `${top}px`)
	target.css('borderColor', `black`)
	target.css('transform', `none`)
})

// add event listeners to each link to move navbar-underline
var target = $('.navbar-underline')
var links = $('.nav-link')
links.each(function() {
	$(this).on('click', (e) => e.preventDefault())
	$(this).on('mouseover', moveHoverUnderline)
})
$('#container').on('mouseover', moveCurrentUnderline)
$('#title').on('mouseover', moveCurrentUnderline)
$('.up-arrow').on('mouseover', moveCurrentUnderline)

// move navbar-underline to current section
function moveCurrentUnderline() {
	// update active class
	$(links).parent().removeClass('active')
	$(`.nav-link.current`).parent().addClass('active')

	// if not in any section yet
	if ($(`.nav-link.current`).length == 0) {
		target.css('width', 0)
		return
	}

	current_navlink_dom = document.querySelector(`.nav-link.current`)
	if (current_navlink_dom == null) return
	var width = current_navlink_dom.getBoundingClientRect().width
	var height = current_navlink_dom.getBoundingClientRect().height
	var left = current_navlink_dom.getBoundingClientRect().left + window.pageXOffset

	// update dimensions
	target.css('width', `${width}px`)
	target.css('height', `${height}px`)
	target.css('left', `${left}px`)
	target.css('top', `${top}px`)
	target.css('borderColor', `black`)
	target.css('transform', `none`)

	// current_navlink_doms = document.querySelectorAll(`.nav-link.current`)
	// if (current_navlink_doms == null) return
	// for (var i = 0; i < current_navlink_doms.length; i++) {
	// 	var current_navlink_dom = current_navlink_doms[i]
	// 	var width = current_navlink_dom.getBoundingClientRect().width
	// 	var height = current_navlink_dom.getBoundingClientRect().height
	// 	var left = current_navlink_dom.getBoundingClientRect().left + window.pageXOffset

	// 	// update dimensions
	// 	target.css('width', `${width}px`)
	// 	target.css('height', `${height}px`)
	// 	target.css('left', `${left}px`)
	// 	target.css('top', `${top}px`)
	// 	target.css('borderColor', `black`)
	// 	target.css('transform', `none`)
	// }
}

// move navbar-underline on navbar link hover
function moveHoverUnderline() {
	if (!$(this).parent().hasClass('active')) {
		// update active class
		$(links).parent().removeClass('active')
		$(this).parent().addClass('active')

		// get dimensions
		var width = this.getBoundingClientRect().width
		var height = this.getBoundingClientRect().height
		var left = this.getBoundingClientRect().left + window.pageXOffset
		var top = 0

		// update dimensions
		target.css('width', `${width}px`)
		target.css('height', `${height}px`)
		target.css('left', `${left}px`)
		target.css('top', `${top}px`)
		target.css('borderColor', `black`)
		target.css('transform', `none`)
	}
}

// adjust navbar-underline on window resize
function resizeFunc() {
	var active = $('.nav-item.active')
	if (active.length > 0) {
		var left = active.getBoundingClientRect().left + window.pageXOffset
		var top = active.getBoundingClientRect().top + window.pageYOffset
		target.css('left', `${left}px`)
		target.css('top', `${top}px`)
	}

	// check if hamburger is showing
	if ($('.hamburger').css('display') == 'block') {
		$('.navbar-underline').css('display', 'none')
	} else {
		$('.navbar-underline').css('display', 'block')
	}
}
window.addEventListener('resize', resizeFunc)


//////////////////// IMAGE LIGHTBOX ////////////////////

var current_image
$(document).ready(function() {
	resizeFunc()
	function showImageOverlay(img) {
		// show selected image
		src = $(img).attr('src')
		$('#image-overlay').attr('src', src)

		// show caption for selected image
		caption = $(img).attr('data-caption')
		$('#overlay-text').html(caption)
	}
	
	// open overlay
	$('.image-container').on('click', function() {
		current_image = $(this).find('img')
	
		img = $(this).find('img')
		showImageOverlay(img)

		// if height greater than window height
		if (0.9*$(window).width()*($(img).height()/$(img).width()) < $(window).height()) {
			$('#image-overlay-container').css('width', `${0.8*$(window).width()}px`)
		} else {
			$('#image-overlay-container').css('height', `${0.8*$(window).height()}px`)
		}

		$('#overlay-tip').css('visibility', 'visible')
			.css('opacity', 1)

		// $('#image-overlay').css('width', '60%')
		// if (window.screen.width < 767) {
		// 	$('#image-overlay').css('width', '90%')
		// }

		// show overlay, disable background scroll
		$('#overlay').css('visibility', 'visible')
		overlay.setAttribute('aria-hidden', false)
		document.body.classList.toggle('noscroll', true)
	})
	
	// close overlay
	$('#close-overlay').on('click', function() {
		// close overlay & re-enable scroll
		$('#overlay').css('visibility', 'hidden')
		$('#overlay-tip').css('visibility', 'hidden')
			.css('opacity', 0)
		document.body.classList.toggle('noscroll', false)
	
		// zoom out image
		$('#image-overlay').attr('width', '60%')
		if (window.screen.width < 767) {
			$('#image-overlay').attr('width', '90%')
		}
	})
	
	// image overlay zoom
	// $('#image-overlay').on('click', function(e) {
	// 	e.stopPropagation() // don't trigger #overlay click event
	// 	// zoom in
	// 	if (window.screen.width < 767) { // mobile
	// 		if ($('#image-overlay').css('width') == '90%') {
	// 			$('#image-overlay').css('width', '100%')
	// 		} else { // zoom out
	// 			$('#image-overlay').css('width', '90%')
	// 		}
	// 		return
	// 	} // desktop
	// 	if ($('#image-overlay').css('width') == '60%') {
	// 		$('#image-overlay').css('width', '80%')
	// 	} else { // zoom out
	// 		$('#image-overlay').css('width', '60%')
	// 	}
	// })

	// navigate prev/next image
	$(document).on('keyup', function(e) {
		if ($('#overlay').css('visibility') == 'hidden') return
		// prevent default keyup behavior
		e.preventDefault()

		// current image being show in overlay
		var images = $('.image')
		var cur = images.index(current_image)
		// previous image - left arrow
		if (e.which == 37) {
			if (cur <= 0) return
			img = images[cur-1]
			current_image = img
			showImageOverlay(img)
		}
		// next image - right arrow
		else if (e.which == 39) {
			if (cur >= images.length-1) return
			img = images[cur+1]
			current_image = img
			showImageOverlay(img)
		}
		else {
			return
		}
		$('#overlay-tip').css('visibility', 'hidden')
			.css('opacity', 0)
	})
})


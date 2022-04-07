// https://jmperezperez.com/medium-image-progressive-loading-placeholder/
// https://medium.com/caspertechteam/simple-image-placeholders-for-lazy-loading-images-unknown-size-19f0866ceced

var current_section = 'intro'
var current_navlink = $('.nav-link')[0]
var current_navlink_dom = document.querySelector(`.nav-link`)
var UPDATE_NAVBAR = 1
var target, links // for shifting navbar underline
var current_image // for overlay image
var parallaxElements = [] // list of parallax elements
var windowHeight = 0

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

// detect if device has touch screen
function isTouchDevice() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0))
}

// window resize function
// adjust shifting underline
function resizeHandler() {
	console.log('resize')
	// check if About section columns are in line, adjust text alignment
	if ($('#about-text').offset().top != $('#about-links').offset().top) {
		$('#about-text').removeClass('text-right').addClass('text-left')
		$('#about-links').removeClass('text-left').addClass('text-center')
	} else {
		$('#about-text').removeClass('text-left').addClass('text-right')
		$('#about-links').removeClass('text-center').addClass('text-left')
	}

	// move shifting underline to current section
	var active_ls = $('.nav-item.active')
	active_ls.each(function() {
		var left = $(this)[0].getBoundingClientRect().left + window.pageXOffset
		var top = $(this)[0].getBoundingClientRect().top + window.pageYOffset
		target.css('left', `${left}px`)
		target.css('top', `${top}px`)
	})

	// don't show shifting underline if hamburger is showing
	if ($('.hamburger').css('display') == 'block') {
		$('.navbar-underline').css('display', 'none')
		$('#intro').css('margin-top', $('#navbar').height() + 20)
	} else {
		$('.navbar-underline').css('display', 'block')
		$('#intro').css('margin-top', $('#navbar').height() + 60)
	}

	// update navbar and intro text positioning
	$('#navbar').attr('data-start', $('#before-sticky').height())
	parallaxElements['navbar'].start = $('#before-sticky').height()
	if ($('#navbar').hasClass('navbar-fixed')) {
		$('#navbar').css('top', 0)
	} else {
		$('#navbar').css('top', $('#before-sticky').height())
	}
}

//////////////////// SCROLL FUNCTIONS ////////////////////

// animated scroll to selected section
function scrollToSection() {
	current_navlink = $(`.nav-link[href="${$(this).attr('href')}"]`)
	current_section = $(current_navlink).attr('href').substring(1)
	UPDATE_NAVBAR = 0

	// check if hamburger is showing
	if ($('.hamburger').css('display') == 'block') {
		$('.navbar-collapse').removeClass('show')
		$('.hamburger').addClass('collapsed')
	}

	// show colored icons for all navlinks
	$('.nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})

	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon_white.svg')
	$('.nav-link').removeClass('current')
	$('img', current_navlink).parent().addClass('current')

	// animate scroll
	var scrollHere = $($(this).attr('href')).offset().top - $('#navbar').height() - 10
	$('html, body').animate({
		scrollTop: scrollHere
	}, 1000, function() {
		// update background shapes
		// updateCurrentSection()
		updateBackgroundShapes(current_section)
		UPDATE_NAVBAR = 1
	})
}

// animated scroll to top of page
function scrollToTop() {
	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: 0
	}, 1000, function() {
		setTimeout(function() {
			UPDATE_NAVBAR = 1
			current_section = 'intro'

			// show colored icons for all navlinks
			$('.nav-link').each(function() {
				var color = icon_dict[$(this).attr('href')]
				$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
			})

			// update active and current class
			$(`.nav-link`).removeClass('current')
			$('.nav-item').removeClass('active')
			target.css('width', 0)

			// update background shapes
			updateBackgroundShapes('intro')
		}, 50) // 50 = delay
	})
}

// update background shapes for a given section
function updateBackgroundShapes(current_section) {
	// reset all other background shapes
	$('.bg-shape').css('opacity', 0)
	$('.top').css('top', function() {
		// console.log(this, $(this).data('start'))
		return $(this).data('start')
	})
	$('.bottom').css('bottom', function() {
		// console.log(this, $(this).data('start'))
		return $(this).data('start')
	})

	// show background shapes for current section
	if (current_section == 'intro') {
		$('.intro1').css('opacity', 1).css('top', 0)
		$('.intro2').css('opacity', 0.8).css('bottom', 0)
	}
	else if (current_section == 'digital-art') {
		$('.digital-art1').css('opacity', 1).css('top', $('#navbar').outerHeight())
		$('.digital-art2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'animation') {
		$('.animation1').css('opacity', 1).css('top', $('#navbar').outerHeight())
		$('.animation2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'design') {
		$('.design1').css('opacity', 1).css('top', $('#navbar').outerHeight())
		$('.design2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'about') {
		$('.intro1').css('opacity', 1).css('top', $('#navbar').outerHeight()).css('z-index', -1)
		$('.intro2').css('opacity', 0.8).css('bottom', 0)
	}
	else { // intro
		$('.intro1').css('opacity', 1).css('top', 0)
		$('.intro2').css('opacity', 0.8).css('bottom', 0)
	}
}

// update current section variable
function updateCurrentSection() {
	if (!UPDATE_NAVBAR) return
	var pageTop = $(document).scrollTop()
	var pageBottom = pageTop + $(window).height()
	var pageMiddle = pageTop + ($(window).height() / 2)
	var tags = $('.section')
	var visible = {}
	// check position of each section
	for (var i = 0; i < tags.length; i++) {
		var tag = tags[i]
		var tag_top = $(tag).position().top + $('#before-sticky').height()
		var tag_bottom = $(tag).position().top + $('#before-sticky').height() + $(tag).height()
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
	return current_section
}

// scroll function
// show stickied navbar once scroll past header
// update current section and shifting underline in navbar
function scrollHandler() {
	// update current section
	var prev_section = current_section
	updateCurrentSection()

	// update bg image
	if (prev_section != current_section) updateBackgroundShapes(current_section)

	// update current section in navbar
	current_navlink = $(`.nav-link[href="#${current_section}"]`)
	// show colored icons for all navlinks
	$('.navbar .nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})
	// show white icon for current navlink
	$('img', current_navlink).attr('src', 'media/favicon_white.svg')
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

	// update shifting underline
	target.css('width', `${width}px`)
	target.css('height', `${height}px`)
	target.css('left', `${left}px`)
	target.css('top', `${top}px`)
	target.css('borderColor', `black`)
	target.css('transform', `none`)

	// fade image in on scroll
	var pageTop = $(document).scrollTop()
	var pageBottom = pageTop + $(window).height()
	var tags = $('.image-container')
	// check position of each image
	for (var i = 0; i < tags.length; i++) {
		var tag = tags[i]
		// if scrolled into view
		if ($(tag).position().top < pageBottom && $(tag).position().top + $(tag).height() > pageTop) {
			$(tag).addClass('visible') // fade in
			$(tag).addClass('up') // slide up
		}
		// if scrolled out of view
		else {
			$(tag).removeClass('visible') // fade in
			$(tag).removeClass('up') // slide up
		}
	}
}


//////////////////// SHIFTING UNDERLINE ////////////////////

// move shifting underline to current section
function moveCurrentUnderline() {
	if (!UPDATE_NAVBAR) return

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
}

// move shifting underline on navbar link hover
function moveHoverUnderline() {
	if (!UPDATE_NAVBAR) return
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

//////////////////// LOADING OVERLAY ////////////////////

// show overlay
function showLoadingOverlay() {
	// show overlay, disable background scroll
	$('#loading-overlay').css('visibility', 'visible')
	document.body.classList.toggle('noscroll', true)
}

// close overlay
function hideLoadingOverlay() {
	// close overlay & re-enable scroll
	$('#loading-overlay').css('visibility', 'hidden').css('opacity', 0)
	document.body.classList.toggle('noscroll', false)
}


//////////////////// IMAGE LIGHTBOX ////////////////////

// update overlay image for a given img
function updateOverlayImage(img) {
	// show selected image
	src = $(img).attr('data-imglarge')
	$('#image-overlay').attr('src', src)

	// show caption for selected image
	caption = $(img).attr('data-caption')
	$('#overlay-text').html(caption)

	$('#image-overlay').on('load', () => {
		$('#image-overlay').css('opacity', 1)
	})
}

// show overlay
function showOverlay() {
	current_image = $(this).find('img')
	img = $(this).find('img')
	updateOverlayImage(img)

	// if height greater than window height
	if (0.9*$(window).width()*($(img).height()/$(img).width()) < $(window).height()) {
		// $('#image-overlay-container').css('width', `${0.8*$(window).width()}px`)
		// $('#image-overlay-container').css('height', '')
	} else {
		$('#image-overlay-container').css('height', `${0.8*$(window).height()}px`)
		$('#image-overlay-container').css('width', '')
	}

	// hide overlay tip if device has touch screen
	if (isTouchDevice()) {
		$('#overlay-tip').css('visibility', 'hidden')
			.css('opacity', 0)
	} else {
		$('#overlay-tip').css('visibility', 'visible')
		.css('opacity', 1)
	}

	// show overlay, disable background scroll
	$('#overlay').css('visibility', 'visible').css('opacity', 1)
	overlay.setAttribute('aria-hidden', false)
	document.body.classList.toggle('noscroll', true)
}

// close overlay
function hideOverlay() {
	// close overlay & re-enable scroll
	$('#overlay').css('visibility', 'hidden').css('opacity', 0)
	$('#overlay-tip').css('visibility', 'hidden').css('opacity', 0)
	$('#image-overlay').css('opacity', 0)
	document.body.classList.toggle('noscroll', false)
}

// respond to keyup events, switch overlay image left and right
function keyUpHandler(e) {
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
			updateOverlayImage(img)
		}
		// next image - right arrow
		else if (e.which == 39) {
			if (cur >= images.length-1) return
			img = images[cur+1]
			current_image = img
			updateOverlayImage(img)
		}
		else {
			return
		}
		$('#overlay-tip').css('visibility', 'hidden')
			.css('opacity', 0)
}

// implement behavior for a given parallax element
// designed specifically for navbar
function parallax(scrollTop) {
	// for each parallax element
	for (var id in parallaxElements) {
		// DURING - fixed position
		// element is now active, fix the position so when we scroll it stays fixed
		$('#navbar').addClass('navbar-fixed')
		if ($('.hamburger').css('display') == 'none') $('.up-arrow').css('opacity', 1)
		else $('.up-arrow').css('opacity', 0)
		if (scrollTop >= parallaxElements[id].start && scrollTop <= parallaxElements[id].stop) {
			// console.log('during', scrollTop, parallaxElements[id].start)
			parallaxElements[id].state = 'during'
			$(parallaxElements[id].elm)
				.css({
					position: 'fixed',
					top: '0px',
					'background-color': '#ffffffee',
				})
		}
		// BEFORE - absolute position
		// scrolled up back past the start value, reset position
		else if (scrollTop < parallaxElements[id].start) {
			// console.log('before', scrollTop, parallaxElements[id].start)
			$('#navbar').removeClass('navbar-fixed')
			$('.up-arrow').css('opacity', 0)
			// if ($('.hamburger').css('display') != 'none') $('#nav-items').css('background-color', '#ffffffee') // #ffffffee
			// else $('#nav-items').css('background-color', 'transparent')
			parallaxElements[id].state = 'before'
			$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: parallaxElements[id].start,
					'background-color': 'transparent',
				})
		}
		// AFTER - absolute position
		// scrolled past the stop value, make position absolute again
		else if (scrollTop > parallaxElements[id].stop && parallaxElements[id].state == 'during') {
			// console.log('after', scrollTop, parallaxElements[id].start)
			$('#navbar').removeClass('navbar-fixed')
			parallaxElements[id].state = 'after'
			$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: `${$('#navbar').height()+scrollTop}px`,
					'background-color': '#ffffffee',
				})
		}
	}
}


//////////////////// IMAGE LAZY LOADING ////////////////////

// load artwork images over placeholder
function loadImages() {
	// for each image container
	$('.image-container').each(function() {
		// get medium-sized image filename
		var img_filename = $(this).attr('data-imglarge')
		var img_med_filename = img_filename.substring(0, img_filename.indexOf('.png')) + '_medium.jpg'

		// load medium-sized image
		var imgLarge = new Image()
		$(imgLarge).addClass('artwork')
			.attr('src', img_med_filename)
			.attr('data-imglarge', img_filename)
			.attr('alt', $('.placeholder', $(this)).attr('alt'))
			.on('load', () => {
				$(imgLarge).addClass('loaded')
			})
		$(this).append($(imgLarge))

		// update placeholder image src
		$('.placeholder', $(this)).attr('src', img_med_filename)
			.attr('data-imglarge', img_filename)
			.css('filter', 'none')
	})
	console.log('window loaded!')
}

//////////////////// EXECUTE ////////////////////

// execute functions when document is ready
$(document).ready(function() {
	// show loading screen
	showLoadingOverlay()

	// find shifting underline
	target = $('.navbar-underline')
	links = $('.nav-link')
	// move shifting underline to hovered section
	links.each(function() {
		$(this).on('click', (e) => e.preventDefault())
		$(this).on('mouseover', moveHoverUnderline)
	})
	// move shifting underline to current section
	$('#container').on('mouseover', moveCurrentUnderline)
	$('#title').on('mouseover', moveCurrentUnderline)
	$('.up-arrow').on('mouseover', moveCurrentUnderline)

	// window resize function
	window.addEventListener('resize', resizeHandler)
	// scroll function
	$(window).scroll(scrollHandler)

	// scroll to section on click
	$('.nav-link').on('click', scrollToSection)
	// scroll to top on click
	$('.up-arrow').on('click', scrollToTop)

	// open overlay
	$('.image-container').on('click', showOverlay)
	// close overlay
	$('#close-overlay').on('click', hideOverlay)
	// navigate prev/next overlay image
	$(document).on('keyup', function(e) {
		keyUpHandler(e)
	})

	// hamburger open menu items
	$('hamburger').on('click', () => {
		if ($('.hamburger').css('display') == 'block') {
			$('#navbar').css('background-color', '#ffffffee')
		}
	})

	//////////// PARALLAX ////////////

	windowHeight = $(window).height()
	$('html, body').scrollTop(1) // auto scroll to top

	// check if device has touch screen/ has touch events
	var touchSupported = (('ontouchstart' in window) ||
							window.DocumentTouch && document instanceof DocumentTouch)

	// if touch events are supported, tie our animation to the position to these events as well
	if (touchSupported) {
		$(window)
			.bind('touchmove', function(e) {
				var val = e.currentTarget.scrollY
				parallax(val)
			})
	}

	// handle scroll event
	$(window)
		.bind('scroll', function(e) {
			var val = $(this).scrollTop()
			parallax(val)
		})

	// update vars used in parallax calculations on window resize
	$(window).resize(function() {
		windowHeight = $(this).height()
		for (var id in parallaxElements) {
			parallaxElements[id].initialOffsetY = $(parallaxElements[id].elm).offset().top
			parallaxElements[id].height = $(parallaxElements[id].elm).height()
		}
	})

	// add parallax elements to array
	// get elements straight away since they won't change
	// this will minimize DOM interactions on scroll events
	$('.parallax').each(function() {
		$elm = $(this)
		var id = $elm.attr('id')
		// use data-id as key
		parallaxElements[id] = {
			id: $elm.attr('id'),
			start: $elm.attr('data-start'),
			stop: $elm.attr('data-stop'),
			speed: $elm.attr('data-speed'),
			elm: $elm[0],
			initialOffsetY: $elm.offset().top,
			height: $elm.height(),
			width: $elm.outerWidth(),
			state: 'before',
			pos: $elm.attr('data-pos'),
		}
	})

	updateBackgroundShapes('intro')
	resizeHandler()

	// load artwork image placeholders
	// $(window).on('load', loadImages)

	loadImages()
	hideLoadingOverlay()
})




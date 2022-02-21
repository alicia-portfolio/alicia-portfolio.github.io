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
	} else {
		$('.navbar-underline').css('display', 'block')
	}

	// update navbar and intro text positioning
	$('#navbar').attr('data-start', $('#before-sticky').height())
	parallaxElements['navbar'].start = $('#before-sticky').height()
	if ($('#navbar').hasClass('navbar-fixed')) {
		$('#navbar').css('top', 0)
	} else {
		$('#navbar').css('top', $('#before-sticky').height())
	}
	$('#intro').css('margin-top', $('#navbar').height() + 20)
}

//////////////////// SCROLL FUNCTIONS ////////////////////

// animated scroll to selected section
function scrollToSection() {
	// show colored icons for all navlinks
	$('.nav-link').each(function() {
		var color = icon_dict[$(this).attr('href')]
		$('img', $(this)).attr('src', `media/favicon_${color}.svg`)
	})

	// show white icon for current navlink
	current_navlink = $(`.nav-link[href="${$(this).attr('href')}"]`)
	$('img', current_navlink).attr('src', 'media/favicon.svg')
	$('.nav-link').removeClass('current')
	$('img', current_navlink).parent().addClass('current')

	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top - $('#navbar').height() - 10
	}, 1000, function() {
		// update background shapes
		updateCurrentSection()
		updateBackgroundShapes(current_section)
		UPDATE_NAVBAR = 1
	})

	// check if hamburger is showing
	if ($('.hamburger').css('display') == 'block') {
		$('.navbar-collapse').removeClass('show')
		$('.hamburger').addClass('collapsed')
	}
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
		$('.intro1').css('opacity', 1).css('top', 0).css('z-index', 1)
		$('.intro2').css('opacity', 0.8).css('bottom', 0).css('z-index', 1)
	}
	else if (current_section == 'digital-art') {
		$('.digital-art1').css('opacity', 1).css('top', $('#navbar').height())
		$('.digital-art2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'animation') {
		$('.animation1').css('opacity', 1).css('top', $('#navbar').height())
		$('.animation2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'design') {
		$('.design1').css('opacity', 1).css('top', $('#navbar').height())
		$('.design2').css('opacity', 1).css('bottom', 0)
	}
	else if (current_section == 'about') {
		$('.intro1').css('opacity', 1).css('top', $('#navbar').height()).css('z-index', -1)
		$('.intro2').css('opacity', 1).css('bottom', 0).css('z-index', -1)
	}
	else { // intro
		$('.intro1').css('opacity', 1).css('top', 0).css('z-index', 1)
		$('.intro2').css('opacity', 0.8).css('bottom', 0).css('z-index', 1)
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
	src = $(img).attr('src')
	$('#image-overlay').attr('src', src)

	// show caption for selected image
	caption = $(img).attr('data-caption')
	$('#overlay-text').html(caption)
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
	$('#overlay').css('visibility', 'visible')
	overlay.setAttribute('aria-hidden', false)
	document.body.classList.toggle('noscroll', true)
}

// close overlay
function hideOverlay() {
	// close overlay & re-enable scroll
	$('#overlay').css('visibility', 'hidden')
	$('#overlay-tip').css('visibility', 'hidden')
		.css('opacity', 0)
	document.body.classList.toggle('noscroll', false)

	// // zoom out image
	// $('#image-overlay').attr('width', '60%')
	// if (window.screen.width < 767) {
	// 	$('#image-overlay').attr('width', '90%')
	// }
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
					'background-color': 'white',
				})
		}
		// BEFORE - absolute position
		// scrolled up back past the start value, reset position
		else if (scrollTop < parallaxElements[id].start) {
			// console.log('before', scrollTop, parallaxElements[id].start)
			$('#navbar').removeClass('navbar-fixed')
			$('.up-arrow').css('opacity', 0)
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
					'background-color': 'white',
				})
		}
	}
}


//////////////////// IMAGE LAZY LOADING ////////////////////

// load artwork images over placeholder
function loadImages() {
	// for each image container
	$('.image-container').each(function() {
		// load large image
		var imgLarge = new Image()
		$(imgLarge).addClass('artwork')
		$(imgLarge).attr('src', $(this).attr('data-imglarge'))
			.on('load', () => {
				$(imgLarge).addClass('loaded')
			})
		
		$(this).append($(imgLarge))

		// update placeholder image src
		$('.placeholder', $(this)).attr('src', $(this).attr('data-imglarge'))
			.css('filter', 'none')
	})
	console.log('window loaded!')
	console.log($('.image-container'))
}

//////////////////// EXECUTE ////////////////////

// execute functions when document is ready
$(document).ready(function() {
	// show laoding screen
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
	$(window).on('load', loadImages)

	loadImages()
	hideLoadingOverlay()
})




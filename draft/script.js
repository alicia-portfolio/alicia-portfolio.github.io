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
}

//////////////////// SCROLL FUNCTIONS ////////////////////

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

	// animate scroll
	UPDATE_NAVBAR = 0
	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top - $('#navbar').height() - 10
	}, 1000, function() {
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
}

// scroll function
// show stickied navbar once scroll past header
// update current section and shifting underline in navbar
function scrollHandler() {
	// // show stickied navbar once scroll past header
	// if ($(this).scrollTop() > $("#before-sticky").outerHeight((includeMargin = true))) { // if scroll past header
	// 	// show sticky navbar
	// 	$('#navbar').addClass('navbar-fixed')
	// 	$('.up-arrow').css('opacity', 1)
	// } else {
	// 	// hide sticky navbar
	// 	$('#navbar').removeClass('navbar-fixed')
	// 	$('.up-arrow').css('opacity', 0)
	// }

	// // activate parallax
	// var val = $(this).scrollTop()
	// parallax(val)

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

	// update shifting underline
	target.css('width', `${width}px`)
	target.css('height', `${height}px`)
	target.css('left', `${left}px`)
	target.css('top', `${top}px`)
	target.css('borderColor', `black`)
	target.css('transform', `none`)
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


//////////////////// PARALLAX ////////////////////

// implement behavior for a given parallax element
function parallax(scrollTop) {
	// for each parallax element
	for (var id in parallaxElements) {
		// console.log(parallaxElements[id], scrollTop, parallaxElements[id].start)
		// DURING - fixed position
		// element is now active, fix the position so when we scroll it stays fixed
		if (scrollTop >= parallaxElements[id].start && scrollTop <= parallaxElements[id].stop) {
			// console.log('during', scrollTop, parallaxElements[id].start)
			parallaxElements[id].state = 'during'
			if (id == 'navbar') {
				$(parallaxElements[id].elm)
				.css({
					position: 'fixed',
					top: '0px',
				})
			}
			else if (parallaxElements[id].pos == 'top') {
				$(parallaxElements[id].elm)
				.css({
					position: 'fixed',
					top: `${$('#navbar').height()}px`,
				})
			} else {
				$(parallaxElements[id].elm)
				.css({
					position: 'fixed',
					top: '',
					bottom: '0px',
				})
			}
		}
		// BEFORE - absolute position
		// scrolled up back past the start value, reset position
		else if (scrollTop < parallaxElements[id].start) {
			// console.log('before', scrollTop, parallaxElements[id].start)
			console.log('%%%%%%%%',id, parallaxElements[id].start,$('#navbar').height(),$(window).height(), scrollTop)
			parallaxElements[id].state = 'before'
			if (id == 'navbar') {
				$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: parallaxElements[id].start,
				})
			} 
			else if (parallaxElements[id].pos == 'top') {
				$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: `${parallaxElements[id].start+$('#navbar').height()}px`,
				})
			} else {
				$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: `${parallaxElements[id].start+$('#navbar').height()+$(window).height()}px`,
				})
			}
		}
		// AFTER - absolute position
		// scrolled past the stop value, make position absolute again
		else if (scrollTop > parallaxElements[id].stop && parallaxElements[id].state == 'during') {
			console.log('after', scrollTop, parallaxElements[id].start)
			parallaxElements[id].state = 'after'
			if (parallaxElements[id].pos == 'top') {
				$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					top: `${$('#navbar').height()+scrollTop}px`,
				})
			} else {
				console.log('#######',id, parallaxElements[id].start,$('#navbar').height(),$(window).height(), scrollTop)
				$(parallaxElements[id].elm)
				.css({
					position: 'absolute',
					// bottom: '0px',
					// top: `${parallaxElements[id].stop + $(window).height()}`,
					top: `${$('#navbar').height()+scrollTop}px`,
					bottom: '',
					// top: `${parallaxElements[id].start+$('#navbar').height()+$(window).height()}px`,
					// top: `${$(parallaxElements[id].elm).offset().top + $('#container').offset().top}`,
					// top: `${$('#navbar').height()+scrollTop+$(window).height()}px`,
					// top: `${$(parallaxElements[id].elm).offset().top}px`
				})
				console.log('#$$$$', id, $(parallaxElements[id].elm).offset().top, $('#container').offset().top, parallaxElements[id].stop + $(window).height())
				// console.log(id, $(window).height(), scrollTop, $('#navbar').height(), $(window).height() + scrollTop + $('#navbar').height() )
			}
			// $(parallaxElements[id].elm)
			// 	.css({
			// 		position: 'absolute',
			// 		top: `${parallaxElements[id].start+$('#navbar').height()+scrollTop}px`,
			// 	})
		}
	}
}

//////////////////// EXECUTE ////////////////////

// execute functions when document is ready
$(document).ready(function() {
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

	// execute resize function
	resizeHandler()


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

	// add start and stop points for parallax shapes
	$('#bg-shapes .parallax').each(function() {
		// 13 = char length of 'media/shapes/'
		var src = $(this).attr('src')
		var section_name = src.substring(13, src.length - 5)
		var shape_name = src.substring(13, src.length - 4)
		var num = shape_name.charAt(shape_name.length - 1)

		// set starting and stopping points depending on section
		var pos = (num == '1') ? 'top' : 'bottom'
		var start = $(`#${section_name}`).offset().top - $('#navbar').height()
		// if (num == '2') start += $(window).height()
		var stop = start + $(`#${section_name}`).height() - $(window).height()

		// var stop =  $(`#${section_name}`).offset().top - $('body').offset().top + $(`#${section_name}`).height()
		// if (num == '2') stop += $(window).height()
		// console.log(shape_name, start, stop, $(`#${section_name}`).offset(), $(`#${section_name}`).offset().top - $('body').offset().top)
		// console.log(pos, num)
		
		$(this).attr('id', shape_name)
		$(this).attr('data-start', start)
		$(this).attr('data-stop',stop)
		$(this).attr('data-pos', pos)
	})

	console.log('intro', $(`#intro`).offset(), $("#intro").offset().top - $("body").offset().top)
	// add parallax elements to array
	// get elements straight away since they won't change
	// this will minimize DOM interactions on scroll events
	$('.parallax').each(function(){
		$elm = $(this)
		var id = $elm.attr('id')
		// use data-id as key
		parallaxElements[id] = {
			id: $elm.attr('id'),
			start: $elm.data('start'),
			stop: $elm.data('stop'),
			speed: $elm.data('speed'),
			elm: $elm[0],
			initialOffsetY: $elm.offset().top,
			height: $elm.height(),
			width: $elm.outerWidth(),
			state: 'before',
			pos: $elm.data('pos'),
		}
	})
	console.log('intro', $(`#intro`).offset(), $("#intro").offset().top - $("body").offset().top)
})


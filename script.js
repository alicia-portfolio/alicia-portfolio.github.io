// wait 3 seconds
function onReady(callback) {
	var intervalId = window.setInterval(function() {
		if (document.getElementsByTagName('body')[0] !== undefined) {
			window.clearInterval(intervalId)
			callback.call(this)
		}
	}, 3000)
}

// hide welcome page overlay
onReady(function() {
	$('#overlay').css('opacity', 0)
		.css('visibility', 'hidden')
})

// animated scroll to selected section
$('#navbar a').on('click', function() {
	console.log($(this).attr('href'))
	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top
	}, 1000)
})

// // navbar collapse
// $("#hamburger").on("click", () => {
// 	$("#hamburger").toggleClass("collapsed");
// 	$("#navbar-items").toggleClass("collapsed");
// });
// $(document).click(function (event) {
// 	var clickover = $(event.target);
// 	var opened = !$("#navbar-items").hasClass("collapsed");
// 	if (
// 		opened == true &&
// 		!clickover.hasClass("navbar-toggler") &&
// 		clickover.parents(".navbar").length == 0
// 	) {
// 		$("#hamburger").addClass("collapsed");
// 		$("#navbar-items").addClass("collapsed");
// 	}
// });

// load all artwork images for a given section
function loadImages(section) {
	return
}

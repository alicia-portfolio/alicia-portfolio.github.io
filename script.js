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

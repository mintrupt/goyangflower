var app = {
	initialize : function() {

		$.mobile.page.prototype.options.backBtnText = '이전';
		$.mobile.defaultPageTransition = 'none';

		app.watchId = 0;
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('resume', this.onResume, false);
		document.addEventListener('pause', this.onPause, false);

		mapScroll = new iScroll('map-wrapper', {
			hScroll : true,
			vScroll : true,
			zoom : true,
			zoomMax : 1.5,
			zoomMin : 0.3
		});

		var images = 54;
		for ( var name = 1; name <= images; name++) {
			var content = '<li><a href="img/flowers/' + name
					+ '.jpg"><img src="img/flowers/' + name + '.jpg" alt="'
					+ name + '" /></a></li>';
			$('#gallery-list').append(content);
		}

		$('#map').on(
				'pageshow',
				function(event) {
					var mapWrapperHeight = $(window).height()
							- $('#map-header').height() + 'px';
					$('#map-wrapper').css('height', mapWrapperHeight);
					$('#map-wrapper').css('width', $(window).width());

					mapScroll.refresh();
				});

		$(document).ready(function() {
			var galleryPhotoSwipe = $("#gallery-list a").photoSwipe({
				enableMouseWheel : false,
				enableKeyboard : false
			});
		});
	},
	onDeviceReady : function() {
		app.geolocation();
	},
	onResume : function() {
		app.geolocation();
	},
	geolocation : function() {

		var options = {
			maximumAge : 3000,
			timeout : 5000,
			enableHighAccuracy : true
		};

		var onSuccess = function(position) {
			var message = '<ul>' + '<li>위도: ' + position.coords.latitude
					+ '</li>' + '<li>경도: ' + position.coords.longitude
					+ '</li>' + '<li>고도: ' + position.coords.altitude + '</li>'
					+ '<li>정확도: ' + position.coords.accuracy + '</li>'
					+ '<li>고도 정확도: ' + position.coords.altitudeAccuracy
					+ '</li>' + '<li>방위: ' + position.coords.heading + '</li>'
					+ '<li>속도: ' + position.coords.speed + '</li>'
					+ '<li>타임스탬프: ' + new Date(position.timestamp) + '</li>'
					+ '</ul>';
			$('.geolocation').html(message);

			if (position.coords.accuracy < 2000) {
				var lat = position.coords.latitude;
				var long = position.coords.longitude;

				var x = lat * (-272357.9612914) + long * 331551.87774443
						- 31772648.23497085;
				var y = lat * (-331608.27513752) + long * (-147601.1577074)
						+ 31198676.55790285;

				x *= 0.50801603206;
				y *= 0.50801603206;

				$('#marker-current').css('left', x - 25);
				$('#marker-current').css('top', y - 25);
			}
		};

		var onError = function(error) {
			var message = 'code: ' + error.code + '\n' + 'message: '
					+ error.message + +'\n';
			$('.geolocation').html(message);

			var restart = function() {
				app.geolocation();
			};

			setTimeout(restart, 2000);
		};

		if (app.watchId !== 0) {
			navigator.geolocation.clearWatch(app.watchId);
			app.watchId = 0;
		}

		app.watchId = navigator.geolocation.watchPosition(onSuccess, onError,
				options);
	},
	onPause : function() {
		navigator.geolocation.clearWatch(app.watchId);
		app.watchId = 0;
	}
}

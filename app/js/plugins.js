/*AnimatedCursor Plugin created by css4 ES6*/
;(function (window) {

  class AnimatedCursor {

      constructor(selector, config) {

        this.mainElement = selector;
        this._config = config || {};
        this._config.printTime = this._config.printTime || 200;
        this._config.deleteTime = this._config.deleteTime || 40;
        this.currentIndex = 0;
        this.words = selector.getAttribute('data-words').split("|");

        this.currTime = this._config.deleteTime;
        this.tempWord = this.words[this.currentIndex];
        this.printWord = '';
        this.status = 'delete';

        this.init();

      }

      init() {

          this.mainElement.innerHTML = this.tempWord;
          let self = this;
          setTimeout(function run() {
              if(self.status === 'print'){
                  self.printLetters(self.printWord)
              }
              else {
                  self.deleteLetters(self.tempWord);
              }

              setTimeout(run, self.currTime);
          }, 1000);

      }

      deleteLetters(word) {
          if(!word.length){
              this.changeStatus();
              this.changeIndex();
              this.currTime = this._config.printTime;
              return true;
          }

          this.currTime = this._config.deleteTime;

          this.tempWord = word.substr(0, word.length-1);
          this.mainElement.innerHTML = this.tempWord;
      }

      printLetters(currprint) {
          if(currprint.length == this.words[this.currentIndex].length) {
              this.changeStatus();
              this.tempWord = this.words[this.currentIndex];
              this.printWord = '';
              this.currTime = this._config.printTime*8;
              return true;
          }
          else {
              this.printWord = this.words[this.currentIndex].substr(0, currprint.length + 1);
              this.mainElement.innerHTML = this.printWord;
          }

      }

      changeIndex() {
        this.currentIndex = this.currentIndex + 1 > this.words.length - 1 ? 0: ++this.currentIndex;
      }

      changeStatus() {
        this.status = this.status === "delete" ? "print" : "delete";
      }

  }

    window.AnimatedCursor = AnimatedCursor;

})(window);

//google maps
;(function(window) {

    $(function () {
       initApi();
    });

    function initApi() {
        if (document.querySelector('[data-map-api-key]') && !document.querySelector('.google-map-api')) {
            if ($('[data-map-api-key]').length) {
                var script = document.createElement('script');
                let apiKey = $('[data-map-api-key]:first').attr('data-map-api-key');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=initMaps';
                script.className = 'google-map-api';
                document.body.appendChild(script);
            }
        }
    }

    function initMaps() {
        if (typeof google !== "undefined") {
                if (typeof google.maps !== "undefined") {
                    $('.google-map[data-map-api-key]').each(function() {
                        var mapInstance = this,
                            mapJSON = typeof $(this).attr('data-map-style') !== "undefined" ? $(this).attr('data-map-style') : false,
                            mapStyle = JSON.parse(mapJSON) || [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }],
                            zoomLevel = (typeof $(this).attr('data-map-zoom') !== "undefined" && $(this).attr('data-map-zoom') !== "") ? $(this).attr('data-map-zoom') * 1 : 17,
                            latlong = typeof $(this).attr('data-map-latlong') != "undefined" ? $(this).attr('data-map-latlong') : false,
                            latitude = latlong ? 1 * latlong.substr(0, latlong.indexOf(',')) : false,
                            longitude = latlong ? 1 * latlong.substr(latlong.indexOf(",") + 1) : false,
                            geocoder = new google.maps.Geocoder(),
                            address = typeof $(this).attr('data-map-address') !== "undefined" ? $(this).attr('data-map-address').split(';') : false,
                            markerTitle = "We Are Here",
                            isDraggable = $(document).width() > 766 ? true : false,
                            map, marker, markerImage,
                            mapOptions = {
                                draggable: isDraggable,
                                scrollwheel: true,
                                zoom: zoomLevel,
                                disableDefaultUI: true,
                                styles: mapStyle
                            };

                        if ($(this).attr('data-marker-title') != undefined && $(this).attr('data-marker-title') != "") {
                            markerTitle = $(this).attr('data-marker-title');
                        }

                        if (address != undefined && address[0] != "") {
                            geocoder.geocode({ 'address': address[0].replace('[nomarker]', '') }, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    var map = new google.maps.Map(mapInstance, mapOptions);
                                    map.setCenter(results[0].geometry.location);

                                    address.forEach(function(address) {
                                        var markerGeoCoder;

                                        markerImage = { url: window.mr_variant == undefined ? 'images/logotype/location.png' : '../images/location.png', size: new google.maps.Size(30, 48), scaledSize: new google.maps.Size(30, 48) };
                                        if (/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/.test(address)) {
                                            var latlong = address.split(','),
                                                marker = new google.maps.Marker({
                                                    position: { lat: 1 * latlong[0], lng: 1 * latlong[1] },
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle,
                                                    optimised: false
                                                });
                                        } else if (address.indexOf('[nomarker]') < 0) {
                                            markerGeoCoder = new google.maps.Geocoder();
                                            markerGeoCoder.geocode({ 'address': address.replace('[nomarker]', '') }, function(results, status) {
                                                if (status == google.maps.GeocoderStatus.OK) {
                                                    marker = new google.maps.Marker({
                                                        map: map,
                                                        icon: markerImage,
                                                        title: markerTitle,
                                                        position: results[0].geometry.location,
                                                        optimised: false
                                                    });
                                                }
                                            });
                                        }

                                    });
                                } else {
                                    console.log('There was a problem geocoding the address.');
                                }
                            });
                        } else if (latitude != undefined && latitude != "" && latitude != false && longitude != undefined && longitude != "" && longitude != false) {
                            mapOptions.center = { lat: latitude, lng: longitude };
                            map = new google.maps.Map(mapInstance, mapOptions);
                            marker = new google.maps.Marker({
                                position: { lat: latitude, lng: longitude },
                                map: map,
                                icon: markerImage,
                                title: markerTitle
                            });

                        }

                    });
                }
        }
    }

    // initMaps();
    window.initMaps = initMaps;

})(window);


//Contact form
;(function(window) {

})(window);
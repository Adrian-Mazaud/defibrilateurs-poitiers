<script>
export default {

    name : 'map-component',

    data () {
        return {
            key: 'AIzaSyDbtnj6dy9cn9xnI2Iy1jHyuQ9XESAvohY',
            travelMode: 'DRIVING'
        }
    },

    /**
     * [beforeMount | Add script tag at the end of body for load async Google Map API]
     * Callback called `app.googleApiLoaded` used in App.vue, emit an event
     */
    beforeMount (){
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key='+ this.key +'&callback=app.googleApiLoaded';
        document.querySelector('body').appendChild(script);

    },

    /**
     * [created description]
     * @return [type] [description]
     */
    created () {
        // When created component we listen few events :
        // - Google api loaded
        eventHub.$on('apiloaded', this.initMap)


    },

    events: {

    },

    mounted (){

    },

    methods: {

        toggleMove () {
            this.move = !this.move
        },

        /**
         * [initMap | Initialize google map, and create map]
         */
        initMap () {
            var mapOptions = {
                zoom: 15
            };
            this.map = new google.maps.Map(this.$el, {
                center: {lat: 46.578352, lng: 0.338170},
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });

            // window.mapStore = new window.mapStore(map);

            this.loadData();

            this.direction = new google.maps.DirectionsRenderer({
                map   : this.map,
                panel :  document.getElementById('panel') // Dom element pour afficher les instructions d'itinÃ©raire
            });
        },

        /**
         * [loadData description]
         * @return [type] [description]
         */
        loadData () {
            // Load data, store in JSON in localstorage ?  FIXME
            this.map.data.loadGeoJson('assets/data/data.json');

            // Set image feature
            this.map.data.setStyle({
                icon: 'assets/img/coeur.png'
            });

            // Attach event to feature (defib)
            this.map.data.addListener('click', function(event) {
            // console.log('event.feature', event.feature);
                this.startItinerary(event);
            }.bind(this));


            // Display user position on map
            user.getCurrentPosition().then( (position) => {

                user.lat = position.coords.latitude;
                user.lng = position.coords.longitude;

                var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.userMarker = new google.maps.Marker({
                    position: userPosition,
                    map: this.map
                })
            })


        },

        startItinerary (event) {
            var origin = user.lat + ',' + user.lng;
            // var origin = this.userPosition.lat() + ',' + this.userPosition.lng();
            var destination = event.latLng.lat() + ',' + event.latLng.lng();
            if(origin && destination){
                console.log(this);
                var request = {
                    origin      : origin,
                    destination : destination,
                    travelMode  : google.maps.DirectionsTravelMode.DRIVING, // Type de transport
                    // DRIVING
                    // WALKING
                    drivingOptions: {
                        departureTime: new Date(/* now, or future date */),
                        trafficModel: google.maps.TrafficModel.PESSIMISTIC
                    }
                }
                var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
                directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
                    if(status == google.maps.DirectionsStatus.OK){
                        // console.log(this);
                        this.direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
                        // panelController.enter();
                        eventHub.$emit('itineraryLoaded') // Event emit whent Google Maps API are loaded, used in `map.vue` | `mapComponent`
                    }
                }.bind(this));
            }
        }


    }

}
</script>

<style lang="sass">

</style>


<template lang="pug" >
    div(id="mapComponent" class="map-container" )
</template>

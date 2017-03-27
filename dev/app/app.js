/** [Vue | Import Vue js ^v2] */
var Vue = require('vue')


/**
 * [MapComponent | This is the... map component]
 * @type {[Vue Component]}
 */
var App = require('./app.vue')
var MapComponent = require('./map.vue')
var PanelComponent = require('./panel.vue')


/**
 * TODO - Using... api
 */
// var aja = require('aja')
// // This... API, not work for now, because pre-flight request (example Chrome) use OPTIONS header and it's not supported by this API
// aja()
//     .header('Content-Type', 'text/plain')
//     .method('get')
//     .url('http://open-data-poitiers.herokuapp.com/api/v2/defibrillators/all')
//     // .cache(false)
//     .on('200', function(response){
//     //well done
//     })
//     .on('40x', function(response){
//     //something is definitely wrong
//     // 'x' means any number (404, 400, etc. will match)
//     })
//     .on('500', function(response){
//     //oh crap
//     })
// .go();

/**
 * [eventHub | Events hub, This is the event hub we'll use in every component to communicate between them.]
 * @type {Vue}
 */
global.eventHub = new Vue()


/**
 * TODO
 */
// class mapStore {
//     constructor(map) {
//         this.map = map;
//     }
//
//     getMap() {
//         return this.map
//     }
// }


/**
 * [class User | For user geolocation | position]
 */
class User {
    constructor(){
        this.available = this.geolocationAvailable()
        this.lat = null
        this.lng = null
        this.timeLastCheckPosition = null

        // FIXME
        // this.denied = this.checkIfUserDeniedGeolocation()
        // this.watchID = this.watchPosition()
    }

    geolocationAvailable () {
        return navigator.geolocation ? true : false;
    }


    // FIXME
    watchPosition () {
        // this.watchID = navigator.geolocation.watchPosition(function(position) {
        //     console.log('position');
        // });
    }

    // FIXME
    checkIfUserDeniedGeolocation () {
        var denied = true;
        navigator.permissions.query({'name' : 'geolocation'}).then(permission => denied = permission.state);
        return denied;

    }

    /**
     * [getPosition | get user Position with geolocation HTML5 api, if not available call handleNoGeolocation]
     * @return {[type]} [description]
    */
    getPosition () {
        if (this.available) {
            navigator.geolocation.getCurrentPosition((position) => {

                this.lat =  position.coords.latitude
                this.lng =  position.coords.longitude
                this.timeLastCheckPosition = position.timestamp

                if (this.denied) {
                    console.log('user reject geolocation');
                }
            });
        }else{
            // FIXME handleNoGeolocation Error
            console.log('geolocation not available');
        }
    }

    getCurrentPosition() {
        return new Promise(
            (resolve, reject) => {
                if (this.available) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        resolve(position)
                    });
                }else{
                    reject('error no geolocation')
                }
            }
        )
    }
}


/**
 * [ls | localStorage]
 * TODO Not used for now
 */
class ls {
    constructor() {
        this.available = this.testAvailable()
    }

    testAvailable () {
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    saveItem(){

    }
}



// Init User Class for user position with html5 geolocation API
global.user = new User();
user.getPosition();

window.addEventListener('load', function(){
    // Init LocalStorage Class
    global.ls = new ls();


    // Vuex Store ?
    // window.mapStore = new mapStore(null);
})


/**
 * [mapComponent description]
 * @type {Vue}
 */
global.app = new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    },
    methods: {
        googleApiLoaded: function(){
            eventHub.$emit('apiloaded') // Event emit whent Google Maps API are loaded, used in `map.vue` | `mapComponent`
        }
    }
})

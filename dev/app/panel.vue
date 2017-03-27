<script>
var dynamics = require('dynamics.js')
export default {
    name: 'panel-component',
    data () {
        return {
            open: false,
            loading: false
        }
    },

    created () {
        eventHub.$on('itineraryLoaded', this.openPanel)
    },

    methods: {
        openPanel(){
            this.open = true;
        },

        toggle () {
            this.open = !this.open;
        },

        toggleLoader () {
            this.loading = !this.loading;
        },

        enter (element, done){
            dynamics.animate(element, {
                translateX: 0
            }, {
                duration: 250,
                friction: 300,
                easing: dynamics.easeInOut,
                complete () {
                    done
                }
            })
        },

        leave (element, done) {
            dynamics.animate(element, {
                translateX: element.offsetWidth + 'px'
            }, {
                duration: 250,
                friction: 300,
                easing: dynamics.easeInOut,
                complete () {
                    done
                }
            })
        }
    }
}
</script>

<style lang="sass">
</style>

<template lang="pug">
    div(class="panel-container")
        a(class="panel-cross-button" @click.prevent="toggle" v-bind:class="{close: open}")
            span.cross
            span.link-hide Ouvrir / Fermer le panneau
        transition(:css="false" @enter="enter" @leave="leave" appear)
            div(class="panel" v-show="open" id="panel")
                div(class="overlay" v-show="loading")
                    span(class="loader")
</template>

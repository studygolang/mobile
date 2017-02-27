<template>
    <transition name="toast">
        <div class="toast-wrap" v-show="showing">{{text}}</div>
    </transition>
</template>

<script>
    const DEFAULT_DURATION = 2000;
    import Methods from './CommonMethods';
    export default {
        name: 's-toast',
        data() {
            return {
                text: '',
                showing: false,
                timer: null
            };
        },
        mounted: function() {
            console.log('toast mounted...');
            Methods.register('toast', this.show);
        },
        methods: {
            show: function(text, duration) {
                this.text = text;
                this.showing = true;
                if (this.timer) {
                    clearInterval(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.showing = false;
                }, duration || DEFAULT_DURATION);
            }
        }
    }
</script>

<style lang="sass">
    @import "Toast.scss";
</style>
<template>
    <transition name="loading">
        <div id="loading-wrap" v-show="showing">
            <div class="loading-toast">
                <div class="loading-toast-icon"></div>
                <div class="loading-toast-content">{{title}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 's-loading',
        data() {
            return {
                title: '',
                showing: false
            }
        },
        methods: {
            show: function(title) {
                this.title = title || '数据加载中';
                this.showing = true;
            },
            hide: function() {
                this.showing = false;
            }
        }
    }
</script>

<style lang="sass">
    @import "Loading.scss";
</style>
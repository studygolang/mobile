<template>
    <div class="pulldown-refresh" :class="{transition: yDiff == 0}"
         :style="transformStyle">
        <div class="pulldown-refresh-icon"></div>
    </div>
</template>

<script>
    const Y_DIFF_MAX = 100;
    const TIME_OUT = 5000;
    const IS_MOBILE = 'ontouchstart' in window;

    export default {
        name: 'pull-down',
        data() {
            return {
                el: null,
                yDiff: 0,
                onTouchstart: null,
                onTouchmove: null,
                onTouchend: null
            }
        },
        computed: {
            transformStyle: function() {
                return {
                    '-webkit-transform': 'translate3d(0, ' + this.yDiff + 'px, 0)',
                    'transform': 'translate3d(0, ' + this.yDiff + 'px, 0)'
                }
            }
        },
        methods: {
            bindElement: function(el, callback) {
                var scrollEl = el;
                if (!el) {
                    el = window;
                    scrollEl = document.body;
                }

                this.el = el;

                var startPulldown = false,
                        startY = 0,
                        moveY = 0,
                        canRefresh = false;

                this.onTouchstart = (e) => {
                    var scrollTop = scrollEl.scrollTop;
//                    console.log('touchstart, scrollTop: ' + scrollTop);

                    startPulldown = (scrollTop == 0);
                    if (startPulldown) {
                        startY = (IS_MOBILE ? e.touches[0] : e).clientY;
                    }
                };

                this.onTouchmove = (e) => {
//                    console.log('touchmove');

                    if (!startPulldown) return;

                    moveY = (IS_MOBILE ? e.touches[0] : e).clientY;
                    var yDiff = moveY - startY;
                    if (yDiff > 0) {
                        e.preventDefault();
                        this.yDiff = Math.min(parseInt(yDiff / 2), Y_DIFF_MAX);
                        canRefresh = this.yDiff >= 60;
                    }
                };

                this.onTouchend = (e) => {
                    startPulldown = false;

                    if (!canRefresh) {
                        // console.log('下拉距离不够, 不刷新');
                        this.yDiff = 0;
                    } else {
                        // console.log('刷新, 执行回调');

                        // 5秒超时后恢复
                        var resumeTimer = setTimeout(() => {
                            this.yDiff = 0;
                        }, TIME_OUT);

                        canRefresh = false;
                        if (typeof callback === 'function') {
                            callback().then(() => {
                                clearTimeout(resumeTimer);
                                this.yDiff = 0;
                            }).catch(() => {
                                clearTimeout(resumeTimer);
                                this.yDiff = 0;
                            });
                        } else {
                            clearTimeout(resumeTimer);
                            this.yDiff = 0;
                        }
                    }
                };

                if (IS_MOBILE) {
                    el.addEventListener('touchstart', this.onTouchstart, false);
                    el.addEventListener('touchmove', this.onTouchmove, false);
                    el.addEventListener('touchend', this.onTouchend, false);
                } else {
                    el.addEventListener('mousedown', this.onTouchstart, false);
                    el.addEventListener('mousemove', this.onTouchmove, false);
                    el.addEventListener('mouseup', this.onTouchend, false);
                }
            }
        },
        mounted: function() {
            console.log('pullDown mounted');
        },
        beforeDestroy: function() {     // 组件销毁时解除事件绑定
            if (IS_MOBILE) {
                this.el.removeEventListener('touchstart', this.onTouchstart);
                this.el.removeEventListener('touchmove', this.onTouchmove);
                this.el.removeEventListener('touchend', this.onTouchend);
            } else {
                this.el.removeEventListener('mousedown', this.onTouchstart);
                this.el.removeEventListener('mousemove', this.onTouchmove);
                this.el.removeEventListener('mouseup', this.onTouchend);
            }
            console.log('pullDown events destroyed');
        }
    }
</script>

<style>
    .pulldown-refresh {
        position: fixed;
        width: 48px;
        height: 48px;
        background-color: #fff;
        border-radius: 5px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: -54px;
        z-index: 41;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .pulldown-refresh-icon {
        width: 33px;
        height: 33px;
        background: url('http://img.ishequ360.com/images/zg/supply/refresh-icon@2x.png') no-repeat center;
        background-size: contain;
        animation: spin 1s linear infinite;
    }

    .transition {
        transition: transform 0.5s ease-out;
    }
</style>
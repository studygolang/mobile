<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="关于" back="1"></s-header>

            <div class="about-main-wrap">
                <div class="about-logo-wrap">
                    <div class="about-logo"></div>
                    <div class="about-barcode"></div>
                    <div class="about-text">您的朋友可扫描二维码下载Go语言中文网APP</div>
                </div>

                <div class="user-menu-group" style="margin-top: 0;">
                    <div class="user-menu">
                        <div class="flex-group">
                            <div class="user-menu-icon version"></div>
                            <div class="user-menu-name">当前版本</div>
                        </div>
                        <div class="user-menu-text">1.0.0</div>
                    </div>
                    <div class="user-menu">
                        <div class="flex-group">
                            <div class="user-menu-icon update"></div>
                            <div class="user-menu-name">版本更新</div>
                        </div>
                        <div class="user-menu-text">暂无更新</div>
                    </div>
                </div>

                <div class="copyright-wrap">
                    Copyright &copy; 2017 <br>
                    Go语言中文网版权所有
                </div>
            </div>
        </aside>
    </transition>
</template>

<script>
    export default {
        name: 'user-about-tab',
        data: function() {
            return {
            }
        },
        mounted: function() {
            console.log('UserAbout 被加载');
        }
    }
</script>

<style lang="sass">
    @import "../sass/AboutTab.scss";
</style>
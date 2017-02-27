<template>
    <div class="user-tab-main-wrap">
        <s-header title="个人中心" no-box-shadow="1"></s-header>
        <div class="user-profile-wrap" @click="goLogin">
            <div class="user-head-image" :style="avatarStyle"></div>
        <template v-if="user.username">
            <div class="user-name-main">{{user.username}}</div>
            <div class="user-name-slave">{{user.monlog}}</div>
        </template>
        <template v-else>
            <div class="user-name-main">未登录</div>
            <div class="user-name-slave">点击登录</div>
        </template>
        </div>

        <div class="user-menu-group">
            <div class="user-menu" @click="goInfo" v-show="user.username">
                <div class="flex-group">
                    <div class="user-menu-icon info"></div>
                    <div class="user-menu-name">个人信息</div>
                </div>
                <div class="user-menu-more"></div>
            </div>
            <div class="user-menu" @click="goAbout">
                <div class="flex-group">
                    <div class="user-menu-icon about"></div>
                    <div class="user-menu-name">关于</div>
                </div>
                <div class="user-menu-more"></div>
            </div>
        </div>

        <div class="user-menu-group">
            <div class="user-menu" @click="logout" v-show="user.username">
                <div class="flex-group">
                    <div class="user-menu-icon exit"></div>
                    <div class="user-menu-name">退出</div>
                </div>
            </div>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
    import NAProxy from '../NAProxy';
    import {URL_USER_CENTER, IMG_HTTP_PREFIX} from '../Config';
    import {getToken, isLogin} from '../TokenUtils';
    import axios from 'axios';
    import ModalApi from '../ModalApi';

    export default {
        name: 'User',
        data() {
            return {
                user: {}
            }
        },
        watch: {
            '$route': function() {
                if (this.$route.query.reload == 1) {
                    this.$emit('log-change');
                    this.main();
                }
            }
        },
        mixins: [ModalApi],
        methods: {
            logout: function() {
                this.confirm('确定退出登录么?', (ok) => {
                    if (!ok) return;
                    NAProxy.commonLogout();
                    this.user = {};
                    this.$emit('log-change');
                });
            },
            goAbout: function() {
                this.$router.push('/user/about');
            },
            goInfo: function() {
                this.$router.push('/user/info');
            },
            goLogin: function() {
                isLogin((hasLogin) => {
                    console.log("hasLogin:"+hasLogin);
                    if (!hasLogin) {
                        this.$router.push('/user/login');
                    }
                });
            },
            main: function() {
                getToken().then((token) => {
                    if (!token) return;

                    axios.get(URL_USER_CENTER, {
                        params: {
                            token: token
                        }
                    }).then((resp) => {
                        if (resp.abort) return;

                        this.user = resp.data.data.user;
                    });
                });
            },
        },
        computed: {
            avatarStyle: function() {
                if (this.user.avatar) {
                    return {
                        background: 'url('+IMG_HTTP_PREFIX+'avatar/'+this.user.avatar+'?imageView2/2/w/82) no-repeat center'
                    }
                }
                return {};
            }
        },
        mounted: function() {
            this.main();
        }
    }
</script>

<style lang="sass">
    @import "User.scss";
</style>
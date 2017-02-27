<template>
    <transition name="aside-tab">
        <aside class="aside-tab" id="login-aside">
            <s-header title="登录" back="1"></s-header>
            <div id="login-wrap">
                <div class="logo">
                    <img src="http://studygolang.qiniudn.com/app/login_logo@2x.png" width="100px" alt="芝麻掌柜">
                </div>
                <section>
                    <form method="post" action="#" id="login-form">
                        <div class="login-username">
                            <div class="txt color-green">账号</div>
                            <div>
                                <input v-model="username" placeholder="请输入账号" class="input-content color-black" @focus="scrollIntoView($event)">
                            </div>
                        </div>
                        <div class="login-password">
                            <div class="txt color-green">密码</div>
                            <div>
                                <input type="password" v-model="passwd" placeholder="请输入密码" class="input-content color-black" @focus="scrollIntoView($event)">
                            </div>
                        </div>

                        <div class="login-submit"><input id="submit" type="submit" value="登  录" :disabled="!canSubmit" @click.prevent="login"></div>
                    </form>
                </section>
                <footer>
                    <div class="contact color-green">联系我们：<a href="mailto:polaris@studygolang.com" title="联系我们" class="color-green">polaris@studygolang.com</a></div>
                </footer>
            </div>
        </aside>
    </transition>
</template>

<script>
    import {URL_USER_LOGIN} from './Config'
    import axios from "axios"
    import {setToken} from './TokenUtils'
    import Methods from './CommonMethods'

    export default {
        data() {
            return {
                username: '',
                passwd: '',
            }
        },
        computed: {
            canSubmit: function() {
                return this.username != "" && this.passwd.length >= 6;
            }
        },
        methods: {
            login: function() {
                let params = "username="+this.username+"&passwd="+this.passwd
                axios.post(URL_USER_LOGIN, params).then((resp) => {
                    if (resp.abort) return;

                    setToken(resp.data.data.token);

                    Methods.invoke('toast', '登录成功');

                    this.$router.push('/user?reload=1');
                });
            },
            scrollIntoView: function(event) {
                event.target.select();
                setTimeout(() => {
                    event.target.scrollIntoView(false);
                }, 200);
            },
        }
    }
</script>

<style type="text/css">
    header { text-align: center; margin: 30px 0 50px; }
    
    #login-aside { background-color: #fff; }

    #login-wrap { padding: 55px 10px 20px 10px; }
    #login-wrap .logo { text-align: center; margin: 30px 0 50px; }

    #login-form { margin: 0 36px;  }
    #login-form .txt { font-size: 14px; }
    #login-form .input-content { border: none; border-bottom: 1px solid #63c470; padding: 10px 0; width: 100%; outline: none; font-size: 16px; }
    #login-form .login-password { margin-top: 25px; }
    #login-form .login-submit { margin-top: 45px; }
    #login-form .login-submit input { border: none; background-color: #63c470; color: #fff; font-size: 21px; padding: 10px; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; width: 100%; height: 45px; }
    #login-form .login-submit input:disabled { background-color: #ccc; }

    footer { margin-top: 13%; width: 100%; }
    footer .contact { text-align: center; font-size: 14px; margin: 0 auto; }
    footer .contact a { text-decoration: none; }
</style>
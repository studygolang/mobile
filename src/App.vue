<template>
  <div>
    <keep-alive>
      <router-view @log-change="logChange"></router-view>
    </keep-alive>

    <footer class="footer-wrap">
        <router-link to="/articles" class="footer-menu" replace>
            <div class="footer-menu-icon article"></div>文章
        </router-link>
        <router-link to="/topics" class="footer-menu" replace>
            <div class="footer-menu-icon community"></div>社区
        </router-link>
        <router-link to="/resources" class="footer-menu" replace>
            <div class="footer-menu-icon resource"></div>资源
        </router-link>
        <router-link to="/projects" class="footer-menu" replace>
            <div class="footer-menu-icon project"></div>项目
        </router-link>
        <router-link to="/user" class="footer-menu" replace>
            <div class="footer-menu-icon user"></div>{{userTxt}}
        </router-link>
    </footer>
    <s-modal ref="modal"></s-modal>
    <s-loading ref="loading"></s-loading>
    <s-toast ref="toast"></s-toast>
  </div>
</template>

<script>
import Modal from './components/Modal.vue';
import Loading from './components/Loading.vue';
import Toast from './components/Toast.vue';
import ModalEventBind from './components/ModalEventBind';
import LoadingEventBind from './components/LoadingEventBind';
import {isLogin} from './components/TokenUtils';

export default {
  name: 'app',
  components: {
    [Modal.name]: Modal,
    [Loading.name]: Loading,
    [Toast.name]: Toast
  },
  data () {
    return {
      userTxt: '我的',
    }
  },
  methods: {
    logChange: function() {
      this.changeTxt();
    },
    changeTxt: function() {
      isLogin((hasLogin) => {
        if (hasLogin) {
          this.userTxt = '我的';
        } else {
          this.userTxt = '未登录';
        }
      });
    }
  },
  mounted: function() {
      ModalEventBind(this.$refs.modal);
      LoadingEventBind(this.$refs.loading);

      this.changeTxt();
  }
}
</script>

<style lang="scss">
@import "sass/App.scss";
</style>

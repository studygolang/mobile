import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios';

import VueTimeago from 'vue-timeago'

import EventBus from './components/EventBus';

import App from './App.vue'

import Article from './components/router/Article.vue'
import ArticleDetailTab from './components/ArticleDetailTab.vue'
import Topic from './components/router/Topic.vue'
import TopicDetailTab from './components/TopicDetailTab.vue'
import Project from './components/router/Project.vue'
import ProjectDetailTab from './components/ProjectDetailTab.vue'
import Resource from './components/router/Resource.vue'
import ResourceDetailTab from './components/ResourceDetailTab.vue'
import User from './components/router/User.vue'
import Login from './components/Login.vue'
import UserInfo from './components/UserInfo.vue'
import AboutTab from './components/AboutTab.vue'

import TopHeader from './components/TopHeader.vue';

Vue.use(VueRouter)

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'zh-CN',
  locales: {
    // you will need json-loader in webpack 1
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})

// 注册组件
Vue.component(TopHeader.name, TopHeader)

const routes = [
	{
		path: '/articles',
		component: Article,
		children: [
			{
				path: 'detail/:id',
				name: 'article-detail',
				component: ArticleDetailTab
			}
		]
	},
	{
		path: '/topics',
		component: Topic,
		children: [
			{
				path: 'detail/:id',
				name: 'topic-detail',
				component: TopicDetailTab
			}
		]
	},
	{
		path: '/resources',
		component: Resource,
		children: [
			{
				path: 'detail/:id',
				name: 'resource-detail',
				component: ResourceDetailTab
			}
		]
	},
	{
		path: '/projects',
		component: Project,
		children: [
			{
				path: 'detail/:id',
				name: 'project-detail',
				component: ProjectDetailTab
			}
		]
	},
	{
		path: '/user',
		component: User,
		children: [
			{
				path: 'login',
				component: Login
			},
			{
				path: 'info',
				component: UserInfo
			},
			{
				path: 'about',
				component: AboutTab
			}
		]
	}
];

const router = new VueRouter({routes})

/* 全局拦截器 */
// request 拦截器
axios.interceptors.request.use(function (config) {
	var method = config.method.toUpperCase();
	EventBus.$emit('showLoading', method == 'GET' ? '加载中' : '提交中');      // 展示loading
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});
// response 拦截器
axios.interceptors.response.use(
	function(resp) {
		EventBus.$emit('hideLoading');      // 隐藏loading
		var data = resp.data;
		var code = data.code;
		if (code != 0) {
			EventBus.$emit('alert', {
				message: data.msg || '未知错误',
				callback: () => {
					if (code == 600) {
						router.push('/user/login');
					}
				}
			});
			resp.abort = true;
		}
		return resp;
	}, function(err) {
		EventBus.$emit('hideLoading');      // 隐藏loading
		EventBus.$emit('alert', {message: '服务器异常'});
		return Promise.reject(err);
	}
);

/**
 * 给原生Promise增加finally方法, 不论是resolve还是reject都会执行
 * @param callback
 * @returns {Promise.<TResult>}
 */
Promise.prototype.finally = function (callback) {
	let P = this.constructor;
	return this.then(
		value  => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => { throw reason })
	);
};

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

// 默认跳转到第一个菜单
if (router.currentRoute.path == '/') {
	router.push(routes[0].path);
}
<template>
	<div>
		<s-header title="开源项目"></s-header>
		<div id="list-main-wrap" class="container-fluid">
			<div class="list-box list-box_text" v-for="project in projects" @click="openProjectDetail(project)">
				<h4 class="list-box__title">{{project.category}} <span class="name" v-if="project.name">{{project.name}}</span></h4>
				<ul class="list-box__info">
					<li class="list-box__info__meta">{{project.author}}</li>
					<li class="list-box__info__meta">{{project.ctime}}</li>
					<li class="list-box__info__meta list-box__info__meta_extra">阅读 {{project.viewnum}}</li>
				</ul>
			</div>
			<div class="load-more" @click="loadData(true)" v-cloak>{{hasMore ? (loading ? '正在加载更多' : '点击加载更多') : '没有更多了'}}</div>
		</div>
		<div class="loading-tip" v-show="!projects.length" v-cloak>暂无数据</div>
	
		<pull-down ref="pulldown"></pull-down>

		<router-view></router-view>
	</div>
</template>

<script>
import {getToken, TOKEN_CACHE_KEY} from '../TokenUtils';
import {URL_PROJECT_LIST} from '../Config';
import axios from 'axios';
import PullDown from '../PullDown.vue';
import {bindPullUpLoading, unbindPullUpLoading} from '../PullUpLoading';

export default {
	name: 'project',
	data() {
		return {
			// 分页使用
			hasMore: false,
			base: undefined,

			loading: false,     // 是否正在加载

			projects: []
		}
	},
	components: {
		PullDown
	},
	mounted: function() {
		this.loadData();
	},
	beforeRouteEnter: function(to, from, next) {
		next(vm => {

			vm.$refs.pulldown.bindElement(null, () => {
				return new Promise((resolve, reject) => {
					vm.loadData(false, () => {resolve();});
				});
			});

			bindPullUpLoading(() => {
				return new Promise((resolve, reject) => {
					vm.loadData(true, () => {resolve();});
				});
			}, {preloadHeight: 300});       // 100 * 3 三张卡片的高度
		});
	},
	beforeRouteLeave: function(to, from, next) {
		this.$refs.pulldown.unbind();

		unbindPullUpLoading();
		next();
	},
	methods: {
		loadData: function(append, callback) {
			if (this.$route.path != '/projects') {
				return;
			}
			if (append && !this.hasMore) {
				return;
			}

			this.loading = true;

			if (!append) {
				this.projects = [];
				this.base = undefined;
			}

			getToken().then((token) => {
				axios.get(URL_PROJECT_LIST, {params: {
					token: token,
					base: this.base
				}}).then((resp) => {
					if (resp.abort) return;

					var data = resp.data.data;
					var projects = data.projects;

					this.hasMore = data.has_more;

					if (append) {
						projects.forEach(project => {this.projects.push(project);});
					} else {
						this.projects = projects;
					}

					let len = this.projects.length;
					if (len > 0) {
						this.base = this.projects[len-1].id;
					}
				}).finally(() => {
					this.loading = false;
					typeof callback === 'function' && callback();
				});
			});
		},
		openProjectDetail: function(project) {
			this.$router.push({
				name: 'project-detail',
				params: { id: project.id }
			});
		}
	}
}
</script>

<style lang="sass" scoped>
@import "List.scss";
</style>
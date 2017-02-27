<template>
	<div>
		<s-header title="Golang 资源"></s-header>
		<div id="list-main-wrap">
			<div class="list-box list-box_text" v-for="resource in resources" @click="openResourceDetail(resource)">
				<h4 class="list-box__title">{{resource.title}} <span class="host" v-if="resource.host">({{resource.host}})</span></h4>
				<ul class="list-box__info">
					<li class="list-box__info__meta">{{resource.user.username}}</li>
					<li class="list-box__info__meta"><timeago :since="resource.ctime" :max-time="86400 * 365" :format="formatTime"></timeago></li>
					<li class="list-box__info__meta list-box__info__meta_extra">阅读 {{resource.viewnum}}</li>
					<li class="list-box__info__meta list-box__info__meta_extra" @click="jumpDetailComment(resource)">评论 {{resource.cmtnum}}</li>
				</ul>
			</div>
			<div class="load-more" @click="loadData(true)">{{hasMore ? '点击加载更多' : '没有更多了'}}</div>
		</div>
		<div class="loading-tip" v-show="!resources.length" v-cloak>暂无数据</div>
		
		<pull-down ref="pulldown"></pull-down>

		<router-view></router-view>
	</div>
</template>

<script>
import {getToken, TOKEN_CACHE_KEY} from '../TokenUtils';
import {URL_RESOURCE_LIST} from '../Config';
import axios from 'axios';
import PullDown from '../PullDown.vue';
import {bindPullUpLoading, unbindPullUpLoading} from '../PullUpLoading';

export default {
	name: 'resource',
	data() {
		return {
			// 分页使用
			hasMore: false,
			p: 1,

			loading: false,     // 是否正在加载

			resources: []
		}
	},
	components: {
		PullDown
	},
	mounted: function() {
		this.$nextTick(function() {
			this.loadData();
			this.$refs.pulldown.bindElement(null, () => {
				return new Promise((resolve, reject) => {
					if (this.$route.path == "/resources") {
						this.loadData(false, () => {resolve();});
					} else {
						(() => {resolve();})();
					}
				});
			})
		});
	},
	beforeRouteEnter: function(to, from, next) {
		next(vm => {
			bindPullUpLoading(() => {
				return new Promise((resolve, reject) => {
					vm.loadData(true, () => {resolve();});
				});
			}, {preloadHeight: 300});       // 100 * 3 三张卡片的高度
		});
	},
	beforeRouteLeave: function(to, from, next) {
		unbindPullUpLoading();
		next();
	},
	methods: {
		loadData: function(append, callback) {
			if (append && !this.hasMore) {
				return;
			}

			this.loading = true;

			if (!append) {
				this.resources = [];
				this.p = 1;
			}

			getToken().then((token) => {
				axios.get(URL_RESOURCE_LIST, {params: {
					token: token,
					p: this.p
				}}).then((resp) => {
					if (resp.abort) return;

					var data = resp.data.data;
					var resources = data.resources;

					this.hasMore = data.has_more;

					if (append) {
						resources.forEach(resource => {this.resources.push(resource);});
					} else {
						this.resources = resources;
					}

					this.p++;
				}).finally(() => {
					this.loading = false;
					typeof callback === 'function' && callback();
				});
			});
		},
		openResourceDetail: function(resource) {
			if (typeof resource.host === "undefined") {
				this.$router.push({
					name: 'resource-detail',
					params: { id: resource.id }
				});
			} else {
				this.$router.push({
					name: 'resource-detail',
					params: { id: resource.id }
				});
			}
		},
		jumpDetailComment: function(resource) {
			this.$router.push({
				name: 'resource-detail',
				params: { id: resource.id }
			});
		},
		formatTime: function(val) {
			let date = new Date(val);
			return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
		}
	}
}
</script>

<style lang="sass" scoped>
@import "List.scss";

</style>
<template>
<div>
	<s-header title="社区"></s-header>
	<div id="list-main-wrap">
		<div class="list-box list-box_text" v-for="topic in topics" @click="openTopicDetail(topic)">
			<h4 class="list-box__title">{{topic.title}}</h4>
			<ul class="list-box__info">
				<li class="list-box__info__meta">{{topic.node}}</li>
				<li class="list-box__info__meta"><timeago :since="topic.ctime" :max-time="86400 * 365" :format="formatTime"></timeago></li>
				<li class="list-box__info__meta list-box__info__meta_extra">阅读 {{topic.view}}</li>
			</ul>
		</div>
		<div class="load-more" @click="loadData(true)">{{hasMore ? '点击加载更多' : '没有更多了'}}</div>
	</div>
	<div class="loading-tip" v-show="!topics.length" v-cloak>暂无数据</div>

	<pull-down ref="pulldown"></pull-down>

	<router-view></router-view>
</div>
</template>

<script>
import {getToken, TOKEN_CACHE_KEY} from '../TokenUtils';
import {URL_TOPIC_LIST} from '../Config';
import axios from 'axios';
import PullDown from '../PullDown.vue';
import {bindPullUpLoading, unbindPullUpLoading} from '../PullUpLoading';

export default {
	name: 'topic',
	data() {
		return {
			// 分页使用
			hasMore: false,
			p: 1,

			loading: false,     // 是否正在加载

			topics: []
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
			if (this.$route.path != '/topics') {
				return;
			}

			if (append && !this.hasMore) {
				return;
			}

			this.loading = true;

			if (!append) {
				this.topics = [];
				this.p = 1;
			}

			getToken().then((token) => {
				axios.get(URL_TOPIC_LIST, {params: {
					token: token,
					p: this.p
				}}).then((resp) => {
					if (resp.abort) return;

					var data = resp.data.data;
					var topics = data.topics;

					this.hasMore = data.has_more;

					if (append) {
						topics.forEach(topic => {this.topics.push(topic);});
					} else {
						this.topics = topics;
					}

					this.p++;
				}).finally(() => {
					this.loading = false;
					typeof callback === 'function' && callback();
				});
			});
		},
		openTopicDetail: function(topic) {
			this.$router.push({
				name: 'topic-detail',
				params: { id: topic.tid }
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
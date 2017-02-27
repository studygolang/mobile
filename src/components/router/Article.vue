<template>
	<div>
		<s-header title="文章"></s-header>
		<div id="list-main-wrap">
			<div class="list-box list-box_text" v-for="article in articles" @click="openArticleDetail(article)">
				<h4 class="list-box__title">{{article.title}}</h4>
				<ul class="list-box__info">
					<li class="list-box__info__meta">{{article.name}}</li>
					<li class="list-box__info__meta">{{article.pub_date}}</li>
					<li class="list-box__info__meta list-box__info__meta_extra">阅读 {{article.viewnum}}</li>
				</ul>
			</div>
			<div class="load-more" @click="loadData(true)">{{hasMore ? (loading ? '正在加载更多' : '点击加载更多') : '没有更多了'}}</div>
		</div>

		<pull-down ref="pulldown"></pull-down>

		<router-view></router-view>
	</div>
</template>

<script>
import Vue from "vue"

import {getToken, TOKEN_CACHE_KEY} from '../TokenUtils';
import {URL_ARTICLE_LIST} from '../Config';
import axios from 'axios';
import PullDown from '../PullDown.vue';
import {bindPullUpLoading, unbindPullUpLoading} from '../PullUpLoading';

export default {
	name: 'article',
	data() {
		return {
			// 分页使用
			hasMore: false,
			base: undefined,

			loading: false,     // 是否正在加载

			articles: []
		}
	},
	components: {
		PullDown
	},
	mounted: function() {
		this.loadData();
		let el = document.getElementById('list-main-wrap')
		this.$refs.pulldown.bindElement(el, () => {
			return new Promise((resolve, reject) => {
				if (this.$route.path == "/articles") {
					this.loadData(false, () => {resolve();});
				} else {
					(() => {resolve();})();
				}
			});
		})

		bindPullUpLoading(() => {
			return new Promise((resolve, reject) => {
				if (this.$route.path == "/articles") {
					this.loadData(true, () => {resolve();});
				} else {
					(() => {resolve();})();
				}
			});
		}, {preloadHeight: 300});       // 100 * 3 三张卡片的高度
	},
	beforeDestroy: function() {
		unbindPullUpLoading();
	},
	methods: {
		loadData: function(append, callback) {
			if (append && !this.hasMore) {
				return;
			}

			this.loading = true;

			if (!append) {
				this.articles = [];
				this.base = undefined;
			}

			getToken().then((token) => {
				axios.get(URL_ARTICLE_LIST, {params: {
					token: token,
					base: this.base
				}}).then((resp) => {
					if (resp.abort) return;

					var data = resp.data.data;
					var articles = data.articles;

					this.hasMore = data.has_more;

					if (append) {
						articles.forEach(article => {this.articles.push(article);});
					} else {
						this.articles = articles;
					}

					let len = this.articles.length;
					if (len > 0) {
						this.base = this.articles[len-1].id;
					}
				}).finally(() => {
					this.loading = false;
					typeof callback === 'function' && callback();
				});
			})
		},
		openArticleDetail: function(article) {
			this.$router.push({
				name: 'article-detail',
				params: { id: article.id }
			});
		}
	}
}
</script>

<style lang="sass" scoped>
	@import "List.scss";
</style>
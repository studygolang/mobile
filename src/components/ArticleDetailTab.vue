<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="文章详情" back="1"></s-header>
            <div class="article-wrap">
                <h1 class="title">{{article.title}}</h1>
                <article v-html="article.content"></article>
                <ul class="article-footer-meta">
                    <li>本文来自：<a :href="'http://'+article.domain">{{article.name}}</a></li>
                    <li>感谢作者：{{article.author_txt}}</li>
                    <li>发布时间：{{article.pub_date}}</li>
                    <li>查看原文：<a :href="article.url">{{article.title}}</a></li>
                </ul>
            </div>
            <div class="loading-tip" v-show="!article.id" v-cloak>该文章不存在或被删除</div>
        </aside>
    </transition>
</template>

<script>
    import NAProxy from './NAProxy';
    import {getToken} from './TokenUtils';
    import {URL_ARTICLE_DETAIL} from './Config';
    import axios from 'axios';

    export default {
        name: 'article-detail-tab',
        data: function() {
            return {
                article_id: 0,
                article: {id: 1}
            }
        },
        mounted: function() {
            this.article_id = this.$route.params.id;
            this.getData();
        },
        methods: {
            getData: function() {
                getToken().then((token) => {
                    axios.get(URL_ARTICLE_DETAIL, {params: {
                        id: this.article_id,
                        token: token
                    }}).then((resp) => {
                        if (resp.abort) return;

                        var data = resp.data.data;
                        this.article = data.article;
                    });
                }, (err) => {
                    this.alert(err);
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../sass/DetailTab.scss";
</style>
<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="资源详情" back="1"></s-header>
            <div class="article-wrap">
                <h1 class="title">{{resource.title}}</h1>
                <div class="article-header-meta" @click="openUser">
                    <div class="pull-left avatar">
                        <img :src="resource.user.avatar | joinImage">
                    </div>
                    <div class="pull-left">
                        <div class="author">{{resource.user.username}}</div>
                        <div class="time">{{resource.ctime}}</div>
                    </div>
                </div>
                <article class="clearfix">
                    <span v-if="resource.host">
                        资源链接：<a :href="resource.url">{{resource.url}}</a>
                    </span>
                    <p v-html="compiledMarkdown"></p>
                </article>
                <ul class="article-footer-meta">
                </ul>
            </div>
            <div class="loading-tip" v-show="!resource.id" v-cloak>该资源不存在或被删除</div>
        </aside>
    </transition>
</template>

<script>
    import NAProxy from './NAProxy';
    import {getToken} from './TokenUtils';
    import {URL_RESOURCE_DETAIL} from './Config';
    import axios from 'axios';

    import marked from 'marked'
    import hljs from "highlight.js"

    marked.setOptions({
        sanitize: false,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    export default {
        name: 'resource-detail-tab',
        data: function() {
            return {
                id: 0,
                resource: {
                    user: {},
                    id: 1,
                }
            }
        },
        mounted: function() {
            this.id = this.$route.params.id;
            this.getData();
        },
        filters: {
            joinImage: function(avatar) {
                if (avatar) {
                    return "http://studygolang.qiniudn.com/avatar/"+avatar+"?imageView2/2/w/40";
                }

                return "";
            }
        },
        computed: {
            compiledMarkdown: function() {
                if (typeof this.resource.content == "undefined") {
                    return '';
                }
                return marked(this.resource.content);
            }
        },
        methods: {
            getData: function() {
                getToken().then((token) => {
                    axios.get(URL_RESOURCE_DETAIL, {params: {
                        id: this.id,
                        token: token
                    }}).then((resp) => {
                        if (resp.abort) return;

                        var data = resp.data.data;
                        this.resource = data.resource;
                    });
                }, (err) => {
                    this.alert(err);
                });
            },
            openUser: function() {
                console.log("open user...");
            }
        }
    }
</script>

<style lang="sass" scoped>
    @import "../sass/DetailTab.scss";
</style>
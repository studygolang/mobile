<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="主题详情" back="1"></s-header>
            <div class="article-wrap">
                <h1 class="title">{{topic.title}}</h1>
                <div class="article-header-meta" @click="openUser">
                    <div class="pull-left avatar">
                        <img :src="topic.user.avatar | joinImage">
                    </div>
                    <div class="pull-left">
                        <div class="author">{{topic.user.username}}</div>
                        <div class="time">{{topic.ctime}}</div>
                    </div>
                </div>
                <article class="clearfix" v-html="compiledMarkdown"></article>
            </div>
            <div class="loading-tip" v-show="!topic.tid" v-cloak>该主题不存在或被删除</div>
        </aside>
    </transition>
</template>

<script>
    import NAProxy from './NAProxy';
    import {getToken} from './TokenUtils';
    import {URL_TOPIC_DETAIL} from './Config';
    import axios from 'axios';

    import marked from 'marked'
    import hljs from "highlight.js"

    marked.setOptions({
        sanitize: true,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    export default {
        name: 'topic-detail-tab',
        data: function() {
            return {
                tid: 0,
                topic: {
                    user: {},
                    tid: 1,
                }
            }
        },
        mounted: function() {
            this.tid = this.$route.params.id;
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
                if (typeof this.topic.content == "undefined") {
                    return "";
                }
                return marked(this.topic.content);
            }
        },
        methods: {
            getData: function() {
                getToken().then((token) => {
                    axios.get(URL_TOPIC_DETAIL, {params: {
                        tid: this.tid,
                        token: token
                    }}).then((resp) => {
                        if (resp.abort) return;

                        var data = resp.data.data;
                        this.topic = data.topic;
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
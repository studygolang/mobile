<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="项目详情" back="1"></s-header>
            <div class="article-wrap">
                <h1 class="title">
                    <img v-if="project.logo" :src="project.logo" width="36px">
                    {{project.category}} <u>{{project.name}}</u>
                </h1>
                <div class="article-header-meta">
                    <div class="pull-left">
                        <div class="author">{{project.author}}</div>
                        <div class="time">{{project.ctime}}</div>
                    </div>
                </div>
                <article class="clearfix" v-html="compiledMarkdown"></article>
                <repo-widget v-if="project.repo" :repo="project.repo"></repo-widget>
                <div class="repo-env">
                    <div class="row">
                        <div class="col-xs-3 text-right">授权协议：</div>
                        <div class="col-xs-8">{{project.licence}}</div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3 text-right">开发语言：</div>
                        <div class="col-xs-8">{{project.lang}}&nbsp;<a :href="project.src" :title="project.name+' 源码'">查看源码»</a></div>
                    </div>
                    <div v-if="project.os" class="row">
                        <div class="col-xs-3 text-right">操作系统：</div>
                        <div class="col-xs-8">{{project.os}}</div>
                    </div>
                </div>
                <ul class="urls list-inline text-center">
                    <li><a :href="project.home" :title="project.name+' 网站'" class="btn btn-default btn-sm">项目首页</a></li>
                    <li><a :href="project.doc" :title="project.name+' 文档'" class="btn btn-default btn-sm">项目文档</a></li>
                    <li v-if="project.download"><a :href="project.download" :title="'下载 '+project.name" class="btn btn-default btn-sm">软件下载</a></li>
                </ul>
            </div>
            <div class="loading-tip" v-show="!project.id" v-cloak>该项目不存在或被删除</div>
        </aside>
    </transition>
</template>

<script>
    import NAProxy from './NAProxy';
    import {getToken} from './TokenUtils';
    import {URL_PROJECT_DETAIL} from './Config';
    import axios from 'axios';

    import marked from 'marked'
    import hljs from "highlight.js"

    import RepoWidget from "./RepoWidget.vue"

    marked.setOptions({
        sanitize: true,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    export default {
        name: 'project-detail-tab',
        data: function() {
            return {
                id: 0,
                project: {}
            }
        },
        components: {
            RepoWidget
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
                if (typeof this.project.desc == "undefined") {
                    return "";
                }
                return marked(this.project.desc);
            }
        },
        methods: {
            getData: function() {
                getToken().then((token) => {
                    axios.get(URL_PROJECT_DETAIL, {params: {
                        id: this.id,
                        token: token
                    }}).then((resp) => {
                        if (resp.abort) return;

                        var data = resp.data.data;
                        this.project = data.project;
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

<style type="text/css">
    .article-wrap h1 img { display: inline; }
    
    .repo-env {
        background: #f6f6f6;
        border: 1px dashed #eee;
        padding: 5px 10px;
        margin: 15px 0;
        line-height: 22px;
    }
    .repo-env .row div { padding-right: 0; }

</style>
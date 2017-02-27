<template>
    <transition name="aside-tab">
        <aside class="aside-tab">
            <s-header title="个人信息" back="1" :submit="true"
                      @go-edit="goEdit" @go-submit="goSubmit"></s-header>

            <div class="enter-main-wrap">
                <div class="container-wrap">
                    <div class="enter-tip warning text-center" v-cloak v-show="user.status == 0">您的账号未激活</div>

                    <div class="main-wrap" v-cloak>

                        <div class="form-group">
                            <div class="form-item">
                                <div class="form-group-title">基础信息</div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="username-input">用户名</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.username" disabled="disabled" id="username-input" minlength="3">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="monlog-input">心情</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.monlog" :disabled="!editing" id="monlog-input" placeholder="一句话记录自己的心情" maxlength="140">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="email-input">Email</label>
                                <div class="form-item-content">
                                    <input type="email" class="form-input" v-model="user.email" :disabled="!editing" id="email-input" placeholder="更改邮箱需要重新激活" maxlength="20">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="name-input">姓名</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.name" :disabled="!editing" id="name-input" placeholder="请输入真实姓名" maxlength="10">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="city-input">城市</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.city" :disabled="!editing" id="city-input" placeholder="请用中文填写所在城市">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="company-input">公司</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.company" :disabled="!editing" id="company-input" placeholder="请输入所在公司" maxlength="20">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="github-input">Github</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.github" :disabled="!editing" id="github-input" placeholder="不需要带域名" maxlength="20">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="weibo-input">微博</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.weibo" :disabled="!editing" id="weibo-input" placeholder="不需要带域名" maxlength="20">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="website-input">个人主页</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.website" :disabled="!editing" id="website-input" placeholder="个人主页，http://开头" maxlength="63">
                                </div>
                            </div>
                            <div class="form-item">
                                <label class="form-item-title" for="introduce-input">个人介绍</label>
                                <div class="form-item-content">
                                    <input type="text" class="form-input" v-model="user.introduce" :disabled="!editing" id="introduce-input" placeholder="个人介绍">
                                </div>
                            </div>
                        </div>
                        <!--
                        <template v-if="editing">
                            <upload-picture title="身份证" desc="申请人需手持身份证正面拍照, 请保持身份证号码清晰可见" model="id_card_pic"
                                            @image-upload="onImageUpload"
                                            demo-image="http://img.ishequ360.com/images/zg/supply/demo-id-v1028.png" :init-image="id_card_pic"></upload-picture>

                            <upload-picture title="营业执照" desc="个体户或公司营业执照" model="licence_pic"
                                            @image-upload="onImageUpload"
                                            demo-image="http://img.ishequ360.com/images/zg/supply/demo-licence.png" :init-image="licence_pic"></upload-picture>

                            <upload-picture title="仓库照片(非必须)" desc="仓库囤货照片, 上传会增加审核通过率" model="warehouse_pic"
                                            @image-upload="onImageUpload"
                                            demo-image="http://img.ishequ360.com/images/zg/supply/demo-store.png" :init-image="warehouse_pic"></upload-picture>
                        </template>

                        <template v-else>

                            <div class="form-group">
                                <div class="form-item">
                                    <div class="form-group-title">头像</div>
                                </div>
                                <p style="margin-top: 20px;">本站使用 <a href="https://portal.qiniu.com/signup?code=3lfz4at7pxfma">七牛云存储</a> 来提供头像服务.</p>
                                <p>
                                    当前头像<img class="img-rounded" src="https://dn-studygolang.qbox.me/avatar/gopher16.png?imageView2/2/w/120">
                                </p>
                                <p><a href="/account/change_avatar" class="btn btn-default btn-gravatar">使用Gravatar头像</a></p>
                                <ul class="nav nav-tabs" id="avatar-tab" role="tablist" style="margin-bottom: 15px;">
                                    <li role="presentation" :class="{active:showDefaultTab}" @click.prevent="showDefaultTab=true"><a href="#default" role="tab" data-toggle="tab">选择默认头像</a></li>
                                    <li role="presentation" :class="{active:!showDefaultTab}" @click.prevent="showDefaultTab=false"><a href="#upload" role="tab" data-toggle="tab">上传头像</a></li>
                                </ul>
                                <div class="tab-content">
                                    <div id="default" class="fade row-fluid" :class="showDefaultObject" role="tabpanel">
                                        <div class="form-group">
                                            <ul class="list-inline">
                                                <li v-for="avatar in defaultAvatars">
                                                    <label>
                                                        <input type="radio" name="avatar" :value="avatar" class="required">
                                                        <img class="img-rounded" :src="avatar | fillAvatar" :alt="avatar">
                                                    </label>
                                                </li>
                                            </ul>
                                            <div class="control-group">
                                                <div class="controls text-center">
                                                    <button type="submit" class="btn btn-success btn-sm submit">保存</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="upload" class="fade row-fluid" :class="showUploadObject">
                                        <div class="form-group">
                                            <div class="col-md-offset-1 col-md-1">
                                                <button id="upload-img" class="btn btn-primary btn-sm">选择图片文件</button>
                                                <span>支持500K以内的jpg/png文件</span>
                                            </div>
                                        </div>
                                        <div id="img-preview" class="form-group">
                                            <div class="col-md-offset-1 col-md-11">
                                                <img src="" alt="" width="72px" height="72px">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-offset-1 col-md-11">
                                                <button type="submit" id="upload-btn" class="btn btn-success btn-sm submit" disabled="">保存新头像</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        -->
                    </div>
                </div>
            </div>
        </aside>
    </transition>
</template>

<script>
    import NAProxy from './NAProxy';
    import {TOKEN_CACHE_KEY, getToken} from './TokenUtils';
    import axios from 'axios';
    import ModalApi from './ModalApi';
    import Methods from './CommonMethods';
    import {URL_USER_ME, URL_USER_MODIFY, IMG_HTTP_PREFIX} from './Config';

    export default {
        name: 'user-info-tab',
        mixins: [ModalApi],
        data() {
            return {
                token: null,
                user: {},
                oldEmail: '',  // 修改邮箱需要重新激活

                defaultAvatars: [],

                showDefaultTab: true,  // 显示 默认头像 的 tab

                editing: true,   // 是否处于编辑状态

                submitting: false,

                noUploadImage: 'http://img.ishequ360.com/images/zg/supply/porfile_info_no_upload.png'
            };
        },
        computed: {
            showDefaultObject: function() {
                return {
                    'tab-pane': !this.showDefaultTab,
                    in: this.showDefaultTab,
                    active: this.showDefaultTab,
                }
            },
            showUploadObject: function() {
                return {
                    'tab-pane': this.showDefaultTab,
                    in: !this.showDefaultTab,
                    active: !this.showDefaultTab,
                }
            }
        },
        filters: {
            fillAvatar: function(avatar) {
                return IMG_HTTP_PREFIX+"avatar/"+avatar+"?imageView2/2/w/80";
            }
        },
        methods: {
            submitInfo: function() {
                let data = {
                    name: this.user.name,
                    monlog: this.user.monlog,
                    email: this.user.email,
                    city: this.user.city,
                    company: this.user.company,
                    github: this.user.github,
                    weibo: this.user.weibo,
                    introduce: this.user.introduce,
                    website: this.user.website,
                }
                let params = '1=1';
                for (let k in data) {
                    params += '&'+k+'='+data[k];
                }
                axios.post(URL_USER_MODIFY+"?token="+this.token, params).then((resp) => {
                    if (resp.abort) return;

                    this.alert('修改成功', () => {
                        this.main();
                    });
                });
            },
            getUserInfo: function() {
                axios.get(URL_USER_ME, {params: {token: this.token}}).then((resp) => {
                    if (resp.abort) return;
                    var result = resp.data;

                    this.user = result.data.user;
                    this.oldEmail = this.user.email;
                    this.defaultAvatars = result.data.default_avatars;
                });
            },
            main: function() {
                getToken().then((_token) => {
                    this.token = _token;
                    this.getUserInfo();
                }, (err) => {
                    this.alert(err);
                });
            },
            onImageUpload: function(obj) {
                var url = obj.url;
                var model = obj.model;
                this[model] = url;
            },
            goEdit: function() {
                this.editing = true;
                Methods.invoke('toast', '可以编辑了');
            },
            goSubmit: function() {
                if (this.oldEmail != this.user.email) {
                    this.confirm('修改邮箱需要重新激活', '确认提交', (ok) => {
                        this.submitInfo();
                    });
                } else {
                    this.submitInfo();
                }
            }
        },
        mounted: function() {
            this.main();
        }
    }
</script>

<style lang="sass">
    @import "../sass/UserInfo.scss";
</style>

<style type="text/css" scoped>
    .tab-content .form-group { border: none; }
</style>
<template>
    <header id="top-header" :class="{'no-box-shadow': noBoxShadow == 1, 'in-side-bar': inSideBar}">
        {{title}}
        <div class="go-back-btn" v-if="back == 1 || close == 1 || myback == 1" @click="handleBack()"></div>
        <div class="go-prepare-btn" v-if="prepare == 1" @click="handlePrepare()">预报价</div>
        <div class="go-ok-btn" v-if="ok == 1" @click="handleOk()">确定</div>
        <div class="go-personal-btn" v-if="personal == 1" @click="handlePersonal()"></div>
        <div class="go-edit-btn" v-if="edit == 1" @click="handleEdit()">编辑</div>
        <div class="go-edit-btn" v-if="submit == 1" @click="handleSubmit()">提交</div>
        <div class="go-edit-btn" v-if="batch == 1" @click="handleBatch()">一键报价</div>
        <div class="go-calendar-btn" v-if="calendar == 1" @click="handleCalendar">
            <input type="text" style="visibility: hidden;" ref="calendarInput">
        </div>
        <div class="go-today-btn" v-if="today == 1" @click="handleToday"></div>
    </header>
</template>

<script>
    export default {
        name: 's-header',
        props: [
            'title',  /* 标题 */
            'back',   /* 展示返回按钮, 行为是浏览器后退 */
            'myback',   /* 展示返回按钮, 行为由用户自定义 */
            'close',  /* 展示返回按钮, 点击时将向上冒泡关闭窗口事件 */
            'ok',    /* 右侧展示确定按钮, 点击冒泡事件 */
            'personal',  /* 右侧展示用户头像按钮,点击冒泡事件 */
            'edit',  /* 右侧展示编辑按钮,点击冒泡事件 */
            'submit',  /* 右侧展示提交按钮,点击冒泡事件 */
            'batch',  /* 右侧展示一件报价按钮,点击冒泡事件 */
            'prepare', /* 左侧展示预报价按钮 */
            'calendar', /* 右侧展示日历按钮 */
            'today', /* 左侧展示(今)按钮 */
            'noBoxShadow',   /* 设为1则不显示阴影 */
            'inSideBar',   /* 是否在侧边弹出栏中(static定位) */
        ],
        methods: {
            handleBack: function() {
                if (this.back == 1) {
                    history.back();
                } else if (this.close == 1) {
                    this.$dispatch('close-tab');
                } else if (this.myback == 1) {
                    this.$emit('my-back');
                }
                return false;
            },
            handleOk: function() {
                this.$emit('go-ok');
            },
            handlePersonal: function() {
                this.$dispatch('go-personal');
            },
            handleEdit: function() {
                this.$emit('go-edit');
            },
            handleSubmit: function() {
                this.$emit('go-submit');
            },
            handleBatch: function() {
                this.$emit('go-batch');
            },
            handlePrepare: function() {
                this.$dispatch('go-prepare');
            },
            handleCalendar: function() {
                window.$(this.$refs.calendarInput).mobiscroll('getInst').show();
            },
            handleToday: function() {
                this.$emit('go-today');
            }
        },
        mounted: function() {
            if (this.calendar == 1) {
                var self = this;
                var inputDom = this.$refs.calendarInput;
                $(inputDom).mobiscroll().date({
                    display: 'modal',
                    lang: 'zh'
                });

                $(inputDom).bind('change', function() {
                    var value = $(this).val();
                    self.$emit('calendar-change', value);
                });
            }
        }
    }
</script>

<style lang="sass">
    @import "../sass/Header.scss";
</style>
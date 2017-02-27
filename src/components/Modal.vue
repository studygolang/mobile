<template>
    <transition name="modal">
        <div id="v-modal-wrap" v-show="show">
            <div id="v-modal-dialog">
                <div id="v-modal-title" v-show="title">{{title}}</div>
                <div id="v-modal-body">
                    <slot name="slotA" v-if="slot == 'slotA'"></slot>
                    <slot name="slotB" v-if="slot == 'slotB'"></slot>
                    <slot name="slotC" v-if="slot == 'slotC'"></slot>
                    <template v-if="!slot">{{message}}</template>
                </div>
                <div id="v-modal-footer">
                    <button class="v-modal-btn slave" @click="cancel()" v-show="type == 'confirm'">取消</button>
                    <button class="v-modal-btn primary" @click="ok()" v-show="type">确定</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 's-modal',
        data: function() {
            return {
                show: false,
                type: '',
                message: '',
                slot: null,
                title: '',
                callback: null
            }
        },
        methods: {
            modal: function(message, title) {
                if (typeof message === 'string') {
                    this.message = message;
                    this.slot = null;
                } else if (typeof message === 'object' && message.slot) {
                    this.slot = message.slot;
                }
                this.title = title;
                this.callback = null;
                this.show = true;
            },
            modalAlert: function(params = {}) {
                this.type = 'alert';
                this.modal(params.message, params.title || '提示');
                this.callback = params.callback;
            },
            modalConfirm: function(params = {}) {
                this.type = 'confirm';
                this.modal(params.message, params.title || '确认');
                this.callback = params.callback;
            },
            ok: function() {
                var self = this;
                this.show = false;
                setTimeout(function() {
                    if (self.callback) {
                        self.callback(true);
                    }
                }, 0);
            },
            cancel: function() {
                var self = this;
                this.show = false;
                setTimeout(function() {
                    if (self.callback) {
                        self.callback(false);
                    }
                }, 0);
            }
        }
    }
</script>

<style lang="sass">
    @import "../sass/Modal.scss";
</style>
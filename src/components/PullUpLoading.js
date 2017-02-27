/**
 * 滚动到底部加载插件
 */

import _ from 'lodash';

const WINDOW_HEIGHT = window.innerHeight;

// 加载回调
var loadingCallback = function() {};

// 是否正在加载中
var loading = false;

var repeatTimes = 0;

// 预加载的高度
var preloadHeight = 0;

function eventHandler() {
    // console.log('scroll');

    if (loading) {
        console.log('正在加载中, 不重复加载');
        repeatTimes++;
        if (repeatTimes > 1) {
            loading = false;
            repeatTimes = 0;
        }
        return;
    }

    if (window.pageYOffset + WINDOW_HEIGHT >= (document.documentElement.scrollHeight - preloadHeight)) {
        console.log('加载下一页');

        if (loadingCallback) {
            // console.log('执行 loading callback')
            loading = true;
            loadingCallback().finally(() => {
                // console.log('执行finally');
                loading = false;
            });
        }
    }
}

// 使用 throttle 节流控制触发频率
var throttleEventHandler = _.throttle(eventHandler, 200);

/**
 * 绑定scroll事件
 */
export function bindPullUpLoading(callback, params = {}) {
    preloadHeight = params.preloadHeight || 0;
    window.addEventListener('scroll', throttleEventHandler, false);

    if (typeof callback === 'function') {
        loadingCallback = callback;
    }
}

/**
 * 解除绑定
 */
export function unbindPullUpLoading() {
    window.removeEventListener('scroll', throttleEventHandler);
    console.log('scroll事件移除');
}
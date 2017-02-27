/**
 * JS-NA接口工具
 */
"use strict";

import {TOKEN_CACHE_KEY} from './TokenUtils';

/**
 * 调用 JS-NA 接口
 * @param type
 * @param param
 * @param callback
 * @param testCallbackData
 */
function naInvoke(type, param, callback, testCallbackData) {
    if (testCallbackData) {
        typeof callback === 'function' && callback(testCallbackData);
        return;
    }

    if (!window.StudyGolang) {
        throw new Error('Native对象失效!');
    }

    param = param || {};

    StudyGolang.Bridge.jsGetData({
        type: type,
        data: param
    }, function(data) {
        typeof callback === 'function' && callback(data);
    });
}

/**
 * 获得Token
 * @param callback
 * @param testData
 */
function naGetToken(callback, testData) {
    naInvoke('GET_TOKEN', {}, callback, testData);
}

/**
 * 登出
 */
function naLogout() {
    naInvoke('LOGOUT', {});
}

function naClearCache() {
    console.log("clear cache start...");
    naInvoke('CLEAR_CACHE', {});
}

/**
 * 清理Token并登出
 */
function commonLogout() {
    localStorage.removeItem(TOKEN_CACHE_KEY);
    if (window.StudyGolang) {
        naLogout();
    }
}

/**
 * Toast
 * @param message
 */
function naToast(message) {
    if (!window.StudyGolang) {
        console.log(message);
        return;
    }
    naInvoke('TOAST', {message: message});
}

function naGotoBrowser(url) {
    naInvoke('GOTO_BROWSER', {url: url});
}

/* 调用NA的图片裁剪功能 */
function naUploadImageClip(data, callback) {
    naInvoke('FETCH_IMAGE', data, callback);
}

/* 拍照并裁剪 */
function naCaptureClip(callback) {
    naUploadImageClip({mode: 1}, callback);
}

/* 从相册选择并裁剪 */
function naPhotosClip(callback) {
    naUploadImageClip({mode: 2}, callback);
}

function isWebView() {
    return typeof window.StudyGolang !== 'undefined';
}

export default {
    naGetToken: naGetToken,
    naLogout: naLogout,
    commonLogout: commonLogout,
    naToast: naToast,
    naGotoBrowser: naGotoBrowser,
    naCaptureClip: naCaptureClip,
    naPhotosClip: naPhotosClip,
    naClearCache: naClearCache,
    isWebView: isWebView
};

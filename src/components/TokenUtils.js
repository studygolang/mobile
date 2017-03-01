"use strict";
import NAProxy from './NAProxy';

const ls = window.localStorage;
const TOKEN_CACHE_KEY = 'S_GOLANG_TOKEN';

/**
 * 使用 Promise 封装并改善 Token 的获取
 * 从 localStorage 中读取
 * 业务调用方式: getToken().then(() => {resolve...});
 * @returns {Promise}
 */
function getToken() {
    return new Promise(function(resolve) {
        var tokenCache = ls.getItem(TOKEN_CACHE_KEY);
        if (tokenCache) {
            resolve(tokenCache);
        } else {
            resolve('');
        }
        return;

        // try {
        //     NAProxy.naGetToken((data) => {
        //         var token = data.token;
        //         if (token) {
        //             ls.setItem(TOKEN_CACHE_KEY, token);
        //             resolve(token);
        //         } else {
        //             resolve('');
        //         }
        //     });
        // } catch (e) {
        //     resolve('');
        // }
    });
}

/**
 * 非 App 方式登录，保存 token 到 localStorage
 * @param string token
 */
function setToken(token) {
    if (token) {
        ls.setItem(TOKEN_CACHE_KEY, token);
    }
}

/**
 * 判断是否登录，执行回调
 * 
 * @return
 */
function isLogin(callback) {
    getToken().then((token) => {
        if (token) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

export {TOKEN_CACHE_KEY, getToken, setToken, isLogin};
/**
 * WebVPN 登录页 JS 版本修复（插入到 HTML 最前面执行）
 * 把旧分包 pdf_vendor.82c.js / app.271.js 替换成服务端当前版本
 */
(function () {
  'use strict';

  var REPLACEMENTS = {
    'pdf_vendor.82c.js': 'vendor.391ee55107261c7e0bdd.js',
    'app.271.js': 'app.2fb1f8a1ec5d2342de95.js'
  };

  function fixUrl(url) {
    if (!url) return url;
    var result = url;
    for (var oldName in REPLACEMENTS) {
      if (result.indexOf(oldName) !== -1) {
        result = result.replace(oldName, REPLACEMENTS[oldName]);
      }
    }
    return result;
  }

  function patchSrcSetter(Proto, prop) {
    var desc = Object.getOwnPropertyDescriptor(Proto, prop);
    if (!desc || !desc.set) return;
    Object.defineProperty(Proto, prop, {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get,
      set: function (value) {
        desc.set.call(this, fixUrl(value));
      }
    });
  }

  patchSrcSetter(HTMLScriptElement.prototype, 'src');
  patchSrcSetter(HTMLLinkElement.prototype, 'href');

  var origSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if ((name === 'src' || name === 'href') && typeof value === 'string') {
      value = fixUrl(value);
    }
    return origSetAttribute.call(this, name, value);
  };

  console.log('[webvpn-fix] 已拦截旧版 JS 引用，将自动替换为 vendor.391ee… / app.2fb1f8…');
})();

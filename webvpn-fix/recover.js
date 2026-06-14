/**
 * WebVPN 登录页白屏修复 — 控制台一键执行
 *
 * 用法：
 * 1. 打开 https://webvpn.cwxu.edu.cn/login （白屏也行）
 * 2. F12 → Console
 * 3. 把本文件内容全部粘贴进去，回车
 * 4. 若仍白屏，再执行一次 location.reload() 后立刻粘贴运行
 */
(function fixWebVPNLogin() {
  'use strict';

  var BASE =
    '/https/77726476706e69737468656265737421e7ef429d347e6b47661dc7a99c406d3676';
  var VENDOR = BASE + '/assets/js/vendor.391ee55107261c7e0bdd.js?vpn-7';
  var APP = BASE + '/assets/js/app.2fb1f8a1ec5d2342de95.js?vpn-7';

  var BROKEN = [/pdf_vendor\.82c\.js/i, /app\.271\.js/i];

  function isBroken(src) {
    return BROKEN.some(function (re) {
      return re.test(src);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.charset = 'utf-8';
      s.src = src;
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error('加载失败: ' + src));
      };
      document.body.appendChild(s);
    });
  }

  var removed = 0;
  document.querySelectorAll('script[src]').forEach(function (el) {
    if (isBroken(el.src)) {
      el.remove();
      removed++;
    }
  });

  var hasVendor = !!document.querySelector('script[src*="vendor.391ee"]');
  var hasApp = !!document.querySelector('script[src*="app.2fb1f8"]');

  console.log('[WebVPN Fix] 已移除旧脚本:', removed, '个');

  if (hasVendor && hasApp) {
    console.log('[WebVPN Fix] 页面已是新版本脚本，无需注入');
    return;
  }

  var chain = Promise.resolve();
  if (!hasVendor) {
    chain = chain.then(function () {
      console.log('[WebVPN Fix] 注入 vendor...');
      return loadScript(VENDOR);
    });
  }
  if (!hasApp) {
    chain = chain.then(function () {
      console.log('[WebVPN Fix] 注入 app...');
      return loadScript(APP);
    });
  }

  chain
    .then(function () {
      console.log('[WebVPN Fix] 完成，请查看页面是否出现登录框');
    })
    .catch(function (err) {
      console.error('[WebVPN Fix] 失败:', err);
      console.log('建议：清缓存后刷新，或在 Network 确认上述 JS 返回 200 且为 JS 内容');
    });
})();

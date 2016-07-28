'use strict';

/*!
 * js-redirect-module JavaScript Library v1.0
 * https://github.com/yama-dev/js-redirect-module
 * Copyright yama-dev
 * Released under the MIT license
 * Date: 2016-07-27
 */
(function () {
  //for mobile path ("/" is omitted)
  var mobileDir = 'sp';
  //for Site root path ("/" is omitted)
  var rootPath = '';
  //for exception path or name
  var exception = 'is-pc';

  var _ua = navigator.userAgent;
  var _href = location.href;
  var _hostname = location.host;
  var _redirect = '';
  if (_href.search(new RegExp('/' + mobileDir + '/')) != -1) {
    if (_ua.indexOf('iPhone') > 0 || _ua.indexOf('iPad') > 0 || _ua.indexOf('Android') > 0 || _ua.indexOf('Android') > 0 && _ua.indexOf('Mobile') > 0 || _ua.indexOf('Windows Phone') > 0) {} else {
      _redirect = _href.replace('/' + mobileDir + '/', '/');
      if (_href.match(new RegExp(exception))) {
        //Exception handling
      } else {
        //Match handling
        location.href = _redirect;
      }
    }
  } else {
    if (_ua.indexOf('iPhone') > 0 || _ua.indexOf('iPad') > 0 || _ua.indexOf('Android') > 0 || _ua.indexOf('Android') > 0 && _ua.indexOf('Mobile') > 0 || _ua.indexOf('Windows Phone') > 0) {
      if (rootPath != '') {
        _redirect = _href.replace('/' + rootPath + '/', '/' + rootPath + '/' + mobileDir + '/');
      } else {
        _redirect = _href.replace(_hostname + '/', _hostname + '/' + mobileDir + '/');
      }
      if (_href.match(new RegExp(exception))) {
        //Exception handling
      } else {
        //Match handling
        location.href = _redirect;
      }
    } else {}
  }
})();
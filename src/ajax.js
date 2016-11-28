/**
 * Created by lilei on 16-6-30.
 */
// import reqwest from 'reqwest'
import Cookies from 'js-cookie';
import _ from 'underscore'

import ajaxLoad from '../DOMcomponents/AjaxLoading'

function ajax(params) {

  	let url = params.url;											// 请求地址
  	let method = 'get';												// 请求方式
	let loading = params.loading && true;							// 是否开启loading动画
  	let success = params.success;									// 包装ajax success方法
  	let fail = params.fail;											// 包装ajax fail方法
	let beforeSend = params.beforeSend;								// 包装ajax beforeSend方法
	let complete = params.complete;									// 包装ajax complete方法


  	if (!url) {
		alert('没有传递请求url');
		return;
  	}

  	if (params.method) {
    	method = params.method.toLocaleLowerCase();
  	}

  	if (_.isEmpty(params.data)) {
    	params.data = {};
  	}
    params.data.platform = "w";

  	let tokenInfo = Cookies.get('Authorization');

  	if (tokenInfo && tokenInfo.length > 0) {

		// 获取　OS　和　token　数据
		/* let userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (userAgent.match(/iPhone/) || userAgent.match(/iPad/) || userAgent.match(/iPod/)) {
			let chart = '+';

			params.data.os = tokenInfo.split(chart)[0];
			params.data.token = tokenInfo.split(chart)[1];
		} else if (userAgent.match(/Android/)) {
			let chart = '-';

			params.data.os = tokenInfo.split(chart)[0];
			params.data.token = tokenInfo.split(chart)[1];
		} */

		if (tokenInfo.indexOf('+') > 0) {
			let chart = '+';

			params.data.os = tokenInfo.split(chart)[0];
			params.data.token = tokenInfo.split(chart)[1];
		} else if (tokenInfo.indexOf('-') > 0) {
			let chart = '-';

			params.data.os = tokenInfo.split(chart)[0];
			params.data.token = tokenInfo.split(chart)[1];
		}

  	}




  	$.ajax({
		type: method,
		url: url,
		// data to be added to query string:
		data: params.data,
		// type of data we are expecting in return:
		dataType: 'json',
		timeout: 2000,
		beforeSend: beforeSendFuc,
		success:successFunc,
		error:failFunc,
		complete:completeFuc
  	});

	function beforeSendFuc(xhr, settings) {
		if (loading) {
			let root = document.getElementById('root')
				, _html = ajaxLoad(true);

			root.appendChild(_html);
		}

		if (typeof beforeSend === 'function')
			beforeSend(xhr, settings);
	}

  	function successFunc(data) {
    	if (typeof success === 'function')
      		success(data);
  	}

  	function failFunc(error) {
    	if (typeof error === 'function')
      		fail(error);
  	}

	function completeFuc(xhr, status) {


		if (typeof complete === 'function')
			complete(xhr, status);
	}

}


export default ajax

// 全局请求封装
// const base_url = 'http://服务器地址:2222/api/'
export const host = '192.168.1.9';
const base_url = 'http://'+host+':7777/'
// 请求超出时间
const timeout = 5000

// 需要修改token，和根据实际修改请求头
export default (params) => {
	let url = params.url;
	let method = params.method || "get";
	let data = params.data || {};
	let header = {
		'Content-Type': 'application/json;charset=UTF-8',
		'Authorization': 'Bearer '+ uni.getStorageSync("fufu-app-token"),
		...params.header
	}

	if (method == "post") {
		header = {
			'Content-Type': 'application/json'
		};
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: base_url + url,
			method: method,
			header: header,
			data: data,
            timeout ,
			success(response) {
				const res = response
				// 根据返回的状态码做出对应的操作
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					uni.clearStorageSync()
					switch (res.statusCode) {
						case 401:
							uni.showModal({
								title: "提示",
								content: "请登录",
								showCancel: false,
								success() {
									setTimeout(() => {
										uni.redirectTo({
											url: "/pages/Login",
										})
									}, 1000);
								},
							});
							break;
						case 404:
							uni.showToast({
								title: '请求地址不存在...',
								duration: 2000,
							})
							break;
						default:
							uni.showToast({
								title: '请重试...',
								duration: 2000,
							})
							break;
					}
				}
			},
			fail(err) {
				console.log(err)
				if (err.errMsg.indexOf('request:fail') !== -1) {
					wx.showToast({
						title: '网络异常',
						icon: "error",
						duration: 2000
					})
				} else {
					wx.showToast({
						title: '未知异常',
						duration: 2000
					})
				}
				reject(err);

			},
			complete() {
				// 不管成功还是失败都会执行
				uni.hideLoading();
				uni.hideToast();
			}
		});
	}).catch(() => {});
};

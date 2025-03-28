export const socket = {
	data() {
		return {
			// socket是否开启
			socketOpen: false,
			// 定时器
			timer: null,

			// 链接
			surl: `websocket链接`,

			// 底部id用于定位到底部
			scrollIntoView: "",

			// 键盘高度
			keyboardHeight: 0,

			// 监听键盘高度的方法
			listener: null
		}
	},

	onLoad(option) {
		// 开启键盘高度监听
		this.listenerKeyboardHeight()

		// socket初始化
		this.init()

		// 定时器，定时判断socket有没有掉线
		this.timer = setInterval(() => {
			this.isSocketConnct()
		}, 2000)

	},
	beforeDestroy() {
		// 关闭定时器
		clearInterval(this.timer)

		// 关闭键盘高度监听
		uni.offKeyboardHeightChange(this.listener)

		// 关闭Socket
		this.closeSocket()
	},
	methods: {
		// 发送消息
		sendSocketMessage(msg) {
			console.log("发送消息", msg);
			let that = this
			if (this.socketOpen) {
				uni.sendSocketMessage({
					data: msg,
					success: (res) => {
						setTimeout(() => {
                            // json转对象
							let param = JSON.parse(msg)
							that.sendMessageHandle(param)
						}, 300)
					},
					fail(err) {
						// 发送失败处理
					}
				});
			} else {
				// Socket没有开启，重新连接并重新发送消息
				this.init()
				setTimeout(() => {
					this.sendSocketMessage(msg)
				},300)
			}
		},

		// 判断是否连接
		isSocketConnct() {
			if (!this.socketOpen) {
				console.log("WebSocket 再次连接！");
				this.init()
			}
		},

		// 初始化
		init() {
			this.connect()
			this.openSocket()
			this.onclose()
			this.onSocketMessage()
		},

		// 建立连接
		connect() {
			console.log(this.surl);
			uni.connectSocket({
				url: this.surl,
				method: 'GET'
			});
		},

		// 监听关闭
		onclose() {
			let that = this
			uni.onSocketClose((res) => {
				that.socketOpen = false
				console.log('WebSocket 已关闭！');
			});
		},

		// 关闭
		closeSocket() {
			uni.closeSocket();
		},

		// 打开Soceket
		openSocket() {
			let that = this
			uni.onSocketOpen((res) => {
				that.socketOpen = true
				console.log('WebSocket连接已打开！');
			});
		},

		// 接收事件
		onSocketMessage() {
			let that = this
			uni.onSocketMessage((res) => {
				let obj = JSON.parse(res.data)
				console.log("接收事件", obj);
				this.onMessageHandle(obj)
			});
		},

		// 接收到事件后处理的方法（可自己重写）
		onMessageHandle(obj) {
			// 根据自己业务逻辑重写
		},

		// 发送消息后处理的方法（可自己重写）
		sendMessageHandle(msg) {
			// 根据自己业务逻辑重写
		},


		// 定位到底部
		scrollToBottom() {
			this.$nextTick(() => {
				this.scrollIntoView = "last-msg-item"
				this.$nextTick(() => {
					this.scrollIntoView = ""
				})
			})
		},

        // 开启键盘高度的监听
		listenerKeyboardHeight() {
			this.listener = (res) => {
				console.log("键盘高度", res.height)
				this.keyboardHeight = res.height
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			}
			uni.onKeyboardHeightChange(this.listener)
		}
	}

}

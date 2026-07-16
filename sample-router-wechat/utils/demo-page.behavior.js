/**
 * 演示页通用 Behavior
 *
 * 三个演示页（native/methods、basic/index、advanced/index）共享相同的
 * 「状态栏 + 操作日志 + 运行/确认/加载」机制，统一收敛到此 Behavior，
 * 各页只需声明自己的 demos 数据与 onRunTap 分发。
 */
module.exports = Behavior({
    data: {
        lastAction: '',
        logs: []
    },
    methods: {
        _run(name, fn) {
            this.showLoading();
            this.addLog(`执行 ${name}`);
            fn()
                .then(() => {
                    this.hideLoading();
                    this.addLog(`${name} 成功`);
                })
                .catch(err => {
                    this.hideLoading();
                    const msg = this._errMsg(err);
                    this.addLog(`${name} 失败: ${msg}`);
                    wx.showToast({title: '失败', icon: 'error'});
                });
        },

        _errMsg(err) {
            if (!err) return '未知错误';
            return err.msg || err.errMsg || (err.err && err.err.errMsg) || err.message || '未知错误';
        },

        _confirm(title, content, onConfirm) {
            wx.showModal({
                title,
                content,
                success: res => {
                    if (res.confirm) onConfirm();
                }
            });
        },

        addLog(message) {
            const logs = this.data.logs;
            logs.unshift(`${this._now()}: ${message}`);
            if (logs.length > 50) logs.pop();
            this.setData({logs});
        },

        onClearLogs() {
            this.setData({logs: []});
        },

        showLoading() {
            wx.showLoading({title: '处理中...', mask: true});
        },

        hideLoading() {
            wx.hideLoading();
        },

        _now() {
            const d = new Date();
            const p = n => String(n).padStart(2, '0');
            return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        }
    }
});

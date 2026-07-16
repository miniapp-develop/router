const {Router} = require('@mini-dev/router');
const router = new Router();

Page({
    data: {
        rawParams: '',
        paramList: []
    },
    onLoad(query) {
        // 打印到开发者工具控制台，方便验证
        console.log('[console] onLoad query =', query);
        const list = Object.keys(query).map(k => ({key: k, value: query[k]}));
        this.setData({
            rawParams: JSON.stringify(query, null, 2),
            paramList: list
        });
    },
    onTapBack() {
        router.navigateBack({delta: 1}).catch(() => {
            wx.showToast({title: '无上一页可返回', icon: 'none'});
        });
    }
});

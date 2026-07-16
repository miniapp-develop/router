const { Router } = require('@mini-dev/router');
const basicRouter = require("./modules/basic/router");
const shopRouter = require("./modules/advanced/shop/router");
const gameRouter = require("./modules/advanced/game/router");

const appRouter = new Router({name: 'AppRouter', basePath: '/'})
    .before(data => {
        console.log(`[${appRouter.name()}] before: user is null`);
        return Promise.resolve(data);
    })
    .use('basic', basicRouter)
    .use('shop', shopRouter)
    .use('game', gameRouter)
    .use('custom', function (option) {
        wx.showModal({
            content: 'this is appRouter\'s custom handle...'
        });
    });

module.exports = appRouter;

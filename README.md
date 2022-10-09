# miniapp-router (a simple miniapp router.)

一个简单的小程序路由封装。

## 目的

由于个人开发小程序的过程中，在管理路由的时候，有几点不方便的地方：

1. 页面跳转需要使用硬编码的路径，在移动页面的时候，需要修改所有的相关 url。比如 wx.navigateTo({url:'pages/foo/index''})
2. 页面之间传递参数需要手工编码成 query 字段。

所以，对小程序的路由进行了一个简单的封装，主要功能：

### 通过页面映射（name -> path）的方式，实现通过 name 来进行页面跳转。

比如对于一个页面：/pages/pa/pb/pb.wxml，可以将此页面注册为：

```javascript
router.use({
    name:'b',
    path:'/pages/pa/pb/pb.wxml'
})
```

这样的话，就可以在 router 上进行更简单的调用：

```javascript

router.navigateTo({name:'b'})
```

### 提供约定的配置。

如果我们的页面命名比较统一，则可以跳过页面映射这一步，直接通过页面的文件夹名字进行跳转。
比如在router的同级目录下有两个页面：

    page1/index.wxml
    page2/index.wxml

则以下调用会进行相应的页面跳转:

```javascript
router.navigateTo({name:'page1'}) // 默认会映射到 page1/index.wxml
router.navigateTo({name:'page2'}) // 默认会映射到 page2/index.wxml
```

### 提供模块间的路由组合。

如果小程序由多个模块组成，则可以为每个模块单独定义一个 模块路由，然后将模块路由注册到全局路由中。
一个示例工程：

    -moduleA
        --pageA
            --index
        --pageB
            --index
        router.js
    -moduleB
        --pageA
            --index
        --pageB
            --index
        router.js
    app.router.js

注册到全局路由：

```javascript
const Router = require('@mini-dev/router');
import moduleARouter from "./moduleA/router";
import moduleBRouter from "./moduleB/router";

const appRouter = new Router({name: 'AppRouter', basePath: '/'})
    .use('module-a', moduleARouter.basePath('/moduleA/'))
    .use('module-b', moduleBRouter.basePath('/moduleA/'));
```

模块间跳转：

```javascript
import appRouter from "../app.router";
appRouter.navigateTo({
    name:['module-a', 'pageA']
})
```

## 使用方式

1, add dependency

```shell
    npm i @mini-dev/router
```

2, define router

```javascript
    const mainRouter = new Router({
            name: 'mainRouter',
            basePath: '/pages/main/',
            routes: [
                'index',
                {
                    name: 'foo',
                    path: 'foo/foo'
                }
            ]
        }
    )
```

3. open page

```javascript
    moduleRouter.navigateTo({
        name: 'index',
        params: {
            a: 100,
            b: 200
        }
    });
```

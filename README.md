# minidev-router (a simple miniapp router.)

一个简单的小程序路由封装。

## 1. 背景

个人开发小程序的过程中，在管理路由的时候，有几点不方便的地方：

1. 页面跳转需要使用硬编码的路径，在移动页面的时候，需要修改所有的相关 url。比如 wx.navigateTo({url:'pages/foo/index''})
2. 页面之间传递参数需要手工编码成 query 字段。

所以对小程序的路由进行了一个简单的封装，解决以上两点痛点。

## 2. 目标

本库的定位是**「增强路由」**，而不是**「统一路由」**：

- 只在小程序原生路由 API 之上做一层薄封装，提供 name 映射、参数序列化、模块组合等增强能力；
- **不抽象、不重写各平台的路由 API**，调用时传入的参数原样透传给平台原生方法，平台特有的字段（如微信的 `events`）照常生效；
- 不引入运行时依赖，库本身发布为纯 CommonJS 源码。

下面分三步递进介绍能力：先讲对五个原生导航方法的**纯参数增强**（第 3 节），再讲基于 name 的**路由解析**（第 4 节），最后讲多模块场景下的**嵌套路由**组合（第 5 节）。此外的扩展能力（中间件等）见第 6 节。

## 3. 原生方法增强

对五个原生导航方法（`navigateTo`/`redirectTo`/`reLaunch`/`switchTab`/`navigateBack`）的**入参**做增强。本节只涉及 `wx` 等原生对象上的方法及其参数，不引入 router 自身的其他方法。

### 3.1 参数自动序列化

`params` 对象自动编码为 query string，`null`/`undefined` 编码为空字符串，`0`/`false` 等假值原样保留：

```javascript
mainRouter.navigateTo({
    name: 'index',
    params: { a: 100, b: 200 }
});
// => /pages/main/index/index?a=100&b=200
```

### 3.2 navigateBack 便捷形式

支持数字简写，归一化为 `{delta: N}`：

```javascript
router.navigateBack(1)              // => {delta: 1}
router.navigateBack({delta: 1})
```

注意：`navigateBack` 不经过 `dispatch`/中间件，直接调用原生方法。

### 3.3 入参与解析优先级

单次调用支持 `url` / `path` / `name` 三种入参，优先级 `url` > `path` > `name`（`name` 的解析见第 4 节）：

- `url` 存在 → 直接透传，其余忽略（原生行为）；
- `path` 存在 → `basePath + path + params`；
- `name` → 见第 4 节。

`url`、`path` 走原生透传，并叠加 3.1 的参数序列化等增强；`name` 则进入下一节的路由解析。

## 4. name 路由

`name` 是 `url`、`path` 之后的入参，整体优先级 `url` > `path` > `name` > 默认页 `index`。将硬编码的页面路径注册为 `name`，调用时只关心 name，路径变动时只需改注册处。这是本库相对原生路由最核心的增量。

### 4.1 通过页面映射（name -> path）实现按 name 跳转

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

### 4.2 约定配置

如果我们的页面命名比较统一，则可以跳过页面映射这一步，直接通过页面的文件夹名字进行跳转。
比如在router的同级目录下有两个页面：

    page1/index.wxml
    page2/index.wxml

则以下调用会进行相应的页面跳转:

```javascript
router.navigateTo({name:'page1'}) // 默认会映射到 page1/index.wxml
router.navigateTo({name:'page2'}) // 默认会映射到 page2/index.wxml
```

## 5. 嵌套路由

当小程序由多个模块组成时，可以为每个模块单独定义一个模块路由，再将其注册到全局路由，通过 name 数组逐层消费实现模块间跳转。

### 5.1 模块间路由组合

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
    const moduleARouter = require("./moduleA/router");
    const moduleBRouter = require("./moduleB/router");

    const appRouter = new Router({name: 'AppRouter', basePath: '/'})
        .use('module-a', moduleARouter.basePath('/moduleA/'))
        .use('module-b', moduleBRouter.basePath('/moduleB/'))
```

模块间跳转：

```javascript
    const appRouter = require("../app.router");
    appRouter.navigateTo({
        name:['module-a', 'pageA']
    })
```

`name` 数组从外层 Router 逐层消费：第一段 `module-a` 命中子 Router 并委托，剩余段 `pageA` 在子 Router 内继续解析。

## 6. 扩展能力

### 6.1 before 中间件

`router.before(h)` 注册异步拦截器，LIFO（后注册先执行），返回 Promise 可异步阻断跳转：

```javascript
router.before(async ({type, payload}) => {
    // 鉴权 / 埋点 / 改写 payload 等
});
```

## 7. 使用方式

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
    mainRouter.navigateTo({
        name: 'index',
        params: {
            a: 100,
            b: 200
        }
    });
```

## 8. 使用条件

### 8.1 运行环境

微信 / 支付宝 / 抖音 / 百度 / QQ 任一小程序运行时。库在首次调用时按 `wx → my → tt → swan → qq` 顺序自动探测平台注入的全局对象，命中后缓存。各平台路由 API 名称（`navigateTo`/`redirectTo`/`navigateBack`/`reLaunch`/`switchTab`）及 `url`/`fail` 回调约定基本一致，参数原样透传，无需调用方关心平台差异。如需替换为自定义实现（如测试 mock），可子类覆写 `getVendor()` 或构造时传入 `vendor`。

### 8.2 页面目录约定

未显式配置 `path` 时，路由按 `{name}/index` 解析页面路径，需将页面按此约定组织目录；否则请在路由配置中显式给出 `path`。

### 8.3 basePath

路径解析依赖 `basePath`，未设置时会告警并以空串兜底。嵌套子 Router 各自维护自己的 `basePath`。

### 8.4 npm 构建

开发期需在小程序 IDE 中执行「构建 npm」以将 `@mini-dev/router` 构建到 `miniprogram_npm/`。

## 9. 示例

完整的微信小程序示例位于 [`sample-router-wechat/`](./sample-router-wechat)。它通过 `"@mini-dev/router": "file:.."` 依赖本库，演示了模块路由组合、命名跳转、参数序列化等用法：

```shell
cd sample-router-wechat
npm install
# 然后在微信开发者工具中打开 sample-router-wechat/，执行「工具 → 构建 npm」
```

# miniapp-router (a simple miniapp router.)

一个简单的小程序路由封装。

## 目的

由于个人在小程序的开发过程中，在管理路由的时候，有几点不方便的地方：

1. 页面跳转需要使用硬编码的路径，在移动页面的时候，需要修改所有的相关path。比如 wx.navigateTo({url:'pages/foo/index''})
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
如果我们的页面命名比较统一，则可以跳过注册这一步，直接通过页面的文件夹名字进行跳转。
比如在router的同级目录下有两个页面：

    page1/index.wxml
    page2/index.wxml

则以下调用会进行相应的页面跳转:
```javascript
router.navigateTo({name:'page1'})
router.navigateTo({name:'page2'})
```

### 提供模块间的路由组合。



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

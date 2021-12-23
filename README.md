# miniapp-router

a simple miniapp router.

## Usage

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

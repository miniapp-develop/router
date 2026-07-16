Component({
    options: {
        virtualHost: true
    },
    externalClasses: ['ext-cls-root'],
    properties: {},
    data: {
        route: ''
    },
    lifetimes: {
        attached() {

            this.setData({
                route: getCurrentPages()[getCurrentPages().length - 1].route
            })
        }
    },
    methods: {},
})

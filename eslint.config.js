import autojsPlugin from './eslint-plugin-autojs.js';

export default [
    {
        files: ["src/**/*.js"],  // 指定要检查的文件：src目录下的所有.js文件
        plugins: {
            autojs: autojsPlugin
        },
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",
            globals: {
                // Auto.js 全局变量
                auto: "readonly",
                device: "readonly",
                app: "readonly",
                console: "readonly",
                images: "readonly",
                threads: "readonly",
                exit: "readonly",
                
                // 应用管理相关
                launchApp: "readonly",
                launch: "readonly",
                openAppSetting: "readonly",
                getPackageName: "readonly",
                getAppName: "readonly",
                currentPackage: "readonly",
                currentActivity: "readonly",
                waitForPackage: "readonly",
                waitForActivity: "readonly",
                
                // 基础操作
                sleep: "readonly",
                click: "readonly",
                longClick: "readonly",
                press: "readonly",
                swipe: "readonly",
                gesture: "readonly",
                scrollDown: "readonly",
                scrollUp: "readonly",
                
                // UI 相关
                toast: "readonly",
                toastLog: "readonly",
                alert: "readonly",
                confirm: "readonly",
                rawInput: "readonly",
                input: "readonly",
                
                // 选择器相关
                text: "readonly",
                textContains: "readonly",
                textStartsWith: "readonly",
                textEndsWith: "readonly",
                textMatches: "readonly",
                desc: "readonly",
                descContains: "readonly",
                descStartsWith: "readonly",
                descEndsWith: "readonly",
                descMatches: "readonly",
                id: "readonly",
                idContains: "readonly",
                idStartsWith: "readonly",
                idEndsWith: "readonly",
                idMatches: "readonly",
                className: "readonly",
                classNameContains: "readonly",
                classNameStartsWith: "readonly",
                classNameEndsWith: "readonly",
                classNameMatches: "readonly",
                packageName: "readonly",
                bounds: "readonly",
                boundsInside: "readonly",
                boundsContains: "readonly",
                drawingOrder: "readonly",
                clickable: "readonly",
                longClickable: "readonly",
                checkable: "readonly",
                checked: "readonly",
                focusable: "readonly",
                focused: "readonly",
                scrollable: "readonly",
                selected: "readonly",
                enabled: "readonly",
                visibleToUser: "readonly",
                
                // 查找相关
                findOne: "readonly",
                find: "readonly",
                untilFind: "readonly",
                
                // 按键相关
                back: "readonly",
                home: "readonly",
                powerDialog: "readonly",
                notifications: "readonly",
                quickSettings: "readonly",
                recents: "readonly",
                splitScreen: "readonly",
                
                // 坐标和屏幕
                getDisplayMetrics: "readonly",
                setScreenMetrics: "readonly",
                captureScreen: "readonly",
                requestScreenCapture: "readonly",
                
                // 文件和存储
                files: "readonly",
                storages: "readonly",
                
                // 网络
                http: "readonly",
                
                // 其他工具
                random: "readonly",
                requiresApi: "readonly",
                requiresAutojsVersion: "readonly",
                runtime: "readonly",
                context: "readonly",
                
                // 全局对象
                global: "readonly",
                
                // 模块系统
                require: "readonly",
                module: "readonly",
                exports: "readonly",
                
                // 事件
                events: "readonly",
                
                // 悬浮窗
                floaty: "readonly",
                
                // 媒体
                media: "readonly",
                
                // 传感器
                sensors: "readonly",
                
                // Shell
                shell: "readonly",
                
                // 定时器
                setTimeout: "readonly",
                setInterval: "readonly",
                clearTimeout: "readonly",
                clearInterval: "readonly",
                setImmediate: "readonly",
                clearImmediate: "readonly"
            },
        },
        rules: {
            // 基础规则
            "indent": ["error", 4],
            "quotes": ["error", "single"],
            "semi": ["error", "always"],

            // Auto.js 特殊规则
            "no-undef": "error",
            "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
            "no-var": "off",          // 必须使用 var
            "prefer-const": "off",    // const 支持但不强制
            "object-shorthand": "off",

            // 最佳实践
            "max-depth": ["warn", 4],
            "complexity": ["warn", 10],
            "no-magic-numbers": ["warn", { "ignore": [0, 1, 2, 1000] }],

            "autojs/images-recycle": "error",  // 自定义规则：检查captureScreen是否配套使用recycle
        }
    }
]
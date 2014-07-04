# grunt-unwrap

一个简单的 CMD 模块解除器，可以将 CMD 格式书写的模块导出不依赖加载器的版本。

典型项目：<https://github.com/aui/artDialog>

##	安装

```shell
npm install grunt-unwrap --save-dev
```

##	src

*	类型：`String` | `Array`

模版文件

##	dest

*	类型：`String`

输出路径。

##	options

###	options.base

*	类型：`String`

模块基础路径。

示例：

```
unwrap: {
    options: {
        base: './src'
    },
    'dialog.js': {
        src: './src/dialog.js',
        dest: './dist/dialog.js'
    }
}
```

###	options.globalBase

*	类型：`String`

**全局**模块基础路径。

例如模块中使用了``require('jquery')``，会最终合并`options.globalBase + '/jquery.js'`文件。你可以新建`jquery.js`来代替`jquery`模块：

```
define(function () {
	return jQuery;
});
```

###	options.namespace

*	类型：`String`

导出的命名空间。一般设置为`'window'`或者`'jQuery'`。

###	options.name

*	类型：`String`

导出的名称

###	options.banner

*	类型：`String`

导出的代码头部注释信息


##	示例

```
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> */\n'
        },
        unwrap: {
            options: {
                base: './src',
                globalBase: './src/global_modules',
                name: 'dialog',
                namespace: 'window',
                banner: '<%= meta.banner %>'
            },
            'dialog.js': {
                src: './src/dialog.js',
                dest: './dist/dialog.js'
            },
            'dialog-plus.js': {
                src: './src/dialog-plus.js',
                dest: './dist/dialog-plus.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-unwrap');
    grunt.registerTask('default', ['unwrap']);
};

```

完整项目演示请参考：<https://github.com/aui/artDialog>

##	注意事项

请不要给模块命名 ID，转换器会自动添加 ID。

## License

The MIT license.
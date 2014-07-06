# grunt-unwrap

这是一个简单的 CMD 模块解除器，可以将 CMD 格式书写的模块导出不依赖加载器的版本。

[jquery](https://github.com/jquery/jquery/)的源码是按照 AMD 规范书写的模块，这样的好处就是可以很方便自由组合需要的特性。jquery 最终发布的时候通过它私有的`build`脚本来打包最终我们所用到的版本。遗憾的是这个`build`脚本只适用于 jquery 项目本身，并不能通用，于是才有了 grunt-unwrap 这个通用解决方案的诞生，你可以基于 CMD 规范书写模块，然后通过 grunt-unwrap 来组装发布版本。

##	典型项目

[artDialog v6.0.2](https://github.com/aui/artDialog) 是 grunt-unwrap 的典型项目，artDialog-v6.0.0 曾只有模块化的版本，后来用户强烈要求提供不依赖加载器的版本，于是最终通过 grunt-unwrap 来实现了这个需求，目前 artDialog 通过 grunt-unwrap 来编译其标准版与增强版，具体可见它的[Gruntfile.js](https://github.com/aui/artDialog/blob/master/Gruntfile.js)文件。

##	安装

首先安装[NodeJS](http://nodejs.org)与[GruntJS](http://gruntjs.com)，然后安装`grunt-unwrap`：

```shell
npm install grunt-unwrap --save-dev
```

##	src

*	类型：`String` | `Array`

需要打包的目标模块文件（内部依赖会提取并合并）。

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

导出的名称。

###	options.banner

*	类型：`String`

导出的代码头部注释信息。

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

最终`dialog.js`与`dialog-plus.js`会在全局暴露`dialog`这个变量让开发者调用。

##	注意事项

1. 请不要给模块命名 ID，转换器会自动添加 ID
2. 模块内部的注释请不要包含`require`，否则可能会误分析

>	未来可能会借助词法分析的库来安全的解决第二个问题。

## License

The MIT license.
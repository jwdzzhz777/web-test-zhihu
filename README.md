# web-test-zhihu
Meteor构建，仿知乎，练习用
# FSCollection
必须导入的包:<br>
``cfs:standard-packages``<br>
同时必须导入<br>
``cfs:gridfs`` or ``cfs:filesystem``
不管有没有使用，至少导入下面之一:
```
$ meteor add cfs:gridfs
$ meteor add cfs:filesyste
$ meteor add cfs:s3	 
$ meteor add cfs:dropbox
$ meteor add iyyang:cfs-aliyun
```
取决于你需要什么。

##介绍
``cfs:standard-packages``
<br>  这个包里面包括了``FS.file`` 和``FS.Collection``.
###FS.file:
<br>一个``FS.file``实例包括了一个文件和该文件在客户端以及服务端的数据，它类似与浏览File对象(并可以从``File``对象创建)，但他可以附加属性和方法.他的很多方法都是当实例被调用``find``或``findOne``而返回时。
###FS.Collection：
<br>他提供了一个可以储存文件信息的集合，他由一个基本的``Mongo.Collection``实例支持，所以大多数集合可以调用的方法，例如``find``和``insert``都可以在``FS.Collection``中调用。如果你需要调用其他``Collection``的方法例如``_ensureIndex``，你可以直接通过``myFSCollection.files``底层的``Mongo.Collection``实例调用他们。
一个``FS.Collection``的``document``可以视为一个``FS.File``.
``CollectionFS``还提供了一个有上传文件必要机制的HTTP上传包，可以被动跟踪上传进度，并暂停和恢复上传。

链接：https://github.com/CollectionFS/Meteor-CollectionFS
###cfs:ui
``meteor add cfs:ui``
有用到的:
####FS.GetFile
```html
{{#with FS.GetFile collectionName id}}
  In here, we can use the FS.File instance methods that work as helpers, such as {{url}} or {{isImage}}
{{/with}}
```
允许你通过collection的 ``name`` 和 ``_id``得到一个``FS.GetFile``.

####FS.UploadProgressBar
上传进度条:
```html
{{> FS.UploadProgressBar bootstrap=true class='progress-bar-success progress-bar-striped active' showPercent=true}}
```
它可以有许多样式。<br>
注意:进度条到100%并不意味着上传全部完成,``hasStored()``等方法都不能完美表示上传完成,但``hasStored()``相对最接近。


#summernote
一个很好用的文本编辑器,可以对很多东西进行重写改成自己需要的。
看这里:http://summernote.org/getting-started/<br>
导入包：``meteor add summernote:summernote``<br>
初始化:
```jq
$('.summernote').summernote(object);//object可选
```
##重写onImageUpload方法
```jq
// onImageUpload callback
$('#summernote').summernote({
  callbacks: {
    onImageUpload: function(files) {
      // upload image to server and create imgNode...
      $summernote.summernote('insertNode', imgNode);
    }
  }
});

// summernote.image.upload
$('#summernote').on('summernote.image.upload', function(we, files) {
  // upload image to server and create imgNode...
  $summernote.summernote('insertNode', imgNode);
});
```
重写上传图片的方法 用上面的collectionFS来替代自带的base64上传。<br>
搭配默认的显示到编辑器的方法:
```jq
$('#summernote').summernote('insertImage', url, function ($image) {
  $image.css('width', $image.width() / 3);
  $image.attr('data-filename', 'retriever');
});
```
可以自定义设置<img>的属性。

##自定义按钮
可以自定义在toolbar上的按钮:
```jq
var deleatebutton = function (context) {
	var ui = $.summernote.ui;
	// create button
	var button = ui.button({
		contents: '<i class="fa fa-child"/> delete',
		tooltip: 'myRemoveMedia',
		click: function(){
			//源码，和默认没区别
			context.invoke('editor.removeMedia');
		}
	});

	return button.render();   // return button as jquery object
};

$('.summernote').summernote({
	popover: {
		image: [
			['remove', ['myRemoveMedia']]
		]
    },
	buttons: {
		hello: deleatebutton
	}
});
```
可以在注释处自定义图片删除按钮的用途。

##jquery-ui
jq的插件,里面有很多theme和一些小部件主要用到的是dialog<br>
导入包``meteor add linto:jquery-ui``<br>
看这里:http://www.runoob.com/jqueryui/example-datepicker.html<br>
初始化:
```jq
$('#imgBox').dialog({
	autoOpen: false, //是否自动 若为false 需要dialog('open')来控制显示
	height: $(window).height(),//高
	width:'100%',//宽
	resizable : false,//不可改变大小
	draggable: false,//不可拖动
	dialogClass: "no-content",//自定义样式
	open: function(event,ui){
		$('body').css({'overflow-y':'hidden'});
	},//打开事件
	beforeClose: function(event,ui){
		$('body').css({'overflow-y':'scroll'});
	},//关闭事件
	show: {
		effect: "fade",
		duration: 100
	},//打开动画
	hide: {
		effect: "fade",
		duration: 200
	},//关闭动画
	modal: true//背景变暗
});
```

关于垂直居中:
看这里:http://blog.csdn.net/wolinxuebin/article/details/7615098<br>

这里我们用了两中方法:<br>
内容居中:
```css
#parent {display: table;}
#child {
	display: table-cell;
	vertical-align: middle;
}
```
图片居中:大概是中心线对齐的概念
```css
#parent{
	height:100%;
	white-space: nowrap;
}
#parent:before{
	content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}
```
也可以是一个元素，也可以是伪类。子元素为要垂直居中的图片。

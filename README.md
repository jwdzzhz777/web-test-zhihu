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

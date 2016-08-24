Icons = new FS.Collection("icons", {
	stores: [
		new FS.Store.FileSystem("icon"),
		new FS.Store.FileSystem("small", {
			beforeWrite: function(fileObj) {
				// We return an object, which will change the
				// filename extension and type for this store only.
				return {
					extension: 'png',
					type: 'image/png'
				};
			},
			transformWrite: function(fileObj, readStream, writeStream) {
				// Transform the image into a 10x10px thumbnail
				gm(readStream, fileObj.name()).resize(30).stream().pipe(writeStream);
			}
		}),
		new FS.Store.FileSystem("middle", {
			beforeWrite: function(fileObj) {
				// We return an object, which will change the
				// filename extension and type for this store only.
				return {
					extension: 'png',
					type: 'image/png'
				};
			},
			transformWrite: function(fileObj, readStream, writeStream) {
				// Transform the image into a 10x10px thumbnail
				gm(readStream, fileObj.name()).resize(40).stream().pipe(writeStream);
			}
		}),
		new FS.Store.FileSystem("large", {
			beforeWrite: function(fileObj) {
				// We return an object, which will change the
				// filename extension and type for this store only.
				return {
					extension: 'png',
					type: 'image/png'
				};
			},
			transformWrite: function(fileObj, readStream, writeStream) {
				// Transform the image into a 10x10px thumbnail
				gm(readStream, fileObj.name()).resize(100).stream().pipe(writeStream);
			}
		})
    ],
    filter: {
		allow: {
			contentTypes: ['image/*'] //allow only images in this FS.Collection
		}
    }
});
/*在这个例子中，我们定义了一个名为“图像”FS.Collection，
这将是一个新的集合在你的MongoDB数据库名称为“cfs.images.filerecord”。
我们也告诉它使用文件系统存储adataper和?/上传的文件存储在本地文件系统。
如果不指定路径，一个CFS /文件在您的应用程序容器（bundle目录）文件夹，将被使用。*/

Icons.allow({
	'insert': function() {
		// add custom authentication code here
		return true;
	},
	'download': function() {
        return true;
    },
	'update': function() {
		// add custom authentication code here
		return true;
	},
	'remove': function() {
		return true;
	}
});

Meteor.methods({
	removeAllIcons: function(){
		Icons.remove({});
	}
});

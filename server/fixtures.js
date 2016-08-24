if(Posts.find().count() === 0){
	var now = new Date().getTime();
	//用户
	var tomId = Meteor.users.insert({
		profile: { name: 'Tom Coleman' }
	});
	var tom = Meteor.users.findOne(tomId);

	var andyId = Meteor.users.insert({
		profile: {name: 'andy'}
	});
	var andy = Meteor.users.findOne(andyId);

	//话题
	var root = Topics.insert({
		topic: '根话题',
		topicIcon: '/root.jpg',
		describe: '知乎的全部话题通过父子关系构成一个有根无循环的有向图。[根话题]即为所有话题的最上层的父话题。话题精华即为知乎的 Top1000 高票回答。请不要在问题上直接绑定[根话题]。',
		follow: [],
		childTopic:[]
	});

	var it = Topics.insert({
		parentTopic:[],
		topic: '互联网',
		topicIcon: '/it.jpg',
		describe: 'describe:互联网',
		peopleCounts: 1200000,
		follow: [],
		childTopic:[]
	});

	var android = Topics.insert({
		parentTopic:[it],
		topic: 'android',
		describe: 'describe:android',
		follow: [],
		topicIcon: '/android.jpg',
		childTopic:[]
	});
	Topics.update(it,{$addToSet: {childTopic: android}});

	var acg = Topics.insert({
		parentTopic:[],
		topic: '动漫',
		topicIcon: '/acg.jpg',
		describe: 'describe:游戏',
		peopleCounts: 5000000,
		follow: [],
		childTopic:[]
	});

	var game = Topics.insert({
		parentTopic:[],
		topic: '游戏',
		topicIcon: '/game.png',
		describe: 'describe:游戏',
		peopleCounts: 2400000,
		follow: [],
		childTopic:[]
	});

	var osu = Topics.insert({
		parentTopic:[acg,game],
		topic: 'osu',
		topicIcon: '/osu.png',
		describe: 'describe:osu',
		follow: [],
		peopleCounts: 1400000,
		childTopic:[]
	});

	for (var i = 0; i < 20; i++) {
		var osuchild = Topics.insert({
			parentTopic:[osu],
			topic: 'osu'+ i,
			topicIcon: '/osu.png',
			describe: 'describe:osu' + i,
			follow: [],
			childTopic:[]
		});

		Topics.update(osu,{$addToSet: {childTopic: osuchild}});
	}

	Topics.update(acg,{$addToSet: {childTopic: osu}});

	var ms = Topics.insert({
		parentTopic:[game],
		topic: '魔兽世界',
		describe: 'describe:魔兽世界',
		peopleCounts: 3600000,
		follow: [],
		topicIcon: '/wow.jpg',
		childTopic:[]
	});

	var ow = Topics.insert({
		parentTopic:[game],
		topic: 'overwatch',
		describe: 'describe:overwatch',
		peopleCounts: 6000000,
		follow: [],
		topicIcon: '/ow.jpg',
		childTopic:[]
	});

	Topics.update(game,{$addToSet: {childTopic: {$each: [osu,ms,ow]}}});

	//帖子
	var telescopeId = Posts.insert({
		topicId: [it],
		topic: it,
		title: 'IT',
		userId: tom._id,
		author: tom.profile.name,
		body: '<p>这是一个互联网的帖子</p>',
		bodyWithoutImage: '这是一个互联网的帖子',
		usedImageId: [],
		submitted: new Date(),
		commentsCount: 0,
		upvoters: [],
		votes: 0
	});

	for (var i = 0; i < 10; i++) {
		Posts.insert({
			topicId: [it],
			topic: it,
			title: '互联网#'+ i,
			userId: tom._id,
			author: tom.profile.name,
			body: '<p>互联网' + i + '互联网' + i + '互联网' + i + '互联网' + i+'</p>',
			bodyWithoutImage: '互联网' + i + '互联网' + i + '互联网' + i + '互联网' + i,
			usedImageId: [],
			submitted: new Date(now - i * 3600 * 1000),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});
	}


	Posts.insert({
		topicId: [it,android],
		topic: android,
		title: 'android',
		userId: andy._id,
		author: andy.profile.name,
		body: '<p>21321321321</p>',
		bodyWithoutImage: '21321321321',
		usedImageId: [],
		submitted: new Date(),
		commentsCount: 0,
		upvoters: [],
		votes: 0
	});

	Posts.insert({
		topicId: [ms],
		topic: ms,
		title: '魔兽',
		userId: andy._id,
		author: andy.profile.name,
		body: '<p>魔兽很好玩很好玩很好玩很好玩和文化和我和我</p>',
		bodyWithoutImage: '魔兽很好玩很好玩很好玩很好玩和文化和我和我',
		usedImageId: [],
		submitted: new Date(),
		commentsCount: 0,
		upvoters: [],
		votes: 0
	});

	for (var i = 0; i < 10; i++) {
		Posts.insert({
			topicId: [ms],
			topic: ms,
			title: '魔兽#'+i,
			userId: andy._id,
			author: andy.profile.name,
			body: '<p>魔兽'+i+'魔兽'+i+'魔兽'+i+'魔兽'+i+'</p>',
			bodyWithoutImage: '魔兽'+i+'魔兽'+i+'魔兽'+i+'魔兽'+i,
			usedImageId: [],
			submitted: new Date(now - i * 3600 * 1000),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});
	}

	Posts.insert({
		topicId: [ow],
		topic: ow,
		title: 'overwahch',
		userId: tom._id,
		author: tom.profile.name,
		body: '<p>吸毒了吸毒了吸毒了吸毒了吸毒了吸毒了吸毒了</p>',
		bodyWithoutImage: '吸毒了吸毒了吸毒了吸毒了吸毒了吸毒了吸毒了',
		usedImageId: [],
		submitted: new Date(),
		commentsCount: 0,
		upvoters: [],
		votes: 0
	});

	for (var i = 0; i < 10; i++) {
		Posts.insert({
			topicId: [ow],
			topic: ow,
			title: 'overwahch#'+i,
			userId: andy._id,
			author: andy.profile.name,
			body: '<p>overwahch'+i+'overwahch'+i+'overwahch'+i+'overwahch'+i+'</p>',
			bodyWithoutImage: 'overwahch'+i+'overwahch'+i+'overwahch'+i+'overwahch'+i,
			usedImageId: [],
			submitted: new Date(now - i * 3600 * 1000),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});
	}
}

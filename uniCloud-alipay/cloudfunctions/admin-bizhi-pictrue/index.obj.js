// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL新增
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-piclist").add(params);
	},
	async list({pegsize=10,current=1}={}){
		size = Math.min(100,pegsize);
		let skip = (current - 1)*size;
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL新增
			clientInfo:this.getClientInfo()
		})
		let picTemp = dbJOL.collection("xxm-bizhi-piclist").orderBy("sort").skip(skip).limit(size).getTemp();
		let userTemp = dbJOL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJOL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		
		return await dbJOL.collection(picTemp,userTemp,classTemp).get({getCount:true});
	}
}

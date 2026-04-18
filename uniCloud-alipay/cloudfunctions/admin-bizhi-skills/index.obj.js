let{httpsToCloud} = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL新增
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-skills").add(params);
	},
	async list({pageSize=10,current=1,classid=""}={}){
		size = Math.min(100,pageSize);
		let skip = (current - 1)*size;
		let where = {};
		if(classid){
			where.classid = classid;
		}
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL查询
			clientInfo:this.getClientInfo()
		})
		let skillTemp = dbJOL.collection("xxm-bizhi-skills").where(where).orderBy("sort").skip(skip).limit(size).getTemp();
		let userTemp = dbJOL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJOL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		
		return await dbJOL.collection(skillTemp,userTemp,classTemp).get({getCount:true});
	},
	async remove(ids = []){
        const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data} = await dbJQL.collection("xxm-bizhi-skills")
		.where(`_id in(${JSON.stringify(ids)})`).get();
		let urls = data.filter(item => item.picurl).map(item => httpsToCloud(item.picurl));
		let deleteFilePromise = urls.length > 0 ? uniCloud.deleteFile({
			fileList:urls
		}) : Promise.resolve();
		let removePromise = await dbJQL.collection("xxm-bizhi-skills")
		.where(`_id in(${JSON.stringify(ids)})`).remove();
		let [,result] = await Promise.all([deleteFilePromise,removePromise]);
		return result;
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-skills").doc(id)
		.field("_id,name,classid,description,sort,picurl,power,cost")
		.get({getOne:true});
	},
	async update(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		const {_id, ...updateData} = params;
		return await dbJQL.collection("xxm-bizhi-skills").doc(_id).update(updateData);
	}
}

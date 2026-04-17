let{httpsToCloud} = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL新增
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-piclist").add(params);
	},
	async list({pegsize=10,current=1,classid="",_id=""}={}){
		size = Math.min(100,pegsize);
		let skip = (current - 1)*size;
		let where = {};
		if(classid){
			where.classid = classid;
		}
		if(_id){
			where._id = _id;
		}
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL查询
			clientInfo:this.getClientInfo()
		})
		let picTemp = dbJOL.collection("xxm-bizhi-piclist").where(where).orderBy("sort").skip(skip).limit(size).getTemp();
		let userTemp = dbJOL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJOL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		
		return await dbJOL.collection(picTemp,userTemp,classTemp).get({getCount:true});
	},
	async remove(ids = []){
        const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data} = await dbJQL.collection("xxm-bizhi-piclist")
		.where(`_id in(${JSON.stringify(ids)})`).get();
		let urls = data.map(item => httpsToCloud(item.picurl));
		let deleteFilePromise = await uniCloud.deleteFile({
			fileList:urls
		})
		let removePromise = await dbJQL.collection("xxm-bizhi-piclist")
		.where(`_id in(${JSON.stringify(ids)})`).remove();
		let [,result] = await Promise.all([deleteFilePromise,removePromise]);
		return result;
	},
	async update(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		const {_id, ...updateData} = params;
		return await dbJQL.collection("xxm-bizhi-piclist").doc(_id).update(updateData);
	}
	
}

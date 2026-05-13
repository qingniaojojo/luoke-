let{httpsToCloud} = require("custom-utils");

module.exports = {
	_before: function () {

	},
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-activity-banner").add(params);
	},
	async list(){
		const dbJOL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-activity-banner").orderBy("sort asc").get()
	},
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data} = await dbJQL.collection("xxm-activity-banner")
		.where(`_id in ${JSON.stringify(ids)}`).get();
		let urls = data.filter(item => item.picurl).map(item => httpsToCloud(item.picurl));
		let deleteFilePromise = urls.length > 0 ? uniCloud.deleteFile({
			fileList:urls
		}) : Promise.resolve();
		let removePromise = await dbJQL.collection("xxm-activity-banner")
		.where(`_id in ${JSON.stringify(ids)}`).remove();
		let [,result] = await Promise.all([deleteFilePromise,removePromise]);
		return result;
	},
	async item(id){
		const dbJOL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-activity-banner").doc(id)
		.field("_id,picurl,url,sort,checked,target,appid")
		.get({getOne:true})
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJOL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
	})
		return await dbJOL.collection("xxm-activity-banner").doc(_id).update({...data,createTime:Date.now()})
	}
}

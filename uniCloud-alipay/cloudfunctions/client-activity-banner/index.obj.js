module.exports = {
	_before: function () {
	},
	async list(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-activity-banner").where({checked:true}).orderBy("sort").get();
	}
}

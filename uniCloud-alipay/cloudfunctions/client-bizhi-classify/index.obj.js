// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () {
	},
	async list({classid="",_id="",page=1,pageSize=12}={}){
		let where = {};
		if(classid){
			where.$or=[
				{ classid: classid },
				{ Fsxid: classid }
			];
		}
		if(_id){
			where._id = _id;
		}
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let skip = (page - 1) * pageSize;//跳过数量
		let picTemp = dbJQL.collection("xxm-bizhi-piclist").where(where).field("_id,picurl,classid,Fsxid,sort,cwname").orderBy("sort").skip(skip).limit(pageSize).getTemp();
		let classTemp =	dbJQL.collection("xxm-bizhi-classify").field("_id,name,picurl").getTemp();
		return await dbJQL.collection(picTemp,classTemp).get({getCount:true});
	}
}

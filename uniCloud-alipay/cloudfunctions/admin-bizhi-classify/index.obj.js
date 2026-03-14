// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	//UniCloud云函数中使用JQL进行数据库操作的方法
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL查询
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-classify").add(params);
	}
	
}

const { addListener } = require("cluster");

module.exports = {
	_before: function () { // 通用预处理器

	},
	//UniCloud云函数中使用JQL进行数据库操作的方法
	async add(params={}){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL新增
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-classify").add(params);
	},
	async list(){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL查询
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-classify").orderBy("sort asc").get()
	},
	async remove(ids = []){
		const dbJOL = uniCloud.databaseForJQL({//创建一个JQL数据库对象,用于执行JQL删除
			clientInfo:this.getClientInfo()
		})
		return await dbJOL.collection("xxm-bizhi-classify").where(`_id in ${JSON.stringify(ids)}`).remove();//删除的写法要注意
		
	}
}

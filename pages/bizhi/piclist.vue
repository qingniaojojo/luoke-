<template>
	<view class="piclist">
		<custom-head-top>
			<template #left>
				宠物列表
			</template>
			
			<template #right>
				<uni-data-select style="width: 200px;" placeholder="选择分类"></uni-data-select>
				<button type="primary" size="mini" @click="handleAPP">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增宠物
				</button>
			</template>
		</custom-head-top>
	</view>
	<view class="main">
		<uni-table border stripe emptyText="暂无更多数据">
			<uni-tr class="table">
				<uni-th align="left" width="100px">发布人</uni-th>
				<uni-th align="left"width="60px">排序</uni-th>
				<uni-th align="left" width="100px">缩略图</uni-th>
				<uni-th align="left"width="100px">宠物名称</uni-th>
				<uni-th align="left"width="100px">属性名称</uni-th>
				<uni-th align="left"width="100px">副属性名称</uni-th>
				<uni-th align="left"width="100px">特性图片</uni-th>
				<uni-th align="left"width="100px">特性详情</uni-th>
				<uni-th align="left" width="80px">物攻值</uni-th>
				<uni-th align="left" width="80px">魔攻值</uni-th>
				<uni-th align="left" width="80px">物防值</uni-th>
				<uni-th align="left" width="80px">魔防值</uni-th>
				<uni-th align="left" width="80px">生命值</uni-th>
				<uni-th align="left" >速度值</uni-th>
				<uni-th align="right" width="200px">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="item in piclist" :key="item._id">
				<uni-td >{{ item.user_id[0].nickname }}</uni-td>
				<uni-td >{{ item.sort }}</uni-td>
				<uni-td class="thumb"><image :src="item.picurl" mode="aspectFill"></image></uni-td>
				<uni-td >{{ item.name }}</uni-td>
				<uni-td >{{ item.classid[0].name }}</uni-td>
				<uni-td >{{ item.Fsxid[0].name }}</uni-td>
				<uni-td class="thumb"><image :src="item.txzimg" mode="aspectFill"></image></uni-td>
				<uni-td >{{ item.description }}</uni-td>
				<uni-td >{{ item.p_at }}</uni-td>
				<uni-td >{{ item.m_at }}</uni-td>	
				<uni-td >{{ item.p_def }}</uni-td>
				<uni-td >{{ item.m_def }}</uni-td>
				<uni-td >{{ item.hp }}</uni-td>
				<uni-td >{{ item.spd }}</uni-td>
				<uni-td width="200px">
					<view class="operate-btn-group">
							<button size="mini" type="primary" plain @click="update(item._id)">修改</button>
							<button size="mini" type="warn" plain @click="remove(item._id)">删除</button><!-- 删除按钮点击时调用remove函数，传入分类id,item._id是分类id -->
						</view>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
	<view class="paging">
		<uni-pagination :current="params.current"
		:total="params.total"
		:page-size="params.pageSize"
		:show-icon="true" @change="changePage"/>	
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { routerTo } from '../../utils/common';
const picCloudObj = uniCloud.importObject("admin-bizhi-pictrue");
const piclist = ref([]);
const params = ref({
	current:1,
	pageSize:10,
	total:0,
})
const changePage = (e)=>{
	params.value.current = e.current;
	getData();
}
const handleAPP = ()=>{
	routerTo("/pages/bizhi/picadd")
}
//获取宠物列表
const getData = async ()=>{
	let {errCode,errMsg,data,count} = await picCloudObj.list(params.value);
	piclist.value = data;
	params.value.total = count;
	console.log(data);
}
const update = (id)=>{

}
const remove = (id)=>{

}
getData();
</script>

<style lang="scss">
.main{
	padding: 20px;
	.thumb{
			image{
				width: 100px;
				height: 100px;
			}
		}
}
</style>
<template>
	<view class="piclist">
		<custom-head-top>
			<template #left>
				宠物列表
			</template>
			
			<template #right>
				<uni-data-select style="width: 200px;" ref="selectRef" @change="classifyChange" collection ="xxm-bizhi-classify" 
					field="_id as value, name as text,sort" 
					:where='`enable == true && name!="无属性"`'
					orderby="sort asc"
					clear
					v-model="selectvalue"
					></uni-data-select>
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
				<uni-th align="left" width="80px">速度值</uni-th>
				<uni-th align="left" width="120px">查看技能</uni-th>
				<uni-th align="right" width="200px">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="item in piclist" :key="item._id">
				<uni-td >{{ item.user_id[0].nickname }}</uni-td>
				<uni-td >{{ item.sort }}</uni-td>
				<uni-td class="thumb"><image @click="previewImg(item.picurl)" :src="item.picurl" mode="aspectFill"></image></uni-td>
				<uni-td >{{ item.cwname }}</uni-td>
				<uni-td >{{ item.classid[0].name }}</uni-td>
				<uni-td >{{ item.Fsxid[0].name }}</uni-td>
				<uni-td class="thumb"><image @click="previewImg(item.txzimg)" :src="item.txzimg" mode="aspectFill"></image></uni-td>
				<uni-td >{{ item.description }}</uni-td>
				<uni-td >{{ item.p_at }}</uni-td>
				<uni-td >{{ item.m_at }}</uni-td>	
				<uni-td >{{ item.p_def }}</uni-td>
				<uni-td >{{ item.m_def }}</uni-td>
				<uni-td >{{ item.hp }}</uni-td>
				<uni-td >{{ item.spd }}</uni-td>
				<uni-td >
					<button size="mini" type="primary" plain @click="handleSkill(item)">查看技能</button>
				</uni-td>
				<uni-td width="200px">
					<view class="operate-btn-group">
						<button :disabled="!hasPermission('UPDATE_PERMISSION')" size="mini" type="primary" plain @click="update(item._id)">修改</button>
						<button :disabled="!hasPermission('DELETE_PERMISSION')" size="mini" type="warn" plain @click="remove(item._id)">删除</button><!-- 删除按钮点击时调用remove函数，传入分类id,item._id是分类id -->
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
	<petSkillsPopup ref="petSkillsPopupRef" :petName="currentPetName"></petSkillsPopup>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { routerTo, showModal,showToast,previewImg ,hasPermission} from '../../utils/common';
import petSkillsPopup from "./children/petSkillsPopup.vue";
const picCloudObj = uniCloud.importObject("admin-bizhi-pictrue");
const selectvalue = ref("");//用于存储分类选择器的值
const selectRef = ref(null);//用于清空分类选择器的值时调用clearVal方法
const petSkillsPopupRef = ref(null);//用于调用petSkillsPopup组件的方法
const piclist = ref([]);
const currentPetName = ref('');
const params = ref({
	current:1,//当前页码
	pageSize:10,//每页显示数量
	total:0,//总页数
	classid:"",//分类id
})
onMounted(()=>{
	selectRef.value.clearVal();
});
// 分类选择器改变时调用
const classifyChange = (e)=>{
	params.value.classid = e;
	getData();
}
//分页
const changePage = (e)=>{
	params.value.current = e.current;
	getData();
}
//跳转新增宠物
const handleAPP = ()=>{
	routerTo("/pages/bizhi/picadd")
}
//获取宠物列表
const getData = async ()=>{
	let {errCode,errMsg,data,count} = await picCloudObj.list(params.value);
	piclist.value = data;
	params.value.total = count;
}
const update = (id)=>{
	uni.navigateTo({
		url: '/pages/bizhi/picedit?id=' + id//跳转修改宠物页面，传入宠物id。
		})
}
const remove = async (id)=>{
	try{
		let feedback = await showModal({content:"确认删除该宠物吗？"})
		if(feedback!=='confirm') return;//如果用户点击了取消按钮，提示删除取消
		uni.showLoading({mask:true});//加载时不能点击其他操作，不显示loading动画
		let {errCode,errMsg} = await picCloudObj.remove([id]);//调用云函数remove删除宠物，数据库删除宠物
		if(errCode!==0)  return showToast({"title":errMsg});//如果删除宠物失败，提示错误信息
		getData();//刷新宠物列表
	}catch(err){
		showToast({"title":err});
	}
	
}
//查看技能
const handleSkill = (item) => {
	currentPetName.value = item.cwname;
	const skillIds = (item.skills || []).filter(id => id);
	petSkillsPopupRef.value.open(skillIds);
}
getData();
</script>

<style lang="scss">
.main{
	padding: 20px;
	.thumb{
			image{
				width: 60px;
				height: 60px;
			}
		}
}
</style>
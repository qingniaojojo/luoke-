<template>
	<view class="banner">
		<custom-head-top>
			<template #left>
				海报管理
			</template>
			
			<template #right>
				<button type="primary" size="mini" @click="handleAPP">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增海报
				</button>
			</template>
		</custom-head-top>

		<view class="main">
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr class="table">
					<uni-th align="center" width="200px">缩略图</uni-th>
					<uni-th align="left" width="80px">排序</uni-th>
					<uni-th align="left" width="150px">跳转地址</uni-th>
					<uni-th align="left" width="100px">跳转方式</uni-th>
					<uni-th align="left" width="100px">appid</uni-th>
					<uni-th align="left" width="100px">是否启用</uni-th>
					<uni-th align="left" width="150px">发布时间</uni-th>
					<uni-th align="right" width="100px">操作</uni-th>
				</uni-tr>
				<uni-tr class="table" v-for="item in bannerData" :key = "item._id">
					<uni-td>
						<image class="thumb" :src="item.picurl" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.sort}}</uni-td>
					<uni-td>{{item.url}}</uni-td>
					<uni-td>
						<uni-tag v-if="item.target==='self'" text="站内" inverted type="primary" />
						<uni-tag v-else text="站外" inverted type="error" />
					</uni-td>
					<uni-td>{{item.appid}}</uni-td>
					<uni-td>
						<switch :checked="item.checked" style="transform:scale(0.6);transform-origin: left center;" @change="checkedChange($event,item._id)"/>
					</uni-td>
					<uni-td>{{formatTime(item.createTime)}}</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button :disabled="!hasPermission('UPDATE_PERMISSION')" size="mini" type="primary" plain @click="update(item._id)">修改</button>
							<button :disabled="!hasPermission('DELETE_PERMISSION')" size="mini" type="warn" plain @click="remove(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<bannerPopup ref="bannerPopRef" :item="item" :type="type" @success="getBanner()" :maxSort= "bannerData[bannerData.length-1]?.sort"> </bannerPopup>
	</view>
</template>

<script setup>
import { ref } from "vue";
import bannerPopup from "./children/bannerPopup.vue"
import { showModal,showToast,hasPermission } from "../../utils/common";
import dayjs from "dayjs";
const bannerCloudObj = uniCloud.importObject("admin-activity-obj",{customUI:true})
const bannerPopRef = ref(null);
const item = ref({});
const bannerData = ref([]);
const type =ref("add");

const handleAPP = ()=>{
	type.value = 'add';
	bannerPopRef.value.open();
}

const getBanner = async()=>{
	let {errCode,errMsg,data} = await bannerCloudObj.list();
	if(errCode!==0) return showToast({title:errMsg});
	bannerData.value = data;
}

const remove = async(id)=>{
	try{
		let feedback = await showModal({content:"是否确认删除？"})
		if(feedback!=='confirm') return showToast({title:"删除取消"});
		let {errCode,errMsg} = await bannerCloudObj.remove([id]);
		if(errCode!==0) showToast({title:errMsg});
		showToast({title:"删除成功"});
		getBanner();
	}catch(err){
		console.log(err);
	}
}

const update = async(id)=>{
	try{
		let {data,errCode,errMsg} = await bannerCloudObj.item(id);
		if(errCode!==0) return showToast({title:errMsg,showCancel:false});
		item.value = data;
		type.value = 'update';
		bannerPopRef.value.open();
	}catch(err){
		console.log(err);
	}
	
}

const checkedChange = async(e,id)=>{
	try{
		uni.showLoading({mask:true});
		let {errCode,errMsg} =  await bannerCloudObj.update({_id:id,checked:e.detail.value});
		if(errCode!==0) return showToast({title:errMsg});
		getBanner();
	}catch(err){
		console.log(err);
	}finally{
		uni.hideLoading();
	}
	
}

const formatTime = (timestamp) => {
	if(!timestamp) return '';
	return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

getBanner();	
</script>

<style lang="scss" scoped>
.main{
	padding: 10px;
	.thumb{
		width: 160px;
		height: 90px;
		border-radius: 3px;
		overflow: hidden;
		
		image{
			width: 100%;
			height: 100%;
		}
	}
}
</style>

<template>
	<uni-popup ref="BannerPopup" type="center" :is-mask-click="false">
		<view class="BannerPopup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="缩略图">
					<view class="picGroup">
						<view class="box add" v-if="!formData.tempurl" @click="selectPicurl">
							<uni-icons type="plusempty" size="30" color="#888"></uni-icons>
						</view>
						<view class="box pic" v-else>
							<image :src="formData.tempurl" mode="aspectFit"></image>
							<view class="mask">
								<view class="icon">
									<uni-icons type="compose" size="20" color="#fff"></uni-icons>
								</view>
								<view class="icon" @click="delImg">
									<uni-icons type="trash" size="20" color="#fff"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="跳转地址" name="url">
					<uni-easyinput type="text" v-model="formData.url" placeholder="请输入跳转地址" />
				</uni-forms-item>
				<uni-forms-item label="跳转方式" name="target">
					<uni-data-select v-model="formData.target" :localdata="targetOptions" placeholder="请选择跳转方式"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="appid" name="appid" v-if="formData.target==='miniprogram'">
					<uni-easyinput type="text" v-model="formData.appid" placeholder="请输入外站appid" />
				</uni-forms-item>
				<uni-forms-item label="是否启用" name="checked">
					<switch v-model="formData.checked" :checked="formData.checked" style="transform:scale(0.6);transform-origin: left center;" @change="checkedChange"/>
				</uni-forms-item>
				<uni-forms-item label="" name="sort">
					<view class="group">
						<button size="mini" type="primary" @click="submit">{{typename}}</button>
						<button size="mini" type="default" @click="close">取消</button>
					</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, onUnmounted,watch, computed, nextTick} from 'vue';
import {cloudToHttps,convertBlobUrlToWebP} from "@/utils/tools.js";
import dayjs from "dayjs";
import { showToast } from '../../../utils/common';
const emits = defineEmits(["success"]);
const props = defineProps(["item","type","maxSort"]);
const bannerCloudObj = uniCloud.importObject("admin-activity-obj",{customUI:true});
const typename = computed(()=>props.type=='add'?'新增':'修改')
onUnmounted(() => {
  if (formData.value.tempurl) {
    URL.revokeObjectURL(formData.value.tempurl);
  }
});
const formRef = ref(null);
const BannerPopup = ref(null);

const formData = ref({
	sort:0,
	checked:true,
	target:"self",
	appid:"",
	url:"",
	picurl: "",
	tempurl:""
})

const targetOptions = ref([
	{value:"self",text:"站内"},
	{value:"miniprogram",text:"站外"}
])

watch(()=>props.item, (nv) => {
   formData.value = {
	...nv,
	tempurl:nv.picurl
};
});

const rules = ref({})

const submit = async()=>{
	try{
		uni.showLoading({mask:true})
		if (formData.value.tempurl && formData.value.tempurl != formData.value.picurl){
			let file = await uploadFile();
			formData.value.picurl = cloudToHttps(file.fileID);
      		URL.revokeObjectURL(formData.value.tempurl);
    	}
		let {tempurl,...params} = formData.value;
		let {errCode,errMsg} = props.type=='add' ? 
		await bannerCloudObj.add(params) : 
		await bannerCloudObj.update(params);
		if(errCode!==0) return showToast({title:errMsg});
		showToast({title:typename.value+"成功"});
		close();
		init();
		emits("success",{msg:typename.value+"成功~~"});
	}catch(err){
		console.log(err);
		showToast({title:err});
	}finally{
		uni.hideLoading();
	}
}

const uploadFile = async()=>{
	let tempurl = await convertBlobUrlToWebP(formData.value.tempurl);
	return await uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath:"banner/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".webp"
	})
}

const selectPicurl = ()=>{
	uni.chooseImage({
		count:1,
		success:res=>{
			formData.value.tempurl = res.tempFilePaths[0]
		}
	})
}
const delImg = ()=>{
  	if (formData.value.tempurl) {
    	URL.revokeObjectURL(formData.value.tempurl);
  	}
	formData.value.tempurl = ''
	formData.value.picurl = ''
}

const checkedChange = (e)=>{
	formData.value.checked = e.detail.value
}

const open =()=>{
	nextTick(()=>{
		if(props.type == 'add') formData.value.sort = props.maxSort+1
	})
	BannerPopup.value.open();
}
const close = ()=>{
  	if (formData.value.tempurl) {
    	URL.revokeObjectURL(formData.value.tempurl);
  	}
	BannerPopup.value.close();
	init();
}

const init =()=>{
	formData.value = {
		sort:0,
		checked:true,
		target:"self",
		appid:"",
		url:"",
		picurl: "",
		tempurl:""
	}
}

defineExpose({
	open
})
</script>

<style lang="scss" scoped>
.BannerPopup{
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding:50px 50px 50px 0px;
	.group{
		display: flex;
		justify-content: start;
		gap: 20px;
		button{
			margin: 0;
			width:130px;
		}
	}
	.picGroup{
		.box{
			width: 160px;
			aspect-ratio: 16 / 9;
			border: 1px solid #e4e4e4;
			border-radius: 10px;
			overflow: hidden;
		}
		.add{
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
		.pic{
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.mask{
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 30px;
				background: rgba(0,0,0,0.4);
				display: flex;
				align-items: center;
				justify-content: center;
				.icon{
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
			}
		}
	}
}	       
</style>

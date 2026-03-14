<template>
		<!-- 分类管理弹窗组件，type="center"表示居中显示 -->
	<uni-popup ref="ClassifyPopup" type="center" :is-mask-click="false">
		<!-- 弹窗内容区域 -->
		<view class="ClassifyPopup">
			<!-- 分类表单 定义ref是为了拿到表单-->
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
					<!-- 分类名称输入框 -->
					<uni-forms-item label="名称" name="name" required><!-- required是必填的*号 -->
						<uni-easyinput type="text" v-model="formData.name" placeholder="请输入属性名称" />
					</uni-forms-item>
					<!-- 排序输入框 -->
					<uni-forms-item label="排序" name="sort">
						<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
					</uni-forms-item>
					<!-- 缩略图上传，不校验不用加name -->
					<uni-forms-item label="缩略图">
							<view class="picGroup">
								<!-- 添加图片按钮，当没有临时图片时显示 -->
								<view class="box add" v-if="!formData.tempurl" @click="selectPicurl">
									<uni-icons type="plusempty" size="30" color="#888"></uni-icons>
								</view>
								<!-- 图片预览区域，当有临时图片时显示 -->
								<view class="box pic" v-else>
									<image :src="formData.tempurl" mode="aspectFit"></image>
									<!-- 图片操作遮罩层 -->
									<view class="mask">
										<!-- 编辑图标 -->
										<view class="icon">
											<uni-icons type="compose" size="20" color="#fff"></uni-icons>
										</view>
										<!-- 删除图标 -->
										<view class="icon" @click="delImg">
											<uni-icons type="trash" size="20" color="#fff"></uni-icons>
										</view>
									</view>
								</view>
								
						</view>
					</uni-forms-item>
						<!-- 是否推荐开关 -->
					<uni-forms-item label="是否推荐" name="select">
						<switch v-model="formData.select" style="transform:scale(0.6);transform-origin: left center;" @change="selectChange"/>
						<!-- "selectChange"和"enableChange"监听 switch 组件的状态变化事件 -->
					</uni-forms-item>
						<!-- 是否启用开关 -->
					<uni-forms-item label="是否启用" name="enable">
						<switch v-model="formData.enable" style="transform:scale(0.6);transform-origin: left center;" @change="enableChange"/>
					</uni-forms-item>
						<!-- 操作按钮组 -->
					<uni-forms-item label="" name="sort">
						<view class="group">
							<button size="mini" type="primary" @click="submit">确认</button>
							<button size="mini" type="default" @click="close">取消</button>
						</view>
					</uni-forms-item>
					
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, onUnmounted} from 'vue';//引入ref，以及onUnmounted生命周期
import {cloudToHttps,convertBlobUrlToWebP} from "@/utils/tools.js";//用来导入压缩图片功能的云函数的方法
import dayjs from "dayjs";//导入dayjs
import { showToast } from '../../../utils/common';
const emits = defineEmits(["success"]);//常量起名emits，定义事件（名称success），用于子组件向父组件通信
const classifyCloundObj = uniCloud.importObject("admin-bizhi-classify",{customUI:true});//导入云函数对象，用于调用云函数.{customUI:true}关闭云对象的loading加载
onUnmounted(() => {
  if (formData.value.tempurl) {// 组件卸载时释放内存，避免内存泄漏
    URL.revokeObjectURL(formData.value.tempurl);
  }
});
const formRef = ref(null);//点击确认按钮时进行校验
const ClassifyPopup = ref(null);// 创建弹窗组件的响应式引用，用于操作弹窗

// 分类表单数据
const formData = ref({
	name:"",
	sort:0,// 排序值，数字越大越靠前
	select:false,
	enable:false,
	picurl: "",// 图片上传后的云存储URL
	tempurl:""// 图片临时路径，用于预览
})

const rules = ref({//校验规则必须写名字  先执行 submit 函数，然后在 submit 函数内部触发对 rules 的验证
	name:{
		rules:[
			// 校验 name 不能为空
			{
				required: true,//必填验证，提示"请填写属性"
				errorMessage: '请填写属性',
			},
			// 对name字段进行长度验证
			{
				minLength: 2,
				maxLength: 8,
				errorMessage: '{label}名称长度在 {minLength} 到 {maxLength} 个字符例如“火系”',
			}
		],
		label:"属性"//定义label属性的名称，它和rules一个等级
	}
})
const submit = async()=>{//使用 async/await 处理异步验证
	try{//验证通过执行 try 块，失败执行 catch 块。
		uni.showLoading({mask:true})//加载的动态图，确保在没有上传完，不能对页面进行任何操作
		await formRef.value.validate();// 触发表单验证（formRef.value.validate() 触发所有字段的验证）
		//validate是uni-forms 组件内置的验证方法
		let file = await uploadFile();//上传图片到云端的按钮处理
		formData.value.picurl = cloudToHttps(file.fileID);//将上传到云端的图片路径转换为https格式
		// 上传成功后释放内存
    	if (formData.value.tempurl) {//如果有临时图片路径
      		URL.revokeObjectURL(formData.value.tempurl);//释放内存，避免内存泄漏
    	}
		
		let {tempurl,...params} = formData.value;// 从 formData.value 中解构出 tempurl 字段,也就是剥离出来tempurl 字段，将剩余字段赋值给 params
		let {errCode,errMsg} = await classifyCloundObj.add(params);//调用云数据库对象的add方法，将想要新增的数据添加到云数据库中，等待操作完成后将结果赋值给变量res。
		if(errCode!==0) return showToast({title:errMsg});//如果errCode不等于0，说明添加失败，返回错误信息
		showToast({title:"添加成功"});//添加成功后，显示toast提示
		close();//添加成功后，关闭弹窗
		init();//添加成功后，初始化(删除旧数据)分类表单数据
		emits("success",{msg:"添加成功~~"});//触发success事件，通知父组件刷新数据
	}catch(err){
		console.log(err); //捕获验证失败的错误
		showToast({title:err});//显示toast提示
	}finally{//无论try块是否有异常，finally块都会执行
		uni.hideLoading();//隐藏加载的动态图
	}
}

const uploadFile = async()=>{//上传图片到云端
	let tempurl = await convertBlobUrlToWebP(formData.value.tempurl);//将blob URL 格式的图像转换为 WebP 格式
	return await uniCloud.uploadFile({//将压缩后的图片上传到云端
		filePath: tempurl,//将压缩后的图片上传到云端
		cloudPath:"wallpaper/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".jpg"//云端地址
	})
}

// 选择图片函数，调用uniapp的图片选择API
const selectPicurl = ()=>{//()=>{}等同于function(){}
	uni.chooseImage({
		count:1,// 最多选择1张图片
		success:res=>{
			formData.value.tempurl = res.tempFilePaths[0]// 将选中的图片临时路径赋值给tempurl
		}
	})
}// 删除图片函数，清空临时图片路径
const delImg = ()=>{
	// 删除图片时释放内存
  	if (formData.value.tempurl) {
    	URL.revokeObjectURL(formData.value.tempurl);//释放内存，避免内存泄漏
  	}
	formData.value.tempurl = ''// 清空临时图片路径，隐藏图片预览
}

//是否推荐事件
const selectChange = (e)=>{//接收事件参数 e
	formData.value.select = e.detail.value//是否推荐开关状态改变时，更新formData的select属性
}//所有组件的自定义事件数据都放在detail
//是否启用事件
const enableChange = (e)=>{
	formData.value.enable = e.detail.value//是否启用开关状态改变时，更新formData的enable属性
}

//执行打开（open）方法
const open =()=>{
	ClassifyPopup.value.open();
}
//取消新增。因为取消在组件里面所以不需要暴露close，只要调用调用打开弹窗，就可以用取消弹窗
const close = ()=>{
	// 关闭弹窗前释放内存
  	if (formData.value.tempurl) {
    	URL.revokeObjectURL(formData.value.tempurl);//释放内存，避免内存泄漏
  	}
	ClassifyPopup.value.close();//关闭弹窗
}

const init =()=>{//初始化分类表单数据
	formData.value = {
		name:"",
		sort:0,// 排序值，数字越大越靠前
		select:false,
		enable:false,
		picurl: "",// 图片上传后的云存储URL
		tempurl:""// 图片临时路径，用于预览
	}
}

//暴露open方法
defineExpose({
	open
})


</script>


<style lang="scss" scoped>
.ClassifyPopup{
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
	// 图片上传区域样式
	.picGroup{
		.box{
			width: 80px;
			aspect-ratio: 1 / 1;//9比16的比例设置
			border: 1px solid #e4e4e4;
			border-radius: 10px;
			overflow: hidden;//超出隐藏
		}
		// 添加按钮样式
		.add{
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;//小手
		}
		// 图片预览样式
		.pic{
			position: relative;//相对定位，不占用文档流空间，不被元素遮挡
			image{
				width: 100%;
				height: 100%;
			}
			// 图片操作遮罩层样式
			.mask{
				position: absolute;//绝对定位，不占用文档流空间，不被元素遮挡
				bottom: 0;//距离底部0像素
				left: 0;
				width: 100%;
				height: 30px;
				background: rgba(0,0,0,0.4);//最后的0.4是透明度，值越大小，透明度越低，显示越清晰。
				display: flex;
				align-items: center;
				justify-content: center;
				// 图标样式
				.icon{
					flex: 1;//等比例分配空间，每个图标占等份
					height: 100%;//图标高度占满父容器
					display: flex;
					align-items: center;//垂直居中对齐
					justify-content: center;//水平居中对齐
					cursor: pointer;//小手
					
				}
			}
		}
	}
	
}	       
</style>

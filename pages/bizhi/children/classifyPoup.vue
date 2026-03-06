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
						<uni-easyinput type="number" v-model="formData.sort" placeholder="请输入排序" />
					</uni-forms-item>
					<!-- 缩略图上传  不校验不用加name-->
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
import { ref } from 'vue';
//点击确认按钮时进行校验
const formRef = ref(null);

// 创建弹窗组件的响应式引用，用于操作弹窗
const ClassifyPopup = ref(null);

// 分类表单数据
const formData = ref({
	name:"",
	sort:0,// 排序值，数字越大越靠前
	select:false,
	enable:false,
	picurl: "",
	tempurl:""
})

//校验规则必须写名字  先执行 submit 函数，然后在 submit 函数内部触发对 rules 的验证
const rules = ref({
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
		await formRef.value.validate();// 触发表单验证（formRef.value.validate() 触发所有字段的验证）
		//validate是uni-forms 组件内置的验证方法
		console.log(formData.value);// 验证通过后输出数据
	}catch(err){
		console.log(err); //捕获验证失败的错误
	}
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
	formData.value.tempurl = ""
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
	ClassifyPopup.value.close();
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
	.picGroup{
		.box{
			width: 80px;
			aspect-ratio: 9 / 16;//9比16的比例设置
			border: 1px solid #e4e4e4;
			border-radius: 10px;
			overflow: hidden;//超出隐藏
		}
		.add{
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;//小手
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

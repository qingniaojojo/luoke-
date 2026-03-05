<template>
		<!-- 分类管理弹窗组件，type="center"表示居中显示 -->
	<uni-popup ref="ClassifyPopup" type="center" :is-mask-click="false">
		<!-- 弹窗内容区域 -->
		<view class="ClassifyPopup">
			<!-- 分类表单 -->
			<uni-forms :modelValue="formData" label-align="right" :label-width="100">
					<!-- 分类名称输入框 -->
					<uni-forms-item label="名称" name="name">
						<uni-easyinput type="text" v-model="formData.name" placeholder="请输入属性名称" />
					</uni-forms-item>
					<!-- 排序输入框 -->
					<uni-forms-item label="排序" name="sort">
						<uni-easyinput type="number" v-model="formData.sort" placeholder="请输入排序" />
					</uni-forms-item>
					<!-- 缩略图上传 -->
					<uni-forms-item label="缩略图" name="sort">
							
					</uni-forms-item>
						<!-- 是否推荐开关 -->
					<uni-forms-item label="是否推荐" name="select">
						<switch v-model="formData.select" style="transform:scale(0.6);transform-origin: left center;"/>
					</uni-forms-item>
						<!-- 是否启用开关 -->
					<uni-forms-item label="是否启用" name="enable">
						<switch v-model="formData.enable" style="transform:scale(0.6);transform-origin: left center;"/>
					</uni-forms-item>
						<!-- 操作按钮组 -->
					<uni-forms-item label="" name="sort">
						<view class="group">
							<button size="mini" type="primary">确认</button>
							<button size="mini" type="default" @click="close">取消</button>
						</view>
					</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
// 创建弹窗组件的响应式引用，用于操作弹窗
const ClassifyPopup = ref(null);
// 分类表单数据
const formData = ref({
	name:"",
	sort:0,// 排序值，数字越大越靠前
	select:false,
	enable:false
})

//执行打开（open）方法
const open =()=>{
	ClassifyPopup.value.open();
}

//取消新增
const close = ()=>{
	ClassifyPopup.value.close();
}

//暴露open方法
defineExpose({
	open,
	close
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
}	       
</style>

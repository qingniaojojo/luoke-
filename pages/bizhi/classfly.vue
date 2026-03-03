<template>
	<view class="classfly">
		<custom-head-top>
			<template #left>
				分类管理
			</template>
			
			<template #right>
				<button type="primary" size="mini" @click="handleAPP">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增分类
				</button>
				<button type="warn" size="mini">
					<uni-icons type="trash" size="14" color="#fff"></uni-icons>
					批量删除
				</button>
			</template>
		</custom-head-top>


		<view class="main">
			<uni-table border stripe emptyText="暂无更多数据" >

				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="left" width="150">缩略图</uni-th>
					<uni-th align="left">分类名称</uni-th>
					<uni-th align="left">排序</uni-th>
					<uni-th align="left">是否推荐</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="right"width="200">操作</uni-th>
				</uni-tr>

				
				<!-- 表格数据行 -->
				<uni-tr v-for="item in 5">
					<uni-td>
						<image class="thumb" src="../../static/logo.png" mode="aspectFill"></image>
					</uni-td>
					<uni-td>
						属性
					</uni-td>
					<uni-td>
						1
					</uni-td>
					<uni-td>
						<uni-tag inverted text="推荐" type="error" />
					</uni-td>
					<uni-td>
						<switch style="transform:scale(0.6);transform-origin: left center;" />
					</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain>修改</button>
							<button size="mini" type="warn" plain>删除</button>
						</view>
					</uni-td>

				</uni-tr>
			
			</uni-table>
		</view>
		

		<view class="paging">
			<uni-pagination title="标题文字" show-icon="true" total="50" current="2"></uni-pagination>
		</view>
		<!-- 分类管理弹窗组件，type="center"表示居中显示 -->
		<uni-popup ref="ClassifyPopup" type="center" :is-mask-click="false">
			<!-- 弹窗内容区域 -->
			<view class="ClassifyPopup">
				<uni-forms :modelValue="formData" label-align="right" :label-width="100">
						<uni-forms-item label="名称" name="name">
							<uni-easyinput type="text" v-model="formData.name" placeholder="请输入属性名称" />
						</uni-forms-item>
						<uni-forms-item label="排序" name="sort">
							<uni-easyinput type="number" v-model="formData.sort" placeholder="请输入排序" />
						</uni-forms-item>
				</uni-forms>
			</view>
		</uni-popup>

	</view>
</template>

<script setup>
import { ref } from 'vue';
const formData = ref({
	name:"",
	sort:0
})
// 创建弹窗组件的响应式引用，用于操作弹窗
const ClassifyPopup = ref(null)
// 点击新增分类按钮时调用，打开弹窗
const handleAPP = ()=>{
	ClassifyPopup.value.open();
}
	
</script>

<style lang="scss" scoped>
.ClassifyPopup{
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding:50px 50px 50px 0px;
}

.main{
	padding: 10px;
	.thumb{
		width: 45px;
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

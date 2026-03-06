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
					<uni-th align="left">属性名称</uni-th>
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

		<classifyPopup ref="classPopRef"> </classifyPopup><!-- 被封装的弹窗调用 -->

	</view>
</template>

<script setup>
import { ref } from "vue";
import classifyPopup from "./children/classifyPoup.vue"
const classPopRef = ref(null);
// 点击新增分类按钮时调用，打开弹窗。为了在父组件中调用子组件
const handleAPP = ()=>{
	classPopRef.value.open();
}

	
</script>

<style lang="scss" scoped>


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

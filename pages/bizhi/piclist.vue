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
			<uni-tr>
				<uni-th align="left">缩略图</uni-th>
				<uni-th align="left">属性名称</uni-th>
				<uni-th align="left">排序</uni-th>
				<uni-th align="left">是否推荐</uni-th>
				<uni-th align="left">是否启用</uni-th>
				<uni-th align="right"width="200">操作</uni-th>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script setup>
import { routerTo } from '../../utils/common';
const handleAPP = ()=>{
	routerTo("/pages/bizhi/picadd")
}
	
</script>

<style lang="scss">
.main{
	padding: 20px;
}
</style>
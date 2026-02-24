<template>
	<view class="classfly">
		<custom-head-top>
			<template #left>
				分类管理
			</template>
			
			<template #right>
				<button type="primary" size="mini">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增分类
				</button>
				<button type="warn" size="mini">
					<uni-icons type="trash" size="14" color="#fff"></uni-icons>
					批量删除</button>
			</template>
		</custom-head-top>
		<view class="main">
			<uni-table border stripe emptyText="暂无更多数据" >
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="left">缩略图</uni-th>
					<uni-th align="left">分类名称</uni-th>
					<uni-th align="left">排序</uni-th>
					<uni-th align="left">是否推荐</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="right">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr>
					<uni-td>
						<image src="../../static/logo.png" mode="aspectFill"></image>
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
						1
					</uni-td>
				</uni-tr>
			
			</uni-table>
		</view>

	</view>
</template>

<script setup>
	
</script>

<style lang="scss" scoped>
.main{
	padding: 10px;
}
</style>

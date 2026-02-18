<template>
	<view class="classfly">
		<view class="custom-head-top">
			<view class="left-top">
				<slot name="left"></slot>
			</view>
			<view class="right-top">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="scss" scoped>
.custom-head-top{
	height: 70px;
	padding: 0 20px;
	border-bottom: 1px solid #eee;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
	.left-top{
		font-size: 18px;
		font-weight: bold;
	}
	.right-top{
		display: flex;
		gap: 15px;
	}
</style>
<template>
	<view class="picadd">
		<view class="piclist">
			<custom-head-top>
				<template #left>
					新增宠物
				</template>
				
				
			</custom-head-top>
			<view class="main">
				<view class="grid">
					<view class="itemBox pic" v-for="item in 7">
						<view class="left">左图</view>
						<view class="right">右文</view>
					</view>
					<view class="itemBox add">
						<view class="icon">+</view>
						<view class="text">点击选择图片</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="scss">
.main{
	padding: 20px;
	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fill,minmax(400px,1fr));
		gap:20px;
		.itemBox{
			background: #f8f8f8;
			width: 100%;
			min-height: 300px;
			border:1px solid transparent;
			display: flex;
			align-items: start;
			padding:20px;
			
			.left{
				width: 150px;
				aspect-ratio: 9/20;
				border: 1px solid green;
			}
			.right{
				flex: 1;
				border: 1px solid red;
				margin-left: 20px;
			}
		}
		.itemBox.pic{
			
		}
		
		.itemBox.add{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: #888;
			cursor: pointer;
			.icon{
				font-size: 50px;
			}
			.text{
				font-size:20px;
				padding-top: 20px;
			}
		}
		.itemBox:hover{
			border-color: #e4e4e4;
		}
	}
}
</style>
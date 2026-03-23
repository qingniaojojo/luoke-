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
						<view class="left">
							<image src="/static/logo.png" mode="aspectFit"></image>
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
						<view class="right">
							<view class="row">
								<view class="label">宠物描述</view>
								<uni-easyinput type="textarea" placeholder="请输入宠物描述"></uni-easyinput>
							</view>
							<view class="row">
								<view class="label">评分</view>
								<uni-rate :touchable="false" allow-half :size="30"></uni-rate>
							</view>
							<view class="row">
								<view class="label">标签</view>
								<uni-easyinput placeholder="请输入标签"></uni-easyinput>
								<view class="tabGroup">
									<view class="tab">标签1</view>
								</view>
							</view>
							
						</view>
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
				background: conic-gradient(#ccc 0 25%,#fff 25% 50%,#ccc 50% 75%,#fff 75%);
				background-size: 15px 15px;
				position: relative;//定位
				image{
					width: 100%;
					height: 100%;
				}
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
					.icon{
						display: flex;
						height: 100%;
						flex: 1;
						align-items: center;
						justify-content: center;
						cursor: pointer;
					}
				}
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
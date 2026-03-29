<template>
	<view class="picadd">
		<view class="piclist">
			<custom-head-top>
				<template #left>
					新增宠物
				</template>
			</custom-head-top>
			<view class="main">
				<view class="setClassify" v-if="piclist.length">
					<uni-data-select ref="selectRef" @change="classifyChange" collection ="xxm-bizhi-classify" 
					field="_id as value, name as text,sort" 
					:where='`enable == true`'
					orderby="sort asc"
					clear
					v-model="selectvalue"
					></uni-data-select>
				</view>
				<view class="grid">
					<view class="itemBox pic" v-for="(item,index) in piclist" :key="index">
						<view class="close" @click="handleClose(index)">X</view>
						<view class="left">
							<image :src="item.tempurl" mode="aspectFit"></image>
							<view class="mask">
								<!-- 编辑图标 -->
								<view class="icon">
									<uni-icons type="compose" size="20" color="#fff"></uni-icons>
								</view>
							</view>
						</view>
						<view class="right">
							<view class="row">
								<view class="label">名称</view>
								<uni-easyinput placeholder="请输入名称"></uni-easyinput>
							</view>
							<view class="xlhfsx">
								<view class="xbox">
									<view class="xlhfsxName">序列号</view>
									<uni-easyinput type="number"></uni-easyinput>
								</view>
								<view class="xbox">
									<view class="xlhfsxName">副属性</view>
									<uni-data-select ></uni-data-select>
								</view>
							</view>
							<view class="row">
								<view class="label">宠物特性</view>
								<uni-easyinput v-model="item.description" type="textarea" placeholder="请输入宠物特性"></uni-easyinput>
							</view>
							<view class="BaseStatBox">
								<view class="baseStat">
									<view class="statItem">物攻:</view>
									<uni-easyinput class="attValue" placeholder="物攻值"></uni-easyinput>
								</view>
								<view class="baseStat">
									<view class="statItem">魔攻:</view>
									<uni-easyinput class="attValue" placeholder="魔攻值"></uni-easyinput>
								</view>
								<view class="baseStat">
									<view class="statItem">物防:</view>
									<uni-easyinput class="attValue" placeholder="魔防值"></uni-easyinput>
								</view>
								<view class="baseStat">
									<view class="statItem">魔防:</view>
									<uni-easyinput class="attValue" placeholder="速度值"></uni-easyinput>
								</view>
								<view class="baseStat">
									<view class="statItem">生命:</view>
									<uni-easyinput class="attValue" placeholder="速度值"></uni-easyinput>
								</view>
								<view class="baseStat">
									<view class="statItem">速度:</view>
									<uni-easyinput class="attValue" placeholder="速度值"></uni-easyinput>
								</view>
							</view>
							
						</view>
					</view>
					<view class="itemBox add" @click="handleSelect" v-if="piclist.length<4">
						<view class="icon">+</view>
						<view class="text">点击选择图片</view>
					</view>
					{{piclist}}
				</view>
				
				<view class="btnGroup" v-if="piclist.length">
					<button class="btn" type="primary" @click="subMit">发布</button>
					<button class="btn" type="warn" plain @click="handleReset">清空</button>
				</view>
				
			</view>
		</view>
	</view>
</template>


<script setup>
import {ref} from 'vue';
import { showModal, showToast } from '../../utils/common';
const selectvalue = ref("");
const selectRef = ref(null);//用于清空分类选择
const piclist = ref([]);//图片列表，用于存储用户选择的图片，临时存储以数组的方式存储
const handleSelect = async()=>{
	let imgs = await uni.chooseImage({
		count: 4,
	})
	let obj = {
			description:"",//宠物描述
			picurl:"",//真实图片路径
			tempurl:""//临时图片路径
	}
	piclist.value = [...piclist.value,...imgs.tempFilePaths.map(item=>({...obj,tempurl:item}))]//将用户选择的图片路径，添加到数组中,防止添加图片时把之前的图片覆盖
	console.log(piclist.value);
}

//移除选择
const handleClose = async(index)=>{
	let feedback = await showModal({content:"是否删除"});
	if(feedback == "confirm") piclist.value.splice(index,1);
	
}

//清空所有
const handleReset =async()=>{
	let feedback = await showModal({content:"是否清空"});
	if(feedback == "confirm") piclist.value=[];
}

//提交
const subMit=()=>{
	if(!selectvalue.value) return showToast({title:"分类必须选择"})
	let desRes = piclist.value.every(item=>item.description)
	if(!desRes) return showToast({title:"特性不能为空"})
	//可以定义其他变量不能为空 
	selectRef.value.clearVal();//清空分类选择，clearVal是自带方法
}

//选择分类
const classifyChange =(e)=>{
	piclist.value.forEach(iteam=>{
		iteam.classid =e
	})
}
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
			padding:10px;
			position: relative;
			.close{
				position: absolute;
				cursor: pointer;
				right: 0;
				top: 0;
				width: 30px;
				height: 30px;
				background: #E43D33;
				color: #FFF;
				display: none;
				align-items: center;
				justify-content: center;
			}
			
			.left{
				width: 140px;
				aspect-ratio: 9/16;
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
				margin-left: 20px;
				.xlhfsx{
					display: grid;
					align-items: center;
					justify-content: center;
					grid-template-columns: repeat(2,1fr);
					gap: 10px;
					width: 100%;
					margin: 5px 0 5px 0;
					.xbox{
						display: flex;
						font-size: 16px; 
						align-items: center;
						width: 100%;
					}
					
				}
				.BaseStatBox{
					display: grid;
					align-items: center;
					justify-content: center;
					grid-template-columns: repeat(3,1fr);
					gap: 2px;
					width: 100%;
					.baseStat{
						display: flex;
						font-size: 14px; 
						align-items: center;
						width: 100%;
						.statItem{
							flex: 0 0 32px;
							margin-right: 5px;
						}
						.attValue{
							margin-right: 10px;
							flex: 0 0 75px;
						}
					}
				}
			}
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
			.close{
				display: flex;
			}
		}
	}
	.setClassify{
		padding: 0 0 16px 0;
		width: 200px;
	}
	.btnGroup{
		display: flex;
		padding: 10px 0;
		margin: 0;
		button{
			width: 150px;
		}
		button:first-child{
		margin-right: 10px; /* 调整按钮之间的间距 */
		}	
	}
}
</style>
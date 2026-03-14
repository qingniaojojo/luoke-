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
				<uni-tr v-for="item in classData" :key = "item_id"><!-- 为什么是item_什么 -->
					<uni-td>
						<image class="thumb" :src="item.picurl" mode="aspectFill"></image>
					</uni-td>
					<uni-td>
						{{item.name}}
					</uni-td>
					<uni-td>
						{{item.sort}}
					</uni-td>
					<uni-td>
						<uni-tag v-if="item.select"  text="推荐" inverted type="error" />
						<uni-tag v-else text="普通" inverted/>
					</uni-td>
					<uni-td>
						<switch :checked="item.enable" style="transform:scale(0.6);transform-origin: left center;" />
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
			<!-- <uni-pagination title="标题文字" show-icon="true" total="3" current="2"></uni-pagination>-->
		</view>

		<classifyPopup ref="classPopRef" @success="getClassify()"> </classifyPopup><!-- 被封装的弹窗调用 新增分类弹窗成功后(触发success事件)，刷新分类列表(用getClassify())-->


	</view>
</template>

<script setup>
import { ref } from "vue";//引入vue的ref函数
import classifyPopup from "./children/classifyPoup.vue"//引入新增分类弹窗组件
import { showToast } from "../../utils/common";//引入提示函数
const classifyCloudObj = uniCloud.importObject("admin-bizhi-classify")//拿取云对象
const classPopRef = ref(null);//新增分类弹窗引用
const classData = ref([]);//分类列表数据
// 点击新增分类按钮时调用，打开弹窗。为了在父组件中调用子组件
const handleAPP = ()=>{//新增分类
	classPopRef.value.open();//打开新增分类弹窗
}

const getClassify = async()=>{//获取分类列表
	let {errCode,errMsg,data} = await classifyCloudObj.list();//调用云函数list
	if(errCode!==0) return showToast({title:errMsg});//如果获取分类列表失败，提示错误信息
	classData.value = data;//将获取到的分类列表赋值给classData
	console.log(data);
}

getClassify();	
</script>

<style lang="scss" scoped>


.main{//分类列表主容器
	padding: 10px;//分类列表主容器内边距
	.thumb{//分类列表缩略图
		width: 70px;
		height: 70px;
		border-radius: 3px;
		overflow: hidden;//分类列表缩略图超出部分隐藏
		
		image{//分类列表缩略图图片
			width: 100%;
			height: 100%;
		}
	}
}
</style>

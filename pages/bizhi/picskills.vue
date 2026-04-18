<template>
	<view class="picadd">
        <view class="piclist">
            <custom-head-top>
                <template #left>
                    宠物技能
                </template>

                <template #right>
				    <uni-data-select style="width: 200px;" ref="selectRef" @change="classifyChange" collection ="xxm-bizhi-classify" 
					field="_id as value, name as text,sort" 
					:where='`enable == true && name!="无属性"`'
					orderby="sort asc"
					clear
					v-model="selectvalue"
					></uni-data-select>
				    <button type="primary" size="mini" @click="handleAPP">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增技能
				    </button>
                </template>
            </custom-head-top>
        </view>
    </view>
    <view class="main">
        <uni-table border stripe emptyText="暂无更多数据">
			<uni-tr class="table">
				<uni-th align="center" width="80px">发布人</uni-th>
				<uni-th align="left"width="80px">排序</uni-th>
                <uni-th align="left" width="80px">属性</uni-th>
				<uni-th align="left" width="80px">技能图片</uni-th>
				<uni-th align="left"width="100px">技能名称</uni-th>
				<uni-th align="left"width="500px">技能详情</uni-th>
				<uni-th align="left"width="50px">威力</uni-th>
				<uni-th align="left" width="50px">消耗</uni-th>
				<uni-th align="right" >操作</uni-th>
			</uni-tr>
            <uni-tr v-for="item in 6" :key="item._id">
                <uni-td align="center">张三</uni-td>
                <uni-td>999</uni-td>
                <uni-td>无属性</uni-td>
                <uni-td>无</uni-td>
                <uni-td>隔空打牛</uni-td>
                <uni-td>啊擦看</uni-td>
                <uni-td>100</uni-td>
                <uni-td>3</uni-td>
                <uni-td width="200px">
					<view class="operate-btn-group">
							<button size="mini" type="primary" plain >修改</button>
							<button size="mini" type="warn" plain >删除</button><!-- 删除按钮点击时调用remove函数，传入分类id,item._id是分类id -->
						</view>
				</uni-td>
            </uni-tr>
        </uni-table>
    </view>
</template>

<script setup>
	
</script>
<style lang="scss" scoped>
.main{
    margin: 20px;
}
</style>
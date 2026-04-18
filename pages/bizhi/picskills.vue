<template>
	<view class="picadd">
		<view class="piclist">
			<custom-head-top>
				<template #left>
					宠物技能
				</template>

				<template #right>
					<uni-data-select style="width: 200px;" ref="selectRef" @change="classifyChange" collection="xxm-bizhi-classify"
						field="_id as value, name as text,sort"
						:where='`enable == true && name!="无属性"`'
						orderby="sort asc"
						clear
						v-model="selectValue"
					></uni-data-select>
					<button type="primary" size="mini" @click="handleAdd">
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
				<uni-th align="center" width="100px">发布人</uni-th>
				<uni-th align="left" width="80px">排序</uni-th>
				<uni-th align="left" width="100px">属性</uni-th>
				<uni-th align="left" width="100px">技能图片</uni-th>
				<uni-th align="left" width="120px">技能名称</uni-th>
				<uni-th align="left" width="300px">技能详情</uni-th>
				<uni-th align="left" width="60px">威力</uni-th>
				<uni-th align="left" width="60px">消耗</uni-th>
				<uni-th align="right" width="200px">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="item in skillList" :key="item._id">
				<uni-td align="center">{{ item.user_id[0]?.nickname || '-' }}</uni-td>
				<uni-td>{{ item.sort }}</uni-td>
				<uni-td>{{ item.classid[0]?.name || '-' }}</uni-td>
				<uni-td>
					<image v-if="item.picurl" class="thumb" @click="previewImg(item.picurl)" :src="item.picurl" mode="aspectFill"></image>
					<text v-else>-</text>
				</uni-td>
				<uni-td>{{ item.name }}</uni-td>
				<uni-td>{{ item.description || '-' }}</uni-td>
				<uni-td>{{ item.power }}</uni-td>
				<uni-td>{{ item.cost }}</uni-td>
				<uni-td width="200px">
					<view class="operate-btn-group">
						<button size="mini" type="primary" plain @click="handleEdit(item._id)">修改</button>
						<button size="mini" type="warn" plain @click="handleDelete(item._id)">删除</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
	<view class="paging">
		<uni-pagination :current="params.current"
			:total="params.total"
			:pageSize="params.pageSize"
			:showIcon="true" @change="changePage" />
	</view>
	<view>
        <skillPopup  ref="skillPopRef" :item="item" :type="type" @success="getSkillList" :maxSort="skillList[skillList.length-1]?.sort || 0"></skillPopup>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { showModal, showToast, previewImg } from '../../utils/common';
import skillPopup from "./children/skillPopup.vue";

const skillCloudObj = uniCloud.importObject("admin-bizhi-skills");
const selectValue = ref("");
const selectRef = ref(null);
const skillList = ref([]);
const skillPopRef = ref(null);
const item = ref({});
const type = ref("add");
// 分页参数
const params = ref({
	current: 1,
	pageSize: 10,
	total: 0,
	classid: ""
});
// 分页参数初始化
onMounted(() => {
	selectRef.value.clearVal();
});
// 分类选择器改变时调用
const classifyChange = (val) => {
	params.value.classid = val;
	params.value.current = 1;
	getSkillList();
};
// 分页
const changePage = (e) => {
	params.value.current = e.current;
	getSkillList();
};
// 新增技能
const handleAdd = () => {
	type.value = "add";
	item.value = {};
	skillPopRef.value.open();
};
// 获取技能列表
const getSkillList = async () => {
	let { errCode, errMsg, data, count } = await skillCloudObj.list(params.value);
	if (errCode !== 0) return showToast({ title: errMsg });
	skillList.value = data;
	params.value.total = count;
};
//修改技能
const handleEdit = async (id) => {
	try {
		let { data: itemData, errCode, errMsg } = await skillCloudObj.item(id);
		if (errCode !== 0) return showToast({ title: errMsg });
		item.value = itemData;
		type.value = "update";
		skillPopRef.value.open();
	} catch (err) {
		console.log(err);
	}
};
//删除技能
const handleDelete = async (id) => {
	try {
		let feedback = await showModal({ content: "确认删除该技能吗？" });
		if (feedback !== 'confirm') return showToast({ title: "删除取消" });
		uni.showLoading({ mask: true });
		let { errCode, errMsg } = await skillCloudObj.remove([id]);
		if (errCode !== 0) return showToast({ title: errMsg });
		showToast({ title: "删除成功" });
		getSkillList();
	} catch (err) {
		showToast({ title: err });
	} finally {
		uni.hideLoading();
	}
};

getSkillList();//获取技能列表
</script>

<style lang="scss">
.main {
	padding: 20px;

	.thumb {
		width: 60px;
		height: 60px;
		border-radius: 3px;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}
}

.paging {
	padding: 20px;
}
</style>

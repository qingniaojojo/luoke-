<template>
	<uni-popup ref="SkillPopup" type="center" :is-mask-click="false">
		<view class="SkillPopup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="技能名称" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入技能名称" />
				</uni-forms-item>
				<uni-forms-item label="技能分类" name="classid" required>
					<uni-data-select 
						ref="selectRef"
						collection="xxm-bizhi-classify" 
						field="_id as value, name as text" 
						:where='`enable == true`' 
						orderby="sort asc" 
						v-model="formData.classid"
						placeholder="请选择技能分类"
					></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="技能描述" name="description">
					<uni-easyinput type="textarea" v-model="formData.description" placeholder="请输入技能描述" />
				</uni-forms-item>
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="技能图片">
					<view class="picGroup">
						<view class="box add" v-if="!formData.tempurl && !formData.picurl" @click="selectPicurl">
							<uni-icons type="plusempty" size="30" color="#888"></uni-icons>
						</view>
						<view class="box pic" v-else>
							<image :src="formData.tempurl || formData.picurl" mode="aspectFit"></image>
							<view class="mask">
								<view class="icon" @click="selectPicurl">
									<uni-icons type="compose" size="20" color="#fff"></uni-icons>
								</view>
								<view class="icon" @click="delImg">
									<uni-icons type="trash" size="20" color="#fff"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="威力" name="power">
					<uni-easyinput type="number" v-model.number="formData.power" placeholder="请输入威力" />
				</uni-forms-item>
				<uni-forms-item label="消耗" name="cost">
					<uni-easyinput type="number" v-model.number="formData.cost" placeholder="请输入消耗" />
				</uni-forms-item>
				<uni-forms-item label="" name="sort">
					<view class="group">
						<button size="mini" type="primary" @click="submit">{{typename}}</button>
						<button size="mini" type="default" @click="close">取消</button>
					</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, onUnmounted, watch, computed, nextTick } from 'vue';
import { cloudToHttps, convertBlobUrlToWebP } from "@/utils/tools.js";
import dayjs from "dayjs";
import { showToast } from '../../../utils/common';

const emits = defineEmits(["success"]);
const props = defineProps(["item", "type", "maxSort"]);
const skillCloudObj = uniCloud.importObject("admin-bizhi-skills", { customUI: true });//用于操作技能数据库
const typename = computed(() => props.type == 'add' ? '新增' : '修改');//根据type属性判断是新增还是修改
// 组件卸载时，撤销 tempurl 对象 URL
onUnmounted(() => {
	if (formData.value.tempurl && formData.value.tempurl.startsWith('blob:')) {
		URL.revokeObjectURL(formData.value.tempurl);
	}
});

const formRef = ref(null);
const SkillPopup = ref(null);
const selectRef = ref(null);

const formData = ref({
	name: "",
	classid: "",
	description: "",
	sort: 0,
	picurl: "",
	tempurl: "",
	power: 0,
	cost: 0
});

watch(() => [props.item, props.type], ([nv, type]) => {
	// 编辑时，不设置 tempurl，直接使用 picurl
	// 确保处理数据结构
	if (type === 'update' && nv && nv._id) {
		// 如果 classid 是数组，取第一个元素的 _id
		let classidValue = nv.classid;
		if (Array.isArray(classidValue) && classidValue.length > 0) {
			classidValue = classidValue[0]._id;
		}
		
		formData.value = {
			_id: nv._id,
			name: nv.name || "",
			classid: classidValue || "",
			description: nv.description || "",
			sort: nv.sort || 0,
			picurl: nv.picurl || "",
			tempurl: "",
			power: nv.power || 0,
			cost: nv.cost || 0
		};
	}
}, { immediate: true });

const rules = ref({
	name: {
		rules: [
			{
				required: true,
				errorMessage: '请输入技能名称',
			},
			{
				minLength: 2,
				maxLength: 20,
				errorMessage: '技能名称长度在 2 到 20 个字符之间',
			}
		],
		label: "技能名称"
	},
	classid: {
		rules: [
			{
				required: true,
				errorMessage: '请选择技能分类',
			}
		],
		label: "技能分类"
	}
});
// 提交表单
const submit = async () => {
	try {
		uni.showLoading({ mask: true });
		await formRef.value.validate();
		
		if (formData.value.tempurl && formData.value.tempurl.startsWith('blob:')) {
			let file = await uploadFile();
			formData.value.picurl = cloudToHttps(file.fileID);
			if (formData.value.tempurl && formData.value.tempurl.startsWith('blob:')) {
				URL.revokeObjectURL(formData.value.tempurl);
			}
		}
		
		let { tempurl, ...params } = formData.value;
		let { errCode, errMsg } = props.type == 'add'
			? await skillCloudObj.add(params)
			: await skillCloudObj.update(params);
			
		if (errCode !== 0) return showToast({ title: errMsg });
		showToast({ title: typename.value + "成功" });
		close();
		init();
		emits("success", { msg: typename.value + "成功~~" });
	} catch (err) {
		showToast({ title: err });
	}
};
// 上传文件
const uploadFile = async () => {
	let tempurl = formData.value.tempurl;
	// 只有当 tempurl 是 blob URL 时才转换
	if (tempurl && tempurl.startsWith('blob:')) {
		tempurl = await convertBlobUrlToWebP(tempurl);
	}
	return await uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath: "skills/" + dayjs().format("YYYYMMDD") + "/" + Date.now() + ".webp"
	});
};
// 选择图片
const selectPicurl = () => {
	uni.chooseImage({
		count: 1,
		success: res => {
			formData.value.tempurl = res.tempFilePaths[0];
		}
	});
};
// 删除图片
const delImg = () => {
	if (formData.value.tempurl && formData.value.tempurl.startsWith('blob:')) {
		URL.revokeObjectURL(formData.value.tempurl);
	}
	formData.value.tempurl = "";
	formData.value.picurl = "";
};
// 打开弹窗
const open = () => {
	if (props.type == 'add') {
		init();
		nextTick(() => {
			formData.value.sort = (props.maxSort || 0) + 1;
		});
	}
	SkillPopup.value.open();
};
// 关闭弹窗
const close = () => {
	if (formData.value.tempurl && formData.value.tempurl.startsWith('blob:')) {
		URL.revokeObjectURL(formData.value.tempurl);
	}
	SkillPopup.value.close();
	init();
};
// 初始化表单数据
const init = () => {
	formData.value = {
		name: "",
		classid: "",
		description: "",
		sort: 0,
		picurl: "",
		tempurl: "",
		power: 0,
		cost: 0
	};
	// 清空 uni-data-select 组件的内部缓存
	nextTick(() => {
		if (selectRef.value && selectRef.value.clearVal) {
			selectRef.value.clearVal();
		}
	});
};
// 导出方法
defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.SkillPopup {
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding: 50px 50px 50px 0px;

	.group {
		display: flex;
		justify-content: start;
		gap: 20px;

		button {
			margin: 0;
			width: 130px;
		}
	}

	.picGroup {
		.box {
			width: 80px;
			aspect-ratio: 1 / 1;
			border: 1px solid #e4e4e4;
			border-radius: 10px;
			overflow: hidden;
		}

		.add {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}

		.pic {
			position: relative;

			image {
				width: 100%;
				height: 100%;
			}

			.mask {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 30px;
				background: rgba(0, 0, 0, 0.4);
				display: flex;
				align-items: center;
				justify-content: center;

				.icon {
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
			}
		}
	}
}
</style>

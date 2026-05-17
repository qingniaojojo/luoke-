<template>
	<uni-popup ref="skillSelectPopup" type="center" :is-mask-click="true">
		<view class="SkillSelectPopup">
			<view class="header">
				<view class="title">选择技能</view>
				<view class="close" @click="close">
					<uni-icons type="close" size="20" color="#333"></uni-icons>
				</view>
			</view>
			<view class="search-box">
				<uni-easyinput v-model="searchKeyword" placeholder="搜索技能名称" clearable @input="onSearchInput">
					<template v-slot:prefix>
						<uni-icons type="search" size="18" color="#999"></uni-icons>
					</template>
				</uni-easyinput>
			</view>
			<view class="skill-list">
				<scroll-view scroll-y="true" class="scroll-view">
					<view 
						class="skill-item" 
						:class="{ 
							active: selectedSkillId === item._id,
							alreadySelected: isAlreadySelected(item._id) && selectedSkillId !== item._id
						}"
						v-for="item in filteredSkills" 
						:key="item._id"
						@click="selectSkill(item)"
					>
						<image v-if="item.picurl" class="skill-icon" :src="item.picurl" mode="aspectFill"></image>
						<view v-else class="skill-icon no-icon">
							<uni-icons type="flag" size="24" color="#999"></uni-icons>
						</view>
						<view class="skill-info">
							<view class="skill-name">{{ item.name }}</view>
							<view class="skill-desc">
								<text v-if="item.classid && item.classid[0]">{{ item.classid[0].name }}</text>
								<text v-if="item.power"> | 威力:{{ item.power }}</text>
								<text v-if="item.cost"> | 消耗:{{ item.cost }}</text>
							</view>
						</view>
						<view v-if="isAlreadySelected(item._id)" class="selected-badge">
							<text v-if="selectedSkillId === item._id">当前</text>
							<text v-else>已选</text>
						</view>
					</view>
					<view v-if="filteredSkills.length === 0" class="empty">
						未找到匹配的技能
					</view>
				</scroll-view>
			</view>
			<view class="footer">
				<button size="mini" type="default" @click="close">取消</button>
				<button size="mini" type="primary" @click="confirmSelect">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const emits = defineEmits(['select']);
const props = defineProps({
	currentSkillId: {
		type: String,
		default: ''
	},
	selectedSkillIds: {
		type: Array,
		default: () => []
	}
});

const skillSelectPopup = ref(null);
const searchKeyword = ref('');
const allSkills = ref([]);
const selectedSkillId = ref('');
const db = uniCloud.database();
const dbCmd = db.command;

// 过滤后的技能列表
const filteredSkills = computed(() => {
	if (!searchKeyword.value.trim()) {
		return allSkills.value;
	}
	const keyword = searchKeyword.value.toLowerCase().trim();
	return allSkills.value.filter(skill => 
		skill.name && skill.name.toLowerCase().includes(keyword)
	);
});

// 打开弹窗
const open = () => {
	searchKeyword.value = '';
	selectedSkillId.value = props.currentSkillId || '';
	skillSelectPopup.value.open();
	loadSkills();
};

// 关闭弹窗
const close = () => {
	skillSelectPopup.value.close();
};

// 加载技能列表
const loadSkills = async () => {
	try {
		const $ = dbCmd.aggregate;
		const res = await db.collection('xxm-bizhi-skills')
			.aggregate()
			.lookup({
				from: 'xxm-bizhi-classify',
				localField: 'classid',
				foreignField: '_id',
				as: 'classid'
			})
			.sort({ sort: 1 })
			.end();
		if (res.result.data) {
			allSkills.value = res.result.data;
		}
	} catch (err) {
		console.error('加载技能失败:', err);
		// 如果聚合查询失败，回退到普通查询
		try {
			const res = await db.collection('xxm-bizhi-skills')
				.orderBy('sort', 'asc')
				.get();
			if (res.result.data) {
				allSkills.value = res.result.data;
			}
		} catch (err2) {
			console.error('回退查询也失败:', err2);
		}
	}
};

// 搜索输入
const onSearchInput = () => {
	// 实时过滤由 computed 处理
};

// 判断技能是否已被选择（除了当前正在编辑的槽位）
const isAlreadySelected = (skillId) => {
	if (!skillId) return false;
	return props.selectedSkillIds.includes(skillId);
};
// 选择技能
const selectSkill = (item) => {
	// 如果技能已被其他槽位选择，不允许选择
	if (isAlreadySelected(item._id) && item._id !== props.currentSkillId) {
		return;
	}
	selectedSkillId.value = item._id;
};

// 确认选择
const confirmSelect = () => {
	emits('select', selectedSkillId.value);
	close();
};

// 监听当前技能ID变化
watch(() => props.currentSkillId, (val) => {
	selectedSkillId.value = val || '';
});

defineExpose({
	open,
	close
});
</script>

<style lang="scss" scoped>
.SkillSelectPopup {
	background: #fff;
	width: 500px;
	max-height: 70vh;
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		border-bottom: 1px solid #f0f0f0;

		.title {
			font-size: 16px;
			font-weight: bold;
		}

		.close {
			cursor: pointer;
			padding: 5px;
		}
	}

	.search-box {
		padding: 15px 20px;
		border-bottom: 1px solid #f0f0f0;
	}

	.skill-list {
		flex: 1;
		min-height: 300px;
		max-height: 400px;
		height: 400px;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.scroll-view {
			height: 400px;
		}

		.skill-item {
			display: flex;
			align-items: center;
			padding: 12px 20px;
			border-bottom: 1px solid #f5f5f5;
			cursor: pointer;
			transition: background-color 0.2s;
			position: relative;

			&:hover {
				background-color: #f9f9f9;
			}

			&.active {
				background-color: #e6f7ff;
			}

			&.alreadySelected {
				opacity: 0.5;
				cursor: not-allowed;

				&:hover {
					background-color: transparent;
				}
			}

			.skill-icon {
				width: 50px;
				height: 50px;
				border-radius: 8px;
				margin-right: 12px;
				flex-shrink: 0;

				&.no-icon {
					background-color: #f5f5f5;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.skill-info {
				flex: 1;
				overflow: hidden;

				.skill-name {
					font-size: 15px;
					font-weight: 500;
					color: #333;
					margin-bottom: 4px;
				}

				.skill-desc {
					font-size: 12px;
					color: #999;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.selected-badge {
				flex-shrink: 0;
				margin-left: 10px;
				padding: 2px 8px;
				background: #ff6b6b;
				color: white;
				font-size: 12px;
				border-radius: 10px;
			}
		}

		.empty {
			padding: 40px;
			text-align: center;
			color: #999;
			font-size: 14px;
		}
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		padding: 15px 20px;
		border-top: 1px solid #f0f0f0;

		button {
			margin: 0;
		}
	}
}
</style>
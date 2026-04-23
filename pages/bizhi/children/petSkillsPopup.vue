<template>
	<uni-popup ref="popup" type="center" :mask-click="false">
		<view class="popup-container">
			<view class="popup-header">
				<view class="popup-title">{{ petName ? petName + ' 的技能' : '技能列表'}}</view>
				<view class="popup-close" @click="close">
					<uni-icons type="close" size="20" color="#999"></uni-icons>
				</view>
			</view>
			<view class="popup-content">
				<scroll-view scroll-y="true" class="scroll-view">
					<view v-if="skills.length === 0" class="empty">
						<view class="empty-icon">
							<uni-icons type="flag" size="48" color="#ddd"></uni-icons>
						</view>
						<view class="empty-text">暂无技能</view>
					</view>
					<view v-for="(skill, index) in skills" :key="skill._id" class="skill-card">
						<view class="skill-index">{{ index + 1 }}</view>
						<view class="skill-main">
							<image v-if="skill.picurl" class="skill-icon" :src="skill.picurl" mode="aspectFill"></image>
							<view v-else class="skill-icon no-icon">
								<uni-icons type="flag" size="24" color="#999"></uni-icons>
							</view>
							<view class="skill-info">
								<view class="skill-name">{{ skill.name }}</view>
								<view class="skill-attr">{{ skill.classid && skill.classid[0] ? skill.classid[0].name : '未知属性' }}</view>
							</view>
						</view>
						<view class="skill-stats">
							<view v-if="skill.power" class="stat-item">
								<text class="stat-label">威力</text>
								<text class="stat-value">{{ skill.power }}</text>
							</view>
							<view v-if="skill.cost" class="stat-item">
								<text class="stat-label">消耗</text>
								<text class="stat-value">{{ skill.cost }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	petName: {
		type: String,
		default: ''
	}
});

const emits = defineEmits([]);
const popup = ref(null);
const skills = ref([]);
const loading = ref(false);

//打开弹窗
const open = async (skillIds) => {
	skills.value = [];
	popup.value.open();
	if (skillIds && skillIds.length > 0) {
		loading.value = true;
		await loadSkills(skillIds);
	}
};

//关闭弹窗
const close = () => {
	popup.value.close();
};

//加载技能详情
const loadSkills = async (skillIds) => {
	try {
		const db = uniCloud.database();
		// 使用 doc 方法批量查询
		const promises = skillIds.map(id => db.collection('xxm-bizhi-skills').doc(id).get());
		const results = await Promise.all(promises);
		skills.value = results.map(res => res.result.data[0]).filter(Boolean);
	} catch (err) {
		console.error('加载技能失败:', err);
	} finally {
		loading.value = false;
	}
};

//暴露方法给父组件
defineExpose({
	open,
	close
});
</script>

<style lang="scss">
.popup-container {
	width: 600rpx;
	max-height: 80vh;
	background-color: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;

	.popup-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #333;
	}

	.popup-close {
		cursor: pointer;
		padding: 10rpx;
	}
}

.popup-content {
	max-height: 60vh;
	overflow: hidden;

	.scroll-view {
		height: 100%;
		max-height: 60vh;
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 0;

	.empty-icon {
		margin-bottom: 20rpx;
	}

	.empty-text {
		color: #999;
		font-size: 28rpx;
	}
}

.skill-card {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #f5f5f5;
	position: relative;

	.skill-index {
		flex-shrink: 0;
		width: 50rpx;
		height: 50rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 600;
		margin-right: 24rpx;
	}

	.skill-main {
		flex: 1;
		display: flex;
		align-items: center;

		.skill-icon {
			width: 80rpx;
			height: 80rpx;
			border-radius: 12rpx;
			margin-right: 24rpx;
			flex-shrink: 0;

			&.no-icon {
				background-color: #f5f5f5;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.skill-info {
			.skill-name {
				font-size: 30rpx;
				font-weight: 500;
				color: #333;
				margin-bottom: 6rpx;
			}

			.skill-attr {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.skill-stats {
		flex-shrink: 0;
		display: flex;
		gap: 24rpx;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 12rpx 20rpx;
			background: #f5f5f5;
			border-radius: 8rpx;
			min-width: 90rpx;

			.stat-label {
				font-size: 22rpx;
				color: #999;
				margin-bottom: 4rpx;
			}

			.stat-value {
				font-size: 28rpx;
				font-weight: 600;
				color: #333;
			}
		}
	}

	&:last-child {
		border-bottom: none;
	}
}
</style>

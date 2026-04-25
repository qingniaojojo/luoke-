<template>
	<view class="picadd">
		<view class="piclist">
			<custom-head-top>
				<template #left>
					编辑宠物
				</template>
			</custom-head-top>
			<view class="main">
				<view class="setClassify" v-if="piclist.length">
					<uni-data-select ref="selectRef" @change="classifyChange" collection ="xxm-bizhi-classify" 
					field="_id as value, name as text,sort" 
					:where='`enable == true && name!="无属性"`'
					orderby="sort asc"
					clear
					v-model="selectvalue"
					></uni-data-select>
				</view>
				<view class="grid">
					<view class="itemBox pic" v-for="(item,index) in piclist" :key="index">
						<view class="left">
							<image :src="item.tempurl" mode="aspectFit"></image>
							<view class="mask">
								<view class="icon">
									<uni-icons type="compose" size="20" color="#fff" @click="editMainImg(index)"></uni-icons>
								</view>
							</view>
						</view>
						<view class="right">
							<view class="row">
								<view class="label">名称</view>
								<uni-easyinput v-model="item.cwname" placeholder="请输入名称"></uni-easyinput>
							</view>
							<view class="xlhfsx">
								<view class="xbox">
									<view class="xlhfsxName">序列号</view>
									<uni-easyinput v-model="item.sort" type="number" placeholder="请输入序列号"></uni-easyinput>
								</view>
								<view class="xbox">
									<view class="xlhfsxName">副属性</view>
									<uni-data-select ref="fsxRef" @change="(val) => fsxChange(val, index)" collection ="xxm-bizhi-classify"
										field="_id as value, name as text,sort"
										:where ='`enable == true`'
										orderby = "sort asc"
										clear
										v-model="item.Fsxid"
										></uni-data-select>
								</view>
							</view>
							<view class="txBigbox">
								<view class="txBox">
									<view class="txImg">
										<view class="label">特性图片</view>
										<view class="selFsximg" @click="txImg(index)">
											<image :src="item.tximg || ''" mode="aspectFit"></image>
										</view>
									</view>
									<view class="txImg">
										<view class="label">宠物特性</view>
										<uni-easyinput v-model="item.description" type="textarea" placeholder="请输入宠物特性"></uni-easyinput>
									</view>
								</view>
								<view class="BaseStatBox">
									<view class="baseStat">
										<view class="statItem">物攻:</view>
										<uni-easyinput v-model="item.p_at"  type="number" class="attValue" placeholder="物攻值"></uni-easyinput>
									</view>
									<view class="baseStat">
										<view class="statItem">魔攻:</view>
										<uni-easyinput v-model="item.m_at" type="number" class="attValue" placeholder="魔攻值"></uni-easyinput>
									</view>
									<view class="baseStat">
										<view class="statItem">物防:</view>
										<uni-easyinput v-model="item.p_def" type="number" class="attValue" placeholder="物防值"></uni-easyinput>
									</view>
									<view class="baseStat">
										<view class="statItem">魔防:</view>
										<uni-easyinput v-model="item.m_def" type="number" class="attValue" placeholder="魔防值"></uni-easyinput>
									</view>
									<view class="baseStat">
										<view class="statItem">生命:</view>
										<uni-easyinput v-model="item.hp" type="number" class="attValue" placeholder="生命值"></uni-easyinput>
									</view>
									<view class="baseStat">
										<view class="statItem">速度:</view>
										<uni-easyinput v-model="item.spd" type="number" class="attValue" placeholder="速度值"></uni-easyinput>
									</view>
								</view>
							</view>
							<view class="skillBox">
								<view class="skillTitle">技能配置（最多18个）</view>
								<view class="skillItem">
									<view class="skillNabox" v-for="(skill, sIndex) in 18" :key="sIndex">
										<view class="skillName">{{ sIndex + 1 }}</view>
										<view class="skill-select-btn" @click="openSkillSelect(index, sIndex)">
											<text v-if="item.skills && item.skills[sIndex]" class="skill-name-text">
												{{ getSkillName(item.skills[sIndex]) }}
											</text>
											<text v-else class="skill-placeholder">请选择</text>
											<view v-if="item.skills && item.skills[sIndex]" class="clear-skill" @click.stop="clearSkill(index, sIndex)">
												<uni-icons type="close" size="14" color="#999"></uni-icons>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						
					</view>
				</view>
				<view class="btnGroup" v-if="piclist.length">
					<button class="btn saveBtn" type="primary" @click="subMit">保存修改</button>
					<button class="btn backBtn" type="warn" plain @click="handleBack">返回</button>
				</view>
			</view>
		</view>
	</view>
	<skillSelectPopup ref="skillSelectPopupRef" :currentSkillId="getCurrentSkillId()" :selectedSkillIds="getAllSelectedSkillIds()" @select="onSkillSelect"></skillSelectPopup>
</template>


<script setup>
import { onMounted } from 'vue';
import {ref} from 'vue';
import { routerTo, showToast } from '../../utils/common';
import { cloudToHttps, convertBlobUrlToWebP } from '../../utils/tools';
import dayjs from 'dayjs';
import skillSelectPopup from "./children/skillSelectPopup.vue";

const selectvalue = ref("");
const piclist = ref([]);
const picCloudObj = uniCloud.importObject("admin-bizhi-pictrue");
const skillCloudObj = uniCloud.importObject("admin-bizhi-skills");
const editId = ref("");
const skillSelectPopupRef = ref(null);
const currentEditSkillIndex = ref({ picIndex: 0, skillIndex: 0 });
const skillNames = ref({});

onMounted(()=>{
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const options = currentPage.options;
	if (options && options.id) {//
		editId.value = options.id;
		loadPetData();
	}
});

//获取宠物详情
const loadPetData = async ()=>{
	try{
		uni.showLoading({mask:true});//加载时不能点击其他操作，不显示loading动画
		let {errCode, data} = await picCloudObj.list({_id: editId.value});
		if(errCode !== 0 || !data || data.length === 0) return showToast({title:"获取数据失败"});
		let item = data[0];
		const classId = item.classid && item.classid.length > 0 ? item.classid[0]._id : '';//分类id
		const fsxId = item.Fsxid && item.Fsxid.length > 0 ? item.Fsxid[0]._id : '';//副属性id
		selectvalue.value = classId;
		piclist.value = [{
			_id: item._id,
			cwname: item.cwname,
			sort: item.sort,
			description: item.description,
			picurl: item.picurl,
			tempurl: item.picurl,//临时图片url
			Fsxid: fsxId,
			tximg: item.txzimg,
			txzimg: item.txzimg,
			p_def: item.p_def,
			m_def: item.m_def,
			hp: item.hp,
			spd: item.spd,
			p_at: item.p_at,
			m_at: item.m_at,
			skills: item.skills || [],
			classid: classId,
			isMainImgChanged: false,//是否修改主图片
			isTxImgChanged: false//是否修改特性图片
		}];
		// 预加载技能名称
		if (item.skills && item.skills.length) {
			item.skills.forEach(skillId => {
				if (skillId) loadSkillName(skillId);
			});
		}
		uni.hideLoading();//隐藏loading动画
	}catch(err){
		showToast({title:err});
	}
}
//选择主图片
const editMainImg = async (index)=>{
	try {
		let imgs = await uni.chooseImage({count: 1});
		if (piclist.value[index]) {//如果存在主图片
			piclist.value[index].tempurl = imgs.tempFilePaths[0];//将选择的图片赋值给tempurl属性
			piclist.value[index].picurl = imgs.tempFilePaths[0];//将选择的图片赋值给picurl属性
			piclist.value[index].isMainImgChanged = true;
		}
	} catch (error) {
		if (error.errMsg !== 'chooseImage:fail cancel') {
			console.error('选择图片失败:', error);
		}
	}
}

const handleBack = ()=>{
	routerTo("/pages/bizhi/piclist","redirect");//返回宠物列表
}
//保存修改
const subMit= async ()=>{
	if(!selectvalue.value) return showToast({title:"分类必须选择"})
	if(!checkFsx()) return;
	let desRes = piclist.value.every(item=>item.description)
	if(!desRes) return showToast({title:"特性不能为空"})
	try{
		uni.showLoading({mask:true});
		
		let uploudTass = piclist.value.map((item,index)=>{
			if(item.isMainImgChanged){
				return uploadFile(item,index);
			}
			return Promise.resolve({fileID: item.picurl});
		});
		
		let Txuploud = piclist.value.map((item,index)=>{
			if(item.isTxImgChanged){
				return txupload(item,index);
			}
			return Promise.resolve({fileID: item.txzimg});
		});
		
		let cloudfiles = await Promise.all(uploudTass);
		let txcloudfiles = await Promise.all(Txuploud);
		
		let params = piclist.value.map((item,index)=>{
			let {tempurl, tximg, isMainImgChanged, isTxImgChanged, ...rest} = item;
			// 过滤掉空的技能值
			let skills = (item.skills || []).filter(skillId => skillId);
			return{
				...rest,
				skills: skills,
				picurl: isMainImgChanged ? cloudToHttps(cloudfiles[index].fileID) : item.picurl,
				txzimg: isTxImgChanged ? cloudToHttps(txcloudfiles[index].fileID) : item.txzimg,
				sort: Number(item.sort) || 0,
				p_def: Number(item.p_def) || 0,
				m_def: Number(item.m_def) || 0,
				hp: Number(item.hp) || 0,
				spd: Number(item.spd) || 0,
				p_at: Number(item.p_at) || 0,
				m_at: Number(item.m_at) || 0
			}
		})
		
		let {errCode,errMsg} = await picCloudObj.update(params[0]);
		if(errCode!==0) return showToast({title:errMsg});
		showToast({title:"修改成功"});
		setTimeout(()=>routerTo("/pages/bizhi/piclist","redirect"),1500);
	}catch(err){
		showToast({title:err});
	}
}
//检查副属性是否选择
const checkFsx = () => {
	const allHasFsx = piclist.value.every(item => item.Fsxid);
	if(!allHasFsx) {
		showToast({title:"副属性必须选择"})
		return false;
	}
	return true;
}
//上传主图片
const uploadFile = async (item,index)=>{
	if (!item.tempurl) {
		return Promise.resolve({ fileID: '' });
	}
	try {
		let tempurl = await convertBlobUrlToWebP(item.tempurl);
		return uniCloud.uploadFile({
			filePath:tempurl,
			cloudPath:`wallpaper/${dayjs().format("YYYYMMDD")}/${Date.now()}_${index}.webp`
		});
	} catch (error) {
		console.error('主图片转换失败:', error);
		return Promise.resolve({ fileID: '' });
	}
}
//上传特性图片
const txupload = async (item,index)=>{
    if (!item.tximg) {
        return Promise.resolve({ fileID: '' });
    }
    try {
        let tximg = await convertBlobUrlToWebP(item.tximg);
        return uniCloud.uploadFile({
            filePath:tximg,
            cloudPath:`wallpaper/${dayjs().format("YYYYMMDD")}/tx_${Date.now()}_${index}.webp`
        });
    } catch (error) {
        console.error('特性图片转换失败:', error);
        return Promise.resolve({ fileID: '' });
    }
}
//选择分类
const classifyChange =(e)=>{
	piclist.value.forEach(iteam=>{
		iteam.classid =e
	})
}

const fsxChange = (val, index)=>{
	if (piclist.value[index]) {
		piclist.value[index].Fsxid = val;
	}
}
//选择特性图片
const txImg = async(index)=>{
	try {
		let imgs = await uni.chooseImage({count: 1});
		if (piclist.value[index]) {
			piclist.value[index].tximg = imgs.tempFilePaths[0];
			piclist.value[index].isTxImgChanged = true;
		}
	} catch (error) {
		if (error.errMsg !== 'chooseImage:fail cancel') {
			console.error('选择特性图片失败:', error);
		}
	}
}
//打开技能选择弹窗
const openSkillSelect = (picIndex, skillIndex) => {
	currentEditSkillIndex.value = { picIndex, skillIndex };
	skillSelectPopupRef.value.open();
};
//获取当前编辑的技能ID
const getCurrentSkillId = () => {
	const { picIndex, skillIndex } = currentEditSkillIndex.value;
	if (piclist.value[picIndex] && piclist.value[picIndex].skills) {
		return piclist.value[picIndex].skills[skillIndex] || '';
	}
	return '';
};
//获取该宠物所有已选择的技能ID（排除当前正在编辑的槽位）
const getAllSelectedSkillIds = () => {
	const { picIndex, skillIndex } = currentEditSkillIndex.value;
	if (piclist.value[picIndex] && piclist.value[picIndex].skills) {
		return piclist.value[picIndex].skills.filter((id, idx) => {
			return id && idx !== skillIndex;
		});
	}
	return [];
};
//技能选择回调
const onSkillSelect = (skillId) => {
	const { picIndex, skillIndex } = currentEditSkillIndex.value;
	if (piclist.value[picIndex]) {
		if (!piclist.value[picIndex].skills) {
			piclist.value[picIndex].skills = [];
		}
		piclist.value[picIndex].skills[skillIndex] = skillId;
		if (skillId) {
			loadSkillName(skillId);
		}
	}
};
//清空技能
const clearSkill = (picIndex, skillIndex) => {
	if (piclist.value[picIndex] && piclist.value[picIndex].skills) {
		piclist.value[picIndex].skills[skillIndex] = '';
	}
};
//获取技能名称
const getSkillName = (skillId) => {
	if (!skillId) return '';
	if (skillNames.value[skillId]) {
		return skillNames.value[skillId];
	}
	loadSkillName(skillId);
	return '加载中...';
};
//加载技能名称
const loadSkillName = async (skillId) => {
	if (skillNames.value[skillId]) return;
	try {
		const res = await skillCloudObj.item(skillId);
		if (res.errCode === 0 && res.data) {
			skillNames.value[skillId] = res.data.name;
		}
	} catch (err) {
		console.error('加载技能名称失败:', err);
	}
};
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
			
			.left{
				width: 140px;
				aspect-ratio: 9/16;
				background: conic-gradient(#ccc 0 25%,#fff 25% 50%,#ccc 50% 75%,#fff 75%);
				background-size: 15px 15px;
				position: relative;
				image{
					width: 100%;
					height: 100%;
				}
				.mask{
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 30px;
					background: rgba(0,0,0,0.4);
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
				.skillBox{
					border: 1px solid #ccc;
					padding: 10px;
					.skillTitle{
						margin-bottom: 8px;
						font-weight: bold;
					}
					.skillItem{
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 8px;
					}
					.skillNabox{
						display: flex;
						align-items: center;
						gap: 5px;
						.skillName{
							min-width: 20px;
							text-align: center;
							font-size: 14px;
						}
						.skill-select-btn{
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 6px 10px;
							background: #fff;
							border: 1px solid #ddd;
							border-radius: 4px;
							cursor: pointer;
							min-height: 32px;
							font-size: 13px;

							&:hover{
								border-color: #999;
							}

							.skill-name-text{
								flex: 1;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								color: #333;
							}

							.skill-placeholder{
								color: #999;
							}

							.clear-skill{
								display: flex;
								align-items: center;
								justify-content: center;
								width: 18px;
								height: 18px;
								border-radius: 50%;
								background: #f0f0f0;
								margin-left: 5px;

								&:hover{
									background: #e0e0e0;
								}
							}
						}
					}
				}
				.txBox{
					display: grid;
					grid-template-columns: 1fr 3fr;
					margin-bottom: 10px;
					.txImg{
						&:first-child {
							width: 67px;
							image{
								width: 50px;
								height: 50px;
								border: 1px solid #ccc;
							}
						}
					}
				}
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
	}
	.setClassify{
		padding: 0 0 16px 0;
		width: 200px;
	}
	.btnGroup{
		display: flex;
		padding: 10px 600px 0 0;
		margin: 0;
		gap: 10px;
		.saveBtn{
			width: 150px;
			margin-right: 0;
		}
		.backBtn{
			width: 150px;
			margin-left: 0;
		}
	}
}
</style>

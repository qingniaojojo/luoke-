// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
        _before: function () {
        },
        async getClassifyList(){
                const db = uniCloud.database();
                let result = await db.collection("xxm-bizhi-classify").orderBy("sort").get();
                return {
                        errCode: 0,
                        data: result.data || []
                };
        },
        async list({classid="",_id="",page=1,pageSize=12}={}){
                let where = {};
                if(classid){
                        where.$or=[
                                { classid: classid },
                                { Fsxid: classid }
                        ];
                }
                if(_id){
                        where._id = _id;
                }
                const dbJQL = uniCloud.databaseForJQL({
                        clientInfo:this.getClientInfo()
                })
                let skip = (page - 1) * pageSize;
                let picTemp = dbJQL.collection("xxm-bizhi-piclist").where(where).field("_id,picurl,classid,Fsxid,sort,cwname").orderBy("sort").skip(skip).limit(pageSize).getTemp();
                let classTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name,picurl").getTemp();
                return await dbJQL.collection(picTemp,classTemp).get({getCount:true});
        },
        async get({id}={}){
                const dbJQL = uniCloud.databaseForJQL({
                        clientInfo:this.getClientInfo()
                })
                const db = uniCloud.database();

                let picTemp = dbJQL.collection("xxm-bizhi-piclist").where({_id: id}).getTemp();
                let classTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name,picurl").getTemp();
                let petResult = await dbJQL.collection(picTemp,classTemp).get();

                if(!petResult.data || petResult.data.length === 0){
                        return {
                                errCode: -1,
                                errMsg: "未找到宠物数据"
                        };
                }

                let pet = petResult.data[0];

                pet.wuli = [{
                        wugong: pet.p_at || 0,
                        wufang: pet.p_def || 0,
                        mogong: pet.m_at || 0,
                        mofang: pet.m_def || 0,
                        sudu: pet.spd || 0,
                        jingli: pet.hp || 0
                }];

                pet.jineng = [];
                if(pet.skills && pet.skills.length > 0){
                        let skillIds = pet.skills.filter(skillId => skillId);
                        if(skillIds.length > 0){
                                let skillTemp = dbJQL.collection("xxm-bizhi-skills").where({
                                        _id: dbJQL.command.in(skillIds)
                                }).getTemp();
                                let skillClassTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name,picurl").getTemp();
                                let skillResult = await dbJQL.collection(skillTemp, skillClassTemp).get();

                                if(skillResult.data && skillResult.data.length > 0){
                                        pet.jineng = skillResult.data.map(skill => ({
                                                ...skill,
                                                jnmc: skill.name,
                                                jnms: skill.description,
                                                pp: skill.cost || 0
                                        }));
                                }
                        }
                }

                return {
                        errCode: 0,
                        data: pet
                };
        },
        async getSkillList({page=1,pageSize=20}={}){
                const db = uniCloud.database();
                const dbJQL = uniCloud.databaseForJQL({
                        clientInfo:this.getClientInfo()
                })
                let skip = (page - 1) * pageSize;

                let skillResult = await db.collection("xxm-bizhi-skills").orderBy("sort").skip(skip).limit(pageSize).get();
                let skills = skillResult.data || [];

                if(skills.length > 0){
                        let classIds = skills.map(s => s.classid).filter(id => id);

                        if(classIds.length > 0){
                                let classResult = await db.collection("xxm-bizhi-classify").where({
                                        _id: db.command.in(classIds)
                                }).get();

                                let classMap = {};
                                classResult.data.forEach(c => {
                                        classMap[c._id] = c;
                                });

                                skills = skills.map(s => ({
                                        ...s,
                                        classify: classMap[s.classid] || null
                                }));
                        }
                }

                return {
                        errCode: 0,
                        data: skills
                };
        }
}

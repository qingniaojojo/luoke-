export const cloudToHttps = (str)=>{
	return str.replace("cloud://", "https://")
	.replace(str.split("/")[2], str.split("/")[2] + ".normal.cloudstatic.cn");	
}//将cloud://转化成https://
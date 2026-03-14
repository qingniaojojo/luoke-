export function showToast({title="",duration=1500,icon="none",mask=false}={}){//显示toast提示自己定义的 showToast 函数
	uni.showToast({//UniApp内置的uni.showToast API
		title:String(title),//将title转换为字符串
		icon,//图标
		duration,//持续时间
		mask//是否显示透明蒙层
	})
}
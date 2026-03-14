export function showToast({title="",duration=1500,icon="none",mask=false}={}){//显示toast提示自己定义的 showToast 函数
	uni.showToast({//UniApp内置的uni.showToast API
		title:String(title),//将title转换为字符串
		icon,//图标
		duration,//持续时间
		mask//是否显示透明蒙层
	})
}

export function showModal({content="",showCancel=true}={}){//显示模态弹窗,content="提示内容",showCancel=true显示取消按钮
	return new Promise((resolve,reject)=>{
		uni.showModal({//UniApp内置的uni.showModal API
			title:"提示",//弹窗标题
			content,//提示内容
			showCancel,//是否显示取消按钮
			success:({confirm})=>{//成功回调
				if(confirm) resolve('confirm');//如果用户点击了确认按钮,将结果resolve出去,confirm是一个布尔值,表示用户是否点击了确认按钮
				else resolve('cancel');//如果用户点击了取消按钮,将结果resolve出去,cancel是一个布尔值,表示用户是否点击了取消按钮
			},
			fail:()=>{//失败回调
				reject('fail');//如果用户点击了取消按钮,将结果reject出去,fail是一个字符串,表示弹窗失败
			}
		})
	})
}
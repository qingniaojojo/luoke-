export const cloudToHttps = (str)=>{
	return str.replace("cloud://", "https://")
	.replace(str.split("/")[2], str.split("/")[2] + ".normal.cloudstatic.cn");	
}//将cloud://转化成https://

/**
 * 将 blob URL 或临时路径格式的图像转换为 WebP 格式
 * @param {string} imageUrl - 输入的图像 URL
 * @param {number} quality - WebP 质量 (0-1)，默认 0.8
 * @returns {Promise<string>} - 返回转换后的 blob URL
 */
export const convertBlobUrlToWebP = (imageUrl, quality = 0.9) => new Promise((resolve, reject) => {//暴露函数
  // 如果不是 blob URL，可能是本地临时路径，直接返回
  if (!imageUrl.startsWith('blob:') && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    return resolve(imageUrl);
  }
  
  const img = new Image();
  img.crossOrigin = 'anonymous'; // 处理跨域
  img.onload = () => {
    const canvas = document.createElement('canvas');//创建canvas元素
    canvas.width = img.width;//设置canvas宽度为图片宽度
    canvas.height = img.height;//设置canvas高度为图片高度
    canvas.getContext('2d').drawImage(img, 0, 0); // 绘制图像
    canvas.toBlob(blob => blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('转换失败')), 'image/webp', quality);
  };//处理图像加载成功
  img.onerror = () => {
    // 如果加载失败，可能是本地临时路径，直接返回原路径
    if (!imageUrl.startsWith('blob:')) {
      return resolve(imageUrl);
    }
    reject(new Error('图像加载失败'));
  };
  img.src = imageUrl;
});

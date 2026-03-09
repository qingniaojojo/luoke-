export const cloudToHttps = (str)=>{
	return str.replace("cloud://", "https://")
	.replace(str.split("/")[2], str.split("/")[2] + ".normal.cloudstatic.cn");	
}//将cloud://转化成https://

/**
 * 将 blob URL 格式的图像转换为 WebP 格式
 * @param {string} blobUrl - 输入的 blob URL
 * @param {number} quality - WebP 质量 (0-1)，默认 0.8
 * @returns {Promise<string>} - 返回转换后的 blob URL
 */
export const convertBlobUrlToWebP = (blobUrl, quality = 0.9) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous'; // 处理跨域
  img.onload = () => {
    const canvas = document.createElement('canvas');//创建canvas元素
    canvas.width = img.width;//设置canvas宽度为图片宽度
    canvas.height = img.height;//设置canvas高度为图片高度
    canvas.getContext('2d').drawImage(img, 0, 0); // 绘制图像
    canvas.toBlob(blob => blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('转换失败')), 'image/webp', quality);
  };//处理图像加载成功
  img.onerror = () => reject(new Error('图像加载失败'));
  img.src = blobUrl;
});

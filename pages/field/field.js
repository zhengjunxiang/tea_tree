Page({
  data: {
    wWidth: 0,
    rateW: 0,
    fields: [
      {
        path: "/image/tiandi01.png",
        width: 100,
        height: 150,
        left: 100,
        top: 100,
        id: 1
      },
      {
        path: "/image/tiandi02.png",
        width: 100,
        height: 150,
        left: 156,
        top: 87,
        id: 2
      }
    ]
  },
  onReady() {
  },
  onLoad() {
    this.setData({
      wWidth: wx.getSystemInfoSync().windowWidth,
      rateW: 750 / wx.getSystemInfoSync().windowWidth
    });
  },
  getImgData(path, offsetLeft, offsetHeight) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          // 初始化画布大小
          canvas.width = res[0].width 
          canvas.height = res[0].height
          const image = canvas.createImage()
          image.src = path
          // 图片加载完成回调
          image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(image, 0, 0, Math.round(100 / this.data.rateW), Math.round(150 / this.data.rateW))
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const offsetPosIndex = 4 * (offsetHeight * canvas.width + offsetLeft);
            resolve(imageData.data[offsetPosIndex] + imageData.data[offsetPosIndex + 1] + imageData.data[offsetPosIndex + 2])
          }
      })
    })
  },
  pageTapClick(event) {
    // 获取点击位置相对于页面的位置
    const pageX = this.data.rateW * event.touches[0].pageX;
    const pageY = this.data.rateW * event.touches[0].pageY;
    // 获取符合该点位置的田地
    const clickedField = this.data.fields.filter(field => {
      return field.left <= pageX &&
        (field.left + field.width) >= pageX &&
        field.top <= pageY &&
        (field.top + field.height) >= pageY
    });
    
    if (!clickedField.length) return;
    console.log("clickedField", clickedField)
    // 获取点击的点在田地里的相对位置
    clickedField.map(field => {
      this.getImgData(
        field.path,
        Math.round((pageX - field.left)/this.data.rateW),
        Math.round((pageY - field.top)/this.data.rateW)
      ).then((imgData) => {
        if (imgData) console.log("field", field)
      })
    })
  }
})

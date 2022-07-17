Page({
  data: {
    cWidth: 750, // 设计稿的宽度
    rateW: 0,
    selectedField: null, // 选中的田地
    fields: [
      {
        path: "/image/tiandi01.png",
        width: 100, height: 150, left: 100, top: 100, id: 1
      },
      {
        path: "/image/tiandi02.png",
        width: 100, height: 150, left: 156, top: 87, id: 2
      },
      {
        path: "/image/tea01.png",
        width: 100, height: 100, left: 100, top: 300, id: 3
      },
      {
        path: "/image/tea02.png",
        width: 100, height: 100, left: 201, top: 300, id: 4
      }
    ]
  },
  onLoad() {
    this.setData({
      rateW: this.data.cWidth / wx.getSystemInfoSync().windowWidth
    });
  },
  pageTapClick(event) {
    this.setData({ selectedField: null });
    wx.setPageStyle({
      style: { overflow: "unset" }
   })
    // 获取点击位置相对于页面的位置
    const pageX = Math.round(this.data.rateW * event.touches[0].pageX);
    const pageY = Math.round(this.data.rateW * event.touches[0].pageY);
    // 获取符合该点位置的田地
    const clickedField = this.data.fields.filter(field => {
      return field.left <= pageX &&
        (field.left + field.width) >= pageX &&
        field.top <= pageY &&
        (field.top + field.height) >= pageY
    });
    if (!clickedField.length) return;
    // 获取点击的点在田地里的相对位置
    clickedField.map(field => {
      this.getImgData(
        field,
        Math.round((pageX - field.left)/this.data.rateW),
        Math.round((pageY - field.top)/this.data.rateW)
      ).then((selectedField) => {
        selectedField && !this.data.selectedField && this.dealField(selectedField)
      })
    })
  },
  getImgData(field, offsetLeft, offsetTop) {
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
          image.src = field.path
          // 图片加载完成回调
          image.onload = () => {
            // 获取田地实际大小
            const fw = field.width / this.data.rateW;
            const fh = field.height / this.data.rateW;
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(image, 0, 0, fw, fh)
            const imageData = ctx.getImageData(0, 0, fw, fh)
            const offsetPosIndex = 4 * (offsetTop * fw + offsetLeft) - 1;
            // 判断是否有像素，确认是否选中图片
            if (
              imageData.data[offsetPosIndex - 3] +
              imageData.data[offsetPosIndex - 2] +
              imageData.data[offsetPosIndex - 1]
            ) resolve(field)
          }
      })
    })
  },
  dealField(selectedField) {
    this.setData({ selectedField })
    wx.setPageStyle({
      style: { overflow: 'hidden' }
   })
  }
})

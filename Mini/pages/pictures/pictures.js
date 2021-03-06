import WeCropper from '../../we-cropper/dist/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = width

// pages/pictures/pictures.js
Page({

  /**
   * Page initial data
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 50,
      zoom: 8,
      cut: {
        x: (width - 200) / 2,
        y: (width - 200) / 2,
        width: 200,
        height: 200
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, I can do something`)
        console.log(`current canvas context: ${ctx}`)
        /*
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
        */
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  uploadImage() {
    const self = this

    wx.chooseImage({
      count: 1,
      //sizeType: ['original', 'compressed'],
      //sourceType: ['album', 'camera'],
      success (res) {
        const src = res.tempFilePaths[0]
        console.log(`load src: ${src}`)

        self.wecropper.pushOrign(src)
      }
    })
  },

  getCropperImage() {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        /*
        wx.previewImage({
          current: '',
          urls: [src]
        })
        */
        var result
        wx.showToast({
          icon: 'loading',
          title: 'uploading'
        })
        const uploadTask = wx.uploadFile({
          url: 'https://luccalu.top/upload',
          filePath: src,
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          //formData: { 'session_token': wx.getStorageSync('session_token') },
          success: function (res) {
            console.log(res)
            if (res.statusCode != 200) {
              wx.showModal({
                title: 'Notice',
                content: 'Failed to upload',
                showCancel: false
              })
              return
            }
            var data = res.data
            /*
            page.setData({
              src: path[0]
            })
            */
            console.log(data)
            console.log(data.substring(0,7))
            console.log(data.substring(8))
            if (data.substring(0,7) == "Success") {
              if (data.substring(8) == "white") {
                result = "yes"
                console.log(result)
              } else {
                result = "no"
              }
            } else {
              result = "no"
            }
            console.log(result)
            const tempUrl = '../result/result?src=' + src + '&resultflag=' + result
            console.log(`go to result: ${tempUrl}`)
            wx.navigateTo({
              //url: '../logs/logs'
              url: tempUrl
            })
          },
          fail: function (e) {
            console.log(e)
            wx.showModal({
              title: 'Notice',
              content: 'Failed to upload',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast()
          }
        })

        uploadTask.onProgressUpdate((res) => {
          console.log('upload process: ', res.progress)
          console.log('uploaded data len: ', res.totalBytesWritten)
          console.log('expect total data len: ', res.totalBytesExpectedToWrite)
        })

        
      } else {
        console.log(`Fail to get picture path!`)
      }
    })
  }
})
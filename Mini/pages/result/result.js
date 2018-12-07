// pages/result/result.js
Page({

  /**
   * Page initial data
   */
  data: {
    src: '../../resources/3M_Logo.jpg',
    result: '推荐使用3M痘痘贴'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(`options.src: ${options.src}`)
    this.setData({
      src: options.src
    })
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

  }
})
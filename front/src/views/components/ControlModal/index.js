/*
 * @Author: your name
 * @Date: 2020-12-23 14:35:37
 * @LastEditTime: 2021-07-13 11:09:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front\src\views\components\ControlModal\index.js
 */
import ControlComponent from '@/views/components/ControlModal/commonModal.vue'

let _instance


// 这里是重点
const module = {
    install: function(Vue) {
      // Vue.component('ControlModal', CommonModel)
      const ControlModal = Vue.extend(ControlComponent);
      const getInstance = function () {
        if (!instance) {
          _instance = new ControlModal(
                        // {
                    //   el: document.createElement('div')
                    // }
                    )
                    let el = _instance.$mount().$el;
                    document.body.appendChild(el)
                }
                return _instance
            } 
        const control = {
          show (options) {
            let instance = getInstance()
            Object.assign(instance, options);
            // instance.show()
            instance.visible = true
            // $vm.h5url = h5url
            console.log("show video", options)
          },
          hide () {
            let instance = getInstance()
            instance.visible = false
          },
          isVisible () {
              let instance = getInstance()
            return instance.visible
          }
        }

    // Vue.mixin({ 　
    //   created: function () {
    //     this.$control = control
    //   }
    // })
        Vue.prototype.$control = control

  }
}

// 导出组件
export default module
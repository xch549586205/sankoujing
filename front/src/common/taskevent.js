
import notification from 'ant-design-vue/lib/notification';
import message from 'ant-design-vue/lib/message';
import moment from 'moment';
import store from '@/store';
import Vue from 'vue';
import service from 'servicePath/index';
import { router } from '@/router/index';
const { deviceManageAsk } = service;

var ws = null

var interval = null

var onclose = function (ev) {
    console.log('websocket已断开',ev)
    ws = null
    if (!interval) {
      clearInterval(interval)
      interval = null
    }
  // message.success('websocket已断开')
};
var onmessage = function (ev) {
    console.log(ev)
    var data = JSON.parse(ev.data)


    store.dispatch("messageManage/addMessage", data)

    notification.open({
        message: data.name,
        description: data.summary,
        placement: 'bottomRight',
        // icon: <a-icon type="smile" style="color: #108ee9" />,
        // onClose: () => {

        // },
        onClick: (e) => {
            console.log('click', e)

        if (data && data.type === "service") {
          if (data.content) {
            let sdata = JSON.parse(data.content)
            if (sdata.effects) {
              sdata.effects.forEach(device => {
                if (device.actions) {
                  device.actions.forEach(action => {
                    if (action.attrmethod === "video") {
                      deviceManageAsk.getDevice({id: device.deviceid}).then(devresp => {
                        const { errcode, data = {} } = devresp
                          const { deviceInfos = [] } = data;
                          if (!deviceInfos || deviceInfos.length == 0) {
                              return
                          }
                          const dev = deviceInfos[0]
                          deviceManageAsk
                            .getProduct({ id: dev.productid })
                            .then((result) => {
                              const { errcode, data = {} } = result;
                              if (errcode === 200) {
                                const { productsinfo = [] } = data;
                                if (productsinfo && productsinfo[0] && productsinfo[0].h5url) {
                                  let h5url = productsinfo[0].h5url + '?data=' + dev.privatedata;

                                  Vue.prototype.$control.show({h5url})
                                  return;
                                }
                              }
                            })
                            .catch((e) => {
                             console.error(e);
                            });
                      })
                    }
                  })
                }
              })
            }
          }
        } else {
            if (data.link == "普通定时" || data.link == "自定义定时") {
              router.push({name: 'timingTask'})
            } else if (data.link == "联动") {
              router.push({ name: 'linkageTask' })
            } else if (data.link == "场景") {
              router.push({ name: 'sceneTask' })
            }
          }
      }
    });
};
var onerror = function (ev) {
    console.log(ev)
    if (!interval) {
      clearInterval(interval)
      interval = null
    }
}
var onopen = function(evt) { 
  console.log('websocket已订阅', evt); 
  if (ws) {
    let message = {
      method: "subscribe",
      param: JSON.stringify(["message","service"]),
    }
    ws.send(JSON.stringify(message))

    interval = setInterval(() => {
      if (ws) {
        let message = {
          method: "heartbeat",
          param: JSON.stringify({}),
        }
        ws.send(JSON.stringify(message))
      }
    }, 10000)
  }
  // message.success('websocket已订阅')
};



export default {
    open: function() {
        if (!ws) {
            const auth = JSON.parse(localStorage.getItem(`authB_${PROJECT.id}`) || '{}');
            const { token, expired } = auth;
            // console.log("websocket", location.host)
            // var headers = {
            //     client : 'web',
            //     timestamp: `${moment().unix()}`,
            //     interfaceVersion: '1',
            //     token
            // }
            ws = new WebSocket(`ws://${location.host}/v1/message/notify?token=${token}&client=web&timestamp=${moment().unix()}&interfaceVersion=1&sign=1`);
            ws.onopen = onopen
            ws.onclose = onclose
            ws.onmessage = onmessage
            ws.onerror = onerror
        }
        return ws
    },
    close: function() {
        if (ws) {
            ws.close()
            ws = null
        }
    },
    // handleMessage: function(handler) {
    //     if (ws) { ws.onmessage = handler }
    // },
    // handleError: function(handler) {
    //     if (ws) { ws.onerror = handler }
    // },
}
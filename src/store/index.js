import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    CarPanelData: [],
    receiveInfo: [{
      'name': '王某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际西6号楼319室',
      'default': true,
      'checked': true
    }, {
      'name': '李某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际东6号楼350室',
      'default': false,
      'checked': false
    }],
    maxOff: false,
    carShow: false,
    aTimer: null,
    ball: {
      show: false,
      el: null,
      img: ''
    },
    popShow: true,
    order: []
  },
  getters: {
    totlecount(state) {
      let count = 0
      state.CarPanelData.forEach((goods) => {
        count += goods.count
      })
      return count
    },
    totleprice(state) {
      let price = 0
      state.CarPanelData.forEach((goods) => {
        price += goods.count * goods.price
      })
      return price
    },
    checkedPrice(state) {
      let total = 0
      state.CarPanelData.forEach((goods) => {
        if (goods.checked) { total += goods.price * goods.count }
      })
      return total
    },
    checkedgoods(state) {
      const checkedItem = state.CarPanelData.filter((goods) => {
        return goods.checked === true
      })
      return checkedItem
    }
  },
  mutations: {
    addCarPanelData(state, data) {
      if (!state.ball.show) {
        let bOff = true
        if (state.CarPanelData.length > 0) {
          state.CarPanelData.forEach((goods) => {
            if (goods.sku_id === data.info.sku_id) {
              bOff = false
              goods.count += data.count
              if (goods.count > goods.limit_num) {
                goods.count -= data.count
                state.maxOff = true
                return
              }
              state.ball.el = event.path[0]
              state.ball.show = true
              state.ball.img = data.info.ali_image
              state.carShow = true
            }
          })
        }

        if (bOff) {
          const goodsData = data.info
          Vue.set(goodsData, 'count', data.count)
          Vue.set(goodsData, 'checked', true)
          state.CarPanelData.push(goodsData)
          state.carShow = true
          state.ball.el = event.path[0]
          state.ball.show = true
          state.ball.img = data.info.ali_image
        }
      }
    },
    delCarPanelData(state, id) {
      state.CarPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          state.CarPanelData.splice(index, 1)
          return false
        }
      })
    },
    plusCarPanelData(state, id) {
      const nowItem = state.CarPanelData.filter((goods) => {
        return goods.sku_id === id
      })[0]
      if (nowItem.count >= nowItem.limit_num) {
        nowItem.count = nowItem.limit_num
        return false
      }
      nowItem.count++
    },
    subCarPanelData(state, id) {
      const nowItem = state.CarPanelData.filter((goods) => {
        return goods.sku_id === id
      })[0]
      if (nowItem.count <= 1) {
        nowItem.count = 1
        return false
      }
      nowItem.count--
    },
    submitReceive(state, data) {
      if (data.receive.default) {
        state.receiveInfo.forEach(receive => {
          receive.default = false
          receive.checked = false
        })
      }
      console.log(data.index)
      if (data.index != -1) {
        state.receiveInfo.splice(data.index, 1, data.receive)
      } else {
        state.receiveInfo.push(data.receive)
      }
    },
    submitOrderfn(state, order) {
      state.CarPanelData.forEach((item, index) => {
        if (item.checked) {
          state.CarPanelData.splice(index, 1)
        }
      })
      state.order.unshift(order)
    },
    payNow(state, orderId) {
      state.order.forEach((item) => {
        if (item.orderId === orderId) {
          item.isPay = true
        }
      })
    },
    checkDefault(state, item) {
      state.receiveInfo.forEach((receive) => {
        receive.default = false
        receive.checked = false
        if (receive === item) {
          receive.default = true
          receive.checked = true
        }
      })
    },
    deleteAddress(state, item) {
      state.receiveInfo.filter((receive, index) => {
        if (receive === item) {
          state.receiveInfo.splice(index, 1)
        }
      })
    },
    closePrompt(state) {
      state.maxOff = false
    },
    colsePop(state) {
      state.popShow = false
    },
    showCar(state) {
      clearTimeout(state.aTimer)
      state.carShow = true
    },
    hideCar(state) {
      state.aTimer = setTimeout(() => {
        state.carShow = false
      }, 500)
    }
  }
})
export default store

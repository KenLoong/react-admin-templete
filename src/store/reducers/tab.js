import { createSlice } from '@reduxjs/toolkit'

const tabSlice = createSlice({
  name: 'tab',
  initialState: { // initialState是用来定义属性的？
    isCollapse: false, // 默认是false状态
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页'
      }
    ],
    currentMenu: {}
  },
  reducers: {
    // 状态变更（取反即可）
    collapseMenu: state => {
      state.isCollapse = !state.isCollapse
    },
    selectMenuList: (state, { payload: val }) => {
      if (val.name !== 'home') {
        state.currentMenu = val
        const result = state.tabsList.findIndex(item => item.name === val.name)
        if (result === -1) {
          state.tabsList.push(val)
          console.log(state.tabsList, 'selectMenuList')
        }
      } else {
        state.currentMenu = null
      }
    },
    closeTab: (state, { payload: val }) => {
      let res = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(res, 1)
    },
    setCurrentMenu: (state, { payload: val }) => {
      if (val.name === 'home') {
        state.currentMenu = {}
      } else {
        state.currentMenu = val
      }
    }
  }
})
// 导出函数
export const { collapseMenu, selectMenuList, closeTab, setCurrentMenu } = tabSlice.actions
export default tabSlice.reducer
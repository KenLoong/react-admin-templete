import { configureStore } from '@reduxjs/toolkit'
import TabReducer from './reducers/tab'

// 使用redux来实现状态管理:tab就是定义的一个状态实例,也就是名字
export default configureStore({
    reducer: {
        tab: TabReducer
    }
})
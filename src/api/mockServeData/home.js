// mock数据模拟
import Mock from 'mockjs'

// 图表数据
let List = []
export default {
  getStatisticalData: () => {
    return {
      code: 20000,
      data: {
        // 饼图数据
        videoData: [
          { name: '小米', value: 2999 },
          { name: '苹果', value: 5999 },
          { name: 'vivo', value: 1500 },
          { name: 'oppo', value: 1999 },
          { name: '魅族', value: 2200 },
          { name: '三星', value: 4500 }
        ],
        // 柱状图数据
        userData: [
          { date: '周一', new: 5, active: 200 },
          { date: '周二', new: 10, active: 500 },
          { date: '周三', new: 12, active: 550 },
          { date: '周四', new: 60, active: 800 },
          { date: '周五', new: 65, active: 550 },
          { date: '周六', new: 53, active: 770 },
          { date: '周日', new: 33, active: 170 }
        ]
      }
    }
  }
}

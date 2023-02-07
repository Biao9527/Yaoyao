<template>
	<view>
    <NavBar title="统计"/>
    <view class="charts-box">
      <qiun-data-charts
          type="pie"
          :opts="opts"
          :chartData="chartData"
      />
    </view>
  <CustomTabBar :active-index="3"
                :operation-height="operationHeight"/>
	</view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";
import {mapState, mapGetters} from 'vuex'

	export default {
    components: {
      CustomTabBar,
      NavBar
    },
    onReady() {
      this.getServerData();
    },
    computed: {
      ...mapState([
        'operationHeight'
      ]),
      ...mapGetters([
        'getAccountList',
        'getMyTableList'
      ])
    },
		data() {
			return {
        chartData: {},
        opts: {
          color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
          padding: [5,5,5,5],
          enableScroll: false,
          extra: {
            pie: {
              activeOpacity: 0.5,
              activeRadius: 10,
              offsetAngle: 0,
              labelWidth: 15,
              border: true,
              borderWidth: 3,
              borderColor: "#FFFFFF",
              linearType: "custom"
            }
          }
        }
			};
		},
    methods: {
      getServerData() {
        //模拟从服务器获取数据时的延时
          //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        const dataList = []
        this.getMyTableList.map(item => {
          const list = this.getAccountList.filter(i => i.tableId === item.id)
          if (list && list.length > 0) {
            let money = 0
            list.map(items => {
              money += Number(items.money)
            })
            dataList.push({"name": item.name, "value": money})
          }
        })
        let res = {
            series: [
              {
                data: dataList
              }
            ]
          };
          this.chartData = JSON.parse(JSON.stringify(res));
      },
    }
	}
</script>

<style lang="scss">
.charts-box {
  width: 100%;
  height: 300px;
}
</style>

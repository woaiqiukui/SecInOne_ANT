<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('漏洞总数')" :total="totalVuln.toString()">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('中高危漏洞数')" :total="vulnHighCount.toString()">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('待修复漏洞')" :total="vulnUnfixedCount.toString()">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('已修复漏洞')" :total="vulnFixedCount.toString()">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
          </div>
          <a-tab-pane loading="true" :tab="$t('待修复漏洞总数')" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" :title="$t('漏洞趋势')" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('中心漏洞数量排名')" :list="vulnUnfixedRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane :tab="$t('已修复漏洞总数')" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" :title="$t('修复数量趋势')" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('中心修复漏洞数量排名')" :list="vulnFixedRank"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="$t('漏洞TOP')" :style="{ height: '100%' }">
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="vulnTableColumns"
                :dataSource="vulnTop"
                :pagination="{ pageSize: 10 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="$t('部门漏洞占比')" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;">
              <!-- style="bottom: 12px;display: inline-block;" -->
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group v-model="selectedCenter" @change="updatePieData">
                  <a-radio-button value="all">全部中心</a-radio-button>
                  <a-radio-button v-for="center in centersData" :key="center.name" :value="center.name">
                    {{ center.name }}
                  </a-radio-button>
                </a-radio-group>
              </div>

            </div>
            <h4>{{ $t('漏洞数量') }}</h4>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>

            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { getVulnCount, getVulnHighCount, getVulnUnfixedCount, getVulnFixedCount, getVulnUnfixedRank, getVulnFixedRank, getVulnTop, getVulnTopCenter } from '@/api/assets'

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '紧急', count: 0 },
  { item: '高危', count: 0 },
  { item: '中危', count: 17 },
  { item: '低危', count: 13 }
]

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,

      //
      pieScale,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },

      totalVuln: 0,
      vulnHighCount: 0,
      vulnUnfixedCount: 0,
      vulnFixedCount: 0,
      barData: Array.from({ length: 12 }, (_, i) => ({
        x: `${i + 1}月`,
        y: 0
      })),
      barData2: Array.from({ length: 12 }, (_, i) => ({
        x: `${i + 1}月`,
        y: 0
      })),
      vulnUnfixedRank: [],
      vulnFixedRank: [],
      vulnTop: [],
      centersData: [],
      selectedCenter: 'all', // 默认选项
      pieData: [] // 用于存储饼图数据
    }
  },
  computed: {
    vulnTableColumns () {
        return [
      {
        dataIndex: 'index',
        title: '排名',
        width: 90
      },
      {
        dataIndex: 'keyword',
        title: '漏洞名称'
      },
      {
        dataIndex: 'count',
        title: '漏洞数量'
      }
      ]
    }
  },
  methods: {
    async fetchData () {
      try {
        const vulnCountResponse = await getVulnCount()
        const vulnHighCountResponse = await getVulnHighCount()
        const vulnUnfixedCountResponse = await getVulnUnfixedCount()
        const vulnFixedCountResponse = await getVulnFixedCount()

        this.totalVuln = vulnCountResponse
        this.vulnHighCount = vulnHighCountResponse
        this.vulnUnfixedCount = vulnUnfixedCountResponse
        this.vulnFixedCount = vulnFixedCountResponse

        const vulnUnfixedRankResponse = await getVulnUnfixedRank()
        const vulnFixedRankResponse = await getVulnFixedRank()

        // 转换获得的排名响应
        this.vulnUnfixedRank = vulnUnfixedRankResponse.map(item => ({
          name: item.charge_center,
          total: item.total
        }))
        this.vulnFixedRank = vulnFixedRankResponse.map(item => ({
          name: item.charge_center,
          total: item.total
        }))
        this.barData = this.initializeYearData(vulnUnfixedRankResponse)
        this.barData2 = this.initializeYearData(vulnFixedRankResponse)

        // 获取漏洞TOP
        const vulnTopResponse = await getVulnTop()
        this.vulnTop = vulnTopResponse.map((item, index) => ({
          index: index + 1,
          keyword: item.title,
          count: item.total
        }))

        // 获取中心漏洞TOP
        const response = await getVulnTopCenter() // 假设这个API返回所有中心的漏洞数据
        this.centersData = response.map(center => ({
          name: center.charge_center,
          data: [
            { item: '紧急', count: center.critical },
            { item: '高危', count: center.high },
            { item: '中危', count: center.medium },
            { item: '低危', count: center.low }
          ]
        }))
        this.updatePieData('all') // 初始化饼图数据

        this.loading = false
      } catch (error) {
        console.error('Error fetching data:', error)
        this.loading = false
      }
    },
    initializeYearData (dataResponse) {
      // 创建一个映射，其键是月份，值是该月所有条目的total之和
      const monthlyTotals = dataResponse.reduce((acc, item) => {
        const month = item.month
        if (acc.has(month)) {
          acc.set(month, acc.get(month) + item.total)
        } else {
          acc.set(month, item.total)
        }
        return acc
      }, new Map())

      // 获取当前年份
      const currentYear = new Date().getFullYear()

      // 生成包含每个月数据的数组
      return Array.from({ length: 12 }, (_, i) => {
        const monthKey = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`
        return {
          x: `${i + 1}月`,
          y: monthlyTotals.get(monthKey) || 0 // 使用聚合的total或默认为0
        }
      })
    },
    // 在methods中添加一个方法来更新饼图数据
    updatePieData (centerName) {
      let value = centerName
      // 检查是否是事件对象，并且确保target及value存在
      if (centerName && centerName.target && 'value' in centerName.target) {
        value = centerName.target.value
      }

      // Now use `value` for your checks
      if (value === 'all') {
        this.pieData = this.centersData.flatMap(center => center.data)
      } else {
        const center = this.centersData.find(c => c.name === value)
        this.pieData = center ? center.data : []
      }

      // 如果需要更新视图，确保处理DataSet
      const dv = new DataSet.View().source(this.pieData)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this.pieData = dv.rows
    }
  },
  created () {
    this.fetchData()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    :deep(.ant-card-head) {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>

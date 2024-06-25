<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
    <template slot="tags" slot-scope="text, record">
      <a-tag
        v-for="(count, level) in record.vulnerabilities || {}"
        :key="level"
        :color="getVulnColor(level)">
        {{ level }}: {{ count }}
      </a-tag>
    </template>
    <template slot="action" slot-scope="{ record }">
      <a @click="showDetails(record)">详情</a>
    </template>
  </a-table>
</template>

<script>
import { notification } from 'ant-design-vue'
import { getAssetsVuln } from '@/api/assets'

export default {
  data () {
    return {
      columns: [
        { title: '所属中心', dataIndex: 'charge_center', key: 'charge_center' },
        { title: '资产名称', dataIndex: 'name', key: 'name' },
        { title: '资产类型', dataIndex: 'asset_type', key: 'asset_type' },
        { title: 'IP', dataIndex: 'ip', key: 'ip' },
        { title: '资产负责人', dataIndex: 'charge', key: 'charge' },
        {
          title: '漏洞信息',
          key: 'tags',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [], // 此处将填充API的数据
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    getVulnColor (level) {
      const colors = {
        '紧急': 'red',
        '高危': 'volcano',
        '中危': 'gold',
        '低危': 'green'
      }
      return colors[level] || 'blue'
    },
    fetchData (page = this.pagination.current, pageSize = this.pagination.pageSize) {
      getAssetsVuln({
        page: page,
        pageSize: pageSize
      }).then(response => {
        this.data = response.data.map(item => ({
          key: item.asset_uuid,
          name: item.name,
          asset_type: item.asset_type,
          ip: item.ip,
          charge: item.charge,
          charge_center: item.charge_center,
          vulnerabilities: this.processVulnerabilities(item.vulnerabilities)
        }))
        // 更新分页总数
        this.pagination.total = response.pagination.total
      }).catch(error => {
        notification.error({
          message: '加载失败',
          description: '无法加载资产数据'
        })
        console.error('Error fetching assets:', error)
      })
    },
    processVulnerabilities (vulns) {
      if (!vulns) return {}
      const result = {}
      Object.keys(vulns).forEach(level => {
        result[level] = vulns[level].count
      })
      return result
    },
    showDetails (record) {
      this.$router.push({ name: 'AssetDetails', params: { id: record.key } })
    },
    handleTableChange (pagination, filters, sorter) {
      // 提取新的分页信息
      const { current, pageSize } = pagination

      // 更新内部分页状态
      this.pagination.current = current
      this.pagination.pageSize = pageSize

      // 使用新的分页信息重新获取数据
      this.fetchData(current, pageSize)
    }
  },
  created () {
    this.fetchData(this.pagination.current, this.pagination.pageSize)
  }
}
</script>

<style scoped>
/* 如果有需要，此处添加样式 */
</style>

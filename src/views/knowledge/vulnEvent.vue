<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :rowKey="record => record.key"
  >
    <template slot="severity" slot-scope="text, record">
      <a-tag :color="getSeverityColor(record.severity)">
        {{ record.severity }}
      </a-tag>
    </template>
    <template slot="tags" slot-scope="text, record">
      <a-tag v-for="(tag, index) in record.tags" :key="index" :color="'blue'">
        {{ tag }}
      </a-tag>
    </template>
    <template slot="description" slot-scope="text, record">
      <a-tooltip :title="record.description">
        <span>{{ truncateText(record.description, 50) }}</span>
      </a-tooltip>
    </template>
    <template slot="from" slot-scope="text, record">
      <a-tooltip :title="record.from">
        <a :href="record.from" target="_blank">{{ truncateText(record.from, 30) }}</a>
      </a-tooltip>
    </template>
  </a-table>
</template>

<script>
import { notification } from 'ant-design-vue'
import { getVulnEvent } from '@/api/knowledge'
import moment from 'moment'

export default {
  data () {
    return {
      columns: [
        { title: '漏洞编号', dataIndex: 'cve', key: 'cve' },
        { title: '漏洞名称', dataIndex: 'title', key: 'title' },
        { title: '漏洞简介', dataIndex: 'description', key: 'description', scopedSlots: { customRender: 'description' } },
        { title: '漏洞等级', dataIndex: 'severity', key: 'severity', scopedSlots: { customRender: 'severity' } },
        { title: '缓解措施', dataIndex: 'solutions', key: 'solutions' },
        { title: 'tags', dataIndex: 'tags', key: 'tags', scopedSlots: { customRender: 'tags' } },
        { title: 'URL', dataIndex: 'from', key: 'from', scopedSlots: { customRender: 'from' } },
        { title: '发现时间', dataIndex: 'update_time', key: 'update_time' }
      ],
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `Total ${total} items`,
        showQuickJumper: true
      },
      loading: false
    }
  },
  methods: {
    fetchData (page = this.pagination.current, pageSize = this.pagination.pageSize) {
      this.loading = true
      getVulnEvent({
        page: page,
        page_size: pageSize
      }).then(response => {
        if (response && response.security_events && Array.isArray(response.security_events)) {
          this.data = response.security_events.map(vuln => {
            console.log('vuln:', vuln)
            // Use moment.js to parse and format the date string
            const formattedDate = moment(vuln[14]).format('YYYY/MM/DD')
            let tags = []
            try {
              tags = JSON.parse(vuln[9])
            } catch (e) {
              console.error('Error parsing tags:', e)
            }

            return {
              key: vuln[1],
              cve: vuln[5] || 'No CVE',
              title: vuln[2],
              description: vuln[3] || 'No description',
              severity: vuln[4],
              solutions: vuln[7] || 'No solutions',
              tags: tags,
              from: vuln[11] || 'No URL',
              update_time: formattedDate // Use formatted date
            }
          }).filter(vuln => vuln !== null) // Filter out any null entries
          // Update pagination information
          this.pagination.total = response.total_pages * pageSize
          this.pagination.current = page
        } else {
          throw new Error('Unexpected response format')
        }
      }).catch(error => {
        notification.error({
          message: '加载失败',
          description: '无法加载漏洞数据'
        })
        console.error('Error fetching vulnerabilities:', error)
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      // Extract new pagination information
      const { current, pageSize } = pagination

      // Fetch new data with updated pagination
      this.fetchData(current, pageSize)
    },
    getSeverityColor (severity) {
      switch (severity) {
        case '严重':
          return 'red'
        case '高危':
          return 'orange'
        case '中危':
          return 'yellow'
        case '低危':
          return 'green'
        default:
          return 'blue'
      }
    },
    truncateText (text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text
    }
  },
  created () {
    this.fetchData(this.pagination.current, this.pagination.pageSize)
  }
}
</script>

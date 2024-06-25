<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" @change="handleTableChange">
    <template slot="label" slot-scope="text, record">
      <a-tag :color="'blue'">
        {{ record.label }}
      </a-tag>
    </template>
  </a-table>
</template>

<script>
import { notification } from 'ant-design-vue'
import { getSecEvent } from '@/api/knowledge'
import moment from 'moment'

export default {
  data () {
    return {
      columns: [
        { title: '标题', dataIndex: 'subject', key: 'subject' },
        { title: '内容', dataIndex: 'content', key: 'content' },
        { title: '标签', dataIndex: 'label', key: 'label', scopedSlots: { customRender: 'label' } },
        { title: 'URL', dataIndex: 'url', key: 'url' },
        { title: '时间', dataIndex: 'date', key: 'date' }
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
      getSecEvent({
        page: page,
        page_size: pageSize
      }).then(response => {
        if (response && response.security_events && Array.isArray(response.security_events)) {
          this.data = response.security_events.map(event => {
            const [id, dateStr, source, subject, content, url] = event
            console.log('Original date:', dateStr)
            if (!url) {
              throw new Error('URL cannot be null')
            }

            // Use moment.js to parse and format the date string
            const formattedDate = moment(dateStr, 'YYYY年MM月DD日 HH:mm').format('YYYY/MM/DD')

            return {
              key: id,
              subject: subject,
              content: content || 'No content',
              url: url,
              date: formattedDate, // Use formatted date
              label: source // Assuming `source` is the label you want to display
            }
          })
          // Update pagination information
          this.pagination.total = response.total_pages * pageSize
          this.pagination.current = page
        } else {
          throw new Error('Unexpected response format')
        }
      }).catch(error => {
        notification.error({
          message: '加载失败',
          description: '无法加载资产数据'
        })
        console.error('Error fetching assets:', error)
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      // Extract new pagination information
      const { current, pageSize } = pagination

      // Fetch new data with updated pagination
      this.fetchData(current, pageSize)
    }
  },
  created () {
    this.fetchData(this.pagination.current, this.pagination.pageSize)
  }
}
</script>

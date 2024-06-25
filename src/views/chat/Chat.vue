<template>
  <div>
    <vue-advanced-chat
      height="calc(100vh - 20px)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
    />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import axios from 'axios'

register()

export default {
  data () {
    return {
      currentUserId: '1234',
      rooms: [
        {
          roomId: '1',
          roomName: 'Room 1',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
          users: [
            { _id: '1234', username: 'John Doe' },
            { _id: '4321', username: 'John Snow' }
          ]
        }
      ],
      messages: [],
      messagesLoaded: false,
      apiKey: 'sk-YKirvvcWBY' // 你的 API 密钥
    }
  },

  methods: {
    fetchMessages (options = {}) {
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true)
        } else {
          this.messages = [...this.addMessages(), ...this.messages]
          this.messagesLoaded = true
        }
      }, 1000)
    },

    addMessages (reset) {
      const messages = []

      messages.push({
        _id: this.messages.length,
        content: '你好，我是皮蛋，我是安全情报领域的AI助手。我的任务是协助处理和自动化安全相关的任务与信息收集。我能帮你做点什么？',
        senderId: '4321',
        username: 'John Doe',
        date: '13 November',
        timestamp: '10:20'
      })

      return messages
    },

    async sendMessage (message) {
      const content = message.content

      // 添加用户发送的消息到消息列表中
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString()
        }
      ]

      // 调用后端 API
      try {
        const response = await axios.post('/chat-api', {
          input: {
            prompt: content
          },
          parameters: {},
          debug: {}
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        })

        const reply = response.data.output.text // 获取后端返回的文本

        // 将后端回复添加到消息列表中
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: reply,
            senderId: '4321', // 假设 4321 是后端回复的 ID
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
      } catch (error) {
        console.error('Error sending message to backend:', error)
      }
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: 'Quicksand', sans-serif
}
</style>

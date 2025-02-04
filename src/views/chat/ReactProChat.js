// ReactProChat.js

import { ProChat } from '@ant-design/pro-chat'
import { useTheme } from 'antd-style'

const ReactProChat = () => {
  const theme = useTheme()

  return (
    <div style={{ background: theme.colorBgLayout }}>
      <ProChat
        helloMessage={
          '欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)'
        }
        request={async (messages) => {
          const mockedData = `这是一段模拟的对话数据。本次会话传入了${messages.length}条消息`
          return new Response(mockedData)
        }}
      />
    </div>
  )
}

export default ReactProChat

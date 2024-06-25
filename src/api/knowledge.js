import request from '@/utils/request'

const knowledgeApi = {
  // 获取前沿资讯
  secEvent: '/security-event/SecEvent',
  // 获取漏洞情报
  vulnEvent: 'vuln-event/VulnEvent'
}

export function getSecEvent (params) {
  return request({
    url: knowledgeApi.secEvent,
    method: 'get',
    params: params
  })
}

export function getVulnEvent (params) {
  return request({
    url: knowledgeApi.vulnEvent,
    method: 'get',
    params: params
  })
}

import request from '@/utils/request'

const assetsApi = {
  // 漏洞总数
  vulnCount: '/assets/total_vulnerabilities',
  // 中高危漏洞数
  vulnHighCount: '/assets/critical_high_vulnerabilities',
  // 待修复漏洞数
  vulnUnfixedCount: '/assets/pending_vulnerabilities',
  // 已修复漏洞数
  vulnFixedCount: '/assets/fixed_vulnerabilities',
  // 中心未修复漏洞数量排名
  vulnUnfixedRank: '/assets/vulnerabilities/stats/monthly/pending',
  // 中心已修复漏洞数量排名
  vulnFixedRank: '/assets/vulnerabilities/stats/monthly/fixed',
  // 漏洞TOP
  vulnTop: '/assets/vulnerabilities/statistics',
  // 前三名漏洞最多中心
  vulnTopCenter: '/assets/departments/top-vulnerabilities',

  // 获取资产漏洞列表
  assetsVuln: '/assets/vulnerabilities',
  // 获取漏洞清单
  vulnList: '/assets/vulnerabilities/details'
}

export function getVulnCount () {
  return request({
    url: assetsApi.vulnCount,
    method: 'get'
  })
}

export function getVulnHighCount () {
  return request({
    url: assetsApi.vulnHighCount,
    method: 'get'
  })
}

export function getVulnUnfixedCount () {
  return request({
    url: assetsApi.vulnUnfixedCount,
    method: 'get'
  })
}

export function getVulnFixedCount () {
  return request({
    url: assetsApi.vulnFixedCount,
    method: 'get'
  })
}

export function getVulnUnfixedRank () {
  return request({
    url: assetsApi.vulnUnfixedRank,
    method: 'get'
  })
}

export function getVulnFixedRank () {
  return request({
    url: assetsApi.vulnFixedRank,
    method: 'get'
  })
}

export function getVulnTop () {
  return request({
    url: assetsApi.vulnTop,
    method: 'get'
  })
}

export function getVulnTopCenter () {
  return request({
    url: assetsApi.vulnTopCenter,
    method: 'get'
  })
}

export function getAssetsVuln (params) {
  return request({
    url: assetsApi.assetsVuln,
    method: 'get',
    params
  })
}

export function getVulnList (params) {
  return request({
    url: assetsApi.vulnList,
    method: 'get',
    params
  })
}

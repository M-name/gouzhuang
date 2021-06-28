import axios from "../axios"

export default {
      // 新增选手信息
      voteCandidateCreate(params) {
          return axios.post('/vote/candidate/create',params)
     },
     // 修改选手信息
     voteCandidateUpdate(params) {
          return axios.post('/vote/candidate/update',params)
     },
     // 删除选手信息
     voteCandidateDel(params) {
          return axios.get('/vote/candidate/del/'+params)
     },
      // 新增基础信息
      voteCreate(params) {
          return axios.post('/vote/create',params)
     },
     // 修改基础信息
     voteUpdate(params) {
          return axios.post('/vote/update',params)
     },
     // 查询投票基本信息
     voteFind(params) {
          return axios.get('/vote/find/'+params)
     },
     // 新增投票规则
     voteRuleCreate(params) {
          return axios.post('/vote/rule/create',params)
     },
     // 修改投票规则
     voteUpdateRule(params) {
          return axios.post('/vote/update/rule',params)
     },
     // 查询投票规则
     voteFindRule(params) {
          return axios.get('/vote/find/rule/'+params)
     },
     // 查询选手列表
     voteCandidateList(params) {
          return axios.get('/vote/candidate/list',{params})
     },
      // 新增选手分组
      voteGroupCreate(params) {
          return axios.post('/vote/group/create',params)
     },
      // 修改选手分组
      voteGroupUpdate(params) {
          return axios.post('/vote/group/update',params)
     },
     // 删除选手分组
     voteGroupDel(params) {
          return axios.get('/vote/group/del/'+params)
     },
     // 查询某一个选手分组
     voteFindGroup(params) {
          return axios.get('/vote/find/group/'+params)
     },
     // 查询选手编号
     voteCandidateOrder(params) {
          return axios.get('/vote/candidate/order',{params})
     },
     // 返回枚举类
     voteGetEnum(params) {
          return axios.get('/vote/getEnum',params)
     },
     // 查询选手分组
     voteGroupList(params) {
          return axios.get('/vote/group/list',{params})
     },
     // 查询投票列表
     voteList(params) {
          return axios.get('/vote/list',{params})
     },
     // 查询投票活动统计
     voteStatistics(params) {
          return axios.get('/vote/statistics',params)
     },
     // 查询某一个选手
     voteFindCandidate(params) {
          return axios.get('/vote/find/candidate/'+params)
     },
     // 修改投票活动状态
     voteUpdateStatus(params) {
          return axios.get('/vote/update/status',{params})
     },
     // 删除投票活动
     voteDel(params) {
          return axios.get('/vote/del/'+params)
     },
     // 查询选手排名
     voteCandidateRanking(params) {
          return axios.get('/vote/candidate/ranking',{params})
     },
     // 查询投票结果统计
     voteResultStatistics(params) {
          return axios.get('/vote/result/statistics',{params})
     },
}
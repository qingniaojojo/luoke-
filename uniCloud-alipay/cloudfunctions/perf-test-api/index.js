'use strict'

exports.main = async (event, context) => {
  try {
    let body = event.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch (e) { return { errCode: -1, errMsg: 'invalid json body' } }
    }
    const { action, params } = body || {}

    if (action === 'login') {
      const db = uniCloud.database()
      const { username } = params || {}
      const userRes = await db.collection('uni-id-users')
        .where({ username })
        .field({ _id: true, username: true, nickname: true, role: true, status: true })
        .limit(1)
        .get()

      if (!userRes.data || userRes.data.length === 0) {
        return { errCode: 10001, errMsg: '用户不存在' }
      }

      const user = userRes.data[0]
      return {
        errCode: 0,
        token: 'perf-token-' + user._id,
        uid: user._id,
        username: user.username,
        userInfo: user
      }
    }

    if (action === 'queryUsers') {
      const db = uniCloud.database()
      const { limit = 20, skip = 0 } = params || {}
      const result = await db.collection('uni-id-users')
        .skip(skip)
        .limit(limit)
        .get()
      return result
    }

    return { errCode: -1, errMsg: 'unknown action: ' + action }
  } catch (err) {
    return {
      errCode: -999,
      errMsg: err.message || String(err),
      stack: err.stack
    }
  }
}
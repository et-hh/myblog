// import { isPostIdValid } from '@/plugins'
import request from '@/plugins/request.js'

// export const login = async () => {
//   return await request({
//     url: '/apiBlog/csrf/info',
//     method: 'get'
//   })
// }

export const savePost = async (data) => {
  const rs = await request({
    url: '/apiBlog/article/add',
    method: 'post',
    data
  })

  return rs.data.data
}

export const editPost = async (data) => {
  const rs = await request({
    url: '/apiBlog/article/modify',
    method: 'post',
    data
  })

  return rs.data.data
}

export const getPost = async (id) => {
  if (typeof id === 'string') {
    const { data } = await request({
      url: '/apiBlog/article/detail/' + id,
      method: 'get'
    })

    return data.data
  } else {
    const { data } = await request({
      url: '/apiBlog/article/list',
      method: 'get',
      params: id
    })

    return data.data
  }
}

export const delPost = async id => {
  await request({
    url: '/apiBlog/article/delete',
    method: 'post',
    params: {
      id
    }
  })
}
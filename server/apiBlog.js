/* eslint-disable no-console */
//引入express模块
const express = require("express")
//定义路由级中间件
const router = express.Router()
//引入数据模型模块
const Post = require("./postSchema")

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-type', 'application/json;charset=utf-8')
  res.header('X-Powered-By', '3.2.1')
  res.header('Cache-Control', 'no-store')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200).end()
  } else {
    next()
  }
})

router.post('/article/add', (req, res) => {
  // Post model上的create方法储存数据
  Post.create({
    ...req.body,
    lastUpdated: Date.now()
  }, (err, post) => {
    if (err) {
      res.json({ status: 'fail', error: err })
    } else {
      res.json({ status: 'success', message: '新增成功', data: post._id})
    }
  })
})

router.post('/article/modify', async (req, res) => {
  const { tags, title, excerpt, strippedContent } = req.body

  // Post model上的findOneAndUpdate方法储存数据
  Post.updateOne({ _id: req.body.id }, {
    $set: {
      strippedContent,
      tags,
      title,
      lastUpdated: Date.now(),
      excerpt
    }
  }, { }, function (err, post) {
    if (err) {
      res.json({ status: 'fail', error: err })
    } else {
      
      res.json({ status: 'success', message: '编辑成功', data: req.body.id})
    }
  })
  // res.json({ status: 'success', message: '编辑成功', data: req.params.id})

  // Post.findOne({
  //   _id: req.params.id
  // })

  // try {
  //   await Post.findByIdAndUpdate(req.params.id, {
  //     $set: {
  //       strippedContent: '123'
  //     }
  //     // tags,
  //     // title,
  //     // lastUpdated: Date.now(),
  //     // excerpt,
      
  //   })
  //   res.json({ status: 'success', message: '编辑成功', data: req.params.id})
  // } catch(err) {
  //   res.json({ status: 'fail', error: err })
  // }

  // , (err, post) => {
  //   if (err) {
  //     res.json({ status: 'fail', error: err })
  //   } else {
  //     console.log(post)
  //     res.json({ status: 'success', message: '编辑成功', data: req.params.id})
  //   }
  // }
})

router.get('/article/detail/:id', (req, res) => {
  // Post model上的findById方法查询数据
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.json({ status: 'fail', error: err })
    } else {
      res.json({ status: 'success', message: '查询成功', data: post})
    }
  })
})

router.get('/article/list', (req, res) => {
  // Post model上的findById方法查询数据
  Post.find({}, (err, posts) => {
    if (err) {
      res.json({ status: 'fail', error: err })
    } else {
      res.json({ status: 'success', message: '查询成功', data: posts})
    }
  })
})

router.post('/article/delete', (req, res) => {
  // Post model上的findById方法查询数据
  Post.deleteOne({ _id: req.query.id }, (err) => {
    if (err) {
      res.json({ status: 'fail', error: err })
    } else {
      res.json({ status: 'success', message: '删除成功', data: null})
    }
  })
})

module.exports = router
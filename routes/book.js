const express = require('express');
const database = require('../config/database');
const env = require('../config/env');
const staticRes = require('../config/static');

const router = express.Router();

function randomArray(n,l) {
  let rnd = [];
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l));
  }
  return rnd;
}
function createData(results, key) {
  const data = results[key]
  if (!data.cover.startsWith('http://')) {
    data.cover = `${env.RES_URL}/img${data.cover}`;
  }
  data.selected = false;
  data.private = false;
  data.cache = false;
  data.readers = 0;
  return data
}
function createGuessYouLike(data) {
  const n = parseInt(randomArray(1,3)) + 1;
  data.type = n
  switch(n) {
    case 1:
      data.result = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break;
    case 2:
      data.result = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break;
    case 3:
      data.result = '《Living with Disfigurement》'
      data.percent = data.id % 2 === 0 ? '92%' : '97%'
  }
  return data
}
function createRecommend(data) {
  data.readers = Math.floor(data.id / 2 * randomArray(1,100))
  return data
}
function createCategoryIds(length) {
  return randomArray(length,staticRes.categories.length)
}
function handleData(data) {
  if (!data.cover.startsWith('http://')) {
    data.cover = `${env.RES_URL}/img${data.cover}`;
  }
  data.selected = false
  data.private = false
  data.cache = false
  data.readers = 0
  return data
}
function createCategoryData(data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0,4)
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  return result.filter(item => item.list.length === 4)
}

router.get('/home', (req, res) => {
  const connection = database.createConnection()
  const sql = "select * from book where cover!='';"
  connection.query(sql, (error,result) => {
    if (error) {
      res.json({
        error_code: 1,
        msg: '数据库错误'
      })
    } else {
      const length = result.length
      const guessYouLike = []
      const banner = `${env.RES_URL}/banner/home_banner2.jpg`
      const recommend = []
      const featured = []
      const random = []
      const categoryList = createCategoryData(result)
      const categories = staticRes.categories
      randomArray(9, length).forEach(key => {
        guessYouLike.push(createGuessYouLike(createData(result,key)))
      })
      randomArray(3, length).forEach(key => {
        recommend.push(createRecommend(createData(result,key)))
      })
      randomArray(3, length).forEach(key => {
        featured.push(createData(result,key))
      })
      randomArray(1, length).forEach(key => {
        random.push(createData(result,key))
      })
      res.json({
        error_code: 0,
        data: {
          guessYouLike,
          banner,
          recommend,
          featured,
          random,
          categories,
          categoryList
        }
      })
    }
  })
});
router.get('/detail', (req, res) => {
  const connection = database.createConnection()
  const fileName = req.query.fileName
  const sql = `select * from book where filename='${fileName}';`
  connection.query(sql, (error, result) => {
    if (error) {
      res.json({
        error_code: 1,
        msg: '数据库错误'
      })
    } else {
      if (result && result.length === 0) {
        res.json({
          error_code: 2,
          data: '未找到数据'
        })
      } else {
        res.json({
          error_code: 0,
          data: result[0]
        })
      }
    }
    connection.end()
  })
});
router.get('/list', (req, res) => {
  const connection = database.createConnection();
  const sql = `select * from book where cover!='';`;
  connection.query(sql, (error, result) => {
    if (error) {
      res.json({
        error_code: 1,
        msg: '数据库查询失败'
      });
    } else {
      result.map(item => handleData(item));
      const data = {};
      staticRes.category.forEach(categoryText => {
        data[categoryText] = result.filter(item => item.categoryText === categoryText);
      });
      res.json({
        error_code: 0,
        data,
        total: result.length
      });
    }
    connection.end();
  })
});
router.get('/flat-list', (req, res) => {
  const connection = database.createConnection();
  const sql = `select * from book where cover!='';`;
  connection.query(sql, (error, result) => {
    if (error) {
      res.json({
        error_code: 1,
        msg: '数据库查询失败'
      });
    } else {
      result.map(item => handleData(item));
      res.json({
        error_code: 0,
        result,
        total: result.length
      });
    }
    connection.end();
  })
});
router.get('/shelf', (req, res) => {
  res.json({
    error_code: 0,
    data: {
      bookList: []
    }
  })
});

module.exports = router

const express=require('express')
const bodyParser =require('body-parser')
const app=express()
const mysql = require('mysql2')
const IPAddress='127.0.0.1'//因为这里是要链接远程数据库，ip 地址是 mysql 的地址！！本地就是 127.0.0.1，服务器上就自己找找看
const UserName='root'
const PWD='Zy050501'
const DBName='book'
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//这上面一段固定的，[] 的部分需要根据自己数据库的信息修改



//处理get请求。这里是一个 get 请求的方法演示，作用是查询 table1 表中的所有数据并返回。

app.get('/getUser',(req,res)=>{ //这里的是 get 方法 getUser，对应了刚才的页面发来的请求。就会执行这个方法。
  //参数传入是在 req.body 对象里面。比如上面的语句是获取传入的 openid 变量，并且我们新定义一个叫 openid 的变量存储传入的 openid 变量
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,		//端口号，mysql 固定3306
    user:UserName,
    password:PWD,
    database:DBName
  })//配置连接的属性
  connection.connect();//尝试连接
  connection.query("select * from Book",function(error,results,fields){//执行查找语句
    if(error) console.log(error);//执行失败的话
    res.json(results)
    console.log(results)
    
  })
  connection.end();//断开连接
  
})

app.get('/api/book-classes',async(req,res)=>{ //这里的是 get 方法 getUser，对应了刚才的页面发来的请求。就会执行这个方法。
  //参数传入是在 req.body 对象里面。比如上面的语句是获取传入的 openid 变量，并且我们新定义一个叫 openid 的变量存储传入的 openid 变量
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,		//端口号，mysql 固定3306
    user:UserName,
    password:PWD,
    database:DBName
  })//配置连接的属性
  connection.connect();//尝试连接
  connection.query("select * from B_class",function(error,results,fields){//执行查找语句
    if(error) console.log(error);//执行失败的话
    res.json(results)
    console.log(results)
    
  })
  connection.end();//断开连接
  
})

// 只保留一个 getStatusText 函数定义
function getStatusText(status) {
  const statusMap = {
    1: '待支付',
    2: '待发货',
    3: '已发货',
    4: '已完成'
  };
  return statusMap[status] || '未知状态';
}

app.get('/api/B_Orders', async (req, res) => {
  let connection;
  try {
    // 1. 创建数据库连接
    connection = mysql.createConnection({
      host: IPAddress,
      port: 3306,
      user: UserName,
      password: PWD,
      database: DBName
    });

    // 2. 连接数据库
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) {
          console.error('数据库连接失败:', err);
          reject(err);
        } else {
          console.log('数据库连接成功');
          resolve();
        }
      });
    });

    // 3. 执行查询
    // 3. 执行查询
const sql = `
SELECT 
	o.Order_num AS orderId,
	o.Buyer_id AS buyerId,
	o.Seller_id AS sellerId,
	b.B_ID AS bookId,
	b.B_name AS bookName,
	b.B_price AS price,
	b.B_score AS score,
	b.B_description AS description,
	b.B_status AS status,
	b.B_new AS \`condition\`,
	b.B_class_id AS categoryId
FROM B_Order o
JOIN Book b ON o.B_ID = b.B_ID
WHERE b.B_status = 2
`;

    console.log('执行SQL:', sql); // 打印SQL语句用于调试

    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error('SQL查询错误:', error);
          reject(error);
        } else {
          console.log('查询结果:', results);
          resolve(results);
        }
      });
    });

    // 4. 格式化结果
    const formattedResults = results.map(order => ({
      id: order.orderId,
      bookId: order.bookId,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      status: order.status,
      name: order.bookName,
      price: order.price,
      score: order.score,
      description: order.description,
      condition: order.condition,
      categoryId: order.categoryId,
      image: order.bookId,
      quantity: 1,
      statusText: getStatusText(order.status)
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('处理请求时出错:', error);
    res.status(500).json({ 
      error: '服务器内部错误',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    // 5. 确保连接关闭
    if (connection) {
      connection.end(err => {
        if (err) console.error('关闭连接时出错:', err);
        else console.log('数据库连接已关闭');
      });
    }
  }
});

// 将状态文本函数移到外部
function getStatusText(status) {
  const statusMap = {
    1: '待支付',
    2: '待发货',
    3: '已发货',
    4: '已完成'
  };
  return statusMap[status] || '未知状态';
}

// 辅助函数：根据状态码返回状态文本
function getStatusText(status) {
  const statusMap = {
    1: '待支付',
    2: '待发货',
    3: '已发货',
    4: '已完成'
  };
  return statusMap[status] || '未知状态';
}

app.get('/api/users/first',async(req,res)=>{ //这里的是 get 方法 getUser，对应了刚才的页面发来的请求。就会执行这个方法。
  //参数传入是在 req.body 对象里面。比如上面的语句是获取传入的 openid 变量，并且我们新定义一个叫 openid 的变量存储传入的 openid 变量
  var connection=mysql.createConnection({
    host:IPAddress,
    port: 3306,		//端口号，mysql 固定3306
    user:UserName,
    password:PWD,
    database:DBName
  })//配置连接的属性
  connection.connect();//尝试连接
  connection.query("select * from Users",function(error,results,fields){//执行查找语句
    if(error) console.log(error);//执行失败的话
    res.json(results)
    console.log(results)
    
  })
  connection.end();//断开连接
  
})

// 新增路由：获取我的出售中待取件的订单
// 改进后的待取件订单接口
// 修改后的待取件订单接口，支持查询不同状态
app.get('/api/my-sell/orders', async (req, res) => {
  let connection;
  try {
    // 1. 创建数据库连接
    connection = mysql.createConnection({
      host: IPAddress,
      port: 3306,
      user: UserName,
      password: PWD,
      database: DBName
    });

    // 2. 连接数据库
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 3. 获取查询参数
    const sellerId = req.query.sellerId || 2;
    const status = req.query.status; // 可选参数
    
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: '缺少sellerId参数'
      });
    }

    // 4. 构建SQL查询
    let sql = `
    SELECT 
      o.Order_num AS orderId,
      o.Buyer_id AS buyerId,
      o.Seller_id AS sellerId,
      b.B_ID AS bookId,
      b.B_name AS bookName,
      b.B_price AS price,
      b.B_status AS status,
      b.B_new AS \`condition\`,
      b.B_picture AS imageData,
      o.create_time AS createTime
    FROM B_Order o
    JOIN Book b ON o.B_ID = b.B_ID
    WHERE o.Seller_id = ?
    `;
    
    const params = [sellerId];
    
    // 添加状态筛选条件
    if (status) {
      sql += ' AND b.B_status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY o.Order_num DESC';

    // 5. 执行查询
    const [results] = await connection.promise().query(sql, params);

    // 6. 格式化结果
    const formattedResults = results.map(order => ({
      id: order.orderId,
      bookId: order.bookId,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      bookName: order.bookName,
      price: order.price,
      status: order.status,
      statusText: getStatusText(order.status),
      condition: order.condition,
      image: order.imageData ? order.imageData.toString('base64') : null,
      createTime: order.createTime
    }));

    res.json({
      success: true,
      data: formattedResults
    });

  } catch (error) {
    console.error('获取订单失败:', error);
    res.status(500).json({ 
      success: false,
      message: '获取订单失败',
      error: error.message
    });
  } finally {
    if (connection) connection.end();
  }
});
// 获取第一个用户信息
// 修改/api/users/first接口

app.get('/api/my-sell/pending-pickup', async (req, res) => {
  let connection;
  try {
    // 1. 创建数据库连接
    connection = mysql.createConnection({
      host: IPAddress,
      port: 3306,
      user: UserName,
      password: PWD,
      database: DBName
    });

    // 2. 连接数据库
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) {
          console.error('数据库连接失败:', err);
          reject(new Error('数据库连接失败'));
        } else {
          console.log('数据库连接成功');
          resolve();
        }
      });
    });

    // 3. 从查询参数获取sellerId
    const sellerId = req.query.sellerId || 2;
    
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: '缺少sellerId参数'
      });
    }

    console.log(`正在查询卖家ID: ${sellerId}的待取件订单`);

    // 4. 执行查询 - 不再查询 B_picture 字段
    const sql = `
    SELECT 
      o.Order_num AS orderId,
      o.Buyer_id AS buyerId,
      o.Seller_id AS sellerId,
      b.B_ID AS bookId,
      b.B_name AS bookName,
      b.B_price AS price,
      b.B_score AS score,
      b.B_description AS description,
      b.B_status AS status,
      b.B_new AS \`condition\`,
      b.B_class_id AS categoryId
    FROM B_Order o
    JOIN Book b ON o.B_ID = b.B_ID
    WHERE o.Seller_id = ? AND b.B_status = 2
    ORDER BY o.Order_num DESC
    `;

    const [results] = await connection.promise().query(sql, [sellerId]);

    console.log(`查询到${results.length}条待取件订单`);

    // 5. 格式化结果
    const formattedResults = results.map(order => ({
      id: order.orderId,
      bookId: order.bookId,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      bookName: order.bookName,
      price: order.price,
      status: order.status,
      statusText: '待取件',
      description: order.description,
      condition: order.condition,
      categoryId: order.categoryId,
      createTime: new Date().toISOString()
    }));

    res.json({
      success: true,
      data: formattedResults
    });

  } catch (error) {
    console.error('获取待取件订单失败:', error);
    res.status(500).json({ 
      success: false,
      message: '获取待取件订单失败',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.end(err => {
        if (err) console.error('关闭数据库连接时出错:', err);
      });
    }
  }
});

// 添加一个新的POST接口来处理购物车结算
app.post('/api/checkout', (req, res) => {
  // 获取前端传来的商品ID数组
  const bookIds = req.body.bookIds; // 假设前端发送的是{bookIds: [id1, id2, ...]}
  
  if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ error: '无效的商品ID列表' });
  }

  var connection = mysql.createConnection({
    host: IPAddress,
    port: 3306,
    user: UserName,
    password: PWD,
    database: DBName
  });

  connection.connect();

  // 构建SQL语句，更新所有指定B_ID的书籍状态为2
  const sql = "UPDATE Book SET B_status = 2 WHERE B_ID IN (?)";
  
  connection.query(sql, [bookIds], function(error, results) {
    if (error) {
      console.error(error);
      connection.end();
      return res.status(500).json({ error: '数据库更新失败' });
    }
    
    connection.end();
    res.json({ success: true, updatedCount: results.affectedRows });
  });
});

// 添加收藏商品接口
app.post('/api/like-book', (req, res) => {
  const { bookId } = req.body;
  
  if (!bookId) {
    return res.status(400).json({ error: '缺少bookId参数' });
  }

  var connection = mysql.createConnection({
    host: IPAddress,
    port: 3306,
    user: UserName,
    password: PWD,
    database: DBName
  });

  connection.connect();

  // 更新书籍的收藏状态
  const sql = "UPDATE Book SET B_like = 1 WHERE B_ID = ?";
  
  connection.query(sql, [bookId], function(error, results) {
    if (error) {
      console.error(error);
      connection.end();
      return res.status(500).json({ error: '数据库更新失败' });
    }
    
    connection.end();
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: '未找到对应书籍' });
    }
    
    res.json({ 
      success: true, 
      message: '收藏成功',
      bookId: bookId
    });
  });
});


app.listen(3000,()=>{//这是一个监听端口，会输出监听到的信息。上面的 console.log 就会在这里输出
  console.log('server running at http://'+IPAddress+':3000')
})


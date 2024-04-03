
const express = require('express');
const cors = require('cors');
const app = express();
const compression = require('compression');
const port = process.env.PORT || 3301;
const session = require('express-session');
const cookie = require('cookie-parser');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

const authRouter = require('./routes/authentication');
const employeesRoutes = require('./routes/employees');
const fileRoutes = require('./routes/filemanager');
const path = require('path');
app.use(cors({
  origin: 'http://localhost:4173',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,

}));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    console.log('timeout');
    res.status(408).send('nope')
  })
  next();
})


// app.use((req,res,next)=>{
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// })
// console.log(require('dotenv').config('./env'))
app.use(cookie());
app.use(session({
  store: new FileStore({ path: path.join(__dirname, '/sessions') }),
  secret: 'mySecret',
  name: 'sid',
  cookie: { maxAge: 60 * 60 * 1000 * 2, httpOnly: true },
  saveUninitialized: false,
  resave: true,
}))

// app.use('/index.html', express.static(path.join(__dirname, '/build/index.html')))

app.use('/', authRouter);
app.use('/', employeesRoutes);
app.use('/', fileRoutes);

// app.post('/users', (req, res, next) => {

//   conn.query(`UPDATE user SET \`user_age\`='${req.query.age}' WHERE user_id='${req.query.id}' `, (err, row) => {
//     if (err) {
//       res.status(403);
//       res.json([]);

//     }
//     res.status(200);

//     res.json(req.query);
//   })
// })





//404 處理
app.use((req, res) => {

  res.status(404).send('404 Not Found!');
})
app.listen(port, () => {
  console.log(`APP LISTENING AT ${port}!`);
})
// app2.listen('3000',()=>console.log('3000 listening'))
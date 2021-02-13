const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongodb = require('mongodb')
const crypto = require('crypto');
const multer = require('multer');




app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/static'));

const upload = multer();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
var db;

/*--------------Endpoints--------------*/


app.get('/me', (req, res) => {
  db.collection('students').findOne({ identity: JSON.parse(Buffer.from(req.cookies.tok, 'base64').toString()).login })
    .then(std => {
      console.log(std);
      res.send(std)
    })
})

app.post('/authen', (req, res) => {
  db.collection('students')
    .findOne({ identity: req.body.identity, tel: req.body.tel })
    .then(std => {
      let token = JSON.stringify({ login: std.identity, role: "u" })
      const hashsig = crypto.createHash('sha256').update("toberur" + token).digest('base64');
      res.cookie('tok', Buffer.from(token).toString('base64'))
      res.cookie('sig', hashsig, { httpOnly: true });
      res.status(200).send("You are authenticated!");
    }).catch(err => {
      res.status(403).send("Invalid Login/Password");
      console.log(err)
    })
});

app.post('/user/',upload.none(), (req, res) => {
  db.collection('students')
    .findOne({ identity: req.body.identity })
    .then(student => {
      if (student) {
        res.status(403).send('หมายเลขบัตรประชาชน ' + req.body.identity + ' ได้ถูกใช้ในการลงทะเบียนในระบบแล้ว สามารถลงชื่อเข้าใช้ได้ที่ <a href="/sign/in">ลิงก์</a>');
      }
      else {
        db.collection('students')
          .insertOne(req.body)
          .then(usr => {
            res.status(201).send('กรอกข้อมูลการสมัครเรียบร้อย ลงชื่อเข้าใช้เพื่อตรวจสอบสถานะได้ที่ <a href="/sign/in">ลิงก์</a>');
          })
      }
    })
});


app.post('/user/:id',upload.none(), (req, res) => {
  db.collection('students')
    .findOne({ identity: req.body.identity })
    .then(student => {
      var newvalues = { $set: req.body };
      db.collection("students").updateOne({ identity: req.body.identity }, newvalues, { usert: true }).then(
        usr => {
          res.status(200).send("อัพเดทข้อมูลเรียบร้อย");
        }
      )
    })
});



app.post('/logout', (req, res) => {
  res.clearCookie('tok', { maxAge: 0 })
  res.clearCookie('sig', { httpOnly: true, maxAge: 0 })
  res.status(200).send("You have been succesfully logged out!");
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});


app.listen(port, () => {
  console.log('Server app listening on port ' + port);
});

setInterval(function () {
  if (!db) mongodb.MongoClient.connect(uri, { useNewUrlParser: true })
    .then(c => db = c.db("admission"))
    .catch(e => { db = null; console.log(e); });
}, 5000);


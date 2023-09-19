const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sqlite = require('sqlite3');

const db = new sqlite.Database('sq.db', (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

// db.run(
//   'create table user(id INTEGER PRIMARY KEY, name varchar(255), email varchar(255));',
//   (sq, err) => {
//     if (err) {
//       console.log(err);
//       throw err;
//     }
//   }
// );

// db.run(`insert into user(name, email) values('raj', 'r@r.com')`, (sq, err) => {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
// });

// db.run('ALTER TABLE user ADD COLUMN lastname varchar(255);', (sq, er) => {
//   if (er) {
//     console.log(err);
//     throw er;
//   }
// });

// db.run(`update user set name='akmal' where id=1;`);
// db.run(`update user set lastname='raj' where id = 1;`);
// db.run('drop table post;');
// db.exec(
//   'create table post(id INTEGER PRIMARY KEY, title varchar(255), authorId INTEGER, FOREIGN KEY(authorId) REFERENCES user(id))'
// );
// db.run('delete from post where authorId = 5;');
// db.each('select * from post;', (err, row) => {
//   console.log(row);
// });
// db.run(`PRAGMA foreign_keys = ON;`);
// db.run(`insert into post(authorId, title) Values(1,'this is life?');`);
db.each(
  'select user.id,user.name,user.email,user.lastname,post.authorId, post.title from user inner join post on user.id = post.authorId where user.id = ?;',
  [1],
  (err, row) => {
    console.log(row);
  }
);

const app = express();

app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
    cookie: {
      sameSite: true,
    },
  })
);
const user = {
  id: 1,
  name: 'raj',
  email: 'r@r.com',
};

app.get('/login', (req, res) => {
  req.session.user = user;
  req.session.save();

  return res.send('Successfully logged in!');
});

app.get('/secret', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.send('unauthorized');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

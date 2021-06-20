var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 8321);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(CORS());

// Variables that hold query strings
const getAllQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
// We replace entire row here
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
const deleteQuery = "DELETE FROM workout WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workout";
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit BOOLEAN,
                        date DATE);`;

// Unit of 0 is lbs, unit of 1 is kgs

const getAllData = (res) => {
  mysql.pool.query(getAllQuery, (err, row, fields) => {
    if (err) {
      next(err);
      return
    }
    res.json({ "rows": row });
  })
}

// Get all
app.get('/', function (req, res, next) {
  mysql.pool.query(getAllQuery, function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    getAllData(res)
  });
});

// Insert
app.post('/', function (req, res, next) {
  // Pulls each of these values off of req.body and taking them and storing them into variables with the same names
  // Uses object destructuring
  let { name, reps, weight, unit, date } = req.body;

  // Make query and insert new row w/ following values
  mysql.pool.query(insertQuery, [name, reps, weight, unit, date], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    getAllData(res);
  });
});

// // Delete
app.delete('/', function (req, res, next) {
  mysql.pool.query(deleteQuery, [req.query.id], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    getAllData(res);
  });
});

// ///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.put('/', function (req, res, next) {
  let { name, reps, weight, unit, date, id } = req.body;
  mysql.pool.query(updateQuery,
    [name, reps, weight, unit, date, id],
    function (err, result) {
      if (err) {
        next(err);
        return;
      }
      getAllData(res);
    });
});

// Resets the table
app.get('/reset-table', function (req, res, next) {
  mysql.pool.query(dropTableQuery, function (err) {
    mysql.pool.query(makeTableQuery, function (err) {
      res.send('Table reset');
    })
  });
});

app.use(function (req, res) {
  res.status(404);
  // res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  // res.render('500');
});

app.listen(app.get('port'), function () {
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; Ctrl + C to terminate`)
});

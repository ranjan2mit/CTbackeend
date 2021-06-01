var express = require('express');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./customtravel.db');
db.serialize(() => {
   // db.run("DROP TABLE Employee");
   // db.run("CREATE TABLE Employee([EmployeeId] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[Name] NVARCHAR(120), [DepartmentId] INTEGER)");
   // db.run("DROP TABLE Department");
   // db.run("CREATE TABLE Department([DepartmentId] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[DeptName] NVARCHAR(120) UNIQUE)");
});

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
   next();
 });

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

app.post('/api/adddept', function (req, res) {
      db.run(`INSERT INTO Department(DeptName) VALUES(?)`, 
      [req.body.departmentname],
      function(error){
         let response = {};
         if(error) {
            response.status = false
            response.message = 'Unable to add department.'
         } else {
            response.status = true
            response.message = 'Department Added.'
            response.departmentid = this.lastID
         }
         res.send(response);
      });
})


app.post('/api/addemp', function (req, res) {
   db.run(`INSERT INTO Employee(Name, DepartmentId) VALUES('${req.body.employeename}', ${req.body.departmentid})`, 
   // [req.body.employeename, req.body.departmentid],
   function(error){
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to add employee.'
      } else {
         response.status = true
         response.message = 'Employee Added.'
         response.employeeid = this.lastID
      }
      res.send(response);
   });
})

app.post('/api/listemp', function (req, res) {
   db.all(`SELECT * FROM Employee`,(error, rows) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to get employee list.'
      } else {
         response.status = true
         response.message = 'Employee list fetched.'
         response.date = rows
      }
      res.send(response);
   });
})

app.post('/api/listdept', function (req, res) {
   db.all(`SELECT * FROM Department`,(error, rows) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to get Department list.'
      } else {
         response.status = true
         response.message = 'Department list fetched.'
         response.date = rows
      }
      res.send(response);
   });
})

app.post('/api/removedept', function (req, res) {
   db.run(`DELETE FROM Department WHERE DepartmentId=?`, req.body.departmentid ,(error) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to delete Department data.'
      } else {
         response.status = true
         response.message = 'Department data deleted.'
         response.departmentid = req.body.departmentid
      }
      res.send(response);
   });
})

app.post('/api/removeemp', function (req, res) {
   db.run(`DELETE FROM Employee WHERE EmployeeId=?`, req.body.employeeid ,(error) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to delete Employee data.'
      } else {
         response.status = true
         response.message = 'Employee data deleted.'
         response.employeeid = req.body.employeeid
      }
      res.send(response);
   });
})

app.post('/api/updateemp', function (req, res) {
   db.run(`UPDATE Employee SET Name=?, DepartmentId=? WHERE EmployeeId=?`, [req.body.employeename, req.body.departmentid, req.body.employeeid] ,(error) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to update Employee data.'
      } else {
         response.status = true
         response.message = 'Employee data update.'
         response.employee = this.changes
      }
      res.send(response);
   });
})

app.post('/api/updatedept', function (req, res) {
   db.run(`UPDATE Department SET DeptName=? WHERE DepartmentId=?`, [req.body.departmentname, req.body.departmentid] ,(error) => {
      let response = {};
      if(error) {
         console.log(error)
         response.status = false
         response.message = 'Unable to update Department data.'
      } else {
         response.status = true
         response.message = 'Department data update.'
         response.department = this.changes
      }
      res.send(response);
   });
})
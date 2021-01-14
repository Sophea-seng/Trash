'use strict'

const Database = use('Database')
const mysql = require('mysql');
const excel = require('exceljs');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trash'
});

class UserController {

  //   async index(request, response) {
  //     return await Database.select('trash.name', 'trash_type.name as Type').table('trash').innerJoin('trash_type', function () {
  //       this
  //         .on('trash.trash_type_id', 'trash_type.id')
  //     })
  //   }
  
  async index(request, response) {
    // Open the MySQL connection
    con.connect((err) => {
      if (err) throw err;

      // -> Query data from MySQL
      con.query("SELECT trash.id,trash.name,trash_type.name as trash_name ,trash_category.name as trash_category,company.name as company_name FROM trash INNER JOIN trash_type ON trash.trash_type_id=trash_type.id INNER JOIN trash_category ON trash.trash_category_id =trash_category.id INNER JOIN company ON trash.company_id=company.id ORDER BY trash.id", function (err, trash, fields) {

        const jsonTrash = JSON.parse(JSON.stringify(trash));
        console.log(jsonTrash);
    
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Trash'); //creating worksheet

        //  WorkSheet Header
        worksheet.columns = [{
            header: 'Id',
            key: 'id',
            width: 10
          },
          {
            header: 'Name',
            key: 'name',
            width: 30
          }, {
            header: 'Trash_Type',
            key: 'trash_name',
            width: 30
          }, {
            header: 'Trash_Category',
            key: 'trash_category',
            width: 30
          }, {
            header: 'Company',
            key: 'company_name',
            width: 30
          },

        ];

        // Add Array Rows
        worksheet.addRows(jsonTrash);

        // Write to File
        workbook.xlsx.writeFile("trash.xlsx")
          .then(function () {
            console.log("file saved!");
          });

        // -> Close MySQL connection
        con.end(function (err) {
          if (err) {
            return console.log('error:' + err.message);
          }
          console.log('Close the database connection.');
        });

        // -> Check 'customer.csv' file in root project folder
      });
    });
  }

}

module.exports = UserController

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Echo1177.",
    database: "bamazon_db"


});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);
        whatToDo(connection);

    });
});


//What the user wants to do: Buy or Exit...
function whatToDo(connection) {
    inquirer.prompt([{
            name: "whatToDo",
            message: "What do you want to do?",
            type: "list",
            choices: ["buy", "exit"],
        },

    ]).then(function (answers) {
        if (answers.whatToDo === "buy") {
            //buy function
            buyItem(connection);
        } else {
            //call exit
            connection.end();
            //process.exit(0);
        }
    });
}

function buyItem(connection) {
    inquirer.prompt([{

            name: "buy",
            type: "input",
            message: "What is the is the ID for the item you want?",


        }, {
            name: "quantity",
            type: "number",
            message: "How many of these items would you like?"
        }])

        .then(function (answer) {

                connection.query("SELECT stock_quantity FROM products WHERE ?", [{

                        item_id: answer.buy

                    }], function (err, result) {
                        if (err) throw err;
                        console.log(result);

                        var stockResult = result[0].stock_quantity;


                        //orig quant = stock result. -answer.quantity. 2nd connection query needs to run the update/
                        connection.query("UPDATE products SET ? WHERE ?", [{
                                    //first question mark refers to the first object in array. 
                                    stock_quantity: parseInt(stockResult) - parseInt(answer.quantity)

                                },
                                {
                                    //name of column that we are referencing.... right side is what user inputs. 
                                    item_id: answer.buy
                                }
                            ]
                      
                        );
                    }
                );
            })
        }
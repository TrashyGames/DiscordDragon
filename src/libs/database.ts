/*
*
*   Database.ts
*
*   A library to handle working with the databases!
*
*/

// Import libraries
const sqlite3 = require('sqlite3')
const mysql = require('mysql')

// Define the database class!
export class Database {
    private config
    private dbtype
    private connection

    constructor(config) {
        this.config = config
        this.init()
    }

    private init() {
        this.dbtype = this.config["type"]
        if (this.config["type"] == "sqlite") {
            // Load a Sqlite database
            let db = new sqlite3.Database(this.config["path"], (err) => {
                if (err) return console.error(err.message)
            })
            this.connection = db
        } else if (this.config["type"] == "mysql") {
            var con = mysql.createConnection({
                host: this.config["url"],
                user: this.config["username"],
                password: this.config["password"]
            })
            con.connect(function(err) {if (err) throw err; return})
            this.connection = con
        } else {
            console.error(`Invalid database type "${this.config["type"]}"!`)
            return
        }
    }

    getConfig() {
        return this.config
    }

    getDBType() {
        return this.dbtype
    }

    getConnectionObject() {
        // You really shouldn't use this!!
        return this.connection
    }

    close() {
        if (this.dbtype == "sqlite") {
            this.connection.close()
        } else if (this.dbtype == "mysql") {
            // TODO
            // I don't know how to do this, lol. Requires testing!
        } else console.error(`Invalid database type "${this.config["type"]}"!`)
    }

    blank() {
        if (this.dbtype == "sqlite") {
        } else if (this.dbtype == "mysql") {
        } else console.error(`Invalid database type "${this.config["type"]}"!`)
    }

    query(statement) {
        // Run a query with no results!
        if (this.dbtype == "sqlite") {
            this.connection.run(statement, [], function(err) {if (err) throw err})
        } else if (this.dbtype == "mysql") {
            this.connection.query(statement, function (err, result) {if (err) throw err})
        } else {
            console.error(`Invalid database type "${this.config["type"]}"!`)
            return
        }
    }

    select(statement, callback) {
        // Run a query that should return results!
        if (this.dbtype == "sqlite") {
            this.connection.all(statement, [], (err, rows) => {
                if (err) throw err
                rows.forEach((row) => callback(row))
            })
        } else if (this.dbtype == "mysql") {
            this.connection.query(statement, function (err, rows, fields) {
                if (err) throw err
                rows.array.forEach(row => callback(row))
            })
        } else {
            console.error(`Invalid database type "${this.config["type"]}"!`)
            return
        }
    }

    // TODO!
    preparedQuery() {
        // Run a preparted statement that should NOT return results! 
        console.trace("Method not implemented")
        return
    }

    // TODO!
    preparedSelect() {
        // Run a prepared statement that SHOULD return results!
        console.trace("Method not implemented")
        return
    }
}
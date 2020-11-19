/*
*
*   DBConfigurator
*
*   A small tool to configure the database!
*
*/

function config(db) {
    const config = db.getConfig()
    if (config["type"] == "mysql")
        db.query(`CREATE DATABASE IF NOT EXISTS ${config["dbname"]};`)
    db.query("CREATE TABLE IF NOT EXISTS `appdata` (`key` TEXT NOT NULL,`value` TEXT DEFAULT '', PRIMARY KEY (`key`));")
}

export { config }
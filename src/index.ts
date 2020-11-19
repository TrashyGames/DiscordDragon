/*
*
*   FluffyDragon
*   Version Alpha 1.0.0
*
*   A Discord bot for furry-based servers!
*
*/

// Import libraries
const fs = require('fs')
const yaml = require('js-yaml')

const Discord = require('discord.js')

// Import local libraries (the ones I made!)
import { Database } from "./libs/database"
import * as DBConfiger from "./libs/dbconfigurator"
import * as Commands from "./commands"

// Import the config!
import * as defaults from "./defaults"
import { Console } from "console"

const configpaths = [ // A list of where the config files might just be...
    "./config.yaml",
    "../config.yaml",
    "./assets/config.yaml",
    "../assets/config.yaml"
]

const config = (() => {
    console.log("Loading configuration files!")
    var config_data
    configpaths.forEach(path => {
        if (fs.existsSync(path)) {
            console.log(`Importing configuration from "${path}"!`)
            config_data = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
        }
    })
    if (config_data != null && config_data != undefined) {
        return config_data
    } else {
        console.warn("Using default configuration!")
        return defaults.config
    }
})()

// Create the discord bot
const client = new Discord.Client()

// Load the database!
console.log(`Connecting to database of type ${config["database"]["type"]}`)
const db = new Database(config["database"])

// Configure the database (if needed)
DBConfiger.config(db)

// Command handler!
function onMessage(msg) {
    var pattern = `<@!${config["discord"]["clientID"]}>`
    var sub = msg.content.substring(0, pattern.length)
    // console.log(`PAT("${pattern}"), PATLEN(${pattern.length}), SUB("${sub}")`)
    if (sub == pattern) {
        console.log("Command received!")
        // Valid command!
        let body = msg.content.substring((pattern).length)
        if (body.substring(0,1) == " ") {
            body = body.substring(1)
        }
        let components = body.split(" ")
        onCommand({
            raw: body,
            command: components[0],
            components: components,
            message: msg
        })
    } else {
        console.log("Not a command!")
    }
}

function onCommand(data) {
    //console.log(data)
    console.log(`Attempting to run command "${data.command}"`)
    if (Commands.commands[data.command] != undefined) {
        console.log("Running command!")
        Commands.commands[data.command](data)
    } else {
        console.warn("Unknown command!")
    }
}

// Bind the discord bot callbacks
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    onMessage(msg)
    console.log(`A message from user "${msg.author}" in channel "${msg.channel}" says "${msg.content}"`)
    if (msg.content === 'ping') {
      msg.reply('Pong!')
    }
})

// Start the bot!
/*
*
*   MAKE SURE TO RESET THE TOKEN AFTER DEVELOPMENT!
*   
*   This token should be active ONLY DURING DEVELOPMENT CYCLE!
*   Security reasons, obviously!
*
*/

if (config["discord"]["token"] == null || config["discord"]["token"] == undefined) {
    console.error("No discord token specified!")
} else {
    console.log("Starting bot!")
    client.login(config["discord"]["token"])
}
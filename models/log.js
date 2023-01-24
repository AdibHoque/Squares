const {Schema, model} = require("mongoose")

let logsSchema = new Schema({
    GuildID: String,
    UserID: String,
    Content: Array
    
})

module.exports = model('logs', logsSchema);
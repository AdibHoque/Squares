const {Schema, model} = require("mongoose")

let guildsSchema = new Schema({
    GuildID: String,
    LogChannel: String,
    MsgLogChannel: String,
    GiveawayLogChannel: String,
    JoinMessageLogCHannel: String,
    LeaveMessageLogChannel: String,
    AppealBlacklist: Array
    
})

module.exports = model('guilds', guildsSchema);
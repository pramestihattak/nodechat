var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs')

var chatSchema = new Schema({
	username: String,
	content: String
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Chat', chatSchema, 'chats');
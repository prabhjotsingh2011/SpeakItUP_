const mongoose = require("mongoose");

var Schema = mongoose.Schema
const refreshSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref :'User'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Refresh', refreshSchema, 'tokens');
'use strict';
var mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    keywords: [{
        _id: false,
        keyword: {
            type: String
        }            
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
     
}, {
    timestamps: true
});

PageSchema.index({ title: 1, content: 1 });


var page = mongoose.model('page', PageSchema);
module.exports = page;
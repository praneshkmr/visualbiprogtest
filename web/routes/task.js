var mongoose = require('mongoose');
var db = require('./mongodb_schema');
var Task = mongoose.model('Task');

exports.addTask = function(name,from,to,subject,description,deadline,callback){
    var now = new Date();
    var t = new Task({
        name : name,
        from : from,
        to : to ,
        description : description,
        deadline : deadline,
        state : "pending",
        created_at : now,
        updated_at : now
    });
    t.save(callback);
}

exports.getAllTasks = function(callback){
    Task.find(callback);
}

exports.updateTask = function(id,name,from,to,subject,description,deadline,state,callback){
    var now = new Date();
    var data = {
        name : name,
        from : from,
        to : to ,
        description : description,
        deadline : deadline,
        state : state,
        updated_at : now
    }
    Task.findByIdAndUpdate(id,data,callback);
}

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var mongoose = require('mongoose');
var db = require('./routes/mongodb_schema');
var Task = mongoose.model('Task');

var task = require('./routes/task');




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/task',function(req,res){
  if (req.body.name && req.body.from && req.body.to && req.body.subject && req.body.description && req.body.deadline ) {
    task.addTask(req.body.name,req.body.from,req.body.to,req.body.subject,req.body.description,req.body.deadline,function(err,task){
      if (err) {
        console.log("Error Adding Task : "+err);
        res.send(500);
      }
      else if (task) {
        res.send(task);
      }
    });
  }
  else{
    res.send(400);
  }
});
app.get('/task',function(req,res){
  task.getAllTasks(function(err,tasks){
      if (err) {
        console.log("Error Getting All Task : "+err);
        res.send(500);
      }
      else if (tasks) {
        res.send(tasks);
      }
  });
});
app.put('/task/:id',function(req,res){
if (req.params.id && req.body.name && req.body.from && req.body.to && req.body.subject && req.body.description && req.body.deadline && req.body.state ) {
    task.updateTask(req.params.id,req.body.name,req.body.from,req.body.to,req.body.subject,req.body.description,req.body.deadline,req.body.state,function(err,task){
      if (err) {
        console.log("Error Updating Task : "+err);
        res.send(500);
      }
      else if (task) {
        res.send(task);
      }
    });
  }
  else{
    res.send(400);
  }
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('add_task', function(task){
    console.log("task received");
    io.emit('add_task', task);
  });
});


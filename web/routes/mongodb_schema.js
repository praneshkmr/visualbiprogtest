var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    "name" : { type: String },
    "from" : { type: String },
    "to" : { type: String },
    "subject" : { type: String },
    "description" : { type: String },
    "deadline" : { type: Date },
    "created_at" : { type: Date },
    "updated_at" : { type: Date },
});

mongoose.model('Task',TaskSchema);

mongoose.connect('mongodb://localhost/taskmgmt',function(err){
    if (err) {
        console.log("Error connecting to MongoDB : "+err+"\n Timestamp : "+ new Date());
    }
});
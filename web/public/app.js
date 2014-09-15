var Task = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            "name" : "",
            "from" : "",
            "to" : "",
            "subject" : "",
            "description" : "",
            "deadline" : "",
            "state" : "pending",
            "created_at" : "",
            "updated_at" : "",
        },
        urlRoot:"/task"
    });
    var TaskCollection = Backbone.Collection.extend({
        model : Task,
        url : "/task"
    });
    var AddTaskView = Backbone.View.extend({
        initialize: function() {
          //this.listenTo(this.model, "change", this.render);
          this.template =  _.template( $("#AddTaskModalTemplate").html());
        },
        render:function () {
            $(this.el).html(this.template());
            return this.$el;
        },
        events:{
          "click #btnAddTask":"addTask" 
        },
        addTask:function(e){
          e.preventDefault();
          var t =  new Task({
            "name" : $('#inputName').val(),
            "from" : $('#inputFrom').val(),
            "to" : $('#inputTo').val(),
            "subject" : $('#inputSubject').val(),
            "description" : $('#inputDescription').val(),
            "deadline" : $('#inputDeadline').val()
          });
          t.save(null,{success:function(task, response, options){
            console.log(task.toJSON());
          }});
        }
    });
    var PendingTasksTableView = Backbone.View.extend({
      count : 1,
        initialize: function() {
          this.listenTo(this.collection, "add", this.render);
          this.listenTo(this.collection, "remove", this.render);
        },
        render:function () {
          var html = null;
          if (this.collection.length == 0) {
            html = "<h5>No Tasks yet. Please Add some.</h5>"
          }
          else{
            var self = this;
            html = "<table class='table table-hover'><thead><tr><th>#</th><th>Name</th><th>From</th>"
            +"<th>deadline</th><th colspan='2'>Options</th></tr></thead><tbody>";
            _.each(this.collection.models,function(task){
              var t = new PendingTasksTableRowItemView({ model : task , count : self.count++ }).render();
              html+= t;
            });
            html += "</tbody></table>";
          }
          $(this.el).html(html);
          return this.$el;
        }
    });
    var PendingTasksTableRowItemView = Backbone.View.extend({
      count : 0,
      tagName: "tr",
      initialize: function(options) {
        this.count = options.count;
      },
      render: function(){
        return ("<td>"+this.count+"</td>"+"<td>"+this.model.get('name')+"</td>"+"<td>"+this.model.get('from')+
                "</td>"+"<td>"+this.model.get('deadline')+"</td>"+"<td><i class='icon-ok'></i></td></tr>");
        
      },
      events:{
        "click .icon-ok":"markCompleted"
      },
      markCompleted:function(e){
        e.preventDefaults();
        console.log("asdasd");
      }
    });
    var CompletedTasksTableView = Backbone.View.extend({
      count : 1,
        initialize: function() {
          this.listenTo(this.collection, "add", this.render);
          this.listenTo(this.collection, "remove", this.render);
        },
        render:function () {
          var html = null;
          if (this.collection.length == 0) {
            html = "<h5>No Pending Tasks</h5>"
          }
          else{
            var self = this;
            html = "<table class='table table-hover'><thead><tr><th>#</th><th>Name</th><th>From</th>"
            +"<th>deadline</th></tr></thead><tbody>";
            _.each(this.collection.models,function(task){
              var t = new CompletedTasksTableRowItemView({ model : task , count : self.count++ }).render();
              html+= t;
            });
            html += "</tbody></table>";
          }
          $(this.el).html(html);
          return this.$el;
        }
    });
    var CompletedTasksTableRowItemView = Backbone.View.extend({
      count : 0,
      tagName: "tr",
      initialize: function(options) {
        this.count = options.count;
      },
      render: function(){
        return ("<td>"+this.count+"</td>"+"<td>"+this.model.get('name')+"</td>"+"<td>"+this.model.get('from')+"</td>"+"<td>"+this.model.get('deadline')+"</td></tr>");
        
      }
    });
    var tasks = new TaskCollection();
    var pendingtasks = null;
    var completedtasks = null;
    tasks.fetch({success:function(tasks, response, options){
      pendingtasks = new TaskCollection(tasks.where({ "state" : "pending" }));
      completedtasks = new TaskCollection(tasks.where({ "state" : "completed" }));
      $('#divPendingTasksTable').html(new PendingTasksTableView({ collection : pendingtasks }).render() );
      $('#divCompletedTasksTable').html(new CompletedTasksTableView({ collection : completedtasks }).render() );
    }});
    $('#divAddTask').html(new AddTaskView().render() );
    
    $('#btnAddTask').click(function(e){
      e.preventDefault();
      $('#modalAddTask').modal('show');
    });
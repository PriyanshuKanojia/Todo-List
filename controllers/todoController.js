var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://test:test@ac-tzwakto-shard-00-00.j7sbary.mongodb.net:27017,ac-tzwakto-shard-00-01.j7sbary.mongodb.net:27017,ac-tzwakto-shard-00-02.j7sbary.mongodb.net:27017/?ssl=true&replicaSet=atlas-m373hb-shard-0&authSource=admin&retryWrites=true&w=majority');

//Create a schema - this is like a blueprint for our data
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

    app.get('/todo', function(req, res){
        //get data from mongodb and pass it to view
        Todo.find({})
        .then(function(data){
            res.render('todo', {todos: data});
        })
        .catch(function(err){
            throw err;
        })
    });

    app.post('/todo', urlencodedParser, function(req, res){
        //get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save()
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            throw err;
        });
    });

    app.delete('/todo/:item', function(req, res){
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne()
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            throw err;
        });
    });

};
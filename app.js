//requerindo os módulos necessários
const express = require("express");
const app = express();
const bodyParser = require("body-parser");



//começando o BD
const db = require("mongoose")

db.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});


const tdlSchema = {
  name: {
    type: String,
    required: [true,"How we gonna add a task if u don't even write anything!"]
  }
};

const Item = db.model("Item",tdlSchema);

//setando itens iniciais para teste


const task = new Item({
  name: "Limpar o banheiro"
});


const task2 = new Item({
  name: "Fazer pastel"
});


const task3 = new Item({
  name: "Estudar DB"
});


const defaultItems = [task,task2,task3];

// Item.insertMany(defaultItems,(error)=>{
//   if(error){
//     console.log(error);
//   }
//   else{
//     console.log("Default itens added!");
    
//   }
// });




//chamando um módulo pŕoprio(local)
const date = require( __dirname + "/date.js")

//inicializando o bodyParser
app.use(bodyParser.urlencoded({extended:true}));
//inicializando o embedded javascript
app.set("view engine", "ejs");
/*Porque usar EJS?

Tirar a necessidade de criar um arquivo HTML pra cada situação que poderia ser atualizada numa página só.
não é muito diferente do erbhtml.

*/
app.use(express.static("assets"));

// infelizmente precisamos criar uma variavel global pra requisição, mas isso é só pq ainda não mexemos com BD
// let workTask = [];

const listSchema = {
  name: {
    type: String,
    required: [true,"How we gonna add a task if u don't even write anything!"]
  },
  items: [tdlSchema]
};

const List = db.model("List",listSchema);


app.get("/:listname", function(req, res){ 



  List.findOne({name:req.params.listname.toLowerCase()},(err,results)=>{
    if(!results){
        const actualList = new List({
          name: req.params.listname,
          items: []
        });
      actualList.save();
      res.render("list", {listTitle: actualList.name,newTask: actualList.items,route: "/" + actualList.name});

    }else{
      res.render("list", {listTitle: results.name,newTask: results.items,route: "/" + results.name});
    }

  });
  
 

  // FUNÇÃO NOVA, BRO! res.render("arquivo ejs que está, exclusivamente, na pasta views", JSON com suas chaves e valores)
  // Item.find({},(error,items)=>{
  //   res.render("list", {listTitle: actualList.name,newTask: actualList.items,route: "/"});
  // });
  
});

//aprendendo o conceito de templating, que é basicamente a arte de reutilizar...templates!
//mas só amanhã, vai dormir mlk.

app.post("/",(req,res)=>{

  console.log(req.body.listTitle);
  
  const newItem = new Item({
    name:req.body.newTask
  });
  List.findOne({name: req.body.listTitle},(error,result)=>{
    result.items.push(newItem);
    result.save();
  });

  res.redirect("/" + req.body.listTitle);
});

//testando layout
app.get("/about",(req,res)=>{
  res.render("about");
});



app.post("/delete",(req,res)=>{
  console.log(req.body.listTitle);
  console.log(req.body.task);
  
  
  
   List.findOneAndUpdate({name:req.body.listTitle},{$pull:{items:{_id:req.body.task }}},(err,result)=>{

   });
   res.redirect("/" + req.body.listTitle);

});

app.listen(3000, function(){ 
  console.log("Server started on port 3000.");
});

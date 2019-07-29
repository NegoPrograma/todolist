//requerindo os módulos necessários
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static("assets"));

//começando o BD
const db = require("mongoose")

db.connect("mongodb+srv://admin-isaac:admin@cluster0-vyins.mongodb.net/todolistDB",{useNewUrlParser: true});


const tdlSchema = {
  name: {
    type: String,
    required: [true,"How we gonna add a task if u don't even write anything!"]
  }
};

const Item = db.model("Item",tdlSchema);

//setando itens iniciais para teste


// const task = new Item({
//   name: "Limpar o banheiro"
// });


// const task2 = new Item({
//   name: "Fazer pastel"
// });


// const task3 = new Item({
//   name: "Estudar DB"
// });


// const defaultItems = [task,task2,task3];

// // Item.insertMany(defaultItems,(error)=>{
// //   if(error){
// //     console.log(error);
// //   }
// //   else{
// //     console.log("Default itens added!");
    
// //   }
// // });




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


app.get("/lists/:listname", function(req, res){ 
  let title = req.params.listname.toLowerCase();

  List.findOne({name:title},(err,results)=>{
    if(!results){
        const actualList = new List({
          name: req.params.listname,
          items: []
        });
      actualList.save();
      res.render("list", {listTitle: actualList.name,newTask: actualList.items});

    }else{
      res.render("list", {listTitle: results.name,newTask: results.items});
    }

  });
  
 

  // FUNÇÃO NOVA, BRO! res.render("arquivo ejs que está, exclusivamente, na pasta views", JSON com suas chaves e valores)
  // Item.find({},(error,items)=>{
  //   res.render("list", {listTitle: actualList.name,newTask: actualList.items,route: "/"});
  // });
  
});

//aprendendo o conceito de templating, que é basicamente a arte de reutilizar...templates!
//mas só amanhã, vai dormir mlk.

app.post("/lists/:listname",(req,res)=>{

  console.log(req.body.listTitle);
  
  const newItem = new Item({
    name:req.body.newTask
  });
  List.findOne({name: req.body.listTitle},(error,result)=>{
    result.items.push(newItem);
    result.save();
  });
setTimeout(()=>{
  res.redirect("/lists/"+req.body.listTitle);

},2000)
});

//testando layout
app.get("/about",(req,res)=>{
  res.render("about");
});



app.post("/delete",(req,res)=>{
  console.log(req.body.listTitle);
  console.log(req.body.task);
   List.findOneAndUpdate({name:req.body.listTitle},{$pull:{items:{_id:req.body.task}}},(err,result)=>{

   });
   res.redirect("/lists/" + req.body.listTitle);

});




//seção especial do conf

//list do conf já feita e deletada pra n ficar salvando
app.get("/conf",(req,res)=>{

  List.find({name: "confessionario"},(error,results)=>{
      if(!results){
          const actualList = new List({
            name: "confessionario",
            items: []
          });
        actualList.save();
        res.render("conf", {newTask: actualList.items});
        }
      else{
       res.render("conf", {newTask: results.items});
      }
  });
});



app.post("/conf",(req,res)=>{

  List.find({name: "confessionario"},(error,results)=>{
    results.items.push(req.body.newTask);
    results.save();
  });
  setTimeout(()=>{res.redirect("/conf")},1800);
});


app.get("dropconfdb",(req,res)=>{
  List.deleteOne({name: "confessionario"});
});

//fim da secção especial do conf


app.listen(process.env.PORT || 3000,()=>{

  console.log("server started! port: 3000");
});
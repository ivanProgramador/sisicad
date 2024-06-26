const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connetion = require("./database/database");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

//teste de conexão
connetion.authenticate().then(()=>{
    console.log('conectado')
}).catch(err=>{
    console.log(err);

});

const Produto = require("./models/Produto/Produto");
const produtoController = require("./models/Produto/produtoController");
const Tipo = require("./models/Tipo/Tipo");
const Pedido = require("./models/Pedido/Pedido");
const pedidoController = require("./models/Pedido/pedido_controller");
const tipoController = require("./models/Tipo/tipoController");
const Produto_pedido = require('./models/Produto_pedido/Produto_pedido');
const comandaController = require('./models/comanda/comandaController');

//rota de sequencia 

const sequenciaController = require("./models/Sequencia/sequenciaController");

app.use("/",tipoController);
app.use("/",produtoController);
app.use("/",sequenciaController);
app.use("/",pedidoController);
app.use("/",comandaController);

app.get("/",(req,res)=>{
    res.render("index");

})




app.listen(7070,()=>{
    console.log("sistema online")
})
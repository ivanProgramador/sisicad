const express = require("express");
const router = express.Router();
const Produto = require("../Produto/Produto");
const Tipo = require("../Tipo/Tipo");
const Produto_pedido = require("../Produto_pedido/Produto_pedido");
const Pedido = require("../Pedido/Pedido");
const Sequelize = require("sequelize");



//formulario de inicio de sequencia

router.get("/inicio_pedido",(req,res)=>{
    res.render("sequencia/inicio_pedido");
});

//formulario para registrar cliente e iniciar o pedido 

router.get("/add_cliente",(req,res)=>{
    res.render("sequencia/add_cliente");
});

//formulario para montagem de pedidos 

router.get("/monta_pedido",(req,res)=>{
  


 Pedido.findOne({
    order: [['createdAt', 'DESC']], // ou [['id', 'DESC']] se estiver usando um ID autoincrementável
  }).then(pedido=>{
    
      Produto.findAll().then(produtos=>{
        var pedido_atual = pedido.id;
        Produto_pedido.findAll({where:{pedido_codigo: pedido_atual}}).then(produtos_pedidos=>{
            res.render("sequencia/monta_pedido",{pedido:pedido,produtos:produtos,produtos_pedidos:produtos_pedidos});
        })
      })
   })
})

//rota de ação para adicionar um pedido 

router.post('/gravar_pedido',(req,res)=>{
    var {cliente,status} = req.body;

    Pedido.create({cliente:cliente,status:1}).then(()=>{
        res.redirect("/monta_pedido");
    })
});

//rota que liga o produto ao pedido 

router.post('/adicionar_produto',(req,res)=>{
     var{cliente,produto_descricao, quantidade, produto_codigo, pedido_codigo} = req.body;

     Produto_pedido.create({cliente,produto_descricao, quantidade, produto_codigo, pedido_codigo}).then(()=>{
        res.redirect("/monta_pedido");
     });
});

//rota que remove o produto do pedido

router.post("/apagar_produto_pedido",(req,res)=>{
    var id = req.body.id;
    Produto_pedido.destroy({where:{id:id}}).then(()=>{
        res.redirect("/monta_pedido");
         
    })
});

//rota que grava 2 no status do pedido fazendo a comanda ser lançada

router.post("/lanca_comanda",(req,res)=>{

  var {id_pedido} = req.body;

  Pedido.update({status:2},{where:{id:id_pedido}}).then(()=>{
      res.redirect("/inicio_pedido");
  })

  

})


//rota que exclui o pedido todo
router.post("/apagar_pedido",(req,res)=>{

   var {id_pedido} = req.body;

    Pedido.destroy({
    where: {
      id: id_pedido,
    }
  }).then(()=>{

    Produto_pedido.destroy(
        {where: {
            pedido_codigo: id_pedido,
          }
        }
    ).then(()=>{

        res.redirect("/inicio_pedido");

    }

    )  
  })
})
       

















module.exports = router;
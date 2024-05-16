var express = require('express');
var aplicacion = require('./aplicacion')
//var cors =require('cors');

var app =express();
//app.use(cors());
app.use(express.json());

app.get('/prueba/',(req,res)=>{
   
    res.send('hello world');
    return res;
});

app.post('/login/',(req,res)=>{
   
    var usuario= req.body;
    //res.json(aplicacion.leer());
    
    aplicacion.leer(usuario,res);

   /* if(usuario.password == usuario.usuario){
        res.json({login:'exitoso'})
    }
    else{
        res.json({login:'error'});
    }  CREA ERROR DE ASINCRONISMO*/
});

app.post('/leer/',(req,res)=>{
   
    var usuario= req.body;
    res.send(usuario.usuario);
});

app.post('/insertar/', (req, res) => {
    
    var usuario = req.body;
    aplicacion.insertar(usuario, res);
    
});

app.listen(7200,()=>{
    console.log('escuchando el puerto');
})
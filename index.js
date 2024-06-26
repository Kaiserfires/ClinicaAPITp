var express = require('express');
var aplicacion = require('./aplicacion');
var cors = require('cors');

var app =express();
app.use(express.json(),);
app.use(cors());

app.get('/pruebajson/',(req,res)=>{
    res.send('hello world');
    return res;
});

app.post('/login/',(req,res)=>{
   
    var usuario= req.body;
    //res.json(aplicacion.leer());
    console.log(req.body.Usuario, req.body.Password);
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
    console.log(usuario);
    res.send(usuario.usuario);
});

app.post('/insertar/', (req, res) => {
    
    var usuario = req.body;
    aplicacion.insertar(usuario, res);
    
});


//principio de turnos

app.get('/especialidades/', (req, res) => {
    aplicacion.obtenerEspecialidades(res);
    return res;
});

app.get('/medicos/especialidad/:especialidadId', (req, res) => { //cada ":" es la varible a buscar
    aplicacion.obtenerMedicosPorEspecialidad(req.params.especialidadId, res);
    return res;
});

app.get('/medicos/:medicoId/disponibilidad', (req, res) => {
    aplicacion.obtenerDisponibilidadMedico(req.params.medicoId, res);
    return res;
});

app.post('/turnos/', (req, res) => {
    aplicacion.crearTurno(req.body, res);
});

app.get('/pacientes/', (req, res) => {
    aplicacion.obtenerPacientes(res);
    return res;
    
    //return aplicacion.obtenerPacientes(res);
});

//fin de turnos

app.listen( process.env.PORT  || 3000,()=>{
    console.log('escuchando el puerto');
})
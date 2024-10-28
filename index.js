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

app.get('/medicos/',(req,res)=>{
    aplicacion.obtenerMedicos(res);
    return res;
});

app.get('/medicos/especialidad/:especialidadId', (req, res) => { //cada ":" es la varible a buscar
    aplicacion.obtenerMedicosPorEspecialidad(req.params.especialidadId, res);
    return res;
});

app.get('/medicos/:medicoId/disponibilidad/:fecha', (req, res) => {
    aplicacion.obtenerDisponibilidadMedico(req.params.medicoId, req.params.fecha, res);
    return res;
});

//obtiene turnos del medico logueado
app.get('/medicos/:medicoId/turnos',(req,res)=>{
    aplicacion.obtenerTurnosPorMedico(req.params.medicoId, res);
}); 
  

app.post('/turnos/', (req, res) => {
    aplicacion.crearTurno(req.body, res);
});

app.get('/obtenerTurnos/', (req, res)=>{
    aplicacion.obtenerTurnos(res);
});

app.get('/pacientes/', (req, res) => {
    aplicacion.obtenerPacientes(res);
    return res;
    
    //return aplicacion.obtenerPacientes(res);
});


// obtener días laborales disponibles de un médico
app.get('/medicos/:medicoId/dias-laborales', (req, res) => {
    aplicacion.obternerDiasDispoTurnos(req.params.medicoId, res);
});

//fin de turnos


//obtiene el nombre y el apellido
app.get('/Usuario/:id',(req,res)=>{
    aplicacion.nombreUser(req.params.id,res);
});

//autorizar medicos.

app.put('/Usuario/:Id/estado/', (req,res) => {
    //aplicacion.cambiarEstado();
    //return res;
    
    var usuarioId=req.params.Id;
    var nuevoEstado = req.body.habilitado ? 1:0;
    console.log(nuevoEstado);
    //aplicacion.cambiarEstado(req.params.Id,req.params.estado,res);
    aplicacion.cambiarEstado(usuarioId,nuevoEstado,res);
});

app.put('/turno/estado/:id',(req, res) => {
    //const Id_Turno = req.params.id;
    //const nuevoEstadoT = req.body.Estado;
    
    aplicacion.cambiarEstadoTurno(req.params.id,req.body.Estado,res);
    
    });

app.get('/Calificaciones/MedicosCalificados/:Id',(req,res)=> {
    aplicacion.obtenerMedicosCalificados(req.params.Id,res);
})

app.post('/Calificaciones/Guardar',(req,res)=>{
    aplicacion.guardarCalificacion(req,res);
})


app.listen( process.env.PORT  || 3000,()=>{
    console.log('escuchando el puerto');
});
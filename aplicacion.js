
var db = require('./DB');

exports.leer = function(usuario ,res){

    db.buscarPersonas(datos=>{
        res.json(validarusuario(datos, usuario))
    });
;}

function validarusuario(datos, usuario){
    for(i=0; i < datos.length; i++){
        element = datos[i];
        console.log(element.Usuario, usuario.Usuario);
        if (element.Usuario == usuario.Usuario && element.Password == usuario.Password)
            return element;
    }
    return null;
};


exports.insertar = function(usuario, res){
    db.insertarUser(usuario, datos => { res.json(datos) });
};

exports.nombreUser=function(Id,res){
    db.nombreUser(Id,res);
};

//turnos

exports.obtenerTurnos = function(res) {
    db.obtenerTurnos(res, datos =>{ res.json(datos) });
};

exports.obtenerEspecialidades = function(res) {
    db.obtenerEspecialidades(res);
};

exports.obtenerMedicos = function(res) {
    db.obtenerMedicos(res);
};

exports.obtenerMedicosPorEspecialidad = function(especialidadId, res) {
    db.obtenerMedicosPorEspecialidad(especialidadId, res);
};

// Función para obtener días laborales disponibles
exports.obternerDiasDispoTurnos = function(medicoId, res) {
    db.obternerDiasDispoTurnos(medicoId, res);
};

exports.obtenerDisponibilidadMedico = function(medicoId, fecha, res) {
    db.obtenerDisponibilidadMedico(medicoId, fecha, res);
};

exports.crearTurno = function(turnoData, res) {
    db.crearTurno(turnoData, res);
};

exports.obtenerPacientes = function(res) {
    db.obtenerPacientes(res);
};

exports.obtenerTurnosPorMedico =function(Medico_id,res){
    db.obtenerTurnosPorMedico(Medico_id, res);
}

exports.cambiarEstado= function(usuarioId, nuevoEstado,res) {
    db.cambiarEstado(usuarioId, nuevoEstado, res);
};

exports.cambiarEstadoTurno= function(Id_Turno,nuevoEstadoT,res){
    db.cambiarEstadoTurno(Id_Turno,nuevoEstadoT,res);
}

exports.obtenerMedicosCalificados = function(Id, res){
    db.obtenerMedicosCalificados(Id,res);
}

exports.guardarCalificacion = function(req,res){
    db.guardarCalificacion(req,res);
}
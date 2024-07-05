
var db = require('./DB');

exports.leer = function(usuario ,res){

    db.buscarPersonas(datos=>{
        res.json(validarusuario(datos, usuario))
    });
}

function validarusuario(datos, usuario){
    for(i=0; i < datos.length; i++){
        element = datos[i];
        console.log(element.Usuario, usuario.Usuario);
        if (element.Usuario == usuario.Usuario && element.Password == usuario.Password)
            return element;
    }
    return null;
}


exports.insertar = function(usuario, res){
    db.insertarUser(usuario, datos => { res.json(datos) });
}


//turnos

exports.obtenerEspecialidades = function(res) {
    db.obtenerEspecialidades(res);
}

exports.obtenerMedicos = function(res) {
    db.obtenerMedicos(res);
}

exports.obtenerMedicosPorEspecialidad = function(especialidadId, res) {
    db.obtenerMedicosPorEspecialidad(especialidadId, res);
}

exports.obtenerDisponibilidadMedico = function(medicoId, res) {
    db.obtenerDisponibilidadMedico(medicoId, res);
}

exports.crearTurno = function(turnoData, res) {
    db.crearTurno(turnoData, res);
}

exports.obtenerPacientes = function(res) {
    db.obtenerPacientes(res);
}

exports.cambiarEstado= function(usuarioId, nuevoEstado,res){
    db.cambiarEstado(usuarioId, nuevoEstado, res);
}
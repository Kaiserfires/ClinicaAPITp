
var mysql= require('mysql');
/*
var conexion = mysql.createConnection({
    host:'sql10.freemysqlhosting.net',
    user:'sql10706491',
    password:'3Sb5wTcvNx',
    database:'sql10706491',
    port:3306
});*/

var conexion = mysql.createConnection({
    host:'mysql.db.mdbgo.com',
    user:'kaiserfires_clinigui',
    password:'Clinica-tp1',
    database:'kaiserfires_cliniguitp',
    port:3306
});


function conectar(){

    conexion.connect(function(err){
        if(err) console.log(err);
        else{
            console.log("conexion exitosa");
        }
    })
}

exports.buscarPersonas = function(respuesta){
    conectar();
    conexion.query("select * from Usuario",
    function(err, resultado, filas){
        if(err) throw err;
            console.log('estoy antes que hola');
        //console.log(resultado);
        respuesta(resultado);
    });
    console.log('hola');
}


exports.insertarUser = function(usuario,retornar){
    conectar();
    var sql = "insert into Usuario (Nombre, Apellido, FecNac, Usuario, Password, Usuario_tipo, Especialidad, horario_entrada, horario_salida, dias_laborales)";
    sql= sql + " values ('" + usuario.Nombre + "',";
    sql= sql + "'" + usuario.Apellido + "',";
    sql= sql + "'" + usuario.FecNac + "',";
    sql= sql + "'" + usuario.Usuario + "',";
    sql= sql + "'" + usuario.Password + "',";
    sql= sql + "'" + usuario.Usuario_tipo + "',";
    sql= sql + "'" + usuario.Especialidad + "',";
    sql= sql + "'" + usuario.horario_entrada + "',";
    sql= sql + "'" + usuario.horario_salida + "',";
    sql= sql + "'" + usuario.dias_laborales + "')";

    conexion.query(sql,
        function(err, resultado, filas){
        if (err) throw err;
        console.log(resultado);

        retornar(resultado);
    });
}
//turnos y busqueda de medicos

exports.obtenerEspecialidades = function(res) {
    conectar();
    conexion.query("SELECT Especialidad FROM Usuario WHERE Especialidad IS NOT NULL", function(err, resultado) {
        if (err) throw err;
        console.log(resultado);
        res.json(resultado);
    });
}

exports.obtenerMedicosPorEspecialidad = function(especialidadId, res) {
    conectar();
    conexion.query("SELECT * FROM Usuario WHERE Usuario_tipo = 2 AND LOWER(Especialidad) = LOWER(?)", [especialidadId], function(err, resultado) { //lower pasa todo a minuscula
        if (err) throw err;
        console.log(resultado);
        res.json(resultado);
    });
}

exports.obtenerDisponibilidadMedico = function(medicoId, res) {
    conectar();
    conexion.query("SELECT horario_entrada, horario_salida FROM Usuario WHERE id = ?", [medicoId], function(err, resultado) {
        if (err) throw err;
        var  disponibilidad =[];
        disponibilidad  = generateHorarios(resultado[0].horario_entrada, resultado[0].horario_salida).slice();
        //console.log(resultado);
        console.log(resultado);
        res.json(disponibilidad);
    });
}

exports.crearTurno = function(turnoData, res) {
    conectar();
    var sql = "INSERT INTO Turnos (Paciente_id, Medico_id, Fecha, Hora, Estado) ";
    sql= sql + " values ('" + Turnos.Paciente_id  + "',";
    sql= sql + "'" + Turnos.Medico_id + "',";
    sql= sql + "'" + Turnos.Fecha + "',";
    sql= sql + "'" + Turnos.Hora + "',)";
    //var values = [turnoData.Paciente_id, turnoData.Medico_id, turnoData.Fecha, turnoData.Hora];
    
    conexion.query(sql, values, function(err, resultado) {
        if (err) throw err;
        res.json({ id: resultado.insertId, ...turnoData });
    });
}

exports.obtenerPacientes = function(res) {
    conectar();
    conexion.query("SELECT * FROM Usuario WHERE Usuario_tipo = 3", function(err, resultado) {
        if (err) throw err;
        res.json(resultado);
    });
}

exports.obtenerMedicos = function(res) {
    conectar();
    conexion.query("SELECT * FROM Usuario WHERE Usuario_tipo = 2", function(err, resultado) {
        if (err) throw err;
        res.json(resultado);
    });
}

function generateHorarios(entrada, salida) {
    const horarios = [];
    let start = new Date(`1970-01-01 ${entrada}:00`);
    const end = new Date(`1970-01-01 ${salida}:00`);
    while (start < end) {
        horarios.push(start.toTimeString().slice(0, 5) + " hs");
        start.setMinutes(start.getMinutes() + 60);
        //console.log(start);
    }
    return horarios;
}

exports.cambiarEstado= function(usuarioId, nuevoEstado,res){
    console.log(nuevoEstado);
    conectar();
    var sql = "UPDATE Usuario SET estado = ? WHERE Id=? AND Usuario_tipo=2";
    conexion.query(sql,[nuevoEstado, usuarioId], function(err, resultado){
        if (err) {
            console.error("Error al actualizar el estado:", err);
            res.status(500).send("Error al actualizar el estado");
            return;
        }
        console.log("Estado actualizado exitosamente");
        res.json(resultado);
    });
    
}
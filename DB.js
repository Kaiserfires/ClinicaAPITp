
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

exports.obtenerDisponibilidadMedico = function(medicoId, fecha, res) {
    conectar();
    // Consulta para obtener el horario de entrada y salida del médico
    conexion.query("SELECT horario_entrada, horario_salida FROM Usuario WHERE id = ?", [medicoId], function(err, resultado) {
        if (err) throw err;

        const horarioEntrada = resultado[0].horario_entrada;
        const horarioSalida = resultado[0].horario_salida;

        // Generar la lista de todos los horarios posibles en ese rango
        let disponibilidad = generateHorarios(horarioEntrada, horarioSalida);

        // Consulta para obtener los turnos ya ocupados en la fecha seleccionada
        const sqlTurnosOcupados = "SELECT Hora FROM Turnos WHERE Medico_id = ? AND Fecha = ?";
        conexion.query(sqlTurnosOcupados, [medicoId, fecha], function(err, turnosOcupados) {
            if (err) throw err;

            // Filtrar los horarios ocupados
            const horasOcupadas = turnosOcupados.map(turno => turno.Hora); // Lista de horarios ocupados
            disponibilidad = disponibilidad.filter(horario => !horasOcupadas.includes(horario));

            // Retornar los horarios disponibles
            res.json(disponibilidad);
        });
    });


    /*conexion.query("SELECT horario_entrada, horario_salida FROM Usuario WHERE id = ?", [medicoId], function(err, resultado) {
        if (err) throw err;
        var  disponibilidad =[];
        disponibilidad  = generateHorarios(resultado[0].horario_entrada, resultado[0].horario_salida).slice();
        //console.log(resultado);
        console.log(resultado);
        res.json(disponibilidad);
    });*/
}

exports.obtenerTurnos =function(res , respuesta){
    conectar();
    var sql= "SELECT * FROM Turnos";
    conexion.query(sql, function(err, res){
        if(err) throw err;
        
        respuesta(res);
    });
}

exports.obternerDiasDispoTurnos = function (medicoId, res) {
    conectar();

    const sqlUsuario = `
        SELECT dias_laborales, horario_entrada, horario_salida 
        FROM Usuario 
        WHERE id = ? AND usuario_tipo = 2 AND estado = 1
    `;

    conexion.query(sqlUsuario, [medicoId], function(err, resultado) {
        if (err) throw err;

        const { dias_laborales, horario_entrada, horario_salida } = resultado[0];
        const diasLaborales = dias_laborales.split(',').map(d => parseInt(d));

        const fechasDisponibles = [];
        const fechaActual = new Date();

        // Revisamos los próximos 15 días
        for (let i = 0; i < 15; i++) {
            const fecha = new Date(fechaActual);
            fecha.setDate(fecha.getDate() + i);

            const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
            if (diasLaborales.includes(diaSemana)) {
                const fechaFormateada = fecha.toISOString().split('T')[0];

                // Verificamos si el día ya está completamente ocupado
                const sqlTurnos = `
                    SELECT COUNT(*) AS totalTurnos 
                    FROM Turnos 
                    WHERE Medico_id = ? AND Fecha = ? 
                    AND Hora BETWEEN ? AND ?
                `;
                conexion.query(
                    sqlTurnos,
                    [medicoId, fechaFormateada, horario_entrada, horario_salida],
                    function(err, resultadoTurnos) {
                        if (err) throw err;

                        // Si no todos los turnos están ocupados, agregamos la fecha disponible
                        if (resultadoTurnos[0].totalTurnos < (parseInt(horario_salida) - parseInt(horario_entrada))) {
                            fechasDisponibles.push({
                                fecha: fechaFormateada,
                                dia: obtenerNombreDia(diaSemana),
                            });
                        }

                        // Si es el último día del ciclo, devolvemos la respuesta
                        if (i === 14) {
                            res.json(fechasDisponibles);
                        }
                    }
                );
            } else if (i === 14) {
                // Si no quedan más días que revisar, devolvemos la respuesta
                res.json(fechasDisponibles);
            }
        }
    });
};

// Función auxiliar para obtener el nombre del día de la semana
function obtenerNombreDia(dia) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia];
}



exports.crearTurno = function(turnoData, res) {
    conectar();
    var sql = "INSERT INTO Turnos (Paciente_id, Medico_id, Fecha, Hora, Estado) ";
    sql= sql + " values ('" + turnoData.Paciente_id  + "',";
    sql= sql + "'" + turnoData.Medico_id + "',";
    sql= sql + "'" + turnoData.Fecha + "',";
    sql= sql + "'" + turnoData.Hora + "',";
    sql= sql + "'" + turnoData.Estado + "')";
    //var values = [turnoData.Paciente_id, turnoData.Medico_id, turnoData.Fecha, turnoData.Hora];
    
    conexion.query(sql, function(err, resultado) {
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

//function generateDiasLaborales(){}


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
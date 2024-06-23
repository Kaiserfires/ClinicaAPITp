
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
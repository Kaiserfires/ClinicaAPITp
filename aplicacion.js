
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



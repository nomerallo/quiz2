var usuarios = {
	admin:{id:1,nombre:"admin",password:"1234"},
	sergio:{id:2,nombre:"sergio",password:"sergio"}
};

exports.autenticar = function(nombre,contraseña,callback){
	var msgError = 'Usuario o contraseña incorrectos';
	
	if(usuarios[nombre]){
		if(contraseña === usuarios[nombre].password){
			callback(null,usuarios[nombre]);
		}else{
			callback(new Error(msgError));
		}

	}else{
		callback(new Error(msgError));
	}
};
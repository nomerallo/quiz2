module.exports = function(sequelize,DataTypes){

	return sequelize.define('tabla_comentarios',//sequelize a veces cambia este nombre de la tabla.Cosa de plurales.
							{
								texto:{
											type:DataTypes.STRING,
											validate:{notEmpty:{msg:"-> Falta el contenido del comentario"}}
										},
								publicado:{type:DataTypes.BOOLEAN,defaultValue: false}
							});
};
define([],function(){
	var mappings = {
		"CreatedTimestamp" : "CreatedTimestamp",
		"Measureemnt_Image_Id" : "Measureemnt_Image_Id",
		"Measurement_History_Id" : "Measurement_History_Id",
		"media_id" : "media_id",
	};
	Object.freeze(mappings);
	
	var typings = {
		"CreatedTimestamp" : "date",
		"Measureemnt_Image_Id" : "number",
		"Measurement_History_Id" : "number",
		"media_id" : "number",
	}
	Object.freeze(typings);
	
	var primaryKeys = [
					"Measureemnt_Image_Id",
	];
	Object.freeze(primaryKeys);
	
	var config = {
		mappings : mappings,
		typings : typings,
		primaryKeys : primaryKeys,
		serviceName : "InspSyncObjSrvc",
		tableName : "measurement_images"
	};
	Object.freeze(config);
	
	return config;
})

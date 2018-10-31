define([],function(){
	var mappings = {
		"CreatedTimestamp" : "CreatedTimestamp",
		"extension" : "extension",
		"id" : "id",
		"LastUpdatedTimestamp" : "LastUpdatedTimestamp",
		"media_base64" : "media_base64",
		"media_id" : "media_id",
		"Timestamp" : "Timestamp",
		"type" : "type",
		"url" : "url",
	};
	Object.freeze(mappings);
	
	var typings = {
		"CreatedTimestamp" : "date",
		"extension" : "string",
		"id" : "string",
		"LastUpdatedTimestamp" : "date",
		"media_base64" : "string",
		"media_id" : "number",
		"Timestamp" : "date",
		"type" : "string",
		"url" : "string",
	}
	Object.freeze(typings);
	
	var primaryKeys = [
					"media_id",
	];
	Object.freeze(primaryKeys);
	
	var config = {
		mappings : mappings,
		typings : typings,
		primaryKeys : primaryKeys,
		serviceName : "InspSyncObjSrvc",
		tableName : "media"
	};
	Object.freeze(config);
	
	return config;
})

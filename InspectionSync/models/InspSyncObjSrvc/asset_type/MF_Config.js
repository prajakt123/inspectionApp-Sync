define([],function(){
	var mappings = {
		"Asset_Type_Id" : "Asset_Type_Id",
		"CreatedTimestamp" : "CreatedTimestamp",
		"Description" : "Description",
		"Id" : "Id",
		"Name" : "Name",
		"Timestamp" : "Timestamp",
	};
	Object.freeze(mappings);
	
	var typings = {
		"Asset_Type_Id" : "number",
		"CreatedTimestamp" : "date",
		"Description" : "string",
		"Id" : "string",
		"Name" : "string",
		"Timestamp" : "date",
	}
	Object.freeze(typings);
	
	var primaryKeys = [
					"Asset_Type_Id",
	];
	Object.freeze(primaryKeys);
	
	var config = {
		mappings : mappings,
		typings : typings,
		primaryKeys : primaryKeys,
		serviceName : "InspSyncObjSrvc",
		tableName : "asset_type"
	};
	Object.freeze(config);
	
	return config;
})

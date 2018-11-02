define([],function(){
	var mappings = {
		"CreatedTimestamp" : "CreatedTimestamp",
		"email" : "email",
		"FirstName" : "FirstName",
		"id" : "id",
		"LastName" : "LastName",
		"Password" : "Password",
		"Role" : "Role",
		"User_Id" : "User_Id",
	};
	Object.freeze(mappings);
	
	var typings = {
		"CreatedTimestamp" : "date",
		"email" : "string",
		"FirstName" : "string",
		"id" : "number",
		"LastName" : "string",
		"Password" : "string",
		"Role" : "string",
		"User_Id" : "number",
	}
	Object.freeze(typings);
	
	var primaryKeys = [
					"id",
					"User_Id",
	];
	Object.freeze(primaryKeys);
	
	var config = {
		mappings : mappings,
		typings : typings,
		primaryKeys : primaryKeys,
		serviceName : "InspSyncObjSrvc",
		tableName : "inspection_user"
	};
	Object.freeze(config);
	
	return config;
})

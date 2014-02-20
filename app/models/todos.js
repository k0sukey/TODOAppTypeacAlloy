exports.definition = {
	config: {
		columns: {
			"id": "integer primary key autoincrement",
			"task": "text not null",
			"done": "numeric default 0 not null",
			"created_at": "text default '0000-00-00 00:00:00' not null",
			"deleted_at": "text default '0000-00-00 00:00:00' not null"
		},
		adapter: {
			type: "sql",
			collection_name: "todos",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};
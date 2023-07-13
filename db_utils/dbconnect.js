const key =
	"patlbO4LCHuvG39e5.9e7cc8bffb8761afec80e0c925a90fedbd682b89795fffd6cd1789acc893226a";
const Airtable = require("airtable");

Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: key,
});

const base = new Airtable({ key }).base("appzPQJSwnY2cv4zc");

async function findByTgId() {
	
	base("Users")
		.select({
			maxRecords: 50,
			view: "Grid view",
		})
		.eachPage(
			function page(records, fetchNextPage) {
				records.forEach(function (record) {
					console.log("Record:", record.fields);
					
				});
				fetchNextPage();
			},
			function done(err) {
				if (err) {
					console.error(err);
					return;
				}
			}
		);

	}

findByTgId();

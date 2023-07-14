// const key =
// 	"patlbO4LCHuvG39e5.9e7cc8bffb8761afec80e0c925a90fedbd682b89795fffd6cd1789acc893226a";
require("dotenv").config();
const key = process.env.AIRT_TOKEN;	
const Airtable = require("airtable");

Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: key,
});

const base = new Airtable({ key }).base("appzPQJSwnY2cv4zc");

async function getFields(table) {
	const pageRecords = [];
try{
	await base(table)
		.select({
			maxRecords: 50,
			view: "bot_view",
		})
		.eachPage(function page(records, fetchNextPage) {
			records.forEach(function (record) {
				pageRecords.push(record.fields);
			});
			fetchNextPage();
		});
	}
	catch (e){
		console.log(e);
	}

	return pageRecords;
}

module.exports = { getFields };

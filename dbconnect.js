require("dotenv").config();

// const base = require('airtable').base('appzPQJSwnY2cv4zc');
const key = process.env.AIRT_TOKEN;

const Airtable = require("airtable");
Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: key,
});

const base = new Airtable({ key }).base("appzPQJSwnY2cv4zc");

base("Users")
	.select({
		// Selecting the first 3 records in Grid view:
		maxRecords: 100,
		view: "Grid view",
	})
	.eachPage(
		function page(records, fetchNextPage) {
			// This function (`page`) will get called for each page of records.

			records.forEach(function (record) {
				console.log("Retrieved", record.fields);
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

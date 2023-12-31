import { config } from "dotenv";
config();
const key = process.env.AIRT_TOKEN;
import Airtable from "airtable";

Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: key,
});

const base = new Airtable({ key }).base("appzPQJSwnY2cv4zc");

async function getFields(table) {
	const pageRecords = [];
	try {
		await base(table)
			.select({
				maxRecords: 50,
				view: "bot_view",
			})
			.eachPage(function page(records, fetchNextPage) {
				records.forEach(function (record) {
					let fields = record.fields;
					fields.recId = record.id;
					pageRecords.push(fields);
				});
				fetchNextPage();
			});
	} catch (e) {
		console.log(e);
	}

	return pageRecords;
}

export { getFields, base };

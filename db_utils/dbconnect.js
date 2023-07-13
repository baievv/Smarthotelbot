require("dotenv").config();

// const key = process.env.AIRT_TOKEN;
const key =
	"patlbO4LCHuvG39e5.9e7cc8bffb8761afec80e0c925a90fedbd682b89795fffd6cd1789acc893226a";
const Airtable = require("airtable");

Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: key,
});

const base = new Airtable({ key }).base("appzPQJSwnY2cv4zc");
const users = base("Users");
const isFind = false;

// Получение записей из таблицы Airtable
base("Users")
	.select({
		maxRecords: 100,
		view: "Grid view",
	})
	.eachPage(
		function page(records, fetchNextPage) {
			records.forEach(function (record) {
				if (record.fields.tg_id == "5775773353") {
					console.log("I find - ", record.fields.FIO);
				}
				console.log("Record - ", record.fields);
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

async function findByTgId() {
	const records = [];

	await base("Users")
		.select()
		.eachPage(
			function page(pageRecords, fetchNextPage) {
				pageRecords.forEach(function (record) {
					console.log(record.fields);
					records.push(...record.fields);
				});
				fetchNextPage();
			},
			function done(err) {
				if (err) {
					console.error(err);
				}
			}
		);
	return records;
}

findByTgId()
	.then((records) => {
		console.log(records);
	})
	.catch((error) => {
		console.error("Ошибка при получении записей:", error);
	});

//  console.log(recordss);

// module.exports=findByTgId;

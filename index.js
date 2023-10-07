import { config } from "dotenv";
import routes from "./routes/index.js";
config();

import express from "express";
import bodyParser from "body-parser";
import { setupBot } from "./bot.js";
import https from "https";
import fs from "fs";

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

routes(app);

const init = async () => {
	try {
		setupBot().launch({
			dropPendingUpdates: true,
		});
		console.log("start bot");
	} catch (error) {
		console.log("Error bot start", error);
	}
};

const httpsOptions = {
	key: fs.readFileSync("./ssl/private.key"),
	cert: fs.readFileSync("./ssl/certificate.crt"),
};

https.createServer(httpsOptions, app).listen(process.env.PORT || 8443, async () => {
	console.log("app running on port-", process.env.PORT || 8443);

	init();
});

// 	if (ctx?.message.web_app_data?.data) {
// 		try {
// 			const data = JSON.parse(ctx?.message.web_app_data?.data);
// 			await ctx.reply("Спасибо за обратную связь!");
// 			await ctx.reply("Ваша страна: " + data?.country);
// 			await ctx.reply("Ваша улица: " + data?.street);
// 		} catch (e) {
// 			console.log(e);
// 		}
// 	}
// });

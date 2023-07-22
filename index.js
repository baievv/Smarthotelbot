// Записываем в файл index.js
import { config } from "dotenv";
config();
// const { Telegraf, Composer, Scenes, session, Markup } = require("telegraf");

import express from "express";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
import {setupBot}  from "./bot.js";

const app = express();
app.use(bodyParser.json());

const init=async ()=> {
	try {
		console.log("start bot");
		setupBot().launch();
	} catch (error) {
		console.log("Error bot start", error);
	}
};

app.listen(process.env.PORT || 8443, async () => {
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

// const init = async () => {
// 	// const res = await getFields("Users");
// 	const res = await findRoleByTgId(6019423987);
// 	console.log("Role is", res);
// };

// try {
// 	await ctx.reply("Welcome to Yarocka Smart Apartments", {
// 		reply_markup: {
// 			keyboard: [
// 				[
// 					{
// 						text: "Manage your aparts",
// 						web_app: { url: webAppUrl },
// 					},
// 				],
// 			],
// 			resize_keyboard: true,
// 			one_time_keyboard: true,
// 		},
// 	});
// 	await ctx.reply(`Your role is ${userRole}`);
// } catch (e) {
// 	console.log(e);
// }

// Записываем в файл index.js
require("dotenv").config();
const {
	requestLockStatus,
	openLock,
	closeLock,
} = require("./iot-connect/lock-server");
const { Telegraf } = require("telegraf");
const webAppUrl = "https://smart-hotel.netlify.app/dashboard/1";
const hotelUsers = require("./database/constants");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { findByTgId } = require("./db_utils/dbconnect");
const date = Date.now();
const clientId = "329721a18c01487ebe8c4f6ed920c4db";
const lockId = "9166406";
const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";

const app = express();
app.use(bodyParser.json());

// const init = async () => {
// 	const res = await requestLockStatus(date, clientId, accessToken);
// 	console.log(res);
// };

// app.post(URI, async (req, res) => {
// 	console.log(req.body);

// 	const chatId = req.body.message.chat.id;
// 	const text = req.body.message.text;

// 	await axios.post(`${TELEGRAM_API}/sendMessage`, {
// 		chat_id: chatId,
// 		text: text,
// 	});
// 	return res.send();
// });

app.listen(process.env.PORT || 8443, async () => {
	console.log("app running on port-", process.env.PORT || 8443);
	// await init();
});

const bot = new Telegraf(process.env.USERBOT_TOKEN);

// bot.session();
bot.start(async (ctx) => {
	//проверка пользователя на права
	const userId = ctx.message.from.id;
	console.log(ctx.message.from.id);
	console.log(findByTgId(userId))
	// const userId = ctx.message.from.id;
	// console.log(isRole(userId).role);
	try {
		await ctx.reply("Welcome to Yarocka Smart Apartments", {
			reply_markup: {
				keyboard: [
					[
						{
							text: "Manage your aparts",
							web_app: { url: webAppUrl },
						},
					],
				],
				resize_keyboard: true,
				one_time_keyboard: true,
			},
		});
	} catch (e) {
		console.log(e);
	}
});

bot.command("drop", async (ctx) => {
	await ctx.reply("Menu closed", {
		reply_markup: {
			remove_keyboard: true,
		},
	});
});

bot.on("message", async (ctx) => {
	if (ctx.message?.text) {
		await ctx.reply(ctx.message.text);
	}

	if (ctx?.message.web_app_data?.data) {
		try {
			const data = JSON.parse(ctx?.message.web_app_data?.data);
			await ctx.reply("Спасибо за обратную связь!");
			await ctx.reply("Ваша страна: " + data?.country);
			await ctx.reply("Ваша улица: " + data?.street);
		} catch (e) {
			console.log(e);
		}
	}
});

bot.launch();

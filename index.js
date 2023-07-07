// Записываем в файл index.js
require("dotenv").config();
const { Telegraf } = require("telegraf");
const webAppUrl = "https://singular-griffin-2b9bc4.netlify.app/form";
const hotelUsers = require("./database/constants");

const bot = new Telegraf(process.env.USERBOT_TOKEN);
// const bot = new Telegraf("6286289860:AAHX2Kr5P9gF8G5r0R1Ft0KFC8XAvyQ6hIc");

const isRole = (id) => {
	return hotelUsers.find((el) => el.id === id);
};

bot.start(async (ctx) => {
	//проверка пользователя на права
	//если не админ/стафф, то проверка есть ли пользователь уже в базе гостей и нет ли у него
	//статуса активного пребывания в апартаментах
	console.log(ctx.message.from.id);
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
	ctx.setChatMenuButton(menuButton, {});
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
//https://api.telegram.org/bot6286289860:AAHX2Kr5P9gF8G5r0R1Ft0KFC8XAvyQ6hIc/setWebHook?url=https://9jsrhtluhh.execute-api.eu-north-1.amazonaws.com/s1

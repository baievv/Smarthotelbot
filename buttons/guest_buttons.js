import { Markup } from "telegraf";

const userHaveApprovedDocs = Markup.inlineKeyboard([
	Markup.button.callback("Продолжить", "user-have-app-docs"),
])
	.oneTime()
	.resize();

const userIsNeedTemperature = Markup.inlineKeyboard([
	Markup.button.callback("Супер, давайте выберем!", "user-need-checkin-ac"),
	Markup.button.callback("Спасибо, нет необходимости", "user-no-need-checkin-ac"),
])
	.oneTime()
	.resize();

const userChooseTemperature = Markup.inlineKeyboard([
	[
		Markup.button.callback("18-19°", "user-checkin-ac18"),
		Markup.button.callback("20-21°", "user-checkin-ac20"),
		Markup.button.callback("22-23°", "user-checkin-ac22"),
	],
	[
		Markup.button.callback("24-25°", "user-checkin-ac24"),
		Markup.button.callback("26-27°", "user-checkin-ac26"),
	],
])
	.oneTime()
	.resize();

export { userHaveApprovedDocs, userIsNeedTemperature, userChooseTemperature };

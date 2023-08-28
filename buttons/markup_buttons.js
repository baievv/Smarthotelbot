import { Markup } from "telegraf";

const buttonsYesNo = Markup.keyboard([["Yes", "No"]])
	.oneTime()
	.resize();

const buttonsYesNoCallback = Markup.inlineKeyboard([
	Markup.button.callback("Да", "xxxx"),
	Markup.button.callback("Нет", "no"),
])
	.oneTime()
	.resize();

const checkDocsBtn = Markup.inlineKeyboard([
	Markup.button.callback("Ок, давай посмотрим!", "check-documents"),
])
	.oneTime()
	.resize();

const startCheckDocsBtn = Markup.inlineKeyboard([
	Markup.button.callback("Начать проверку", "start-check-docs"),
])
	.oneTime()
	.resize();

const againCheckDocsBtn = Markup.inlineKeyboard([
	Markup.button.callback("Продолжить проверку", "start-check-docs"),
])
	.oneTime()
	.resize();

	const userHaveApprovedDocs = Markup.inlineKeyboard([
		Markup.button.callback("Продолжить", "user-have-app-docs"),
	])
		.oneTime()
		.resize();

const approveDocsBtn = Markup.inlineKeyboard([
	Markup.button.callback("✅Одобрить", "approve-guest-docs"),
	Markup.button.callback("⛔️Отклонить", "disapprove-guest-docs"),
])
	.oneTime()
	.resize();

export {
	buttonsYesNo,
	buttonsYesNoCallback,
	checkDocsBtn,
	startCheckDocsBtn,
	approveDocsBtn,
	againCheckDocsBtn,
	userHaveApprovedDocs
};

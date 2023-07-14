require("dotenv").config();
const { start } = require("./controllers/commands");
const { Telegraf, Composer, Scenes, session, Markup } = require("telegraf");
const { simpleReply, isTruePhone } = require("./utils/utils");
const { isActualBookingByPhone } = require("./db_utils/db_utils");
const webAppUrl = "https://smart-hotel.netlify.app/dashboard/1";
const bot = new Telegraf(process.env.USERBOT_TOKEN);

const askPhone = new Composer();
askPhone.on("text", async (ctx) => {
	console.log("Scenes");
	await ctx.reply(
		"Please,send your phone number in international format +ХХ ХХХ ХХХ ХХ ХХ"
	);
	return ctx.wizard.next();
});

const getPhone = new Composer();
getPhone.on("text", async (ctx) => {
	const phoneNumber = ctx.message.text;
	await simpleReply(ctx, `Вы прислали номер${phoneNumber}`);
	if (isTruePhone(phoneNumber).result) {
		const { phone } = isTruePhone(phoneNumber);
		ctx.reply(`Your phone is true - ${phone}`);
		// Проверка на наличие актуальных бронировок по номеру телефона
    const isFind = await isActualBookingByPhone(phone);
    console.log("Check phone is ",isFind);
		if (isFind){
      ctx.reply("Спасибо! Ваша бронировка найдена");
      ctx.reply("Для того, чтобы администратор смог проверить ваш документы - пришлите нам, пожалуйста, фото первой страницы загранпаспорта");
      ctx.wizard.next();
    } else {
      ctx.reply("К сожалению, актуальных бронировок на этот номер телефона не найдено!")
    }
		return ctx.wizard.next();
	} else {
		ctx.reply("You send wrong number");
		ctx.scene.reenter("askPhone");
	}
	return ctx.wizard.next();
});

const checkPhone = new Composer();
checkPhone.on("text", async (ctx) => {
	await simpleReply(ctx, `Вы прислали номер${ctx.message.text}`);
	return ctx.wizard.next();
});

const outSc = new Composer();

const firstTimeScene = new Scenes.WizardScene(
	"sceneWizard",
	askPhone,
	getPhone,
	checkPhone,
	outSc
);
const stage = new Scenes.Stage([firstTimeScene]);

const setupBot = () => {
	bot.use((ctx, next) => {
		return next();
	});
	bot.use(session());
	bot.use(stage.middleware());
	bot.start(start);
	return bot;
};

module.exports = { setupBot };

require("dotenv").config();
const { start } = require("./controllers/commands");
const { Telegraf, Composer, Scenes, session, Markup } = require("telegraf");
// const { simpleReply, isTruePhone } = require("./utils/utils");
// const { isActualBookingByPhone } = require("./db_utils/db_utils");
const { firstTimeScene, reAskPhoto, checkPhoto } = require("./controllers/new_guest");
const webAppUrl = "https://smart-hotel.netlify.app/dashboard/1";
const bot = new Telegraf(process.env.USERBOT_TOKEN);

const stage = new Scenes.Stage([firstTimeScene,reAskPhoto,checkPhoto]);

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

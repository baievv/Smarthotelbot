import { config } from "dotenv";
config();
import { start } from "./controllers/commands.js";
import { Telegraf, Composer, Scenes, session } from "telegraf";
import { firstTimeScene, reAskPhoto, checkPhoto } from "./controllers/new_guest.js";
const webAppUrl = "http://49.13.63.34:3000/dashboard/1";
// import fs from "fs";
// import got from "got";
const bot = new Telegraf(process.env.USERBOT_TOKEN);

const stage = new Scenes.Stage([firstTimeScene, reAskPhoto, checkPhoto]);

const setupBot = () => {
	bot.use((ctx, next) => {
		return next();
	});
	bot.use(session());
	bot.use(stage.middleware());
	bot.start(start);
	return bot;
};

export { setupBot };

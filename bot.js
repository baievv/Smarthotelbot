import { config } from "dotenv";
config();
import { start } from "./controllers/commands.js";
import { Telegraf, Scenes, session } from "telegraf";
import {
	firstTimeScene,
	reAskPhoto,
	checkPhoto,
	switchRole,
	requestCheckinTemperature,
} from "./controllers/new_guest.js";
import { adminApproveDocs } from "./controllers/admin_scenes.js";
import { addBotActions } from "./controllers/bot_actions.js";

const stage = new Scenes.Stage([
	firstTimeScene,
	reAskPhoto,
	checkPhoto,
	adminApproveDocs,
	switchRole,
	requestCheckinTemperature,
]);

const bot = new Telegraf(process.env.USERBOT_TOKEN);

const setupBot = () => {
	bot.use((ctx, next) => {
		return next();
	});
	// bot.launch();
	bot.use(session());
	bot.use(stage.middleware());
	addBotActions();
	bot.start(start);

	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
	return bot;
};

export { setupBot, bot };
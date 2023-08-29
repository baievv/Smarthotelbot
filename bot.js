import { config } from "dotenv";
config();
import { start } from "./controllers/commands.js";
import { Telegraf, Scenes, session } from "telegraf";
import { firstTimeScene, reAskPhoto, checkPhoto,switchRole, requestCheckinTemperature } from "./controllers/new_guest.js";
import { adminApproveDocs} from "./controllers/admin_scenes.js";
import { addBotActions } from "./controllers/bot_actions.js";

const bot = new Telegraf(process.env.USERBOT_TOKEN);

const stage = new Scenes.Stage([firstTimeScene, reAskPhoto, checkPhoto,adminApproveDocs,switchRole,requestCheckinTemperature]);

const setupBot = () => {
	bot.use((ctx, next) => {
		return next();
	});

	bot.use(session());
	bot.use(stage.middleware());
	addBotActions();
	bot.start(start);
	// Включение грациозной остановки
	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
	return bot;
};

export { setupBot, bot };

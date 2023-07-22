import { Composer, Scenes,session } from "telegraf";
import { isActualBookingByPhone} from "../db_utils/db_utils.js";
import { updateNewUserByPhone, updateUserPhotoByPhone } from "../db_utils/db_update.js";
import { isTruePhone, userData, saveDocFromChat } from "../utils/utils.js";
import { setupBot }  from "../bot.js";
const webAppUrl = "https://smart-hotel.netlify.app/dashboard/1";

const askPhone = new Composer();
askPhone.on("text", async (ctx) => {
	await ctx.reply(
		"Для верификации пришлите, пожалуйста, Ваш номер телефона в международном формате  +ХХ ХХХ ХХХ ХХ ХХ"
	);
	return ctx.wizard.next();
});

const getPhone = new Composer();
getPhone.hears("start", async (ctx) => {
	setupBot().launch();
});
getPhone.on("text", async (ctx) => {
	const msg = ctx.message;
	const phoneNumber = msg.text;
	
	if (isTruePhone(phoneNumber).result) {
		const { phone } = isTruePhone(phoneNumber);
		ctx.session.phone=phone;
		// Проверка на наличие актуальных бронировок по номеру телефона
		const isFind = await isActualBookingByPhone(phone);
		if (isFind) {
			await ctx.reply("Спасибо! Ваша бронировка найдена😊");
			updateNewUserByPhone(phone, userData(msg), "nobody");
			await ctx.reply(
				"Для того, чтобы администратор смог проверить ваш документы - пришлите нам, пожалуйста, фото первой страницы загранпаспорта"
			);
			return ctx.scene.enter("checkPhoto");
		} else {
			await ctx.reply(
				"К сожалению, актуальных бронировок на этот номер телефона не найдено😔"
			);
			await ctx.reply("Возможно Вы прислали неправильный номер!");
		}
		return ctx.scene.reenter("askPhone");
	} else {
		await ctx.reply(
			"Номер, который Вы прислали, не соответствует международному формату🤷‍♀️"
		);
		return ctx.scene.reenter("askPhone");
	}
});

const checkPhoto = new Scenes.BaseScene("checkPhoto");
checkPhoto.hears("start", async (ctx) => {
	setupBot().launch();
});

checkPhoto.on("document", async (ctx) => {
	const targetChatId = 909198449;
	// saveDocFromChat(ctx);
	await ctx.telegram.sendMessage(
		targetChatId,
		`Гость ${ctx.message.chat.first_name} (${ctx.message.chat.username}) прислал документы для проверки`
	);
	updateUserPhotoByPhone(ctx);
	console.log(ctx.message);
	await ctx.forwardMessage(targetChatId, ctx.message.chat.id, ctx.message.message_id);
	await ctx.reply("Спасибо! Ваши документы отправлены администратору на проверку");
	await ctx.reply("Мы пришлем Вам уведомление, как только документы будут проверены!");
	const delaySeconds = 3;
	setTimeout(async () => {
		await ctx.reply("Хорошие новости - Ваши документы подтверждены администратором");
	}, delaySeconds * 1000);
	setTimeout(async () => {
		await ctx.reply("Ваши апартаменты расположены по адресу --");
		await ctx.sendLocation(41.64560982834371, 41.61851927863314);
	}, delaySeconds * 2000);
	setTimeout(async () => {
		await ctx.reply("Обратите внимание на наш гайд по апартаментам и окрестностям");
		await ctx.reply("Gide.pdf");
	}, delaySeconds * 3000);
	setTimeout(async () => {
		await ctx.reply("Уже совсем скоро Вы станете нашим Гостем!");
		await ctx.telegram.sendMessage(
			ctx.message.chat.id,
			"Обратите внимание, что у вас появилось меню, в котором вы можете открыть панель для управления апартаментами, а также кнопки для общения с администратором/услуги",
			{
				reply_markup: {
					keyboard: [
						[
							{
								text: "Управление апартаментами",
								web_app: { url: webAppUrl },
							},
							{ text: "Связаться с администратором" },
						],
					],
					resize_keyboard: true,
				},
			}
		);
	}, delaySeconds * 4000);
	ctx.scene.leave("checkPhoto");
});

checkPhoto.on("message", async (ctx) => {
	if (typeof ctx.message.document === "undefined") {
		await ctx.reply("Простите, но это не фото");
		ctx.scene.enter("reAskPhoto");
	} else ctx.scene.leave("checkPhoto");
});

const docsApprove = new Scenes.BaseScene("docsApprove");
// docsApprove.sendMessage(ctx);

const reAskPhoto = new Scenes.BaseScene("reAskPhoto");
reAskPhoto.hears("start", async (ctx) => {
	setupBot().launch();
});
reAskPhoto.enter(async (ctx) => {
	await ctx.reply(
		"Пожалуйста, попробуйте снова прислать нам фото вашего загранпаспорта"
	);
	ctx.scene.enter("checkPhoto");
});

const firstTimeScene = new Scenes.WizardScene("sceneWizard", askPhone, getPhone);

export { firstTimeScene, reAskPhoto, checkPhoto };

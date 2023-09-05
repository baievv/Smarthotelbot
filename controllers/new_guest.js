import { Composer, Scenes } from "telegraf";
import {
	addRecordForApprove,
	getApartsAndRoomByTgId,
	getBookingsRecordIdbyTgId,
	getUserInfoByTgId,
	isActualBookingByPhone,
} from "../db_utils/db_utils.js";
import {
	updateBookingCheckinTempByTgId,
	updateNewUserByPhone,
} from "../db_utils/db_update.js";
import { isTruePhone, userData } from "../utils/utils.js";
import { checkDocsBtn } from "../buttons/admin_buttons.js";
import { start } from "./commands.js";
import {
	userChooseTemperature,
	userIsNeedTemperature,
} from "../buttons/guest_buttons.js";

const switchRole = new Scenes.BaseScene("switchRole");
switchRole.enter(async (ctx) => {
	await ctx.reply("Hi, admin");
	ctx.scene.enter("adminApproveDocs");
});

//1. Сцена для первого входа и верификации клиента по номеру телефона
const askPhone = new Composer();
askPhone.on("text", async (ctx) => {
	await ctx.reply(
		"Для верификации пришлите, пожалуйста, Ваш номер телефона в международном формате  +ХХ ХХХ ХХХ ХХ ХХ"
	);
	return ctx.wizard.next();
});

//2. Сцена для проверки полученного номера и поиска актуальной бронировки по телефону
const getPhone = new Composer();
getPhone.on("text", async (ctx) => {
	const msg = ctx.message;
	const phoneNumber = msg.text;

	if (ctx.message.text === "/start") {
		start(ctx);
		return;
	}
	if (isTruePhone(phoneNumber).result) {
		const { phone } = isTruePhone(phoneNumber);
		ctx.session.phone = phone;
		// Проверка на наличие актуальных бронировок по номеру телефона
		const isFind = await isActualBookingByPhone(phone);
		if (isFind) {
			await ctx.reply("Спасибо! Ваша бронировка найдена😊");
			updateNewUserByPhone(phone, userData(msg), "guest");
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

//3. Сцена получения фото документов и проверки их админом
const checkPhoto = new Scenes.BaseScene("checkPhoto");
checkPhoto.on("photo", async (ctx) => {
	const targetChatId = 909198449;
	const document = ctx.message.photo.at(-1);
	const adminChatId = 909198449;
	const { href: url } = await ctx.telegram.getFileLink(document.file_id);

	const user = await getUserInfoByTgId(ctx.message.chat.id);
	const temp = await getApartsAndRoomByTgId(ctx.message.chat.id);
	console.log("temp- ", temp);
	user.aparts = temp.aparts;
	user.roomNumber = temp.room;
	user.BookingNumber = temp.book_number;
	user.document = [{ url }];
	addRecordForApprove(user);

	await ctx.telegram.sendMessage(
		adminChatId,
		`Получены новые документы от гостя ${user.FullName}\n` +
			`по бронированию #${user.BookingNumber}\n` +
			`Апартаменты -${user.aparts}\n` +
			`Номер комнаты - ${user.roomNumber}\n` +
			`для проверки`,
		checkDocsBtn
	);

	await ctx.reply(
		"Документы отправлены на проверку. Пожалуйста, подождите ответа от администратора🙂"
	);
});

checkPhoto.on("document", async (ctx) => {
	const adminChatId = 909198449;
	const { href: url } = await ctx.telegram.getFileLink(ctx.message.document.file_id);

	const user = await getUserInfoByTgId(ctx.message.chat.id);
	const temp = await getApartsAndRoomByTgId(ctx.message.chat.id);
	console.log("temp- ", temp);
	user.aparts = temp.aparts;
	user.roomNumber = temp.room;
	user.BookingNumber = temp.book_number;
	user.document = [{ url }];
	addRecordForApprove(user);

	await ctx.telegram.sendMessage(
		adminChatId,
		`Получены новые документы от гостя ${user.FullName}\n` +
			`по бронированию #${user.BookingNumber}\n` +
			`Апартаменты -${user.aparts}\n` +
			`Номер комнаты - ${user.roomNumber}\n` +
			`для проверки`,
		checkDocsBtn
	);

	await ctx.reply(
		"Документы отправлены на проверку. Пожалуйста, подождите ответа от администратора🙂"
	);
});

checkPhoto.action("user-have-app-docs", (ctx) => {
	// docsChecked(ctx);
	ctx.scene.leave("checkPhoto");
	ctx.scene.enter("requestCheckinTemperature");
});

checkPhoto.on("message", async (ctx) => {
	if (ctx.message.text === "/start") {
		start(ctx);
		return;
	}
	if (typeof ctx.message.document === "undefined") {
		await ctx.reply("Простите, но это не фото");
		ctx.scene.enter("reAskPhoto");
	} else ctx.scene.leave("checkPhoto");
});

//4. Сцена, которая реактивирует сцену получения фото документов,
//   в случае, если пользователь прислал что то другое
const reAskPhoto = new Scenes.BaseScene("reAskPhoto");

reAskPhoto.enter(async (ctx) => {
	await ctx.reply(
		"Пожалуйста, попробуйте снова прислать нам фото вашего загранпаспорта"
	);
	ctx.scene.enter("checkPhoto");
});

const requestCheckinTemperature = new Scenes.BaseScene("requestCheckinTemperature");

requestCheckinTemperature.enter(async (ctx) => {
	console.log("CHatId - ", ctx.chat.id);
	ctx.scene.session.recordId = await getBookingsRecordIdbyTgId(ctx.chat.id);
	console.log("Booking number is ", ctx.scene.session.recordId);
	await ctx.reply(
		`Нам очень важен комфорт наших гостей!\n` +
			`Поэтому мы предлагаем Вам выбрать желаемую температуру, которая будет в апартаментах на момент Вашего прибытия`,
		userIsNeedTemperature
	);
});

requestCheckinTemperature.action("user-need-checkin-ac", async (ctx) => {
	await ctx.answerCbQuery("Oк, good choice👌");
	await ctx.reply(
		"Супер!Давайте выберем температуру, которая будет для Вас комфортна",
		userChooseTemperature
	);
});

requestCheckinTemperature.action("user-noneed-checkin-ac", async (ctx) => {
	await ctx.answerCbQuery("OK, no problem");
	docsChecked(ctx);
	//!!!!!!ctx.scene.leave("requestCheckinTemperature");
});

requestCheckinTemperature.action("user-checkin-ac18", async (ctx) => {
	await updateBookingCheckinTempByTgId(ctx.scene.session.recordId, 19);
	await ctx.reply("Вы выбрали температуру 18-19°!");
	await ctx.reply("Вы не любите жару?)))");
	docsChecked(ctx);
});

requestCheckinTemperature.action("user-checkin-ac20", async (ctx) => {
	await updateBookingCheckinTempByTgId(ctx.scene.session.recordId, 19);
	await ctx.reply("Вы выбрали температуру 20-21°!");
	await ctx.reply("Вы не любите жару?)))");
	docsChecked(ctx);
});

requestCheckinTemperature.action("user-checkin-ac22", async (ctx) => {
	await updateBookingCheckinTempByTgId(ctx.scene.session.recordId, 19);
	await ctx.reply("Вы выбрали температуру 22-23°!");
	await ctx.reply("Вы - любитель комфорта)))");
	docsChecked(ctx);
});
requestCheckinTemperature.action("user-checkin-ac24", async (ctx) => {
	await updateBookingCheckinTempByTgId(ctx.scene.session.recordId, 19);
	await ctx.reply("Вы выбрали температуру 24-25°!");
	await ctx.reply("Идеальный выбор)))");
	docsChecked(ctx);
});

requestCheckinTemperature.action("user-checkin-ac26", async (ctx) => {
	await updateBookingCheckinTempByTgId(ctx.scene.session.recordId, 19);
	await ctx.reply("Вы выбрали температуру 26-27°!");
	await ctx.reply("Любите потеплее?)))");
	docsChecked(ctx);
});

const docsChecked = async (ctx) => {
	const delaySeconds = 1;
	setTimeout(async () => {
		await ctx.reply("Ваши апартаменты расположены по адресу --");
		await ctx.sendLocation(41.64560982834371, 41.61851927863314);
	}, delaySeconds * 1000);
	setTimeout(async () => {
		await ctx.reply("Обратите внимание на наш гайд по апартаментам и окрестностям");
		await ctx.reply("Gide.pdf");
	}, delaySeconds * 2000);
	setTimeout(async () => {
		await ctx.reply("Уже совсем скоро Вы станете нашим Гостем!");
		await ctx.telegram.sendMessage(
			ctx.chat.id,
			"Обратите внимание, что у вас появилось меню, в котором вы можете открыть панель для управления апартаментами, а также кнопки для общения с администратором/услуги",
			{
				reply_markup: {
					keyboard: [
						[
							{
								text: "Управление апартаментами",
								web_app: {
									url: `https://yarociytech.com/dashboard/1`,
								},
							},
							{ text: "Связаться с администратором" },
						],
					],
					resize_keyboard: true,
				},
			}
		);
	}, delaySeconds * 3000);
};

const firstTimeScene = new Scenes.WizardScene("sceneWizard", askPhone, getPhone);

export { firstTimeScene, reAskPhoto, checkPhoto, switchRole, requestCheckinTemperature };

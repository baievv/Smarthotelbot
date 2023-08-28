import { Scenes, session, Composer, Markup } from "telegraf";
import { start } from "./commands.js";
import { getAllApprovesToArray, getRecordCount } from "../db_utils/db_utils.js";
import { againCheckDocsBtn, approveDocsBtn, startCheckDocsBtn, userHaveApprovedDocs } from "../buttons/markup_buttons.js";
import { updateUserPhotoByTgId } from "../db_utils/db_update.js";
import { deleteRecordByRecId } from "../db_utils/db_delete.js";
const adminApproveDocs = new Scenes.BaseScene("adminApproveDocs");

adminApproveDocs.enter(async (ctx) => {
	const count = await getRecordCount("ApproveDocs");
	ctx.reply(`Количество запросов для проверки - ${count}`, startCheckDocsBtn);
});

adminApproveDocs.command("start", async (ctx) => {
	start(ctx);
});

adminApproveDocs.action("start-check-docs", async (ctx) => {
	ctx.scene.session.myArray = await getAllApprovesToArray();
	const requests = await getAllApprovesToArray();
	if (requests.length >= 1) {
		await ctx.reply(
			`Документы гостя ${requests[0].pib}\n` +
				`по бронированию №${requests[0].BookingNumber}\n` +
				`апартаменты ${requests[0].Aparts}\n` +
				`комната ${requests[0].room_number}`
		);
		await ctx.replyWithDocument(requests[0].document[0].url, approveDocsBtn);
	}
});

adminApproveDocs.action("approve-guest-docs", async (ctx) => {
	let guest=ctx.scene.session.myArray[0];
	// console.log("Guest is ",guest);
	await ctx.reply(`Вы одобрили документы гостя ${guest.pib}`);
	await ctx.telegram.sendMessage(guest.tg_id,"Поздравляем!Администратор одобрил Ваши документы",userHaveApprovedDocs )
	await updateUserPhotoByTgId(guest, "doc");
	await deleteRecordByRecId("ApproveDocs",guest);
	if (ctx.scene.session.myArray.length>=2){
		ctx.reply(`У вас еще есть непроверенные документы`,againCheckDocsBtn);
	} else {
		ctx.reply("На данный момент запросов на проверку документов нет")
	}
});

adminApproveDocs.action("disapprove-guest-docs", async (ctx) => {
	ctx.reply("Вы отклонили документы гостя");
});

export { adminApproveDocs };

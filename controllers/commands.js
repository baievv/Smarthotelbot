import { findRoleByTgId } from "../db_utils/db_utils.js";

 const start = async (ctx) => {
	const userId = ctx.message.from.id;
	const userRole = await findRoleByTgId(userId);

	switch (userRole) {
		case "admin":
			await ctx.reply(`Привет, ${userRole}!`);
			try {
				ctx.scene.enter("switchRole",{ userId: userId });
			}
			catch (e){
				console.log(e);
			}
			break;
		case "guest":
			await ctx.reply("Добро пожаловать в Yarocka Smart Hotel", {
				reply_markup: {
					remove_keyboard: true,
				},
			});
			await ctx.scene.enter("sceneWizard", { userId: userId });
			break;
		case "stuff":
			() => {};
			break;
		default:
			await ctx.reply("Добро пожаловать в Yarocka Smart Hotel", {
				reply_markup: {
					remove_keyboard: true,
				},
			});
			await ctx.scene.enter("sceneWizard");
	}
};

export { start };

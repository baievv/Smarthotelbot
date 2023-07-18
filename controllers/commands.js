const { findRoleByTgId } = require("../db_utils/db_utils");

const start = async (ctx) => {
	const userId = ctx.message.from.id;
	const userRole = await findRoleByTgId(userId);

	switch (userRole) {
		case "admin":
			await ctx.reply(`Привет, ${userRole}!`);
			break;
		case "guest":
			() => {};
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
			console.log(ctx.message.chat.id);
			await ctx.scene.enter("sceneWizard");
	}
};

module.exports = { start };

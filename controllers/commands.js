const { findRoleByTgId } = require("../db_utils/db_utils");

const start = async (ctx) => {

		// await ctx.reply("Menu closed", {
		// 	reply_markup: {
		// 		remove_keyboard: true,
		// 	},
		// });

	const userId = ctx.message.from.id;
	console.log(ctx.message);
	const userRole = await findRoleByTgId(userId);

	switch (userRole) {
		case "admin":
			simpleReply(ctx, `Hi, ${userRole}!`);
			break;
		case "guest":
			() => {};
			break;
		case "stuff":
			() => {};
			break;
		default:
      ctx.reply("Приветствуем в Yarocka Smart Hotel");
			ctx.scene.enter("sceneWizard");
	}
};

module.exports = { start };

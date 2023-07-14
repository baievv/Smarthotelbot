const { getFields } = require("./dbconnect");

const findRoleByTgId = async (id) => {
	const records = await getFields("Users");
	let role = "nobody";
	for (const item of records) {
		if (item.tg_id == id) {
			role = item.role;
			break; // Досрочный выход из цикла при условии
		}
		console.log(item);
	}
	return role;
};

const isActualBookingByPhone = async (phone) => {
	let result = false;
	let date = Date.now();
	const records = await getFields("Bookings");
	for (const item of records) {
		let guestDate = Date.parse(item.CheckIn);
		console.log(`Guest phone -${item.Phone}, phone - ${phone}`);
		console.log(`Guest Date -${guestDate}, now - ${date}`);
		if (item.Phone == phone && guestDate > date) {
			result = true;
		}
	}
	console.log(result);
	return result;
};

module.exports = { findRoleByTgId, isActualBookingByPhone };

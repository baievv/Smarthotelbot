import { getFields } from "./dbconnect.js";

const findRoleByTgId = async (id) => {
	const records = await getFields("Users");
	// console.log(records);
	let role = "nobody";
	for (const item of records) {
		if (item.tg_id == id) {
			role = item.role;
			break; // Досрочный выход из цикла при условии
		}
	}
	return role;
};



const getUserRecordIdbyPhone = async (phone) => {
	const records = await getFields("Users");
	let id = 0;
	for (const item of records) {
		if (item.Phone === phone) {
			id = item.recId;
			break; // Досрочный выход из цикла при условии
		}
	}
	return id;
};

const isActualBookingByPhone = async (phone) => {
	let result = false;
	let date = Date.now();
	const records = await getFields("Bookings");
	for (const item of records) {
		let guestDate = Date.parse(item.CheckIn);
		// console.log(`Guest phone -${item.Phone}, phone - ${phone}`);
		// console.log(`Guest Date -${guestDate}, now - ${date}`);
		if (item.Phone == phone && guestDate > date) {
			result = true;
		}
	}
	return result;
};

export  {
	findRoleByTgId,
	isActualBookingByPhone,
	getUserRecordIdbyPhone,
};

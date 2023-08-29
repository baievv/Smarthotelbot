import { getFields, base } from "./dbconnect.js";

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

const getApartsAndRoomByTgId = async (id) => {
	const records = await getFields("Bookings");
	console.log("inside getAparts");
	let rec = {};
	for (const item of records) {
		if (item.tg_id == id) {
			console.log("Item -", item);
			rec.aparts = item.Aparts;
			rec.room = item.Room;
			rec.book_number = item.BookingNumber;
			break; // Досрочный выход из цикла при условии
		}
	}
	return rec;
};

const getAllApprovesToArray = async () => {
	const records = await getFields("ApproveDocs");
	let rec = [];
	for (const item of records) {
		rec.push(item);
	}
	return rec;
};

const getUserInfoByTgId = async (tgId) => {
	const records = await getFields("Users");
	let user = 0;
	for (const item of records) {
		if (item.tg_id === tgId) {
			user = item;
			break; // Досрочный выход из цикла при условии
		}
	}
	return user;
};

const getRecordCount = async (table) => {
	const records = await getFields(table);
	let count = 0;
	for (const item of records) {
		count++;
	}
	return count;
};

const addRecordForApprove = async (record) => {
	base("ApproveDocs").create(
		[
			{
				fields: {
					pib: record.FullName,
					tg_id: record.tg_id,
					BookingNumber: record.BookingNumber,
					Aparts: record.aparts,
					room_number: record.roomNumber,
					document: record.document,
				},
			},
		],
		function (err, records) {
			if (err) {
				console.error(err);
				return;
			}
			records.forEach(function (record) {
				// console.log(record.getId());
			});
		}
	);
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

const getUserRecordIdbyTgId = async (tg_id) => {
	const records = await getFields("Users");
	let id = 0;
	for (const item of records) {
		if (item.tg_id === tg_id) {
			id = item.recId;
			break; // Досрочный выход из цикла при условии
		}
	}
	return id;
};
const getBookingsRecordIdbyTgId = async (tg_id) => {
	const records = await getFields("Bookings");
	let id = 0;
	console.log("List Bookings");
	for (const item of records) {
		console.log(item);
		if (item.tgId == tg_id) {
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
		if (item.Phone == phone && guestDate > date) {
			result = true;
		}
	}
	return result;
};

const findTgIdFromBookingsByAparts = async (aparts) => {
	const records = await getFields("Bookings");
	const apart = aparts === "batumi" && "Batumi Smart";
	let id = 0;
	for (const item of records) {
		if (item.isActual === "Yes" && item.Aparts === apart) {
			id = Number(item.tgId);
			break; // Досрочный выход из цикла при условии
		}
	}
	return id;
};

export {
	findRoleByTgId,
	isActualBookingByPhone,
	getUserRecordIdbyPhone,
	getUserRecordIdbyTgId,
	getUserInfoByTgId,
	getRecordCount,
	addRecordForApprove,
	getApartsAndRoomByTgId,
	getAllApprovesToArray,
	getBookingsRecordIdbyTgId,
	findTgIdFromBookingsByAparts,
};

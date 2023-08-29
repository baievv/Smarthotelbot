import { getUserRecordIdbyPhone,getUserRecordIdbyTgId } from "./db_utils.js";
import { base } from "./dbconnect.js";


const updateUserPhotoByTgId = async (guest, type) => {
	const recordId = await getUserRecordIdbyTgId(guest.tg_id);
	let document;
	if (type === "doc") {
		document = guest.document;
	}
	if (type === "photo") {
		document = guest.photo.at(-1);
	}
console.log("Guest is -", guest);
	const url  =  guest.document[0].url;

	base("Users").update(
		[
			{
				id: recordId,
				fields: {
					passport: [{ url }],
					isDocApproved:"Yes",
				},
			},
		],
		function (err) {
			if (err) {
				console.error(err);
				return;
			}
		}
	);
};

const updateNewUserByPhone = async (phone, userData, role) => {
	const recordId = await getUserRecordIdbyPhone(phone);
	//console.log("Updating user|record Id - ", recordId);
	base("Users").update(
		[
			{
				id: recordId,
				fields: {
					tg_id: userData.tg_id,
					tg_chatId: userData.tg_chatId,
					tg_userName: userData.tg_userName,
					tg_firstName: userData.tg_firstName,
					tg_lastName: userData.tg_lastName,
					role: role,
				},
			},
		],
		function (err) {
			if (err) {
				console.error(err);
				return;
			}
		}
	);
};

const updateBookingCheckinTempByTgId = async (recordId, temperature) => {
	base("Bookings").update(
		[
			{
				id: recordId,
				fields: {
					Checkin_temperature: temperature,
				},
			},
		],
		function (err) {
			if (err) {
				console.error(err);
				return;
			}
		}
	);
};

export { updateNewUserByPhone , updateUserPhotoByTgId,updateBookingCheckinTempByTgId};



// const updateUserPhotoByPhone = async (ctx, type) => {
// 	const { phone } = ctx.session;
// 	const recordId = await getUserRecordIdbyPhone(phone);
// 	let document;
	
// 	if (type === "doc") {
// 		document = ctx.message.document;
// 	}
// 	if (type==='photo'){
// 		document=ctx.message.photo.at(-1);
// 		}

// 	const { href: url } = await ctx.telegram.getFileLink(document.file_id);
// 	base("Users").update(
// 		[
// 			{
// 				id: recordId,
// 				fields: {
// 					passport: [{ url }],
// 				},
// 			},
// 		],
// 		function (err) {
// 			if (err) {
// 				console.error(err);
// 				return;
// 			}
// 		}
// 	);
// };

import { base } from "./dbconnect.js";
import { getUserRecordIdbyTgId } from "./db_utils.js";

const deleteRecordByRecId = async (table, guest) => {
	//  const guest= ctx.scene.session.MyArray;
	const recordId = await getUserRecordIdbyTgId(guest.tg_id);
	base(table).destroy(
		[guest.recId],
		function (err, deletedRecords) {
			if (err) {
				console.error(err);
				return;
			}
			console.log("Deleted", deletedRecords.length, "records");
		}
	);
};

export {deleteRecordByRecId};
import { requestLockStatus, openLock, closeLock } from "./lock-server.js";

const clientId = "329721a18c01487ebe8c4f6ed920c4db";
const lockId = "9166406";
const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";

export default async function execCommand(apart, device, command) {
	console.log("inside");
	if (apart === "Batumi" && device === "lock") {
		if (command === "open") {
			let lockStatus = await requestLockStatus(clientId, accessToken, lockId);
			console.log("Lock now is", lockStatus);
			let result = await openLock(clientId, accessToken, lockId);
		}
		if (command === "close") {
		}
		if (command === "status") {
		} else return "unknown command";
	}
}

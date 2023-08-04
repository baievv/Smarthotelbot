import { requestLockStatus, openLock, closeLock } from "./lock-server.js";

export default async function execCommand(apart, device, command) {
	console.log("inside execCommand");
	let result;
	const lockStatus = await requestLockStatus();
	console.log("Lock state now is -", lockStatus.state);
	// if (apart === "batumi" && device === "lock" && lockStatus.state==0) {
	if (lockStatus.state == 0 && command === "open") {
		let res = await openLock();
		console.log("Result of opening is -", res);
		let lockState = await requestLockStatus();
		console.log("Lock state now is", lockState.state);
		if (lockState.state == 1) {
			result = { status: "Lock was opened" };
		} else result = { status: "Have some problems" };
	} else if (lockStatus.state == 1 && command === "close") {
		let res = await closeLock();
		console.log("Result of close is -", res);
		let lockState = await requestLockStatus();
		console.log("Lock state now is", lockState.state);
		if (lockState.state == 0) {
			result = { status: "Lock was closed" };
		} else result = { status: "Have some problems" };
	} else result = { status: "Unknown command" };
	return result;
}

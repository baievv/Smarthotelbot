import { requestLockStatus, openLock, closeLock } from "./lock-server.js";

const lockStatus = async () => {
	let result = await requestLockStatus();
	return result;
};

const lockOpen = async () => {
	let result = await openLock();
	return result;
};

const lockClose = async () => {
	let result = await closeLock();
	return result;
};

async function sleep(ms) {
	console.log("sleeping");
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function execCommand(apart, device, command) {
	let result;
	const status = await lockStatus();
	console.log("Lock state now is -", status);
	// if (apart === "batumi" && device === "lock" && lockStatus.state==0) {
	if (status.state == 0 && command === "switch") {
		await sleep(500);
		const res = await lockOpen();
		console.log("Result of opening is -", res);
		if (res.errcode === 0) {
			result = { status: "open" };
		} else result = { status: "problems" };
	};
	if (status.state == 1 && command === "switch") {
		sleep(500);
		const res = await lockClose();
		if (res.errcode === 0) {
			result = { status: "close" };
		} else result = { status: "problems" };
	};
	if (command==='status'){
		if (status.state===0){
			result='closed';
		}else result='open';
	};
	console.log('Result function is -',result);
 return result;
}

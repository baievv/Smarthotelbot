const axios = require("axios");
const date = Date.now();
const clientId = "329721a18c01487ebe8c4f6ed920c4db";
const lockId = "9166406";
const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";

async function requestLockStatus(date, clientId, accessToken) {
	try {
		const response = await axios.get(
			`https://euapi.ttlock.com/v3/lock/queryOpenState?clientId=${clientId}&accessToken=${accessToken}&lockId=9166406&date=${date}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}

async function getLockDetails(clientId, accessToken, lockId, date) {
	try {
		const response = await axios.get(
			`https://euapi.ttlock.com/v3/lock/detail?clientId=${clientId}&accessToken=${accessToken}&lockId=${lockId}&date=${date}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}

async function openLock(clientId, accessToken, lockId, date) {
	const url = "https://euapi.ttlock.com/v3/lock/unlock";
	const data = new URLSearchParams();

	console.log("Открываем замок");
	data.append("clientId", clientId);
	data.append("accessToken", accessToken);
	data.append("lockId", lockId);
	data.append("date", date);

	axios
		.post(url, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			return error;
		});
}

async function closeLock(clientId, accessToken, lockId, date) {
	const url = "https://euapi.ttlock.com/v3/lock/lock";
	const data = new URLSearchParams();

	console.log("Закрываем замок");
	data.append("clientId", clientId);
	data.append("accessToken", accessToken);
	data.append("lockId", lockId);
	data.append("date", date);

	axios
		.post(url, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.log(response.data);
		})
		.catch((error) => {
			console.error(error);
		});
}
// const date = Date.now();
// const clientId = "329721a18c01487ebe8c4f6ed920c4db";
// const lockId = "9166406";
// const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";

// requestLockStatus(date, clientId, accessToken);
// getLockDetails(clientId, accessToken, lockId, date);
// openLock(clientId, accessToken, lockId, date);
// closeLock(clientId, accessToken, lockId, date);

module.exports = { requestLockStatus, openLock, closeLock };
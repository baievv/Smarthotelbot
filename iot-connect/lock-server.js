import axios from "axios";
const clientIdd = "329721a18c01487ebe8c4f6ed920c4db";
const lockIdd = "9166406";
const accessTokenn = "cfbfd3e45cb1b35077f41756b8a6f448";

export async function requestLockStatus(
	clientId = clientIdd,
	accessToken = accessTokenn
) {
	let date = Date.now();
	const url = `https://euapi.ttlock.com/v3/lock/queryOpenState?clientId=${clientId}&accessToken=${accessToken}&lockId=9166406&date=${date}`;
	const response = await axios.get(url);
	console.log("request status", response.status);
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error("Ошибка при выполнении запроса");
	}
}

export async function getLockDetails(clientId, accessToken, lockId) {
	try {
		const response = await axios.get(
			`https://euapi.ttlock.com/v3/lock/detail?clientId=${clientId}&accessToken=${accessToken}&lockId=${lockId}&date=${date}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}

export async function openLock(
	clientId = clientIdd,
	accessToken = accessTokenn,
	lockId = lockIdd
) {
	let date = Date.now();
	const url = "https://euapi.ttlock.com/v3/lock/unlock";
	const data = new URLSearchParams();

	console.log("Открываем замок");
	data.append("clientId", clientId);
	data.append("accessToken", accessToken);
	data.append("lockId", lockId);
	data.append("date", date);

	const response = await axios.post(url, data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
	console.log("request openlock status", response.status);
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error("Ошибка при выполнении запроса");
	}
}

export async function closeLock(
	clientId = clientIdd,
	accessToken = accessTokenn,
	lockId = lockIdd
) {
	const url = "https://euapi.ttlock.com/v3/lock/lock";
	const data = new URLSearchParams();
	const date = Date.now();
	console.log("Закрываем замок");
	data.append("clientId", clientId);
	data.append("accessToken", accessToken);
	data.append("lockId", lockId);
	data.append("date", date);

	const response = await axios.post(url, data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
	// console.log("request closelock status", response.status);
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error("Ошибка при выполнении запроса");
	}
}

// const clientId = "329721a18c01487ebe8c4f6ed920c4db";
// const lockId = "9166406";
// const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";
// cd .

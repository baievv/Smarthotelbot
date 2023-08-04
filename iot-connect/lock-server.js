import axios from "axios";
const clientIdd = "329721a18c01487ebe8c4f6ed920c4db";
const lockIdd = "9166406";
const accessTokenn = "cfbfd3e45cb1b35077f41756b8a6f448";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestLockStatus(
	clientId = clientIdd,
	accessToken = accessTokenn
) {
	try {
		await sleep(500);
		let date = Date.now();
		const url = `https://euapi.ttlock.com/v3/lock/queryOpenState?clientId=${clientId}&accessToken=${accessToken}&lockId=9166406&date=${date}`;

		const response = await axios.get(url);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error("Ошибка при выполнении запроса");
		}
	} catch (error) {
		return error;
	}
}

export async function getLockDetails(clientId, accessToken, lockId) {
	try {
		await sleep(500);
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
	await sleep(500);
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
			console.log(response.data);
			return response.data;
		})
		.catch((error) => {
			console.log(error);
			return error;
		});
}

export async function closeLock(
	clientId = clientIdd,
	accessToken = accessTokenn,
	lockId = lockIdd
) {
	const url = "https://euapi.ttlock.com/v3/lock/lock";
	const data = new URLSearchParams();
	await sleep(500);
	const date = Date.now();
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
// const clientId = "329721a18c01487ebe8c4f6ed920c4db";
// const lockId = "9166406";
// const accessToken = "cfbfd3e45cb1b35077f41756b8a6f448";


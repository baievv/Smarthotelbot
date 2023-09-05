import * as qs from "qs";
import * as crypto from "crypto";
import { default as axios } from "axios";

let accessToken = "";
const config = {
	host: "https://openapi.tuyaeu.com",
	accessKey: "q9csp3ratmqjuhktk943",
	secretKey: "3573a9fe57504b90a67f7ef6b893d2c8",
	deviceId: "bfaa34c99d5a5038b6trcr",
};

const httpClient = axios.create({
	baseURL: config.host,
	timeout: 5 * 1e3,
});

async function main() {
	// 1. Login signature, request highway to get login token
	const tokenHeaders = await getTokenSign();
	const options = {
		headers: tokenHeaders,
	};
	const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", options);
	if (!login || !login.success) {
		throw Error(`Failed to obtain highway authorization: ${login.msg}`);
	}
	console.log(
		"highway Login credentials obtained successfully: ",
		login.result.access_token
	);
	accessToken = login.result.access_token;

	const url = `/v1.0/iot-03/devices/status?device_ids=${config.deviceId}`;

	const method = "GET";
	const query = {};
	const reqHeaders = await getRequestSign(url, method, {}, query);
	const { path, ...headers } = reqHeaders;
	// console.log("Request header: ", reqHeaders);

	const { data } = await httpClient.request({
		url: path,
		method,
		data: {},
		params: {},
		headers,
	});
	if (!data || !data.success) {
		throw Error(`Error requesting highway service interface: ${data.msg}`);
	}
	// console.log("Business data obtained successfully: ", JSON.stringify(data));
	console.log("Business data obtained successfully: ", data);
	console.log("Result from sensor -", data.result[0].status);
}

// Token signature, just pass it as headers
async function getTokenSign() {
	const nonce = "";
	const method = "GET";
	const timestamp = Date.now().toString();
	const signUrl = "/v1.0/token?grant_type=1";
	const contentHash = crypto.createHash("sha256").update("").digest("hex");
	const signHeaders = Object.keys({});
	const signHeaderStr = Object.keys(signHeaders).reduce((pre, cur, idx) => {
		return `${pre}${cur}:${{}[cur]}${idx === signHeaders.length - 1 ? "" : "\n"}`;
	}, "");
	const stringToSign = [method, contentHash, signHeaderStr, signUrl].join("\n");
	const signStr = config.accessKey + timestamp + nonce + stringToSign;
	return {
		t: timestamp,
		sign_method: "HMAC-SHA256",
		client_id: config.accessKey,
		sign: await encryptStr(signStr, config.secretKey),
		Dev_channel: "YarockaSmart",
		Dev_lang: "Nodejs",
	};
}

// request signature, just pass it as headers
async function getRequestSign(path, method, headers = {}, query = {}, body = {}) {
	const t = Date.now().toString();
	// Parameter deduplication: querystring parameter priority is higher than query
	const [uri, pathQuery] = path.split("?");
	console.log(uri, pathQuery);
	const queryMerged = Object.assign(query, qs.parse(pathQuery));
	// The query dictionary is sorted, and the highway interface related to the form will also be added later
	const sortedQuery = {};
	Object.keys(queryMerged)
		.sort()
		.forEach((i) => (sortedQuery[i] = query[i]));
	console.log("sortedQuery", sortedQuery);

	const querystring = qs.stringify(sortedQuery);
	const url = querystring ? `${uri}?${querystring}` : uri;
	console.log("адрес запроса: ", url);
	if (!accessToken) {
		// Если токена нет, то запрос нужно делать заново.Картинка здесь удобна для того, чтобы напрямую кидать глобальный объект.Не иметь токена нельзя
	}
	const contentHash = crypto
		.createHash("sha256")
		.update(JSON.stringify(body))
		.digest("hex");
	const stringToSign = [method, contentHash, "", decodeURIComponent(url)].join("\n");
	const signStr = config.accessKey + accessToken + t + stringToSign;
	return {
		t,
		path: url,
		access_token: accessToken,
		sign_method: "HMAC-SHA256",
		client_id: config.accessKey,
		sign: await encryptStr(signStr, config.secretKey),
		Dev_channel: "YarockaSmart",
		Dev_lang: "Nodejs",
	};
}

// HMAC-SHA256 encryption algorithm, returns pure uppercase characters
async function encryptStr(str, secret) {
	return crypto
		.createHmac("sha256", secret)
		.update(str, "utf8")
		.digest("hex")
		.toUpperCase();
}

main();

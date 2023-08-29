import axios from "axios";

async function getToken(){
	const url = "https://euapi.ttlock.com/oauth2/token";
	const data = new URLSearchParams();
	console.log("Получаем токен");
	data.append("clientId", "329721a18c01487ebe8c4f6ed920c4db");
	data.append("clientSecret", '4d9de2034502d92b152f16a485a18f0b');
	data.append("username", "dmitry.rb@gmail.com");
	data.append("password", "1bd2a21a7df889630f444364813738d7");

	const response = await axios.post(url, data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
  console.log("request is ", data);
	if (response.status === 200) {
		return console.log(response.data);
	} else {
		throw new Error("Ошибка при выполнении запроса");
	}
}

refreshToken();
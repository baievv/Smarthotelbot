//routing main
import execCommand from "../iot-connect/index.js";

async function useCommand(aparts, device, command) {
	let status = await execCommand(aparts, device, command);
	console.log("Status is -", status);
	return status;
}

export default function (app) {
	app.get("/dashboard/*/*/*", (req, res) => {
		const aparts = req.params[0];
		const device = req.params[1];
		const command = req.params[2];

		console.log("Aparts is ", aparts, " device is ", device, " command is ", command);
		let response=useCommand(aparts,device,command);
		console.log("Response is ", response);
		res.json(response);
	});
}

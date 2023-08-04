//routing main
import execCommand from "../iot-connect/index.js";

export default function (app) {
	app.get("/dashboard/*/*/*", (req, res) => {
		console.log("Try to use /dashboard/");
		const aparts = req.params[0];
		const device = req.params[1];
		const command = req.params[2];

		console.log("Aparts is ", aparts, " device is ", device, " command is ", command);
		let status = execCommand(aparts, device, command);
		console.log('Status is -', status);
		res.json(status);
	});
}

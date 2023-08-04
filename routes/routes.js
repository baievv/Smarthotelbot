//routing main
import execCommand from "../iot-connect/index.js";
export default function (app) {
	app.get("/dashboard/*/*/*", (req, res) => {
		console.log("Try to use /dashboard/");
		const aparts = req.params[0];
		const device = req.params[1];
		const command = req.params[2];

		console.log("Aparts is ", aparts, " device is ", device, " command is ", command);

		execCommand(aparts, device, command);

		res.json({
			path: "asdd",
			result: true,
			files: "dashboards",
		});
	});
}

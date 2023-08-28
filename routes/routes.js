//routing main
import execCommand from "../iot-connect/index.js";

async function useCommand(aparts, device, command) {
	try {
		let status = await execCommand(aparts, device, command);
		console.log("Status is -", status);
		return status;
	} catch (error) {
		console.error("Error:", error);
		throw error; // Передайте ошибку дальше
	}
}

export default function (app) {
	app.get("/dashboard/*/*/*", async (req, res) => {
		const aparts = req.params[0];
		const device = req.params[1];
		const command = req.params[2];

		console.log("Aparts is ", aparts, " device is ", device, " command is ", command);
		try {
			let response = await useCommand(aparts, device, command);
			console.log("Response is ", response);
			res.json(response);
		} catch (error) {
			res.status(500).json({ error: "An error occurred" });
		}
	});
}
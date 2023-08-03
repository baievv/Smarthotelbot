//routing main


export default function(app) {
	
	app.get("/dashboard/*", (req, res) => {
		console.log("Try to use /dashboard/");
		const path = req.params[0];
		console.log(path);

		res.json({
			path: "asdd",
			result: true,
			files: "dashboards",
		});
	});

	app.get("/asd", (req, res) => {
		console.log("Try to use /asd");
		res.json({
			path: "asd",
			req: "Your route",
		});
	});
};

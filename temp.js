bot.on(message("document"), async (ctx) => {
	// verify that ctx.message.document.mime_type is an image type

	const link = await bot.telegram.getFileLink(ctx.ctx.message.document.file_id);

	// use acquired link to download image using fetch, axios, ...
});

//чтение и запись файла
import fs from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";

const stream = fs.createWriteStream(filename);
const { body } = await fetch(link);
await finished(Readable.fromWeb(body).pipe(stream));

// const fs = require("fs");

// const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.on("photo", async (ctx) => {
// 	const photo = ctx.message.photo[0]; // получаем первое фото из сообщения
// 	const file = await ctx.telegram.getFile(photo.file_id); // получаем объект файла
// 	const filePath = `./${file.file_path}`; // путь к файлу на сервере Telegram
// 	const fileStream = fs.createWriteStream(filePath); // создаем поток для записи файла
// 	await ctx.telegram.downloadFile(file.file_id, fileStream); // скачиваем файл и записываем его на диск
// 	ctx.reply(`Фото сохранено на сервере: ${filePath}`);
// });

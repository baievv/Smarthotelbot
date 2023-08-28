import fs from "fs";
import got from "got";
import { pipeline } from "stream/promises";

const isTruePhone = (text) => {
	
	const phoneNumberPattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
	const cleanedText = text.replace(/[\s-]+/g, "");
	const isPhoneNumber = phoneNumberPattern.test(cleanedText);

	return { result: isPhoneNumber, phone: cleanedText };
};

const userData = (msg) => {
	return {
		tg_id: msg.from.id,
		tg_chatId: msg.chat.id,
		tg_userName: msg.from.username,
		tg_firstName: msg.from?.first_name,
		tg_lastName: msg.from?.last_name,
	};
};

const saveDocFromChat = async (ctx) => {
	const document = ctx.message.document;
	const file = await ctx.telegram.getFileLink(document.file_id);
	console.log(file);
	const filePath = `./documents/${document.file_name}`;
	// const fileStream = fs.createWriteStream(filePath);

	const { href: url } = await ctx.telegram.getFileLink(document.file_id);
	console.log("url -", url);
	console.log("filePath -", filePath);
	// pipeline(got.stream(url), fs.createWriteStream(filePath));

	try {
		await pipeline(got.stream(url), fs.createWriteStream(filePath));
	} catch (e) {
		console.log(e);
	}
};

const saveDocFromAirtable= async(document)=>{
	const file = document.file_id;
	console.log('File - ',file);
	const filePath = `./documents/${document.file_name}`;
	// const fileStream = fs.createWriteStream(filePath);

	const { href: url } = document;
	console.log("url -", url);
	console.log("filePath -", filePath);
	// pipeline(got.stream(url), fs.createWriteStream(filePath));

	try {
		await pipeline(got.stream(url), fs.createWriteStream(filePath));
	} catch (e) {
		console.log(e);
	}
}

export { isTruePhone, userData, saveDocFromChat,saveDocFromAirtable };

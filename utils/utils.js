const simpleReply = async (ctx, text) => {
	try {
		await ctx.reply(text);
	} catch (e) {
		console.log(e);
	}
};

const isTruePhone=(text)=> {
  // Регулярное выражение для проверки номера телефона в международном формате
  var phoneNumberPattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  // Удаление пробелов и тире из текста номера телефона
  var cleanedText = text.replace(/[\s-]+/g, '');

  // Проверка соответствия текста номеру телефона в международном формате
  var isPhoneNumber = phoneNumberPattern.test(cleanedText);

  return {result:isPhoneNumber, phone:cleanedText};
}

module.exports={simpleReply,isTruePhone}
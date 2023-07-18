const isTruePhone=(text)=> {
  const phoneNumberPattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  const cleanedText = text.replace(/[\s-]+/g, '');
  const isPhoneNumber = phoneNumberPattern.test(cleanedText);

  return {result:isPhoneNumber, phone:cleanedText};
}

module.exports={isTruePhone}
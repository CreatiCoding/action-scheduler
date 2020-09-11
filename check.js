const axios = require("axios");

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;
if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error(
    [
      `TELEGRAM_TOKEN: ${TELEGRAM_TOKEN}`,
      `TELEGRAM_CHAT_ID: ${TELEGRAM_CHAT_ID}`,
    ].join("\n")
  );
  return;
}

const token = TELEGRAM_TOKEN;
const chat_id = TELEGRAM_CHAT_ID;

(async () => {
  const { data } = await axios.get(
    "https://m.pet-friends.co.kr/product/information?product_id="
  );
  if (data.indexOf('title content="펫프렌즈 : 반려동물 쇼핑몰 1위') !== -1) {
    const text = encodeURIComponent("펫프렌즈 SEO 스키마 이상 발견");
    const result = await axios.get(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`
    );
    console.log(result.data);
  } else {
    console.log("펫프렌즈 정상");
  }
})();

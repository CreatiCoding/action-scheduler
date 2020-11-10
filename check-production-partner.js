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
  try {
    const { data } = await axios.get("https://partner-admin.pet-friends.co.kr");
    if (!data || data.indexOf("로그인") === -1) {
      throw new Error("장애 발생");
    }
    console.log("success");
  } catch (e) {
    console.log(e);
    const text = encodeURIComponent(
      [
        `[상용 파트너 어드민 프론트 서버 오류 발생]`,
        `${"https://github.com/CreatiCoding/action-scheduler/actions?query=workflow%3Acheck-production-partner"}`,
      ].join("\n")
    );
    await axios.get(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`
    );
  }
})();

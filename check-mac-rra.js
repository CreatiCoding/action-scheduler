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
    const { data } = await axios.get(
      "https://mobile.twitter.com/applekorea_rra"
    );
    console.log(data.split("[적합등록]").length);
    console.log(data.split("[적합인증]").length);
    if (
      data.split("[적합등록]").length !== 9 ||
      data.split("[적합인증]").length !== 12
    ) {
      const text = encodeURIComponent(
        [
          `[애플 전파인증!!]`,
          `${data.split('"button button-block disabled"').length}`,
          `${data.split('"button button-block"').length}`,
          `${"https://www.apple.com/kr/shop/buy-mac/macbook-air"}`,
        ].join("\n")
      );
      await axios.get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`
      );
    } else {
      console.log(
        "success",
        data.split('"button button-block disabled"').length,
        data.split('"button button-block"').length
      );
    }
  } catch (e) {
    console.log(e);
  }
})();

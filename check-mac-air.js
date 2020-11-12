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
      "https://www.apple.com/kr/shop/buy-mac/macbook-air"
    );
    if (
      data.split('"button button-block disabled"').length !== 7 ||
      data.split('"button button-block"').length !== 1
    ) {
      const text = encodeURIComponent(
        [
          `[맥북 에어 출시!!]`,
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

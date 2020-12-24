const axios = require("axios");
const curl = new (require("curl-request"))();

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
const CURRENT_TOTAL_COUNT = 218;

(async () => {
  try {
    const { body } = await curl
      .setHeaders([
        "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
      ])
      .get(
        "https://www.youthcenter.go.kr/board/boardList.do?bbsNo=3&pageUrl=board/board"
      );
    const contents = body;
    if (!contents) {
      return await axios.get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
          "error of empty"
        )}`
      );
    }
    const s =
      contents.indexOf("<strong>검색건수 <span>") +
      "<strong>검색건수 <span>".length;
    const e = contents.indexOf("</span> 건</strong>");
    const total_count = parseInt(contents.substring(s, e));
    const list = contents
      .split("<span>제목</span>")
      .filter((e) => e.length < 1000)
      .map((e) => e.replace(/\t/g, ""))
      .map((e) => {
        const title_start =
          e.indexOf('class="ellipsis">') + 'class="ellipsis">'.length;
        const title_end = e.indexOf("\n\n</div>\n</td>\n<td>\n");
        const created_start =
          e.indexOf("등록일</span>\n") + "등록일</span>\n".length;
        const created_end = e.indexOf("\n</td>\n<td>\n<span>조회수");
        return {
          title: e
            .substring(title_start, title_end)
            .replace("\n</a>", "")
            .replace("<strong>새 글</strong>", "")
            .trim(),
          created: e.substring(created_start, created_end).trim(),
        };
      });
    const text = [
      `[청년 구직 활동 지원금] 공지사항 업데이트`,
      `총 게시글수: ${total_count}`,
      ...list.map((e) => `[${e.created}] ${e.title}`),
      `${"https://www.youthcenter.go.kr/board/boardList.do?bbsNo=3&pageUrl=board/board"}`,
    ].join("\n");
    if (Number.isNaN(total_count)) {
      await axios.get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
          contents.substr(0, 100)
        )}`
      );
    } else if (total_count !== CURRENT_TOTAL_COUNT) {
      await axios.get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
          text
        )}`
      );
    } else {
      console.log("success", text);
    }
  } catch (e) {
    console.log(e);
  }
})();

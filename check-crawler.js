const child_process = require("child_process");
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
const CURRENT_TOTAL_COUNT = 217;

(async () => {
  try {
    const contents = await (async () => {
      return new Promise((resolve) => {
        let contents = "";
        const curl_process = child_process.exec(
          `curl "https://www.youthcenter.go.kr/board/boardList.do?bbsNo=3&pageUrl=board/board"`
        );
        curl_process.stdout.on("data", function (data) {
          contents += data;
        });
        curl_process.on("exit", (code) => {
          resolve(contents);
        });
      });
    })();
    console.log(contents);
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

    const text = encodeURIComponent(
      [
        `[청년 구직 활동 지원금] 공지사항 업데이트`,
        `총 게시글수: ${total_count}`,
        ...list.map((e) => `[${e.created}] ${e.title}`),
        `${"https://www.youthcenter.go.kr/board/boardList.do?bbsNo=3&pageUrl=board/board"}`,
      ].join("\n")
    );
    if (total_count !== CURRENT_TOTAL_COUNT) {
      await axios.get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`
      );
    } else {
      console.log("success", text);
    }
  } catch (e) {
    console.log(e);
  }
})();

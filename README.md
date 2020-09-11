# action-scheduler

**action 스케줄러**

깃헙 액션을 활용한 무료 스케줄러

### 활용사례

- node기반 코드 실행(크롤링 후 웹훅 실행)

### 등록된 샘플

- 펫프렌즈 상품 SEO 오류 정보 확인

### 1시간마다 check node 스크립트 코드 실행

```
name: check-telegram
on:
  push:
  pull_request:
  schedule:
    - cron: "*/60 * * * *"
jobs:
  fetch:
    name: check
    env:
      TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
      TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Use Node.js 10.x
        uses: actions/setup-node@v1
        with:
          node-version: 10.x
      - name: 테스트 텔레그램
        run: |
          npm install
          npm run check
```

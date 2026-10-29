# 研究與實證護理概論｜115-1 可複製平台模板

## 本版重點
- 已將教學進度改成 W1–W18，不綁定實際日期。
- 已將 Chapters 收合為 7 個 Modules，方便未來教學設計與網站導覽。
- 已新增學生名單管理頁：`modules/games/student-list-manager.html`
- 尚未有新學期學生名單也可以先上線；開學後再匯入 Supabase。

## 主要入口
- `modules/index.html`：課程總入口，含模組化教學進度
- `modules/nursing-research-full.html`：自主學習平台
- `modules/games/index.html`：老師總控台
- `modules/games/student-list-manager.html`：學生名單匯入／更新
- `modules/games/start.html`：開課展示 QR
- `modules/games/student-entry.html`：學生入口
- `modules/games/nursing-research-games.html`：遊戲中心
- `modules/games/leaderboard.html`：排行榜
- `modules/games/links.html`：課程評值／小組互評 QR
- `modules/games/report.html`：成果報告

## 新學期學生名單流程
1. Supabase 先執行 `docs/supabase-schema.sql`
2. 開 `modules/games/student-list-manager.html`
3. 貼上 CSV：
   `學期,學號,姓名,組別,暱稱`
4. 按「預覽名單」
5. 按「匯入 / 更新 Supabase」

## 其他科目複製
只要修改：
- `config/course-config.js`
- `config/units-config.js`
- 替換自主學習平台 HTML
- 替換遊戲中心 HTML

## 通用教學計畫表
本版新增：
- `modules/teaching-plan.html`：網頁版通用教學計畫表，可列印或另存 PDF。
- `docs/通用教學計畫表_1151_無授課教師.docx`：Word 版通用教學計畫表。
特色：
- 已移除授課教師欄位與教師姓名。
- 教學進度採 W1–W18，不綁定實際日期。
- 18週內容整理為 7 個 Modules / Chapters。

## v3 修正
- 自主學習平台新增右上方「⛶ 全螢幕」按鈕。
- 左側選單縮小為 220px，並可隨時以 ☰ 收合。
- 左側選單支援滑動時自動縮隱藏，亦可用「📌 固定」鎖定。
- 通用教學計畫表修正核心能力指標與相應學習成果標準。
- 移除不適合呈現在正式頁面的製作說明文字。


## v4 教室展示版與全螢幕閱讀修正
新增：
- `modules/classroom-presentation.html`：教室上課展示版，採 PPT-like slide 呈現。
- 自主學習平台新增全螢幕、簡報展示入口、側邊欄固定/自動隱藏/左側觸及展開。
- 全螢幕模式下側邊欄不會因下滑自動顯現；需退出全螢幕或使用目錄按鈕。
- 教室展示版支援鍵盤：← → 換頁、F 全螢幕、L 簡報筆、M 目錄。

## v6 離線版
新增：START_HERE_OFFLINE.html、modules/classroom-presentation-offline.html。
此版本不需要 localhost，可直接雙擊 HTML 開啟。

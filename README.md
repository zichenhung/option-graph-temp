# My CS Study Hub：個人程式學習任務管理站 🎯

這是一個為資工系學生量身打造的**個人介紹與程式學習任務管理網站**。
本專案為網頁前端開發學習的期末作業，展示了如何使用純原生前端技術（HTML5、CSS3、Vanilla JavaScript）建立一個高互動性、響應式（RWD）且支援深/淺色主題切換的靜態網頁應用。

---

## 🌟 專案特色

1. **個人學習看板**：以學習地圖為主軸，整合「任務看板 (Task Board)」、「專業技能展示」、「專案成果」與「學習里程碑」，讓個人介紹更具實用性。
2. **純原生技術開發**：無使用任何第三方前端框架（如 React、Vue）、套件庫（如 jQuery）或樣式庫（如 Tailwind CSS、Bootstrap）。字體使用系統預設字體，且完全不載入任何外部 CDN 與字體檔，確保在無外部資源的環境下也能正常顯示。所有程式邏輯與樣式皆由純 HTML/CSS/JavaScript 手工打造。
3. **無痛本地運行**：專案不依賴後端伺服器與資料庫，只要下載後直接點擊 `index.html` 即可在瀏覽器中完全運作。
4. **狀態持久化**：使用瀏覽器的 `localStorage` 來儲存任務清單以及使用者選擇的主題設定，即使重整網頁或關閉瀏覽器，資料依然保存。

---

## 🛠️ 使用技術

* **結構標籤 (Structure)**：HTML5 語意化標籤 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<form>`)，利於 SEO 與無障礙閱讀。
* **樣式表現 (Styling)**：
  - CSS3 自訂變數 (Variables) 與響應式設計 (RWD / Media Queries)。
  - 彈性盒模型 (Flexbox) 與網格佈局 (CSS Grid)。
  - 微互動特效（Transition 過渡、Hover 放大縮放與 Keyframe 漸顯動畫）。
  - 深色與淺色主題切換。
* **互動邏輯 (Behavior)**：原生 JavaScript (ES6+)。

---

## ⚡ JavaScript 功能與 API 詳細說明

本專案深度應用了多項網頁 DOM 操作、事件監聽與本地端資料序列化儲存技術。以下為核心 API 的實作說明：

### 1. DOM 節點選取與操作
* **`document.querySelector()`**：
  - 用途：精準選取頁面中符合 CSS 選擇器的**第一個**元素節點。
  - 實作位置：如選取主題切換按鈕 (`#theme-toggle`)、任務輸入框 (`#task-input`)、以及表單元件等。
* **`document.querySelectorAll()`**：
  - 用途：選取頁面中符合 CSS 選擇器的**所有**元素節點，並回傳一個 `NodeList` 集合以進行迴圈處理。
  - 實作位置：如選取並監聽所有專案卡片 (`.project-card`)，以及分類篩選按鈕 (`.filter-btn`)。

### 2. 動態節點建立與組裝
* **`document.createElement()`**：
  - 用途：動態在記憶體中建立指定的 HTML 節點。
  - 實作位置：在任務清單的 `render()` 函式中，每當使用者新增任務或載入歷史資料，JavaScript 就會動態建立 `<li>`、`<label>`、`<input type="checkbox">` 與 `<button>` 刪除按鈕等節點。
* **`Element.append()`**：
  - 用途：將一個或多個子節點插入到指定的父節點末尾。
  - 實作位置：將 checkbox、文字 span 與刪除按鈕 `append` 進 `<li>` 任務容器，再將該 `<li>` 插入到畫面的 `#task-list` (`<ul>`) 中。

### 3. 事件監聽 (Event Handlers)
* **`addEventListener()`**：
  - 用途：向指定元素註冊事件處理函式。
  - 實作位置：監聽主題切換點擊事件 (`click`)、表單送出事件 (`submit`)、任務勾選變更事件 (`change`) 等。
* **鍵盤事件 (`keydown` / `keyup`)**：
  - 用途：監聽鍵盤動作，提升使用者操作流暢度。
  - 實作位置：在任務輸入框監聽 `keydown`，若按下 `Enter` 鍵（`event.key === 'Enter'`）則自動執行新增任務。

### 4. 本地資料持久化 (LocalStorage & JSON)
* **`localStorage.getItem()`** 與 **`localStorage.setItem()`**：
  - 用途：在瀏覽器中持久儲存鍵值對資料（Key-Value）。
  - 實作位置：當任務清單發生變動（新增/刪除/完成狀態切換）或使用者切換深淺色主題時，自動將資料儲存至 LocalStorage；下次重新開啟網頁時則自動載入。
* **`JSON.stringify()`**：
  - 用途：將 JavaScript 陣列或物件序列化為 JSON 格式的「字串」，以符合 LocalStorage 只能儲存字串的限制。
* **`JSON.parse()`**：
  - 用途：將 LocalStorage 中讀取出來的 JSON 字串還原為 JavaScript 可操作的「陣列與物件」。

### 5. 樣式類別操控
* **`Element.classList.add()` / `remove()` / `toggle()`**：
  - 用途：增刪或切換節點上的 CSS Class 類別。
  - 實作位置：點擊主題切換按鈕時，使用 `classList.toggle('light-theme')` 切換網頁版型；點擊專案卡片時，切換 `expanded` 以展開或收合卡片細節；表單驗證失敗時，為父容器加上 `has-error` 以顯示紅字提示。

### 6. 表單提交攔截
* **`event.preventDefault()`**：
  - 用途：阻止 HTML 表單的瀏覽器預設行為（即送出資料並重新載入網頁）。
  - 實作位置：在聯絡/目標表單的 `submit` 事件中，攔截請求進行 JavaScript 欄位驗證，並在通過驗證後直接用 JS 將結果更新至畫面的摘要板上。

---

## 💻 本地開啟方式

本專案完全為靜態網頁，無需安裝任何伺服器環境或進行套件建置。

1. **直接開啟**：
   - 下載或複製本專案的資料夾至您的電腦中。
   - 在資料夾內尋找 `index.html` 檔案。
   - 使用任意現代瀏覽器（如 Google Chrome、Microsoft Edge、Safari、Mozilla Firefox）**連按兩下 (Double Click)** `index.html` 即可直接瀏覽網頁並使用所有功能。

2. **使用本地伺服器開啟 (選用，開發建議)**：
   - 若您有安裝 VS Code，可使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 外掛開啟專案。
   - 或在專案目錄下使用終端機執行 Python 內建的伺服器：
     ```bash
     python -m http.server 8000
     ```
     然後在瀏覽器網址列輸入 `http://localhost:8000` 即可訪問。

---

## 🌐 GitHub Pages 部署步驟

本網站無後端、無資料庫，非常適合免費部署於 GitHub Pages 上作為您的個人網頁作品集。

1. **建立 Git 版本庫並上傳至 GitHub**：
   - 在 GitHub 上建立一個新的公開儲存庫 (Repository)，命名為例如 `my-cs-study-hub`。
   - 本地端開啟終端機 (Git Bash / PowerShell / Terminal)，切換至專案根目錄，初始化 Git 並進行首次提交：
     ```bash
     git init
     git add .
     git commit -m "Initialize project: My CS Study Hub"
     ```
   - 將本地儲存庫與 GitHub 連接，並推送到遠端（請將下方 URL 改為您自己的 Repository URL）：
     ```bash
     git remote add origin https://github.com/<您的GitHub帳號>/my-cs-study-hub.git
     git branch -M main
     git push -u origin main
     ```

2. **啟用 GitHub Pages 服務**：
   - 開啟您的瀏覽器，進入 GitHub 該專案儲存庫頁面。
   - 點擊右上方的 **Settings**（設定）頁籤。
   - 在左側選單中，點選 **Pages**。
   - 在 **Build and deployment** 區塊下：
     - **Source** 選擇 `Deploy from a branch`。
     - **Branch** 選擇 `main` 分支，目錄選擇 `/ (root)`，然後點擊 **Save**。

3. **訪問您的網站**：
   - 點擊儲存後，GitHub Action 將會自動開始建置與發布網頁（約需 1-2 分鐘）。
   - 稍後重新整理此設定頁面，您會在最上方看到發布成功網址，格式如下：
     `https://<您的GitHub帳號>.github.io/my-cs-study-hub/`
   - 點擊該連結，即可公開分享您的期末作業個人網頁！

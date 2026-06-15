/**
 * ==========================================================================
 * My CS Study Hub - Core JavaScript Controller (script.js)
 * ==========================================================================
 * 本檔案使用純原生 JavaScript (Vanilla JS) 實作網頁的所有互動行為。
 * 包含：深/淺色主題切換、學習任務看板管理（含篩選、新增、刪除、LocalStorage 儲存）、
 * 專案卡片點擊收合、以及學習目標表單驗證與即時摘要渲染。
 * 
 * 依據專案規範，註解中會詳細說明 DOM 操作、Event Listener、LocalStorage 與 JSON 解析之原理。
 */

// 確保網頁 DOM 元素完全載入後再執行腳本，以防找不到 DOM 節點
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. 主題切換功能 (Theme Switcher)
     ========================================================================== */
  
  // 【DOM 操作】使用 document.querySelector 取得主題切換按鈕及圖示元素
  const themeToggle = document.querySelector('#theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');

  // 【LocalStorage 讀取】檢查使用者先前是否儲存過主題偏好
  // localStorage.getItem 會從瀏覽器的本地儲存區讀取對應 key 的字串資料
  const savedTheme = localStorage.getItem('theme');

  // 初始化主題設定
  if (savedTheme === 'light') {
    // 【classList 操作】若儲存的值為 'light'，為 body 節點加上 'light-theme' 樣式類別
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️'; // 切換圖示為太陽
  } else {
    // 預設為深色主題，確保樣式正確
    document.body.classList.remove('light-theme');
    themeIcon.textContent = '🌙'; // 切換圖示為月亮
  }

  // 【Event Listener】監聽主題按鈕的點擊事件
  themeToggle.addEventListener('click', () => {
    // 【classList.toggle】動態切換 body 是否含有 'light-theme' class
    // 如果有該 class 就移除，沒有就加上，並回傳 Boolean 值代表目前的狀態
    const isLight = document.body.classList.toggle('light-theme');
    
    // 依據切換後的狀態，更新按鈕文字並寫入 LocalStorage 儲存
    if (isLight) {
      themeIcon.textContent = '☀️';
      // 【LocalStorage 寫入】將主題偏好存入 'theme' 鍵中，資料會永久留存於瀏覽器
      localStorage.setItem('theme', 'light');
    } else {
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  });


  /* ==========================================================================
     2. 學習任務看板功能 (Study Task Board)
     ========================================================================== */

  // 【DOM 操作】選取任務看板所需的 input、select、按鈕及統計展示元件
  const taskInput = document.querySelector('#task-input');
  const taskCategory = document.querySelector('#task-category');
  const addTaskBtn = document.querySelector('#add-task-btn');
  const clearAllBtn = document.querySelector('#clear-all-btn');
  const taskListContainer = document.querySelector('#task-list');
  const totalCountLabel = document.querySelector('#total-count');
  const completedCountLabel = document.querySelector('#completed-count');
  const filterButtonsContainer = document.querySelector('#filter-buttons-container');

  // 【LocalStorage & JSON.parse】讀取已儲存的任務資料
  // 因為 localStorage 僅能儲存「字串」，因此存入時使用了 JSON.stringify 轉成字串，
  // 讀取時必須透過 JSON.parse() 將 JSON 格式字串轉換回 JavaScript 的「陣列/物件」結構。
  // 若 LocalStorage 中無資料，則初始化為空陣列。
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // 記錄目前選擇的篩選分類，預設為 'All' (全部顯示)
  let currentFilter = 'All';

  /**
   * 儲存任務資料到 LocalStorage
   * 【JSON.stringify】將 JavaScript 陣列轉為 JSON 字串，以符合 LocalStorage 只能存字串的限制
   */
  const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  /**
   * 核心渲染函式 (render)
   * 功能：根據目前的任務陣列與分類篩選條件，重新建立 DOM 節點並畫在畫面上。
   */
  const renderTasks = () => {
    // 1. 清空舊的列表內容，避免重複渲染
    taskListContainer.innerHTML = '';

    // 2. 依據目前選取的分類篩選任務
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'All') return true;
      return task.category === currentFilter;
    });

    // 3. 檢查任務陣列是否為空，若空則顯示提示字樣
    if (filteredTasks.length === 0) {
      // 【createElement & append】動態建立一個 placeholder 節點展示無任務狀態
      const placeholder = document.createElement('div');
      placeholder.className = 'empty-task-placeholder';
      placeholder.innerHTML = '<span>☕</span>目前沒有此分類的學習任務，快去新增一個吧！';
      taskListContainer.append(placeholder);
    } else {
      // 4. 迴圈跑每一個任務物件，動態建構 DOM 節點
      filteredTasks.forEach(task => {
        // 【createElement】建立 li 元素作為單個任務的容器
        const li = document.createElement('li');
        // 為任務容器設定 class，並依分類加入對應的樣式類別（用來控制左側顏色邊條）
        li.className = `task-item category-${task.category.toLowerCase()}`;
        
        // 若該任務已完成，則加上 'completed' class，以套用刪除線和淡化樣式
        if (task.completed) {
          li.classList.add('completed');
        }

        // 【createElement】建立複選框容器與 input[type="checkbox"]
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'task-checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        
        // 【Event Listener】監聽 Checkbox 改變狀態的 change 事件
        checkbox.addEventListener('change', () => {
          toggleTaskStatus(task.id);
        });
        
        // 將 checkbox 丟入容器
        checkboxContainer.append(checkbox);

        // 【createElement】建立分類標籤 badge
        const catBadge = document.createElement('span');
        catBadge.className = 'task-item-badge';
        catBadge.textContent = task.category;

        // 【createElement】建立任務描述文字節點
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text-content';
        textSpan.textContent = task.text;

        // 【createElement】建立刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task-btn';
        deleteBtn.innerHTML = '&times;'; // 顯示 X 符號
        deleteBtn.setAttribute('aria-label', '刪除任務');
        
        // 【Event Listener】監聽刪除按鈕點擊事件
        deleteBtn.addEventListener('click', () => {
          deleteTask(task.id);
        });

        // 【append】使用 append 將所有子節點依序組裝放入 li 容器中
        li.append(checkboxContainer, catBadge, textSpan, deleteBtn);

        // 將組裝好的任務 li 放入畫面的 ul 列表中
        taskListContainer.append(li);
      });
    }

    // 5. 更新統計數據（總任務數與已完成數，統計是基於「所有任務」而非篩選後的任務）
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    totalCountLabel.textContent = totalCount;
    completedCountLabel.textContent = completedCount;
  };

  /**
   * 新增任務的處理函式
   */
  const handleAddTask = () => {
    const text = taskInput.value.trim(); // 取得並修剪輸入字串的空白字元
    const category = taskCategory.value;

    // 簡易欄位驗證：不可為空
    if (!text) {
      alert('請先輸入學習任務描述！');
      taskInput.focus();
      return;
    }

    // 建立新任務物件模型
    const newTask = {
      id: Date.now(), // 使用當前時間戳記作為唯一辨識 ID
      text: text,
      category: category,
      completed: false // 預設新增的任務為未完成狀態
    };

    // 將新任務推入狀態陣列中
    tasks.push(newTask);
    
    // 同步到 LocalStorage 並重新渲染畫面
    saveTasksToLocalStorage();
    renderTasks();

    // 清空輸入欄位，並將焦點停留在輸入框以便繼續輸入
    taskInput.value = '';
    taskInput.focus();
  };

  /**
   * 切換任務完成狀態
   * @param {number} id - 任務的唯一 ID
   */
  const toggleTaskStatus = (id) => {
    // 找出對應 ID 的任務，並將 completed 狀態反轉
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasksToLocalStorage();
    renderTasks();
  };

  /**
   * 刪除指定任務
   * @param {number} id - 任務的唯一 ID
   */
  const deleteTask = (id) => {
    // 過濾掉該 ID 的任務
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasksToLocalStorage();
    renderTasks();
  };

  /**
   * 清除全部任務
   */
  const handleClearAllTasks = () => {
    if (tasks.length === 0) {
      alert('目前沒有任何任務可以清除！');
      return;
    }

    // 彈出確認視窗，提升使用者體驗
    const confirmClear = confirm('確定要清除所有的學習任務嗎？這將會同步清空本地儲存區的任務資料！');
    if (confirmClear) {
      tasks = []; // 清空狀態陣列
      saveTasksToLocalStorage(); // 同步清空 local storage
      renderTasks(); // 重新渲染
    }
  };

  // --- 註冊任務看板相關的 Event Listeners ---

  // 1. 監聽「新增任務」按鈕點擊
  addTaskBtn.addEventListener('click', handleAddTask);

  // 2. 監聽「Enter 鍵」按下事件 (keydown/keyup)
  // 當使用者在文字輸入框中按下鍵盤，判斷是否為 Enter 鍵，是的話就執行新增
  taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  });

  // 3. 監聽「清除全部」按鈕點擊
  clearAllBtn.addEventListener('click', handleClearAllTasks);

  // 4. 監聽「篩選按鈕」點擊
  // 【document.querySelectorAll】選取所有篩選按鈕，並跑迴圈為每個按鈕註冊事件
  const filterButtons = filterButtonsContainer.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 狀態 class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 為當前被點擊的按鈕加上 active class
      button.classList.add('active');
      
      // 取得按鈕上的 data-filter 屬性值
      currentFilter = button.getAttribute('data-filter');
      
      // 重新渲染過濾後的任務列表
      renderTasks();
    });
  });

  // 初始化首次執行：將 LocalStorage 讀出來的資料渲染至畫面上
  renderTasks();


  /* ==========================================================================
     3. 專案卡片點擊展開/收合 (Projects Detail Toggle)
     ========================================================================== */

  // 【document.querySelectorAll】取得所有專案卡片元素
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    // 監聽專案卡片 click 事件
    card.addEventListener('click', () => {
      // 【classList.toggle】切換 'expanded' class。
      // 在 CSS 中，.project-card.expanded 的 .project-card-detail 將會有高度限制放寬並套用 transition
      const isExpanded = card.classList.toggle('expanded');
      const clickHint = card.querySelector('.click-hint');
      if (clickHint) {
        clickHint.textContent = isExpanded ? '點擊收合詳細資訊 ▴' : '點擊展開詳細資訊 ▾';
      }
    });

    // 增強鍵盤無障礙操作 (Accessibility)：當卡片獲得焦點時，按 Enter 鍵也能觸發展開收合
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const isExpanded = card.classList.toggle('expanded');
        const clickHint = card.querySelector('.click-hint');
        if (clickHint) {
          clickHint.textContent = isExpanded ? '點擊收合詳細資訊 ▴' : '點擊展開詳細資訊 ▾';
        }
      }
    });
  });


  /* ==========================================================================
     4. 聯絡與學習目標表單驗證 (Goal Form & Validation)
     ========================================================================== */

  // 【DOM 操作】選取表單、輸入框、錯誤提示區以及即時摘要顯示區元件
  const goalForm = document.querySelector('#goal-form');
  const nameInput = document.querySelector('#contact-name');
  const emailInput = document.querySelector('#contact-email');
  const goalInput = document.querySelector('#contact-goal');

  const nameError = document.querySelector('#name-error');
  const emailError = document.querySelector('#email-error');
  const goalError = document.querySelector('#goal-error');

  const formPlaceholder = document.querySelector('#form-placeholder');
  const formSummaryCard = document.querySelector('#form-summary-card');
  const summaryName = document.querySelector('#summary-name');
  const summaryEmail = document.querySelector('#summary-email');
  const summaryTime = document.querySelector('#summary-time');
  const summaryGoal = document.querySelector('#summary-goal');

  // 【Event Listener】監聽表單的 submit 送出事件
  goalForm.addEventListener('submit', (event) => {
    // 【preventDefault()】阻止瀏覽器預設的表單送出刷新頁面行為，以便用 JS 處理驗證與資料展示
    event.preventDefault();

    // 重新初始化所有欄位錯誤狀態 (移除 has-error class)
    nameInput.parentElement.classList.remove('has-error');
    emailInput.parentElement.classList.remove('has-error');
    goalInput.parentElement.classList.remove('has-error');

    // 取得輸入值並去除前後空白
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const goalValue = goalInput.value.trim();

    let isFormValid = true;

    // 1. 姓名驗證：不可為空
    if (!nameValue) {
      nameInput.parentElement.classList.add('has-error');
      isFormValid = false;
    }

    // 2. Email 驗證：不可為空且符合 Regex 正規表達式格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      emailError.textContent = '電子信箱不可為空！';
      emailInput.parentElement.classList.add('has-error');
      isFormValid = false;
    } else if (!emailRegex.test(emailValue)) {
      emailError.textContent = '請輸入正確格式的電子信箱！（如 example@domain.com）';
      emailInput.parentElement.classList.add('has-error');
      isFormValid = false;
    }

    // 3. 學習目標驗證：不可為空
    if (!goalValue) {
      goalInput.parentElement.classList.add('has-error');
      isFormValid = false;
    }

    // 驗證失敗則中斷送出流程
    if (!isFormValid) {
      return;
    }

    // 驗證成功：將輸入摘要渲染在右側看板上
    summaryName.textContent = nameValue;
    summaryEmail.textContent = emailValue;
    summaryGoal.textContent = goalValue;
    
    // 動態產生提交時間
    const now = new Date();
    summaryTime.textContent = now.toLocaleString('zh-Hant', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 【classList】動態切換顯示狀態：隱藏 placeholder，顯示 summary card
    formPlaceholder.classList.add('hidden');
    formSummaryCard.classList.remove('hidden');

    // 清空表單欄位以供下一次輸入
    goalForm.reset();

    // 平滑捲動至摘要看板區，提醒使用者資料已成功更新
    formSummaryCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

});

// ========================================
// Cloudflare Worker
// ========================================
//
// ここを自分のWorker URLに変更してください。
//
// 例:
// https://my-sites-api.example.workers.dev
//

const WORKER_URL = "https://hello.nextgen-runtime-service.workers.dev";

// ========================================
// HTML要素
// ========================================

const loginScreen = document.getElementById("loginScreen");

const siteScreen = document.getElementById("siteScreen");

const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("passwordInput");

const loginMessage = document.getElementById("loginMessage");

const siteList = document.getElementById("siteList");

const siteMessage = document.getElementById("siteMessage");

const logoutButton = document.getElementById("logoutButton");

// ========================================
// ログイン
// ========================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = passwordInput.value;

  if (!password) {
    loginMessage.textContent = "パスワードを入力してください。";

    return;
  }

  loginMessage.textContent = "確認しています……";

  const button = loginForm.querySelector("button");

  button.disabled = true;

  try {
    const response = await fetch(`${WORKER_URL}/api/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        password,
      }),
    });

    const result = await response.json();

    // =========================
    // パスワード不一致
    // =========================

    if (!response.ok) {
      loginMessage.textContent = result.message || "パスワードが違います。";

      passwordInput.value = "";

      passwordInput.focus();

      return;
    }

    // =========================
    // 成功
    // =========================

    if (!result.success || !Array.isArray(result.sites)) {
      loginMessage.textContent = "サイト一覧を取得できませんでした。";

      return;
    }

    showSites(result.sites);
  } catch (error) {
    console.error(error);

    loginMessage.textContent = "サーバーに接続できませんでした。";
  } finally {
    button.disabled = false;
  }
});

// ========================================
// サイト表示
// ========================================

function showSites(sites) {
  loginScreen.classList.add("hidden");

  siteScreen.classList.remove("hidden");

  siteList.innerHTML = "";

  siteMessage.textContent = "";

  if (sites.length === 0) {
    siteMessage.textContent = "登録されているサイトがありません。";

    return;
  }

  sites.forEach((site) => {
    const card = document.createElement("a");

    card.className = "site-card";

    card.href = site.url;

    card.target = "_blank";

    card.rel = "noopener noreferrer";

    // アイコン

    const icon = document.createElement("div");

    icon.className = "site-icon";

    icon.textContent = site.icon || "🌐";

    // 名前

    const name = document.createElement("div");

    name.className = "site-name";

    name.textContent = site.name;

    // 説明

    const description = document.createElement("div");

    description.className = "site-description";

    description.textContent = site.description || "";

    // =========================
    // ステータス
    // =========================

    const status = document.createElement("div");

    status.className = "site-status";

    if (site.status === "ok") {
      status.textContent = "○";
    } else if (site.status === "ng") {
      status.textContent = "✕";
    } else {
      status.textContent = "?";
    }

    card.appendChild(icon);

    card.appendChild(name);

    card.appendChild(description);

    card.appendChild(status);

    siteList.appendChild(card);
  });
}
// ========================================
// ロック
// ========================================

logoutButton.addEventListener("click", () => {
  siteScreen.classList.add("hidden");

  loginScreen.classList.remove("hidden");

  passwordInput.value = "";

  loginMessage.textContent = "";

  siteList.innerHTML = "";

  passwordInput.focus();
});

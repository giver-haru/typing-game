const API_URL = "typing.php";

const words = [
    "server",
    "network",
    "database",
    "program",
    "browser",
    "protocol",
    "packet",
    "router",
    "firewall",
    "address",
    "domain",
    "internet",
    "computer",
    "keyboard",
    "monitor",
    "software",
    "hardware",
    "memory",
    "storage",
    "download",
    "upload",
    "password",
    "account",
    "website",
    "system"
];

let score = 0;
let currentWord = "";
let timeLeft = 30;
let timerId = null;
let isPlaying = false;
let totalKeys = 0;
let missKeys = 0;

// ゲーム開始
function startGame() {

    if (timerId !== null) {
        clearInterval(timerId);
    }

    score = 0;
    totalKeys = 0;
    missKeys = 0;
    timeLeft = 30;
    isPlaying = true;

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("result").textContent = "";
    document.getElementById("input").value = "";

    const input = document.getElementById("input");
    input.disabled = false;
    input.focus();

    document.getElementById("record").classList.add("hidden");
    document.getElementById("saveMsg").textContent = "";
    document.getElementById("historyList").innerHTML = "";

    nextWord();

    // 1秒ごとに残り時間を減らす
    timerId = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 次の単語
function nextWord() {

    const random =
        Math.floor(Math.random() * words.length);

    currentWord = words[random];

    document.getElementById("word").textContent =
        currentWord;
}

// ゲーム終了
function endGame() {

    clearInterval(timerId);
    timerId = null;
    isPlaying = false;

    const input = document.getElementById("input");
    input.disabled = true;
    input.value = "";

    document.getElementById("word").textContent = "終了！";

    // 正確率を計算
    let accuracy = 100;
    if (totalKeys > 0) {
        accuracy = Math.round(((totalKeys - missKeys) / totalKeys) * 100);
    }

    document.getElementById("result").textContent =
        "スコア: " + score + " 点 ／ 正確率: " + accuracy + "%";

    document.getElementById("record").classList.remove("hidden");
}

// 入力判定
document.getElementById("input")
.addEventListener("input", function () {

    if (!isPlaying) {
        return;
    }

    const text =
        document.getElementById("input").value;

    const pos = text.length;

    // 打った文字と正しい文字を比較
    if (pos > 0) {
        const typedChar = text[pos - 1];
        const correctChar = currentWord[pos - 1];

        totalKeys++;

        if (typedChar !== correctChar) {
            missKeys++;
        }
    }

    // 正解
    if (text === currentWord) {
        score++;
        document.getElementById("score").textContent = score;
        document.getElementById("input").value = "";
        nextWord();
    }
});

// スコアをデータベースに保存
async function saveScore() {

    const msg = document.getElementById("saveMsg");
    msg.textContent = "保存中...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "save",
                score: score
            })
        });

        const data = await response.json();

        if (data.status === "ok") {
            msg.textContent = "保存しました。";
        } else {
            msg.textContent = "保存に失敗しました: " + (data.message || "不明なエラー");
        }
    } catch (e) {
        msg.textContent = "通信エラーが発生しました。";
    }
}

// 履歴を取得して表示
async function loadHistory() {

    const list = document.getElementById("historyList");
    list.innerHTML = "<li>読み込み中...</li>";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "load"
            })
        });

        const data = await response.json();

        list.innerHTML = "";

        if (data.status === "ok" && data.history.length > 0) {
            data.history.forEach(function (row) {
                const li = document.createElement("li");
                li.textContent = row.played_at + " ： " + row.score + " 点";
                list.appendChild(li);
            });
        } else {
            list.innerHTML = "<li>まだ履歴がありません。</li>";
        }
    } catch (e) {
        list.innerHTML = "<li>通信エラーが発生しました。</li>";
    }
}
<?php
header("Content-Type: application/json; charset=utf-8");

// DB接続情報
$dsn      = "mysql:host=localhost;dbname=webdb;charset=utf8mb4";
$dbuser   = "webapp";
$dbpass   = "your_password";

// リクエストのJSONを受け取る
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if ($data === null || !isset($data["action"])) {
    echo json_encode(["status" => "error", "message" => "不正なリクエストです。"]);
    exit;
}

try {
    $pdo = new PDO($dsn, $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($data["action"] === "save") {

        // スコアが数値かチェック
        if (!isset($data["score"]) || !is_numeric($data["score"])) {
            echo json_encode(["status" => "error", "message" => "スコアが不正です。"]);
            exit;
        }

        $score = (int)$data["score"];

        // プレースホルダで挿入
        $stmt = $pdo->prepare(
            "INSERT INTO typing_history (score, played_at) VALUES (:score, NOW())"
        );
        $stmt->bindValue(":score", $score, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(["status" => "ok"]);

    } else if ($data["action"] === "load") {

        // 新しい順に最大20件取得
        $stmt = $pdo->query(
            "SELECT score, played_at FROM typing_history ORDER BY id DESC LIMIT 20"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "ok", "history" => $rows]);

    } else {
        echo json_encode(["status" => "error", "message" => "不明なactionです。"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DBエラーが発生しました。"]);
}

from flask import Flask, render_template, jsonify, request
import os
import json

app = Flask(__name__)

# Файл для зберігання статусу квестів
QUEST_STATUS_FILE = "quest_status.json"

# Ініціалізація файлу, якщо він не існує
if not os.path.exists(QUEST_STATUS_FILE):
    with open(QUEST_STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump({"room1": False, "room2": False, "room3": False, "room4": False}, f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/api/quest-status", methods=["GET", "POST"])
def quest_status():
    if request.method == "POST":
        data = request.get_json()
        with open(QUEST_STATUS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
        return jsonify({"message": "Статус квестів оновлено"}), 200

    with open(QUEST_STATUS_FILE, "r", encoding="utf-8") as f:
        return jsonify(json.load(f))

@app.route("/reset", methods=["POST"])
def reset_status():
    with open(QUEST_STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump({"room1": False, "room2": False, "room3": False, "room4": False}, f)
    return jsonify({"message": "Стан квестів скинуто"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)

from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

# Шлях до файлу зі статусами кімнат
QUEST_STATUS_FILE = "quest_status.json"

@app.route("/")
def home():
    return render_template("index.html")  # Рендерить основну HTML-сторінку

@app.route("/api/quest-status")
def quest_status():
    try:
        # Перевіряємо, чи існує файл
        if not os.path.exists(QUEST_STATUS_FILE):
            return jsonify({"error": "Файл статусів не знайдено"}), 404
        
        # Зчитуємо файл
        with open(QUEST_STATUS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        return jsonify(data)  # Повертаємо статуси у вигляді JSON
    except json.JSONDecodeError:
        return jsonify({"error": "Помилка у форматі JSON"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)  # Сервер доступний у локальній мережі

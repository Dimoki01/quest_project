from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

# Load quest and user data from JSON file
def load_data():
    with open('quest_status.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# Save updated quest and user data to JSON file
def save_data(data):
    with open('quest_status.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    data = load_data()
    quests = data['quests']
    users = data['users']
    return render_template('index.html', quests=quests, users=users)

@app.route('/admin')
def admin():
    data = load_data()
    quests = data['quests']
    users = data['users']
    return render_template('admin.html', quests=quests, users=users)

@app.route('/api/quest-status', methods=['GET'])
def get_quest_status():
    try:
        with open('quest_status.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_room', methods=['POST'])
def update_room():
    data = request.get_json()
    room = data['room']
    status = data['status']

    quest_data = load_data()
    if room in quest_data['quests']:
        quest_data['quests'][room] = status
        save_data(quest_data)

    return jsonify(quest_data)

@app.route('/update_user_points', methods=['POST'])
def update_user_points():
    data = request.get_json()
    user = data['user']
    points = data['points']

    quest_data = load_data()
    if user in quest_data['users']:
        quest_data['users'][user] += points
        # Ensure points do not go below zero
        quest_data['users'][user] = max(quest_data['users'][user], 0)
        save_data(quest_data)

    return jsonify(quest_data)

if __name__ == '__main__':
    app.run(debug=True)

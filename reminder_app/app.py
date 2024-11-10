from flask import Flask, render_template, request, jsonify
from datetime import datetime
import threading
import time

app = Flask(__name__)

# List to store reminders
reminders = []

# Background thread to check for reminders
def check_reminders():
    while True:
        current_time = datetime.now()
        for reminder in reminders:
            if reminder['time'] <= current_time and not reminder['notified']:
                reminder['notified'] = True
                print(f"Reminder: {reminder['message']} at {reminder['time']}")
        time.sleep(10)

# Main page
@app.route('/')
def index():
    return render_template('index.html', reminders=reminders)

# Route to add a new reminder
@app.route('/add_reminder', methods=['POST'])
def add_reminder():
    data = request.get_json()
    reminder_time = datetime.strptime(data['time'], '%Y-%m-%d %H:%M:%S')
    reminders.append({'time': reminder_time, 'message': data['message'], 'notified': False})
    return jsonify({'status': 'Reminder set!'})

if __name__ == '__main__':
    reminder_thread = threading.Thread(target=check_reminders)
    reminder_thread.start()
    app.run(debug=True)

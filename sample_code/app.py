from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = Flask(__name__)

# Access the API key from environment variables
api_key = os.getenv("API_KEY")

# Function to read local data
def read_local_data(file_path):
    try:
        with open(file_path, 'r') as file:
            data = file.read()
        return data
    except FileNotFoundError:
        return "Data not found."

# Function to send email
def send_email(to_address, subject, body):
    from_address = 'enter_email_address_here'
    password = 'enter_the_app_password_here'

    msg = MIMEMultipart()
    msg['From'] = from_address
    msg['To'] = to_address
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(from_address, password)
        text = msg.as_string()
        server.sendmail(from_address, to_address, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('message')
    if user_input == "1":
        response = read_local_data('entry_requirements.txt')
    elif user_input == "2":
        response = read_local_data('course_information.txt')
    elif user_input == "3":
        response = read_local_data('fees_costs.txt')
    else:
        response = "Unfortunately, I haven't been trained on your request, and at this time, I can only help you with defined capabilities."
    return jsonify({"response": response})

@app.route('/get-content', methods=['POST'])
def get_content():
    file_request = request.json.get('file')
    content = read_local_data(file_request)
    return jsonify({"content": content})

@app.route('/send-email', methods=['POST'])
def send_email_route():
    data = request.json
    email = data.get('email')
    subject = data.get('subject')
    body = data.get('body')
    if send_email(email, subject, body):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, render_template

# This module will be used to upload the API key into the project
from dotenv import load_dotenv
import os

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

if __name__ == '__main__':
    app.run(debug=True)

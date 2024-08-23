from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Get the API key from environment variables
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')


prompt = """
You are an expert in helping people improve their typing speed. Generate a random paragraph.
"""

@app.route("/get_generated_para", methods=["GET"])
def anthropic_ai_generated_text():
    try:
        # Use the correct method to generate text
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text'):
            generated_text = response.text  # Access the generated text correctly
        else:
            return jsonify({'error': 'No generated text found'}), 500
        
        return jsonify({'generated_text': generated_text})  # Return the generated text
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
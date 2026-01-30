import json
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import boto3
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

MODEL_ID = os.getenv('BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0')

SYSTEM_PROMPT = """You are an expert at creating and modifying MVT (Multivariate Testing) JSON configurations.

Your task is to convert natural language test requirements into precise, valid JSON configurations.

MVT JSON Structure Guidelines:
- Configurations typically have 4-6 levels of nesting
- Common structure includes: experiments, variants, targeting, allocation, metrics
- Always maintain valid JSON syntax
- Preserve existing structure when updating
- Use clear, descriptive keys

When generating configurations:
1. Create well-structured, nested JSON
2. Include reasonable defaults for testing parameters
3. Add comments as separate explanation field if needed
4. Ensure all brackets and quotes are properly closed

Return ONLY valid JSON without any markdown formatting or explanations outside the JSON."""

def call_claude(user_message, existing_json=None):
    """Call Claude via AWS Bedrock"""
    
    if existing_json:
        user_message = f"""Existing JSON configuration:
```json
{existing_json}
```

Update request: {user_message}

Please update the JSON configuration based on the request while preserving the existing structure."""
    
    try:
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 4096,
            "system": SYSTEM_PROMPT,
            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            "temperature": 0.3
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        generated_text = response_body['content'][0]['text']
        
        # Extract JSON from response (in case Claude adds explanation)
        generated_text = generated_text.strip()
        if '```json' in generated_text:
            generated_text = generated_text.split('```json')[1].split('```')[0].strip()
        elif '```' in generated_text:
            generated_text = generated_text.split('```')[1].split('```')[0].strip()
        
        # Validate it's proper JSON
        parsed_json = json.loads(generated_text)
        return json.dumps(parsed_json, indent=2)
        
    except Exception as e:
        raise Exception(f"Error calling Bedrock: {str(e)}")

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/generate', methods=['POST'])
def generate_config():
    """Generate new JSON configuration from natural language"""
    try:
        data = request.json
        description = data.get('description', '')
        existing_json = data.get('existingJson', '')
        
        if not description:
            return jsonify({'error': 'Description is required'}), 400
        
        result = call_claude(description, existing_json if existing_json else None)
        
        return jsonify({
            'success': True,
            'json': result
        })
        
    except json.JSONDecodeError as e:
        return jsonify({'error': f'Invalid JSON generated: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/validate', methods=['POST'])
def validate_json():
    """Validate JSON syntax"""
    try:
        data = request.json
        json_str = data.get('json', '')
        
        if not json_str:
            return jsonify({'valid': False, 'error': 'No JSON provided'})
        
        json.loads(json_str)
        return jsonify({'valid': True})
        
    except json.JSONDecodeError as e:
        return jsonify({'valid': False, 'error': str(e)})

@app.route('/api/explain', methods=['POST'])
def explain_config():
    """Explain what a JSON configuration does"""
    try:
        data = request.json
        json_str = data.get('json', '')
        
        if not json_str:
            return jsonify({'error': 'JSON is required'}), 400
        
        explanation_prompt = f"""Explain what this MVT JSON configuration does in 5 sentences. Cover the below questions in the answer :

```json
{json_str}
```

Provide a clear, concise explanation of:
1. What test is being configured
2. What variants are being tested
3. Who the test targets
4. Any other important details

Explain using language alone, do not use emojis.

"""
        
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [
                {
                    "role": "user",
                    "content": explanation_prompt
                }
            ],
            "temperature": 0.5
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        explanation = response_body['content'][0]['text']
        
        return jsonify({
            'success': True,
            'explanation': explanation
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Check for AWS credentials
    if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
        print("WARNING: AWS credentials not found in environment variables!")
        print("Please copy .env.example to .env and add your credentials.")
    
    app.run(debug=True, port=5000)

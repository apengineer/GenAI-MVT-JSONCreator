# MVT JSON Updater - Intelligent Configuration Management

A simple web application that uses AI (Claude 4.5 Sonnet via AWS Bedrock) to convert natural language A/B test requirements into precise JSON configurations.


https://github.com/user-attachments/assets/6cc96eb6-4479-4184-928b-d62a34b3dcb6


## Features

- 🤖 Natural language to JSON conversion
- 📝 Update existing JSON configurations
- ✅ JSON validation
- 💡 Configuration explanation
- 📋 Copy to clipboard
- 🎨 Clean, responsive UI

## Prerequisites

- Python 3.13+
- AWS Account with Bedrock access
- Claude 4.5 Sonnet enabled in your AWS region

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and add your AWS credentials: Note: Use IAM Roles instead of env files. This is only for demo purposes

```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=global.anthropic.claude-sonnet-4-5-20250929-v1:0
```

### 3. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Usage

1. **Describe Your Test**: Enter a natural language description of your A/B test
   - Example: "Create an A/B test for button color - 50% red, 50% blue for mobile users"

2. **Optional - Provide Existing JSON**: If you want to update an existing configuration, paste it in the second textarea

3. **Generate**: Click "Generate Configuration" to create your JSON

4. **Review**: The AI-generated JSON will appear on the right side

5. **Explain**: Click "Explain Configuration" to get a plain English explanation

6. **Copy**: Use the "Copy JSON" button to copy the configuration to your clipboard

## API Endpoints

- `POST /api/generate` - Generate or update JSON configuration
- `POST /api/validate` - Validate JSON syntax
- `POST /api/explain` - Get explanation of configuration

## Project Structure

```
mvt-json-updater/
├── app.py                 # Flask backend with Bedrock integration
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── static/
│   ├── index.html        # Frontend UI
│   ├── style.css         # Styling
│   └── app.js            # Frontend logic
└── README.md             # This file
```

## AWS Bedrock Configuration

Make sure you have:
1. AWS Bedrock enabled in your region
2. Access to  4.5 Sonnet model
3. Proper IAM permissions for `bedrock:InvokeModel`

## Troubleshooting

**AWS Credentials Error**: Make sure your `.env` file exists and contains valid credentials

**Model Not Found**: Verify that  4.5 Sonnet is available in your AWS region

**CORS Issues**: The Flask app has CORS enabled for local development


## License

MIT License - feel free to use for demos and prototypes





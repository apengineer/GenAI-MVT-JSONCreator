const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const descriptionInput = document.getElementById('description');
const existingJsonInput = document.getElementById('existingJson');
const templateFileInput = document.getElementById('templateFile');
const uploadBtn = document.getElementById('uploadBtn');
const fileNameDisplay = document.getElementById('fileName');
const generateBtn = document.getElementById('generateBtn');
const explainBtn = document.getElementById('explainBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const outputElement = document.getElementById('output');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const explanationElement = document.getElementById('explanation');
const explanationTextElement = document.getElementById('explanationText');
const validationStatusElement = document.getElementById('validationStatus');

let currentJson = '';

// Event Listeners
generateBtn.addEventListener('click', generateConfiguration);
explainBtn.addEventListener('click', explainConfiguration);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyToClipboard);
existingJsonInput.addEventListener('input', validateExistingJson);
uploadBtn.addEventListener('click', () => templateFileInput.click());
templateFileInput.addEventListener('change', handleFileUpload);

// Generate Configuration
async function generateConfiguration() {
    const description = descriptionInput.value.trim();
    const existingJson = existingJsonInput.value.trim();
    
    if (!description) {
        showError('Please describe your A/B test');
        return;
    }
    
    hideError();
    showLoading(true);
    explanationElement.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description,
                existingJson: existingJson || null
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate configuration');
        }
        
        currentJson = data.json;
        displayJson(currentJson);
        showValidation(true);
        copyBtn.disabled = false;
        explainBtn.disabled = false;
        
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Explain Configuration
async function explainConfiguration() {
    if (!currentJson) {
        showError('No configuration to explain');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/explain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                json: currentJson
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to explain configuration');
        }
        
        explanationTextElement.textContent = data.explanation;
        explanationElement.style.display = 'block';
        
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Handle File Upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    if (!file.name.endsWith('.json')) {
        showError('Please upload a JSON file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            // Validate it's proper JSON
            JSON.parse(content);
            existingJsonInput.value = content;
            fileNameDisplay.textContent = `✓ ${file.name}`;
            fileNameDisplay.style.color = '#2e7d32';
            validateExistingJson();
        } catch (error) {
            showError('Invalid JSON file: ' + error.message);
            fileNameDisplay.textContent = `✗ ${file.name} (invalid)`;
            fileNameDisplay.style.color = '#c62828';
        }
    };
    
    reader.onerror = function() {
        showError('Failed to read file');
    };
    
    reader.readAsText(file);
}

// Validate Existing JSON
async function validateExistingJson() {
    const jsonStr = existingJsonInput.value.trim();
    
    if (!jsonStr) {
        validationStatusElement.textContent = '';
        validationStatusElement.className = 'validation-status';
        return;
    }
    
    try {
        JSON.parse(jsonStr);
        validationStatusElement.textContent = '✓ Valid JSON';
        validationStatusElement.className = 'validation-status valid';
    } catch (error) {
        validationStatusElement.textContent = '✗ Invalid JSON: ' + error.message;
        validationStatusElement.className = 'validation-status invalid';
    }
}

// Display JSON
function displayJson(jsonStr) {
    try {
        const formatted = JSON.stringify(JSON.parse(jsonStr), null, 2);
        outputElement.textContent = formatted;
        outputElement.style.color = '#d4d4d4';
    } catch (error) {
        outputElement.textContent = jsonStr;
        outputElement.style.color = '#f44';
    }
}

// Copy to Clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(currentJson);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

// Clear All
function clearAll() {
    descriptionInput.value = '';
    existingJsonInput.value = '';
    templateFileInput.value = '';
    fileNameDisplay.textContent = '';
    outputElement.textContent = 'Your generated JSON will appear here...';
    outputElement.style.color = '#d4d4d4';
    explanationElement.style.display = 'none';
    validationStatusElement.textContent = '';
    validationStatusElement.className = 'validation-status';
    currentJson = '';
    copyBtn.disabled = true;
    explainBtn.disabled = true;
    hideError();
}

// Show/Hide Loading
function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
    generateBtn.disabled = show;
    explainBtn.disabled = show;
}

// Show/Hide Error
function showError(message) {
    errorElement.textContent = '⚠️ ' + message;
    errorElement.style.display = 'block';
}

function hideError() {
    errorElement.style.display = 'none';
}

// Show Validation Status
function showValidation(isValid) {
    if (isValid) {
        validationStatusElement.textContent = '✓ Valid JSON Configuration Generated';
        validationStatusElement.className = 'validation-status valid';
    } else {
        validationStatusElement.textContent = '✗ Invalid JSON';
        validationStatusElement.className = 'validation-status invalid';
    }
}

// Example configurations
const examples = [
    "Create an A/B test for button color - 50% users see red button, 50% see blue button. Target mobile users in the US. Track click-through rate.",
    "Set up a multivariate test with 3 variants: control (current design), variant A (larger font), variant B (different layout). Split traffic 40/30/30. Target all users.",
    "Create a test for pricing page - test 3 different price points ($9.99, $14.99, $19.99) with equal distribution. Track conversion rate and revenue."
];

// Add example button functionality (optional enhancement)
console.log('MVT JSON Updater loaded successfully');
console.log('Example prompts:', examples);

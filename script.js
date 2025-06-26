// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const clearInput = document.getElementById('clearInput');
const pasteInput = document.getElementById('pasteInput');
const copyOutput = document.getElementById('copyOutput');
const downloadOutput = document.getElementById('downloadOutput');
const themeToggle = document.getElementById('themeToggle');
const conversionTypeRadios = document.querySelectorAll('input[name="conversionType"]');

// Initialize
function init() {
    loadTheme();
    setupEventListeners();
}

function setupEventListeners() {
    convertBtn.addEventListener('click', handleConversion);
    swapBtn.addEventListener('click', swapInputOutput);
    clearInput.addEventListener('click', () => {
        inputText.value = '';
        inputText.focus();
    });
    pasteInput.addEventListener('click', pasteFromClipboard);
    copyOutput.addEventListener('click', copyToClipboard);
    downloadOutput.addEventListener('click', downloadOutputAsFile);
    themeToggle.addEventListener('click', toggleTheme);
}

// Conversion Functions
function handleConversion() {
    const input = inputText.value;
    if (!input.trim()) return;

    const conversionType = document.querySelector('input[name="conversionType"]:checked').value;
    
    try {
        let result;
        if (conversionType === 'jsonToText') {
            result = jsonToText(input);
        } else {
            result = jsonEncode(input);
        }
        outputText.value = result;
    } catch (error) {
        outputText.value = `Error: ${error.message}`;
    }
}

function jsonToText(input) {
    // If input is a JSON string (starts and ends with quotes)
    if (input.startsWith('"') && input.endsWith('"')) {
        try {
            // Parse to handle escaped characters
            return JSON.parse(input);
        } catch {
            // If parsing fails, just remove surrounding quotes
            return input.slice(1, -1);
        }
    }
    // If input is valid JSON object/array
    try {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, 2);
    } catch {
        // If not JSON at all, return as-is
        return input;
    }
}

function jsonEncode(input) {
    // If input is already valid JSON, return as-is
    try {
        JSON.parse(input);
        return input;
    } catch {
        // Otherwise encode as JSON string
        return JSON.stringify(input);
    }
}

// Utility Functions
function swapInputOutput() {
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;
    
    // Toggle conversion type
    const currentType = document.querySelector('input[name="conversionType"]:checked').value;
    const newType = currentType === 'jsonToText' ? 'jsonEncode' : 'jsonToText';
    document.querySelector(`input[value="${newType}"]`).checked = true;
}

async function copyToClipboard() {
    if (!outputText.value) return;
    try {
        await navigator.clipboard.writeText(outputText.value);
        alert('Copied to clipboard!');
    } catch (err) {
        alert('Failed to copy');
    }
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
    } catch (err) {
        alert('Failed to paste');
    }
}

function downloadOutputAsFile() {
    if (!outputText.value) return;
    const blob = new Blob([outputText.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversion-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Theme Functions
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
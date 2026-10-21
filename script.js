const textInput = document.getElementById('textInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');

// Undo/Redo State History Tracking Core Lists
let stateHistoryStack = [""];
let trackingHistoryIndex = 0;
let bypassHistoryPushFlag = false;

if (textInput) {
    textInput.addEventListener('input', () => {
        runLiveMetrics();
        if (!bypassHistoryPushFlag) {
            // Cut off any forward redo history track if user manually types something new
            stateHistoryStack = stateHistoryStack.slice(0, trackingHistoryIndex + 1);
            stateHistoryStack.push(textInput.value);
            trackingHistoryIndex++;
        }
    });
}

function runLiveMetrics() {
    const text = textInput.value;
    charCount.textContent = text.length;
    wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    lineCount.textContent = text === '' ? 0 : text.split('\n').length;
}

// 1 Step Backward Logic Execution
function executeUndo() {
    if (trackingHistoryIndex > 0) {
        bypassHistoryPushFlag = true;
        trackingHistoryIndex--;
        textInput.value = stateHistoryStack[trackingHistoryIndex];
        runLiveMetrics();
        bypassHistoryPushFlag = false;
    }
}

// 1 Step Forward Logic Execution
function executeRedo() {
    if (trackingHistoryIndex < stateHistoryStack.length - 1) {
        bypassHistoryPushFlag = true;
        trackingHistoryIndex++;
        textInput.value = stateHistoryStack[trackingHistoryIndex];
        runLiveMetrics();
        bypassHistoryPushFlag = false;
    }
}

// Intermediary script parsing helpers tracking step metrics
function recordExecutionState(newValueString) {
    textInput.value = newValueString;
    runLiveMetrics();
    stateHistoryStack = stateHistoryStack.slice(0, trackingHistoryIndex + 1);
    stateHistoryStack.push(newValueString);
    trackingHistoryIndex++;
}

// 1. Case Conversions Logic Engine
function runCase(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    let res = "";
    if (type === 'upper') res = txt.toUpperCase();
    else if (type === 'lower') res = txt.toLowerCase();
    else if (type === 'title') res = txt.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    else if (type === 'sentence') res = txt.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    else if (type === 'capitalize') res = txt.replace(/\b([a-z])/g, (m) => m.toUpperCase());
    else if (type === 'alternate') res = txt.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    else if (type === 'invert') res = txt.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    recordExecutionState(res);
}

// 2. Whitespace Cleaner Logic Engine
function runClean(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    let res = "";
    if (type === 'spaces') res = txt.replace(/[ \t]+/g, ' ').trim();
    else if (type === 'add_necessary') res = txt.replace(/([.,!?;:])([A-Za-z0-9])/g, '\$1 \$2');
    else if (type === 'blank') res = txt.split('\n').filter(line => line.trim() !== '').join('\n');
    else if (type === 'trim') res = txt.split('\n').map(line => line.trim()).join('\n');
    else if (type === 'html') res = txt.replace(/<\/?[^>]+(>|\$)/g, "");
    recordExecutionState(res);
}

// 3. Lines & Lists Logic Engine
function runList(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    let lines = txt.split('\n');
    let res = "";
    if (type === 'sort_az') res = lines.sort((a, b) => a.localeCompare(b)).join('\n');
    else if (type === 'sort_za') res = lines.sort((a, b) => b.localeCompare(a)).join('\n');
    else if (type === 'reverse') res = lines.reverse().join('\n');
    else if (type === 'numbers') res = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
    else if (type === 'dedupe') res = [...new Set(lines)].join('\n');
    recordExecutionState(res);
}

function generateLorem() {
    recordExecutionState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
}

function copyToClipboard() {
    if (!textInput.value) return;
    textInput.select();
    document.execCommand('copy');
    alert('Content copied to clipboard successfully!');
}

function clearText() {
    recordExecutionState("");
}

const textInput = document.getElementById('textInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');

if (textInput) {
    textInput.addEventListener('input', runLiveMetrics);
}

function runLiveMetrics() {
    const text = textInput.value;
    charCount.textContent = text.length;
    wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    lineCount.textContent = text === '' ? 0 : text.split('\n').length;
}

// Drops down panel tab context shifting engine controls
function switchContext(category) {
    document.getElementById('caseActions').classList.add('hidden-strip');
    document.getElementById('whitespaceActions').classList.add('hidden-strip');
    document.getElementById('listActions').classList.add('hidden-strip');

    if (category === 'case') {
        document.getElementById('caseActions').classList.remove('hidden-strip');
    } else if (category === 'whitespace') {
        document.getElementById('whitespaceActions').classList.remove('hidden-strip');
    } else if (category === 'lists') {
        document.getElementById('listActions').classList.remove('hidden-strip');
    }
}

// 1. In-Place Case Conversions Execution
function runCase(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    if (type === 'upper') textInput.value = txt.toUpperCase();
    else if (type === 'lower') textInput.value = txt.toLowerCase();
    else if (type === 'title') textInput.value = txt.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    else if (type === 'sentence') textInput.value = txt.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    else if (type === 'capitalize') textInput.value = txt.replace(/\b([a-z])/g, (m) => m.toUpperCase());
    else if (type === 'alternate') textInput.value = txt.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    else if (type === 'invert') textInput.value = txt.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    runLiveMetrics();
}

// 2. In-Place Whitespace Parsing Engine
function runClean(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    if (type === 'spaces') textInput.value = txt.replace(/[ \t]+/g, ' ').trim();
    else if (type === 'add_necessary') textInput.value = txt.replace(/([.,!?;:])([A-Za-z0-9])/g, '\$1 \$2');
    else if (type === 'blank') textInput.value = txt.split('\n').filter(line => line.trim() !== '').join('\n');
    else if (type === 'trim') textInput.value = txt.split('\n').map(line => line.trim()).join('\n');
    else if (type === 'html') textInput.value = txt.replace(/<\/?[^>]+(>|\$)/g, "");
    runLiveMetrics();
}

// 3. In-Place List Arrangement Sorting
function runList(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    let lines = txt.split('\n');
    if (type === 'sort_az') textInput.value = lines.sort((a, b) => a.localeCompare(b)).join('\n');
    else if (type === 'sort_za') textInput.value = lines.sort((a, b) => b.localeCompare(a)).join('\n');
    else if (type === 'reverse') textInput.value = lines.reverse().join('\n');
    else if (type === 'numbers') textInput.value = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
    else if (type === 'dedupe') textInput.value = [...new Set(lines)].join('\n');
    runLiveMetrics();
}

async function pasteFromClipboard() {
    try {
        textInput.value = await navigator.clipboard.readText();
        runLiveMetrics();
    } catch (err) {
        alert('Please grant clipboard access permissions to execute paste command layouts.');
    }
}

function copyToClipboard() {
    if (!textInput.value) return;
    textInput.select();
    document.execCommand('copy');
    alert('Content successfully copied to clipboard!');
}

function clearText() {
    textInput.value = '';
    runLiveMetrics();
}

const textInput = document.getElementById('textInput');
const textOutput = document.getElementById('textOutput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');

if (textInput) {
    textInput.addEventListener('input', () => {
        const text = textInput.value;
        charCount.textContent = text.length;
        wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        if (text === '') textOutput.value = '';
    });
}

// 1. Case Conversions Logic Engine
function runCase(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    if (type === 'upper') textOutput.value = txt.toUpperCase();
    else if (type === 'lower') textOutput.value = txt.toLowerCase();
    else if (type === 'title') textOutput.value = txt.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    else if (type === 'sentence') textOutput.value = txt.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    else if (type === 'capitalize') textOutput.value = txt.replace(/\b([a-z])/g, (m) => m.toUpperCase());
    else if (type === 'camel') textOutput.value = txt.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
    else if (type === 'pascal') textOutput.value = txt.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, '');
    else if (type === 'snake') textOutput.value = txt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

// 2. Whitespace Cleaner Logic Engine
function runClean(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;

    if (type === 'spaces') {
        textOutput.value = txt.replace(/[ \t]+/g, ' ').trim();
    } else if (type === 'add_necessary') {
        // Automatically injects spaces after punctuation marks if they are missing
        textOutput.value = txt.replace(/([.,!?;:])([A-Za-z0-9])/g, '\$1 \$2');
    } else if (type === 'blank') {
        textOutput.value = txt.split('\n').filter(line => line.trim() !== '').join('\n');
    } else if (type === 'trim') {
        textOutput.value = txt.split('\n').map(line => line.trim()).join('\n');
    } else if (type === 'unwrap') {
        textOutput.value = txt.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    } else if (type === 'html') {
        textOutput.value = txt.replace(/<\/?[^>]+(>|\$)/g, "");
    }
}

// 3. Lines & Lists Logic Engine
function runList(type) {
    let txt = textInput.value; if (!txt || txt.trim() === '') return;
    let lines = txt.split('\n');
    if (type === 'sort_az') textOutput.value = lines.sort((a, b) => a.localeCompare(b)).join('\n');
    else if (type === 'sort_za') textOutput.value = lines.sort((a, b) => b.localeCompare(a)).join('\n');
    else if (type === 'reverse') textOutput.value = lines.reverse().join('\n');
    else if (type === 'numbers') textOutput.value = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
    else if (type === 'dedupe') textOutput.value = [...new Set(lines)].join('\n');
    else if (type === 'shuffle') textOutput.value = lines.sort(() => Math.random() - 0.5).join('\n');
}

async function pasteFromClipboard() {
    try {
        textInput.value = await navigator.clipboard.readText();
        textInput.dispatchEvent(new Event('input'));
    } catch (err) {
        alert('Please allow clipboard permissions to paste text elements.');
    }
}

// Fixed copy engine target maps back explicitly to textOutput
function copyToClipboard() {
    if (!textOutput.value) return;
    textOutput.select();
    document.execCommand('copy');
    alert('Formatted content successfully copied to clipboard!');
}

function clearText() {
    textInput.value = '';
    textOutput.value = '';
    if (wordCount) wordCount.textContent = '0';
    if (charCount) charCount.textContent = '0';
}

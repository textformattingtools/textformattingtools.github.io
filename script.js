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

// 1. Case Transforms (index.html)
function runCase(type) {
    let txt = textInput.value; if (!txt.trim()) return;
    if (type === 'upper') textOutput.value = txt.toUpperCase();
    else if (type === 'lower') textOutput.value = txt.toLowerCase();
    else if (type === 'title') textOutput.value = txt.replace(/\w\(\S*/\)g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
    else if (type === 'sentence') textOutput.value = txt.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    else if (type === 'capitalize') textOutput.value = txt.replace(/\b([a-z])/g, (m) => m.toUpperCase());
    else if (type === 'camel') textOutput.value = txt.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
    else if (type === 'pascal') textOutput.value = txt.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, '');
    else if (type === 'snake') textOutput.value = txt.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    else if (type === 'kebab') textOutput.value = txt.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    else if (type === 'constant') textOutput.value = txt.toUpperCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    else if (type === 'dot') textOutput.value = txt.toLowerCase().replace(/\s+/g, '.').replace(/[^a-zA-Z0-9.]/g, '');
    else if (type === 'path') textOutput.value = txt.toLowerCase().replace(/\s+/g, '/').replace(/[^a-zA-Z0-9/]/g, '');
    else if (type === 'alternate') textOutput.value = txt.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    else if (type === 'invert') textOutput.value = txt.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
}

// 2. Whitespace Controls (whitespace.html)
function runClean(type) {
    let txt = textInput.value; if (!txt.trim()) return;
    if (type === 'spaces') textOutput.value = txt.replace(/[ \t]+/g, ' ').trim();
    else if (type === 'blank') textOutput.value = txt.split('\n').filter(line => line.trim() !== '').join('\n');
    else if (type === 'trim') textOutput.value = txt.split('\n').map(line => line.trim()).join('\n');
    else if (type === 'unwrap') textOutput.value = txt.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    else if (type === 'html') textOutput.value = txt.replace(/<\/?[^>]+(>|\$)/g, "");
    else if (type === 'accents') textOutput.value = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    else if (type === 'emojis') textOutput.value = txt.replace(/[\u1F600-\u1F64F]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
    else if (type === 'allspaces') textOutput.value = txt.replace(/\s+/g, '');
    else if (type === 'tabs') textOutput.value = txt.replace(/\t/g, '  ');
}

// 3. List Sorting Engine (lists.html)
function runList(type) {
    let txt = textInput.value; if (!txt.trim()) return;
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
        alert('Please allow clipboard permissions.');
    }
}

function copyToClipboard() {
    if (!textOutput.value) return;
    textOutput.select();
    document.execCommand('copy');
    alert('Formatted content copied to clipboard safely!');
}

function clearText() {
    textInput.value = '';
    textOutput.value = '';
    if (textInput) textInput.dispatchEvent(new Event('input'));
}

/**
 * Text Formatting Tools - Core Engine
 * Pure vanilla JavaScript with no external dependencies.
 * Complete suite for case conversion, text cleaning, sorting, word counting & state management.
 */

(function () {
  'use strict';

  // DOM Elements
  const editor = document.getElementById('editor');
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  const copyBtn = document.getElementById('btn-copy');
  const clearBtn = document.getElementById('btn-clear');
  const downloadBtn = document.getElementById('btn-download');
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('btn-upload');
  const sampleBtn = document.getElementById('btn-sample');
  const fontToggleBtn = document.getElementById('btn-font-toggle');
  const findReplaceToggleBtn = document.getElementById('btn-find-replace-toggle');
  const findReplacePanel = document.getElementById('find-replace-panel');
  const findInput = document.getElementById('find-input');
  const replaceInput = document.getElementById('replace-input');
  const replaceBtn = document.getElementById('btn-do-replace');
  const replaceAllBtn = document.getElementById('btn-do-replace-all');
  const matchCaseCheck = document.getElementById('match-case-check');
  const useRegexCheck = document.getElementById('regex-check');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const toastContainer = document.getElementById('toast-container');

  // Stats Elements
  const statWords = document.getElementById('stat-words');
  const statChars = document.getElementById('stat-chars');
  const statCharsNoSpaces = document.getElementById('stat-chars-no-spaces');
  const statLines = document.getElementById('stat-lines');
  const statSentences = document.getElementById('stat-sentences');
  const statParagraphs = document.getElementById('stat-paragraphs');
  const statReadingTime = document.getElementById('stat-reading-time');
  const statSpeakingTime = document.getElementById('stat-speaking-time');
  const freqTableBody = document.getElementById('freq-table-body');

  // State & History Stack
  const MAX_HISTORY = 50;
  let history = [];
  let historyIndex = -1;
  let typingTimer = null;

  // --------------------------------------------------------------------------
  // Dynamic Sample Text Per Page
  // --------------------------------------------------------------------------
  function getSampleTextForCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('case-converter')) {
      return `the lord of the rings: the fellowship of the ring.
THIS IS AN EXAMPLE of unformatted, mixed-case text.
it contains various sentences. how do you like converting text? i think it's fantastic!
user_first_name
account_balance_usd
total-shipping-cost`;
    } else if (path.includes('text-cleaner')) {
      return `Here is an example   with    multiple irregular   spaces.
Missing spaces,like this.And here!is another issue;right now.

<div class="note">
  <p>Here is some <b>HTML formatting</b> with &amp; entities like &quot;quotes&quot; and &copy; copyright.</p>
</div>

   Leading and trailing whitespace on this line.   

Another paragraph after multiple empty lines.`;
    } else if (path.includes('sort-lines')) {
      return `Banana
Apple
Cherry
Item 10
Item 2
Item 1
Apple
Date
Elderberry
Banana
Fig
Cherry`;
    } else if (path.includes('word-counter')) {
      return `Text formatting tools make writing, editing, and programming faster and more accurate. Whether you need to count words, analyze character limits for social media, or inspect keyword frequency density, real-time metrics help writers optimize their content for readers and search engines.

Good typography and clean formatting ensure clarity, readability, and professional communication across all digital platforms. With instant feedback, you can quickly compose and refine your writing.`;
    }

    // Default for index.html / all-in-one
    return `hello world! THIS is an EXAmple of unformatted, messy text.
It has   multiple    spaces, missing spaces after punctuation,like this.and here!

1. Apple
3. Banana
2. Cherry
1. Apple

<p>Here is some <b>HTML markup</b> with &amp; entities.</p>
user_profile_data
Order now for fast, safe delivery!`;
  }

  // --------------------------------------------------------------------------
  // History Management (Undo / Redo)
  // --------------------------------------------------------------------------
  function pushState(newText) {
    if (historyIndex >= 0 && history[historyIndex] === newText) {
      return;
    }
    history = history.slice(0, historyIndex + 1);
    history.push(newText);
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyIndex++;
    }
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      if (editor) {
        editor.value = history[historyIndex];
        triggerUpdate(false);
        showToast('Undo applied');
      }
      updateHistoryButtons();
    } else {
      showToast('Nothing to undo', 'error');
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      if (editor) {
        editor.value = history[historyIndex];
        triggerUpdate(false);
        showToast('Redo applied');
      }
      updateHistoryButtons();
    } else {
      showToast('Nothing to redo', 'error');
    }
  }

  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 2400);
  }

  // --------------------------------------------------------------------------
  // Text Case Conversion Functions
  // --------------------------------------------------------------------------

  // 1. UPPERCASE
  function toUpperCase(text) {
    return text.toUpperCase();
  }

  // 2. lowercase
  function toLowerCase(text) {
    return text.toLowerCase();
  }

  // 3. Sentence case
  function toSentenceCase(text) {
    if (!text) return '';
    const lower = text.toLowerCase();
    // Capitalize character following start of string, sentence punctuation, newlines, or list symbols
    let result = lower.replace(/(^\s*|[\.\!\?]\s+|[\r\n]+\s*|[\-\*\•]\s*)([a-z\u00E0-\u00FC])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    // Also capitalize standalone English "I" and contractions
    result = result.replace(/\b(i)\b/g, 'I');
    result = result.replace(/\b(i)('m|'ll|'ve|'d)\b/g, (m, p1, p2) => 'I' + p2);
    return result;
  }

  // 4. Capitalized Case (Word Capitalization)
  function toCapitalizedCase(text) {
    // Capitalize the first letter of words without erroneously turning "don't" into "Don'T"
    return text.toLowerCase().replace(/(?:^|\s|[\(\[\{\"\'\-\/])([a-z\u00E0-\u00FC])/g, (m, p1) => m.slice(0, -1) + p1.toUpperCase());
  }

  // 5. Title Case (AP / Chicago style)
  const MINOR_WORDS = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of',
    'on', 'or', 'per', 'the', 'to', 'vs', 'via', 'en'
  ]);

  function toTitleCase(text) {
    if (!text) return '';
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      if (!line.trim()) return line;
      const words = line.split(/(\s+)/);
      const wordIndices = [];
      words.forEach((w, idx) => {
        if (/\S/.test(w)) wordIndices.push(idx);
      });

      let prevEndsWithPunct = false;

      return words.map((word, idx) => {
        if (!/\S/.test(word)) return word;
        const cleanWord = word.replace(/^[^\w\u00E0-\u00FC]+|[^\w\u00E0-\u00FC]+$/g, '').toLowerCase();
        const isFirst = idx === wordIndices[0];
        const isLast = idx === wordIndices[wordIndices.length - 1];
        const forceCap = isFirst || isLast || prevEndsWithPunct;

        prevEndsWithPunct = /[:\-—!?]$/.test(word.trim());

        if (forceCap || !MINOR_WORDS.has(cleanWord)) {
          return word.replace(/^([^\w\u00E0-\u00FC]*)([\w\u00E0-\u00FC])(.*)$/i, (_, prefix, firstLetter, rest) => {
            return prefix + firstLetter.toUpperCase() + rest.toLowerCase();
          });
        } else {
          return word.replace(/^([^\w\u00E0-\u00FC]*)([\w\u00E0-\u00FC]+)(.*)$/i, (_, prefix, letters, rest) => {
            return prefix + letters.toLowerCase() + rest;
          });
        }
      }).join('');
    });
    return processedLines.join('\n');
  }

  // 6. aLtErNaTiNg cAsE
  function toAlternatingCase(text) {
    let makeUpper = false;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[a-zA-Z\u00C0-\u00FF]/.test(char)) {
        result += makeUpper ? char.toUpperCase() : char.toLowerCase();
        makeUpper = !makeUpper;
      } else {
        result += char;
      }
    }
    // If the transformation didn't change anything, flip the initial case
    if (result === text) {
      makeUpper = true;
      result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z\u00C0-\u00FF]/.test(char)) {
          result += makeUpper ? char.toUpperCase() : char.toLowerCase();
          makeUpper = !makeUpper;
        } else {
          result += char;
        }
      }
    }
    return result;
  }

  // 7. InVeRsE CaSe
  function toInverseCase(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === char.toUpperCase()) {
        result += char.toLowerCase();
      } else {
        result += char.toUpperCase();
      }
    }
    return result;
  }

  // Helper for line-by-line developer casings
  function transformLines(text, lineFn) {
    if (!text) return '';
    return text.split('\n').map(line => {
      if (!line.trim()) return line;
      return lineFn(line);
    }).join('\n');
  }

  // 8. camelCase
  function toCamelCase(text) {
    return transformLines(text, line => {
      const words = line
        .replace(/[^\w\s-]/g, ' ')
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean);
      if (words.length === 0) return '';
      return words.map((w, i) => {
        if (i === 0) return w.toLowerCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }).join('');
    });
  }

  // 9. PascalCase
  function toPascalCase(text) {
    return transformLines(text, line => {
      const words = line
        .replace(/[^\w\s-]/g, ' ')
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean);
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    });
  }

  // 10. snake_case
  function toSnakeCase(text) {
    return transformLines(text, line => {
      return line
        .trim()
        .replace(/[^\w\s-]/g, ' ')
        .split(/[\s_-]+/)
        .map(w => w.toLowerCase())
        .filter(Boolean)
        .join('_');
    });
  }

  // 11. kebab-case
  function toKebabCase(text) {
    return transformLines(text, line => {
      return line
        .trim()
        .replace(/[^\w\s-]/g, ' ')
        .split(/[\s_-]+/)
        .map(w => w.toLowerCase())
        .filter(Boolean)
        .join('-');
    });
  }

  // --------------------------------------------------------------------------
  // Text Cleaning Functions
  // --------------------------------------------------------------------------

  // Normalize Spaces
  function normalizeSpaces(text) {
    return text
      .split('\n')
      .map(line => line.replace(/[ \t\u00A0]+/g, ' ').trim())
      .join('\n');
  }

  // Trim Lines
  function trimLines(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }

  // Remove Blank Lines
  function removeBlankLines(text) {
    const originalLines = text.split('\n');
    const filtered = originalLines.filter(line => line.trim().length > 0);
    const removedCount = originalLines.length - filtered.length;
    return {
      result: filtered.join('\n'),
      removedCount
    };
  }

  // Add Missing Spaces After Punctuation
  function addSpacesAfterPunctuation(text) {
    // Add space after comma, semicolon, exclamation, or question mark if directly followed by a word character
    let res = text.replace(/([,;!?])([A-Za-z0-9])/g, '$1 $2');
    // Add space after colon if followed by word (except http: or https:)
    res = res.replace(/(?<!https?):([A-Za-z0-9])/g, ': $1');
    // Add space after period if followed by letters, avoiding numbers (e.g. 3.14) and common web extensions
    res = res.replace(/\.([a-zA-Z])(?!(?:com|org|net|io|edu|gov|co|ai|dev|html|css|js|txt|png|jpg|pdf)\b)/g, '. $1');
    return res;
  }

  // Strip HTML Tags & Entities
  function stripHtmlTags(text) {
    if (!text) return '';
    // Strip script and style blocks
    let clean = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    // Convert common block break tags to newlines so words don't merge
    clean = clean.replace(/<br\s*[\/]?>/gi, '\n');
    clean = clean.replace(/<\/(?:p|div|li|tr|h[1-6])>/gi, '\n');
    // Strip remaining tags
    clean = clean.replace(/<[^>]+>/g, '');
    // Decode HTML entities
    const entities = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&ndash;': '–',
      '&mdash;': '—'
    };
    for (const [key, val] of Object.entries(entities)) {
      clean = clean.split(key).join(val);
    }
    clean = clean.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
    return clean;
  }

  // Remove Line Breaks / Single Line
  function removeLineBreaks(text) {
    return text.replace(/[\r\n]+/g, ' ').replace(/[ \t\u00A0]+/g, ' ').trim();
  }

  // Remove Duplicate Lines
  function removeDuplicateLines(text, caseSensitive = true) {
    const lines = text.split('\n');
    const seen = new Set();
    const result = [];
    let dupCount = 0;

    for (const line of lines) {
      const key = caseSensitive ? line.trim() : line.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      } else {
        dupCount++;
      }
    }
    return {
      result: result.join('\n'),
      dupCount
    };
  }

  // --------------------------------------------------------------------------
  // List & Line Tools
  // --------------------------------------------------------------------------

  // Sort A-Z
  function sortAZ(text) {
    const lines = text.split('\n');
    return lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('\n');
  }

  // Sort Z-A
  function sortZA(text) {
    const lines = text.split('\n');
    return lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })).join('\n');
  }

  // Natural Sort (1, 2, 10)
  function naturalSort(text) {
    const lines = text.split('\n');
    return lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })).join('\n');
  }

  // Reverse Lines
  function reverseLines(text) {
    return text.split('\n').reverse().join('\n');
  }

  // Number Lines
  function numberLines(text) {
    const lines = text.split('\n');
    let counter = 1;
    return lines.map(line => {
      if (line.trim().length === 0) return line;
      return `${counter++}. ${line}`;
    }).join('\n');
  }

  // Remove Line Numbers & Bullets
  function removeLineNumbers(text) {
    return text
      .split('\n')
      .map(line => line.replace(/^\s*(?:\d+[\.\)\-:]|\[\d+\]|\*|\-|\•)\s*/, ''))
      .join('\n');
  }

  // Shuffle Lines (Fisher-Yates)
  function shuffleLines(text) {
    const lines = text.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    return lines.join('\n');
  }

  // Sort By Line Length
  function sortByLineLength(text, ascending = true) {
    const lines = text.split('\n');
    return lines.sort((a, b) => ascending ? a.length - b.length : b.length - a.length).join('\n');
  }

  // --------------------------------------------------------------------------
  // Extra Utilities
  // --------------------------------------------------------------------------

  // Reverse Text (Unicode & Emoji safe)
  function reverseText(text) {
    return Array.from(text).reverse().join('');
  }

  // URL Encode
  function urlEncode(text) {
    return encodeURIComponent(text);
  }

  // URL Decode
  function urlDecode(text) {
    try {
      return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch (e) {
      showToast('Invalid URL encoding', 'error');
      return text;
    }
  }

  // Base64 Encode
  function base64Encode(text) {
    try {
      const bytes = new TextEncoder().encode(text);
      const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
      return btoa(binString);
    } catch (e) {
      showToast('Base64 encoding failed', 'error');
      return text;
    }
  }

  // Base64 Decode
  function base64Decode(text) {
    try {
      const cleanInput = text.trim().replace(/\s+/g, '');
      const binString = atob(cleanInput);
      const bytes = Uint8Array.from(binString, m => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (e) {
      showToast('Invalid Base64 string', 'error');
      return text;
    }
  }

  // --------------------------------------------------------------------------
  // Statistics Counter
  // --------------------------------------------------------------------------
  function calculateStats(text) {
    if (!text) {
      return {
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        lines: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: '0s',
        speakingTime: '0s',
        topWords: []
      };
    }

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split(/\r\n|\r|\n/).length;

    // Words
    const wordMatches = text.trim().match(/[\w\u00C0-\u00FF'-]+/g) || [];
    const words = wordMatches.length;

    // Sentences
    const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
    const sentences = sentenceMatches.length || (words > 0 ? 1 : 0);

    // Paragraphs
    const paragraphBlocks = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphs = paragraphBlocks.length || (words > 0 ? 1 : 0);

    // Reading & Speaking Time
    const readMinutes = words / 200;
    const readingTime = readMinutes < 1 ? `${Math.max(1, Math.round(readMinutes * 60))}s` : `${Math.round(readMinutes)}m`;

    const speakMinutes = words / 130;
    const speakingTime = speakMinutes < 1 ? `${Math.max(1, Math.round(speakMinutes * 60))}s` : `${Math.round(speakMinutes)}m`;

    // Keyword Frequency Table
    const freqMap = {};
    for (const w of wordMatches) {
      const clean = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
      if (clean.length > 0) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    }
    const topWords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({
        word,
        count,
        percent: words > 0 ? ((count / words) * 100).toFixed(1) + '%' : '0%'
      }));

    return {
      words,
      chars,
      charsNoSpaces,
      lines,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      topWords
    };
  }

  function updateStatsUI() {
    if (!editor) return;
    const stats = calculateStats(editor.value);

    if (statWords) statWords.textContent = stats.words.toLocaleString();
    if (statChars) statChars.textContent = stats.chars.toLocaleString();
    if (statCharsNoSpaces) statCharsNoSpaces.textContent = stats.charsNoSpaces.toLocaleString();
    if (statLines) statLines.textContent = stats.lines.toLocaleString();
    if (statSentences) statSentences.textContent = stats.sentences.toLocaleString();
    if (statParagraphs) statParagraphs.textContent = stats.paragraphs.toLocaleString();
    if (statReadingTime) statReadingTime.textContent = stats.readingTime;
    if (statSpeakingTime) statSpeakingTime.textContent = stats.speakingTime;

    if (freqTableBody) {
      freqTableBody.innerHTML = '';
      if (stats.topWords.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align:center; color:#9ca3af; padding: 1.25rem;">No keywords yet. Type or paste text above.</td>`;
        freqTableBody.appendChild(row);
      } else {
        stats.topWords.forEach(({ word, count, percent }) => {
          const row = document.createElement('tr');
          row.innerHTML = `<td><strong>${escapeHtml(word)}</strong></td><td>${count}</td><td>${percent}</td>`;
          freqTableBody.appendChild(row);
        });
      }
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function triggerUpdate(saveToHistory = true) {
    if (!editor) return;
    updateStatsUI();
    if (saveToHistory) {
      pushState(editor.value);
    }
  }

  // --------------------------------------------------------------------------
  // Apply Transformation Helper
  // --------------------------------------------------------------------------
  function applyTransform(fn, actionName) {
    if (!editor) return;
    const currentText = editor.value;
    if (!currentText) {
      showToast('Text area is empty! Enter or paste text first.', 'error');
      return;
    }

    const newText = fn(currentText);
    if (newText === currentText) {
      showToast(`Text is already in ${actionName}`, 'info');
      return;
    }

    editor.value = newText;
    triggerUpdate(true);
    showToast(`Applied ${actionName}`, 'success');
  }

  // --------------------------------------------------------------------------
  // Robust Clipboard Copy (Iframe & Standard Support)
  // --------------------------------------------------------------------------
  async function copyTextToClipboard() {
    if (!editor) return;
    const text = editor.value;
    if (!text) {
      showToast('Text area is empty! Nothing to copy.', 'error');
      return;
    }

    let copied = false;

    // Method 1: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        // Fallback below
      }
    }

    // Method 2: document.execCommand fallback (vital for sandboxed iframes)
    if (!copied) {
      try {
        editor.focus();
        editor.select();
        editor.setSelectionRange(0, 999999);
        copied = document.execCommand('copy');
      } catch (err) {
        // failed
      }
    }

    if (copied) {
      if (copyBtn) {
        const origHtml = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `✓ Copied!`;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = origHtml;
        }, 2000);
      }
      showToast(`✓ Copied ${text.length.toLocaleString()} characters to clipboard`, 'success');
    } else {
      showToast('Copy blocked by browser permissions. Please press Ctrl+C / Cmd+C', 'info');
    }
  }

  // --------------------------------------------------------------------------
  // Initialization & Event Binding
  // --------------------------------------------------------------------------
  function init() {
    if (!editor) return;

    pushState(editor.value);
    updateStatsUI();

    // Editor input listener
    editor.addEventListener('input', () => {
      updateStatsUI();
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        pushState(editor.value);
      }, 700);
    });

    // Keyboard shortcuts (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    });

    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (redoBtn) redoBtn.addEventListener('click', redo);
    if (copyBtn) copyBtn.addEventListener('click', copyTextToClipboard);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!editor.value) {
          showToast('Text area is already empty.', 'info');
          return;
        }
        editor.value = '';
        triggerUpdate(true);
        showToast('Text cleared');
        editor.focus();
      });
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        editor.value = getSampleTextForCurrentPage();
        triggerUpdate(true);
        showToast('Loaded sample text', 'success');
      });
    }

    if (fontToggleBtn) {
      fontToggleBtn.addEventListener('click', () => {
        editor.classList.toggle('is-mono');
        const isMono = editor.classList.contains('is-mono');
        fontToggleBtn.textContent = isMono ? 'Font: Monospace' : 'Font: Sans';
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const text = editor.value;
        if (!text) {
          showToast('Text area is empty! Nothing to download.', 'error');
          return;
        }
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded formatted-text.txt', 'success');
      });
    }

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          editor.value = event.target.result;
          triggerUpdate(true);
          showToast(`Loaded ${file.name}`, 'success');
          fileInput.value = '';
        };
        reader.onerror = () => {
          showToast('Failed to read file', 'error');
          fileInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    if (findReplaceToggleBtn && findReplacePanel) {
      findReplaceToggleBtn.addEventListener('click', () => {
        findReplacePanel.classList.toggle('is-open');
        if (findReplacePanel.classList.contains('is-open') && findInput) {
          findInput.focus();
        }
      });
    }

    function handleFindReplace(replaceAll = false) {
      if (!findInput || !editor) return;
      const findVal = findInput.value;
      const replaceVal = replaceInput ? replaceInput.value : '';
      if (!findVal) {
        showToast('Please enter text to search', 'error');
        return;
      }

      const matchCase = matchCaseCheck && matchCaseCheck.checked;
      const isRegex = useRegexCheck && useRegexCheck.checked;
      const current = editor.value;

      try {
        let pattern;
        if (isRegex) {
          const flags = (replaceAll ? 'g' : '') + (matchCase ? '' : 'i');
          pattern = new RegExp(findVal, flags);
        } else {
          const escaped = findVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const flags = (replaceAll ? 'g' : '') + (matchCase ? '' : 'i');
          pattern = new RegExp(escaped, flags);
        }

        // Count occurrences safely without modifying regex lastIndex
        const countFlags = 'g' + (matchCase ? '' : 'i');
        const countRegex = new RegExp(isRegex ? findVal : findVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), countFlags);
        const matches = current.match(countRegex);

        if (!matches || matches.length === 0) {
          showToast(`No matches found for "${findVal}"`, 'error');
          return;
        }

        const updated = current.replace(pattern, replaceVal);
        editor.value = updated;
        triggerUpdate(true);
        showToast(replaceAll ? `Replaced ${matches.length} occurrences` : 'Replaced 1 occurrence', 'success');
      } catch (err) {
        showToast(`Search error: ${err.message}`, 'error');
      }
    }

    if (replaceBtn) replaceBtn.addEventListener('click', () => handleFindReplace(false));
    if (replaceAllBtn) replaceAllBtn.addEventListener('click', () => handleFindReplace(true));

    if (mobileNavToggle && navLinks) {
      mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }

    // Tool Buttons Action Dispatcher
    const toolButtons = document.querySelectorAll('[data-action]');
    toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        switch (action) {
          case 'uppercase':
            applyTransform(toUpperCase, 'UPPERCASE');
            break;
          case 'lowercase':
            applyTransform(toLowerCase, 'lowercase');
            break;
          case 'sentence-case':
            applyTransform(toSentenceCase, 'Sentence case');
            break;
          case 'title-case':
            applyTransform(toTitleCase, 'Title Case');
            break;
          case 'capitalized-case':
            applyTransform(toCapitalizedCase, 'Capitalized Case');
            break;
          case 'alternating-case':
            applyTransform(toAlternatingCase, 'aLtErNaTiNg cAsE');
            break;
          case 'inverse-case':
            applyTransform(toInverseCase, 'InVeRsE CaSe');
            break;
          case 'camel-case':
            applyTransform(toCamelCase, 'camelCase');
            break;
          case 'pascal-case':
            applyTransform(toPascalCase, 'PascalCase');
            break;
          case 'snake-case':
            applyTransform(toSnakeCase, 'snake_case');
            break;
          case 'kebab-case':
            applyTransform(toKebabCase, 'kebab-case');
            break;

          case 'normalize-spaces':
            applyTransform(normalizeSpaces, 'Normalized Spaces');
            break;
          case 'trim-lines':
            applyTransform(trimLines, 'Trimmed Lines');
            break;
          case 'remove-blank-lines':
            if (!editor.value) {
              showToast('Text area is empty! Enter or paste text first.', 'error');
              return;
            }
            {
              const { result, removedCount } = removeBlankLines(editor.value);
              if (removedCount === 0) {
                showToast('No blank lines found', 'info');
              } else {
                editor.value = result;
                triggerUpdate(true);
                showToast(`Removed ${removedCount} blank line${removedCount > 1 ? 's' : ''}`, 'success');
              }
            }
            break;
          case 'add-punct-spaces':
            applyTransform(addSpacesAfterPunctuation, 'Added Punctuation Spaces');
            break;
          case 'strip-html':
            applyTransform(stripHtmlTags, 'Stripped HTML Tags');
            break;
          case 'single-line':
            applyTransform(removeLineBreaks, 'Single Line');
            break;
          case 'remove-duplicate-lines':
            if (!editor.value) {
              showToast('Text area is empty! Enter or paste text first.', 'error');
              return;
            }
            {
              const { result, dupCount } = removeDuplicateLines(editor.value);
              if (dupCount === 0) {
                showToast('No duplicate lines found', 'info');
              } else {
                editor.value = result;
                triggerUpdate(true);
                showToast(`Removed ${dupCount} duplicate line${dupCount > 1 ? 's' : ''}`, 'success');
              }
            }
            break;
          case 'clean-all':
            applyTransform(t => {
              let res = stripHtmlTags(t);
              res = addSpacesAfterPunctuation(res);
              res = normalizeSpaces(res);
              res = trimLines(res);
              res = removeBlankLines(res).result;
              return res;
            }, 'Full Clean');
            break;

          case 'sort-az':
            applyTransform(sortAZ, 'Sorted A-Z');
            break;
          case 'sort-za':
            applyTransform(sortZA, 'Sorted Z-A');
            break;
          case 'natural-sort':
            applyTransform(naturalSort, 'Natural Sort');
            break;
          case 'reverse-lines':
            applyTransform(reverseLines, 'Reversed Lines');
            break;
          case 'number-lines':
            applyTransform(numberLines, 'Numbered Lines');
            break;
          case 'remove-line-numbers':
            applyTransform(removeLineNumbers, 'Removed Line Numbers');
            break;
          case 'shuffle-lines':
            applyTransform(shuffleLines, 'Shuffled Lines');
            break;
          case 'sort-length-asc':
            applyTransform(t => sortByLineLength(t, true), 'Sorted by Length (Shortest first)');
            break;
          case 'sort-length-desc':
            applyTransform(t => sortByLineLength(t, false), 'Sorted by Length (Longest first)');
            break;

          case 'reverse-text':
            applyTransform(reverseText, 'Reversed Text');
            break;
          case 'url-encode':
            applyTransform(urlEncode, 'URL Encoded');
            break;
          case 'url-decode':
            applyTransform(urlDecode, 'URL Decoded');
            break;
          case 'base64-encode':
            applyTransform(base64Encode, 'Base64 Encoded');
            break;
          case 'base64-decode':
            applyTransform(base64Decode, 'Base64 Decoded');
            break;

          default:
            console.warn('Unknown action:', action);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

# Text Formatting Tools

A clean, responsive, fast, and 100% private online text formatting website inspired by the minimal white aesthetic and navigation of ConvertCase.net.

Built using **pure standard HTML, CSS, and vanilla JavaScript** without requiring Node.js, build pipelines, servers, databases, or API keys.

---

## 🚀 Key Features

- **Text Case Converter**: UPPERCASE, lowercase, Sentence case, Title Case (AP/Chicago style), Capitalized Case, alternating case, inverse case, camelCase, PascalCase, snake_case, and kebab-case.
- **Text Cleaner**: Normalize irregular spaces, trim line ends, remove blank lines, add missing spaces after punctuation, strip HTML tags with entity decoding, and join lines into single paragraphs.
- **List & Line Tools**: Sort A–Z, sort Z–A, natural numeric sort (handles numbers like 1, 2, 10 properly), reverse lines, line numbering (1., 2., 3.), remove line numbers/bullets, randomize lines (Fisher-Yates shuffle), and deduplicate lines.
- **Real-Time Word & Text Counter**: Live counts of words, characters (with and without spaces), lines, sentences, paragraphs, estimated silent reading time, speaking pace, and keyword density.
- **Full History & Utilities**: Working Undo (`Ctrl+Z`), Redo (`Ctrl+Y`), interactive Find & Replace (with Regex and case sensitivity options), Copy to Clipboard with toast feedback, file upload, download as `.txt`, and font toggle (Sans / Monospace).
- **100% Client-Side Privacy**: Text never leaves your browser. Zero tracking, zero telemetry, and zero ads.

---

## 📁 Repository Structure

All pages and static assets reside directly in the root directory for instant static hosting:

```text
├── index.html            # All-in-one text formatting suite
├── case-converter.html   # Dedicated case converter & style guide
├── text-cleaner.html     # Dedicated whitespace sanitizer & HTML stripper
├── sort-lines.html       # Dedicated list sorter, reverse & deduplicator
├── word-counter.html     # Dedicated text metrics & keyword frequency analyzer
├── style.css             # Clean, minimal white stylesheet with responsive design
├── app.js                # Core vanilla JavaScript engine (zero dependencies)
└── README.md             # Documentation and GitHub Pages deployment guide
```

---

## 🌐 How to Publish to GitHub Pages

Because Text Formatting Tools uses standard HTML, CSS, and vanilla JavaScript with relative paths, it can be deployed to GitHub Pages in seconds without any build tools.

### Step-by-Step Instructions:

1. **Create or push to a GitHub Repository**:
   - Create a new public or private repository on [GitHub](https://github.com) (e.g., `text-formatting-tools`).
   - Push all the repository files (`index.html`, `case-converter.html`, `text-cleaner.html`, `sort-lines.html`, `word-counter.html`, `style.css`, `app.js`) to the default branch (usually `main`).

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click the **Settings** tab near the top right.
   - In the left sidebar, click **Pages** (under the "Code and automation" section).
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch`.
     - **Branch**: Select `main` (or `master`).
     - **Folder**: Select `/ (root)`.
   - Click the **Save** button.

3. **Visit Your Live Website**:
   - Wait 30–60 seconds while GitHub Pages deploys the site.
   - Refresh the GitHub Pages settings page. You will see a banner at the top:
     > *"Your site is live at `https://<your-username>.github.io/<repository-name>/`"*
   - Click the URL to open your live text formatting site!

---

## 💻 Local Testing

You can run this project locally using any static web server:

- **Using Python**:
  ```bash
  python -m http.server 3000
  ```
- **Using Node / NPX**:
  ```bash
  npx serve .
  ```
- **Or simply open `index.html` directly in any web browser** (Chrome, Firefox, Safari, Edge).

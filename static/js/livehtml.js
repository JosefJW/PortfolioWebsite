// Initialize CodeMirror for multi-language support (HTML, CSS, JS)
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
  mode: 'htmlmixed', // Set mode for HTML, CSS, JavaScript
  theme: 'dracula',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
});

// Function to update the live preview
function updatePreview() {
  const code = editor.getValue();  // Get the code from CodeMirror editor
  const sanitizedCode = DOMPurify.sanitize(code);

  const previewFrame = document.getElementById('preview-frame');

  // Clear previous preview content
  const previewDoc = previewFrame.contentWindow.document;
  previewDoc.open();
  previewDoc.close();

  try {
      // Inject HTML, CSS, and JavaScript into the iframe for live preview
      previewDoc.open();
      previewDoc.write(sanitizedCode);  // Write HTML, CSS, and JS into the iframe
      previewDoc.close();
  } catch (e) {
      // Show error if any
      previewDoc.body.innerHTML = `Error: ${e.message}`;
  }
}

// Update preview on every input change in the editor
editor.on('change', updatePreview);
updatePreview();

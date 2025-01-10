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
  const sanitizedCode = DOMPurify.sanitize(code);  // Sanitize the code

  const previewFrame = document.getElementById('preview-frame');
  const previewDoc = previewFrame.contentWindow.document;

  // Reset the iframe content
  previewDoc.open();
  previewDoc.write("");  // Clear any previous content (blank)
  previewDoc.close();    // Ensure the document is fully closed

  try {
    // Inject the sanitized HTML into the iframe
    previewDoc.open();
    previewDoc.write(sanitizedCode);  // Write sanitized HTML into the iframe
    previewDoc.close();              // Close the document to apply changes
  } catch (e) {
    // If there's an error, show it inside the iframe
    previewDoc.body.innerHTML = `Error: ${e.message}`;
  }
}

// Update preview on every input change in the editor
editor.on('change', updatePreview);
updatePreview();  // Initial update on load


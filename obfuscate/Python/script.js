// script.js
(function() {
  const input       = document.getElementById('inputCode');
  const obfBtn      = document.getElementById('obfBtn');
  const output      = document.getElementById('outputCode');
  const copyBtn     = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const loader      = document.getElementById('loader');
  const levelCount  = document.getElementById('levelCount');
  const levelValue  = document.getElementById('levelValue');
  const themeToggle = document.getElementById('themeToggle');

  // Sync slider label
  levelCount.addEventListener('input', () => {
    levelValue.textContent = levelCount.value;
  });

  // Light / dark toggle
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
  });

  obfBtn.addEventListener('click', () => {
    const code = input.value.trim();
    if (!code) return alert('Please paste Python code before obfuscating.');

    loader.classList.remove('hidden');
    setTimeout(() => {
      // Convert each character to its Unicode code point
      const codes = Array.from(code).map(ch => ch.charCodeAt(0));

      // Generate junk assignments
      let junk = '';
      for (let i = 1; i <= parseInt(levelCount.value); i++) {
        const a = Math.floor(Math.random() * 9000) + 1000;
        const b = Math.floor(Math.random() * 9000) + 1000;
        junk += `j${i} = ${a} + ${b}\n`;
        junk += `j${i} = ${a}\n`;
      }

      // Build final script
      const parts = [
        `o = [${codes.join(',')} ]`,
        junk,
        `s = ''.join(chr(c) for c in o)`,
        `exec(s)`
      ];

      const watermark = '# v1.0 Beta – https://sites.google.com/view/azurflowware/python-obfuscator';
      const final = [watermark, ...parts].join('\n\n');

      output.textContent = final;
      loader.classList.add('hidden');
      copyBtn.disabled = downloadBtn.disabled = false;

      // Copy to clipboard
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(final);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
      };

      // Download as file
      downloadBtn.onclick = () => {
        const blob = new Blob([final], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }, 300);
  });

  // Load FontAwesome icons
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  });
})();
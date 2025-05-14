(function(){
  const input       = document.getElementById('inputCode');
  const obfBtn      = document.getElementById('obfBtn');
  const output      = document.getElementById('outputCode');
  const copyBtn     = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const loader      = document.getElementById('loader');
  const levelCount  = document.getElementById('levelCount');
  const levelValue  = document.getElementById('levelValue');
  const themeToggle = document.getElementById('themeToggle');

  // Update slider label
  levelCount.addEventListener('input', () => {
    levelValue.textContent = levelCount.value;
  });

  // Toggle light/dark
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.textContent = isLight ? 'Light Mode' : 'Dark Mode';
  });

  obfBtn.addEventListener('click', () => {
    const html = input.value.trim();
    if (!html) return alert('Please paste HTML code before obfuscating.');

    loader.classList.remove('hidden');
    setTimeout(() => {
      // encode chars
      const codes = Array.from(html).map(c => c.charCodeAt(0));
      // junk (now "level") code
      let junk = '';
      for (let i = 0; i < parseInt(levelCount.value); i++) {
        const a = Math.floor(Math.random() * 9000) + 1000;
        const b = Math.floor(Math.random() * 9000) + 1000;
        junk += `var j${i}=${a}+${b}; j${i}=${a}; `;
      }

      const core = [
        `var o=[${codes.join(',')}];`,
        junk,
        `var s=''; for(let i=0; i<o.length; i++){ s+=String.fromCharCode(o[i]); }`,
        'document.write(s);'
      ];

      // watermark on first line
      const watermarkTag = '<!-- V1.5 Beta https://sites.google.com/view/azurflowware/html-obfuscator-new -->';
      const final = `${watermarkTag}
<script>(function(){${core.join(' ')}})();<\/script>`;

      output.textContent = final;
      loader.classList.add('hidden');
      copyBtn.disabled = downloadBtn.disabled = false;

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(final);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
      };
      downloadBtn.onclick = () => {
        const blob = new Blob([final], { type: 'text/html' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = 'obfuscated.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };
    }, 500);
  });

  // load Font Awesome
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  });
})();

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

  levelCount.addEventListener('input', () => {
    levelValue.textContent = levelCount.value;
  });

  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.textContent = isLight ? 'Light Mode' : 'Dark Mode';
  });

  obfBtn.addEventListener('click', () => {
    const lua = input.value.trim();
    if (!lua) return alert('Please paste Lua code before obfuscating.');

    loader.classList.remove('hidden');
    setTimeout(() => {
      const codes = Array.from(lua).map(c => c.charCodeAt(0));

      let junk = '';
      for (let i = 1; i <= parseInt(levelCount.value); i++) {
        const a = Math.floor(Math.random() * 9000) + 1000;
        const b = Math.floor(Math.random() * 9000) + 1000;
        junk += `local j${i} = ${a} + ${b}; j${i} = ${a}; `;
      }

      const parts = [
        `local o = {${codes.join(',')}};`,
        junk,
        [
          `local s = ""`,
          `for i = 1, #o do`,
          `  s = s .. string.char(o[i])`,
          `end`,
          `load(s)()`
        ].join('\n')
      ];

      const watermarkTag = '-- v1.3 Beta https://sites.google.com/view/azurflowware/lua-obfuscator';
      const final = `${watermarkTag}
${parts.join('\n')}`;

      output.textContent = final;
      loader.classList.add('hidden');
      copyBtn.disabled = downloadBtn.disabled = false;

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(final);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
      };
      downloadBtn.onclick = () => {
        const blob = new Blob([final], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = 'obfuscated.lua';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };
    }, 500);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  });
})();

function obfuscate() {
  const lua = document.getElementById('inputCode').value;
  if (!lua) { 
    alert('Por favor, insira o código Lua primeiro.'); 
    return; 
  }

  // Convert each character to its numeric code
  const codes = Array.from(lua).map(ch => ch.charCodeAt(0));
  
  // Watermark and header
  const watermark = '--[[ v1.0.0 https://sites.google.com/view/azurflowware/lua-obfuscator-beta ]]';
  
  // Generate Lua table and builder using variable 'o'
  const tableLua = `local o={${codes.join(',')}}`;
  
  // Insert junk operations to thwart automated deobfuscators
  const junk = [];
  for (let i = 0; i < 20; i++) {
    const a = Math.floor(Math.random() * 10000);
    const b = Math.floor(Math.random() * 10000);
    junk.push(`local j${i}=${a}+${b}; j${i}=j${i}-${b};`);
  }
  const junkCode = junk.join(' ');
  
  const build = "local s=''; for i,v in ipairs(o) do s = s .. string.char(v) end";
  const exec = 'loadstring(s)()';
  
  // Combine everything
  const obf = `${watermark}\n${tableLua}\n${junkCode}\n${build}\n${exec}`;
  
  // Display
  const output = document.getElementById('outputCode');
  output.textContent = obf;
  
  // Enable buttons
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  
  copyBtn.disabled = false;
  downloadBtn.disabled = false;
  
  // Attach actions
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(obf)
      .then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  downloadBtn.onclick = () => {
    const blob = new Blob([obf], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

// Adicionando Font Awesome para ícones
document.addEventListener('DOMContentLoaded', function() {
  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(fa);
  
  // Atualizando textos dos botões para incluir ícones
  document.getElementById('copyBtn').innerHTML = '<i class="far fa-copy"></i> Copiar';
  document.getElementById('downloadBtn').innerHTML = '<i class="fas fa-download"></i> Download';
});
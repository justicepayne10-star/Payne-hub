// app.js - moved from inline script; improves UX & accessibility
(function(){
  const loader = document.getElementById('loader');
  const gateway = document.getElementById('gateway');
  const adminInput = document.getElementById('adminCode');
  const enterBtn = document.getElementById('enterBtn');
  const guestBtn = document.getElementById('guestBtn');
  const status = document.getElementById('status');
  const appContainer = document.getElementById('appContainer');

  // Show loader then gateway
  window.addEventListener('load', () => {
    setTimeout(() => {
      if(loader){ loader.classList.add('hidden'); loader.setAttribute('aria-hidden','true'); }
      openGateway();
    }, 600);
  });

  function openGateway(){
    if(!gateway) return;
    gateway.setAttribute('aria-hidden','false');
    gateway.style.display = 'flex';
    // focus first input for keyboard users
    setTimeout(() => adminInput && adminInput.focus(), 50);
  }

  function closeGateway(){
    if(!gateway) return;
    gateway.setAttribute('aria-hidden','true');
    gateway.style.display = 'none';
    // return focus to main app container
    setTimeout(() => appContainer && appContainer.focus && appContainer.focus(), 50);
  }

  // Replace alert with aria-live updates
  function showMessage(msg){
    if(status){ status.textContent = msg; }
  }

  // Demo-friendly auth function
  async function checkAdmin(){
    const code = adminInput ? adminInput.value.trim() : '';
    if(!code){ showMessage('Please enter a code or continue as guest.'); adminInput && adminInput.focus(); return; }

    // Try to call a server endpoint. If absent, fallback to demo behavior.
    try{
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if(res.ok){
        const json = await res.json();
        if(json && json.role === 'admin'){
          showMessage('Welcome, Admin.');
        } else {
          showMessage('Proceeding as Guest.');
        }
      } else {
        // non-2xx response
        showMessage('Server rejected credentials — proceeding as Guest.');
      }
    } catch(err){
      // network error or no backend available
      // IMPORTANT: never treat client-side code as secure for real credentials.
      // This fallback is only for demo and local testing.
      if(code === '12345'){
        showMessage('Demo: Welcome, Admin.');
      } else {
        showMessage('Demo: Proceeding as Guest.');
      }
    } finally{
      closeGateway();
    }
  }

  // Wire buttons
  enterBtn && enterBtn.addEventListener('click', checkAdmin);
  guestBtn && guestBtn.addEventListener('click', () => { showMessage('Proceeding as Guest.'); closeGateway(); });

  // Allow Enter key on input to submit
  adminInput && adminInput.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ checkAdmin(); } });

})();

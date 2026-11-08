(function(){
  'use strict';
  const ACCESS_CODE = '030409';
  const body = document.body;
  const form = document.getElementById('yos-gate-form');
  const input = document.getElementById('yos-gate-code');
  const status = document.getElementById('yos-gate-status');
  const gate = document.getElementById('yos-access-gate');
  if (!form || !gate) return;
  function unlock(){ body.classList.remove('yos-locked'); gate.hidden = true; try { sessionStorage.setItem('yos-site-unlocked','1'); } catch(_) {} }
  try { if (sessionStorage.getItem('yos-site-unlocked') === '1') unlock(); } catch(_) {}
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if ((input.value || '').trim() === ACCESS_CODE) { status.textContent = 'Welcome in.'; unlock(); }
    else { status.textContent = 'That code does not match. Try again.'; input.value=''; input.focus(); }
  });
})();

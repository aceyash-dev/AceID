(() => {
  const KEY = "aceid.cookie-notice.v1";
  try { if (localStorage.getItem(KEY) === "accepted") return; } catch {}

  const style = document.createElement("style");
  style.textContent = `
    .ace-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9000;width:min(760px,calc(100% - 32px));margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 16px;border:1px solid #111;background:#fff;color:#111;box-shadow:0 18px 50px rgba(17,17,17,.14);font:12px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .ace-cookie-copy{min-width:0}.ace-cookie-copy strong{display:block;font-size:13px}.ace-cookie-copy a{color:inherit;text-underline-offset:3px}
    .ace-cookie-actions{flex:0 0 auto}.ace-cookie-actions button{min-height:38px;padding:0 14px;border:1px solid #111;background:#111;color:#fff;font:600 12px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
    @media(max-width:600px){.ace-cookie-banner{left:10px;right:10px;width:calc(100% - 20px);bottom:10px;flex-direction:column;align-items:stretch}.ace-cookie-actions button{width:100%}}
  `;
  document.head.appendChild(style);
  const banner=document.createElement("aside");
  banner.className="ace-cookie-banner";
  banner.setAttribute("role","region");
  banner.setAttribute("aria-label","Cookie notice");
  banner.innerHTML=`<div class="ace-cookie-copy"><strong>Essential cookies only.</strong> Ace ID uses cookies necessary for authentication, sessions and security. No advertising cookies are used. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/cookie-policy">Cookie policy</a></div><div class="ace-cookie-actions"><button type="button">Got it</button></div>`;
  banner.querySelector("button").addEventListener("click",()=>{try{localStorage.setItem(KEY,"accepted")}catch{} banner.remove()});
  document.body.appendChild(banner);
})();
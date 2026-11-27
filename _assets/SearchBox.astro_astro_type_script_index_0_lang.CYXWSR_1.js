import{s as g}from"./site-path.I1SIC9wi.js";import{r as p}from"./search-engine.BzB_t9aB.js";import{t as y}from"./native-bridge.BZ-joEbh.js";function n(s){return s.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]||a)}document.querySelectorAll("[data-search-widget]").forEach(s=>{const a=s.querySelector("[data-search-input]"),l=s.querySelector("[data-search-output]"),c=s.querySelector("[data-search-voice]"),u=s.querySelector("[data-search-corpus]");if(!a||!l||!u)return;let d=[];try{d=JSON.parse(u.textContent||"[]")}catch{d=[]}const o=t=>{if(!t.trim()){l.innerHTML="";return}const r=p(t,d,7);let i="";r.understoodSynonyms.length>0&&(i+=`<div class="syn-bar" style="display:flex; flex-wrap:wrap; gap:0.45rem; align-items:center; font-size:var(--fs-xs);">
          <strong style="color:var(--ink-muted);">Đã hiểu từ dân gian:</strong>
          ${r.understoodSynonyms.map(e=>`<span class="badge badge-gold">${n(e)}</span>`).join("")}
        </div>`);for(const e of r.banners)i+=`
          <div class="safety-search-alert" data-safety-banner="${e.kind}" style="background:var(--emergency-soft); border:2.5px solid var(--emergency); border-radius:var(--r-lg); padding:1rem 1.15rem; display:grid; gap:0.65rem;">
            <strong style="color:var(--emergency-ink); font-size:var(--fs-md); line-height:1.3;">${n(e.title)}</strong>
            <p style="margin:0; color:var(--ink-primary); font-size:var(--fs-sm);">${n(e.message)}</p>
            <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
              <a href="tel:115" data-search-call115="true" class="btn btn-emergency" style="padding:0.55rem 1rem;">Gọi 115 ngay</a>
              <a href="${e.primaryCtaHref}" class="btn btn-outline" style="padding:0.55rem 1rem;">${n(e.primaryCtaLabel)}</a>
              ${e.secondaryArticleSlug?`<a href="${g(`/tra-cuu/${e.secondaryArticleSlug}/`)}" class="btn btn-outline" style="padding:0.55rem 1rem;">${n(e.secondaryArticleLabel||"Đọc chi tiết")}</a>`:""}
            </div>
          </div>
        `;r.results.length>0?i+=`<div style="display:grid; gap:0.55rem;">
          ${r.results.map(e=>`
            <a href="${g(`/tra-cuu/${e.slug}/`)}" class="card" style="padding:0.9rem 1.1rem; text-decoration:none; display:grid; gap:0.25rem; min-height:60px;">
              <span class="badge ${e.actionLevel==="emergency"?"badge-red":e.actionLevel==="urgent_today"?"badge-warn":"badge-teal"}" style="justify-self:start;">
                ${n(e.categoryLabel)}
              </span>
              <strong style="color:var(--ink-primary); font-size:var(--fs-base);">${n(e.title)}</strong>
              <span style="color:var(--ink-secondary); font-size:var(--fs-sm);">${n(e.tldr15s[0]||"")}</span>
            </a>
          `).join("")}
        </div>`:r.banners.length===0&&(i+=`<div class="card" style="padding:1rem;">
          <p style="margin:0; color:var(--ink-secondary);">Chưa tìm thấy bài khớp chính xác với "${n(t)}". Nếu có bất kỳ dấu hiệu thần kinh lạ khởi phát đột ngột, hãy bấm <strong>Gọi 115</strong> hoặc mở <a href="${g("/so-cuu/")}" style="display:inline-flex; align-items:center; min-height:48px; padding-inline:0.4rem;">Sơ cứu 0 giây</a>.</p>
        </div>`),l.innerHTML=i};a.addEventListener("input",()=>o(a.value)),s.querySelectorAll("[data-search-chip]").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.searchChip||"";a.value=r,o(r)})}),l.addEventListener("click",t=>{t.target?.closest("[data-search-call115]")&&(t.preventDefault(),y())}),c?.addEventListener("click",()=>{const t=window.SpeechRecognition||window.webkitSpeechRecognition;if(!t){l.innerHTML='<div class="card" style="padding:0.9rem;"><p style="margin:0;">Trình duyệt này chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn hãy chạm chọn một trong các nút từ khóa bên trên hoặc gõ không dấu.</p></div>';return}const r=new t;r.lang="vi-VN",r.interimResults=!1,c.setAttribute("aria-busy","true"),r.onresult=i=>{const e=i.results?.[0]?.[0]?.transcript||"";a.value=e,o(e)},r.onend=()=>c.removeAttribute("aria-busy"),r.onerror=()=>c.removeAttribute("aria-busy"),r.start()}),a.value.trim()&&o(a.value)});

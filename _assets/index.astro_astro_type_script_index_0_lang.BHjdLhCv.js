import{s as g}from"./site-path.I1SIC9wi.js";import{l as w,f as u,i as L,a as k,b as m}from"./history-store.CboHbEE1.js";import{t as $}from"./native-bridge.BZ-joEbh.js";const C=document.getElementById("sign-cards-json")?.textContent||"[]",x=JSON.parse(C),o=document.getElementById("sign-detail-drawer"),h=document.getElementById("drawer-sign-title"),p=document.getElementById("drawer-sign-body"),A=document.getElementById("btn-close-drawer");document.querySelectorAll("[data-sign-id]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.signId,s=x.find(r=>r.id===a);!s||!o||!h||!p||(document.querySelectorAll("[data-sign-id]").forEach(r=>r.setAttribute("aria-expanded","false")),n.setAttribute("aria-expanded","true"),h.textContent=`${s.shortCode} — ${s.name}`,p.textContent=s.detail,o.classList.remove("hidden"))})});A?.addEventListener("click",()=>{o?.classList.add("hidden"),document.querySelectorAll("[data-sign-id]").forEach(n=>n.setAttribute("aria-expanded","false"))});async function y(){const n=document.getElementById("home-history-zone"),a=document.getElementById("home-pending-banner"),s=document.getElementById("home-last-record-card");if(!n||!a||!s)return;const{vault:r}=await w(),d=r.records.filter(e=>e.outcome!=="abandoned");if(d.length===0){n.classList.add("hidden");return}n.classList.remove("hidden");const f=Date.now(),i=d.find(e=>{const c=(f-new Date(e.finishedAt).getTime())/36e5;return e.actions.some(l=>l.type==="marked_called_115"||l.type==="marked_hospital_visited")?!1:(e.outcome==="emergency"||e.outcome==="uncertain")&&c<=24||e.outcome==="tia_warning"&&c<=48});if(i){const e=i.outcome==="tia_warning";a.className="care-card "+(e?"level-urgent":"level-emergency"),a.innerHTML=`
        <div class="care-card-header">
          <span>${e?"Cảnh báo TIA chưa xác nhận đi khám":"Cảnh báo dấu hiệu cấp chưa xác nhận gọi 115"}</span>
        </div>
        <div class="care-card-body" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem;">
          <p style="margin:0;">
            Lúc <strong>${u(i.finishedAt)}</strong> (${i.personLabel||"Người kiểm tra"}): ghi nhận <strong>${e?"dấu hiệu xuất hiện rồi tự hết (nghi TIA)":i.positiveSigns.join(", ")||"dấu hiệu nghi ngờ"}</strong>. ${e?"Cần đưa tới Khoa Cấp cứu Đơn vị Đột quỵ ngay!":"Đã gọi cấp cứu 115 chưa?"}
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:0.55rem;">
            <a href="tel:115" data-pending-call="${i.id}" class="btn btn-emergency">Gọi 115 ngay</a>
            <button type="button" data-pending-ack="${i.id}" class="btn btn-outline">Đã vào viện / Đã đi khám</button>
          </div>
        </div>
      `,a.classList.remove("hidden")}else a.classList.add("hidden");const t=d[0],v=L(t.finishedAt,2),b=t.outcome==="emergency"||t.outcome==="uncertain"?`Có dấu hiệu nghi ngờ (${t.positiveSigns.join(", ")||"cần gọi 115"})`:t.outcome==="tia_warning"?"Có dấu hiệu vừa tự hết (Cảnh báo sớm TIA — cần cấp cứu ngay)":t.outcome.startsWith("risk_")?`Đánh giá nguy cơ nền: ${t.riskLevelLabel||"Đã lưu"}`:"Chưa thấy dấu hiệu thường gặp tại thời điểm kiểm tra (Không loại trừ đột quỵ)";s.innerHTML=`
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.85rem;">
        <div style="display:grid; gap:0.25rem;">
          <span class="badge ${t.outcome==="emergency"||t.outcome==="uncertain"?"badge-red":t.outcome==="tia_warning"?"badge-warn":"badge-teal"}" style="justify-self:start;">
            LẦN KIỂM TRA GẦN NHẤT · ${t.personLabel||"Chưa chọn tên"}
          </span>
          <strong style="font-size:var(--fs-base);">
            Lúc ${u(t.finishedAt)} (${k(t.finishedAt)}): ${b}
          </strong>
          ${v?'<span style="color:var(--warn-ink); font-weight:700; font-size:var(--fs-sm);">Kết quả đã hơn 2 giờ trước — tình trạng có thể đã thay đổi. Hãy kiểm tra lại ngay nếu còn lo lắng.</span>':""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
          <a href="${g("/kiem-tra/")}" class="btn btn-primary">Kiểm tra lại ngay</a>
          <a href="${g("/kiem-tra/#tab-history")}" class="btn btn-outline">Lịch sử (${d.length})</a>
        </div>
      </div>
    `,s.classList.remove("hidden"),a.querySelector("[data-pending-call]")?.addEventListener("click",async e=>{e.preventDefault(),await m(i.id,"tapped_call_115"),$()}),a.querySelector("[data-pending-ack]")?.addEventListener("click",async()=>{await m(i.id,"marked_hospital_visited"),y()})}y();

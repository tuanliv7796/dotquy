/* ==========================================================================
   ANATOMICALLY CLEAR FIRST-AID VECTOR ILLUSTRATIONS (ONE ACTION PER FIGURE)
   Note: Recovery position depicts neutral/slightly extended lateral head
   alignment to drain secretions — NEVER head lower than torso.
   ========================================================================== */

export const FIRST_AID_ILLUSTRATIONS: Record<string, { label: string; svg: string }> = {
  recoveryPosition: {
    label: 'Minh họa tư thế nằm nghiêng an toàn: xoay đồng trục sang một bên, tay trên đỡ má, chân trên co giữ vững, đầu ngang tự nhiên hơi ngửa nhẹ để dịch nôn tự chảy ra ngoài không tràn vào phổi.',
    svg: `<svg viewBox="0 0 360 150" width="100%" height="145" role="img" aria-label="Tư thế nằm nghiêng an toàn chống sặc">
      <rect x="8" y="8" width="344" height="134" rx="16" fill="#E6F4F1" stroke="#115E59" stroke-width="1.5"/>
      <line x1="28" y1="118" x2="332" y2="118" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
      <!-- Soft flat support under head (level with spine, NEVER lower than torso) -->
      <rect x="44" y="96" width="54" height="18" rx="7" fill="#FFFFFF" stroke="#115E59" stroke-width="2"/>
      <!-- Head level & slightly tilted forward/open to drain -->
      <circle cx="74" cy="82" r="18" fill="#FDE68A" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Hand supporting cheek -->
      <path d="M112 94 Q92 98 82 92" fill="none" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
      <!-- Lateral Torso aligned horizontally with head -->
      <rect x="96" y="72" width="102" height="38" rx="16" fill="#115E59" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Top bent leg stabilizing body on floor -->
      <path d="M194 88 L244 68 L266 114" fill="none" stroke="#0F172A" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Bottom straight leg -->
      <path d="M194 102 L292 108" fill="none" stroke="#334155" stroke-width="10" stroke-linecap="round"/>
      <!-- Drainage arrow from mouth corner downward -->
      <path d="M58 90 L42 106 M42 106 L50 106 M42 106 L42 98" fill="none" stroke="#B91C1C" stroke-width="2.6" stroke-linecap="round"/>
      <text x="180" y="32" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="700">Đầu ngang trục lưng (hơi ngửa nhẹ) · Chân trên co chống lật</text>
    </svg>`,
  },

  cprChest: {
    label: 'Minh họa ép tim ngoài lồng ngực người lớn: đặt người bệnh nằm ngửa trên nền cứng, hai bàn tay đan chồng lên nhau chính giữa xương ức, ấn thẳng góc sâu 5 đến 6 cm với nhịp 100 đến 120 lần mỗi phút.',
    svg: `<svg viewBox="0 0 360 150" width="100%" height="145" role="img" aria-label="Vị trí ép tim giữa xương ức sâu 5 đến 6 cm">
      <rect x="8" y="8" width="344" height="134" rx="16" fill="#FEF2F2" stroke="#B91C1C" stroke-width="1.5"/>
      <line x1="28" y1="122" x2="332" y2="122" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Supine patient on firm floor -->
      <circle cx="72" cy="98" r="17" fill="#FDE68A" stroke="#0F172A" stroke-width="2.5"/>
      <rect x="94" y="84" width="128" height="34" rx="12" fill="#CBD5E1" stroke="#0F172A" stroke-width="2.5"/>
      <line x1="222" y1="106" x2="306" y2="112" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
      <!-- Rescuer straight arms & interlocked hands at mid-sternum -->
      <line x1="146" y1="26" x2="154" y2="78" stroke="#B91C1C" stroke-width="6" stroke-linecap="round"/>
      <line x1="166" y1="26" x2="158" y2="78" stroke="#B91C1C" stroke-width="6" stroke-linecap="round"/>
      <rect x="140" y="74" width="32" height="11" rx="5" fill="#B91C1C"/>
      <!-- Vertical compression arrow 5-6 cm -->
      <path d="M196 44 L196 76 M190 69 L196 77 L202 69" fill="none" stroke="#B91C1C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="262" y="56" text-anchor="middle" fill="#991B1B" font-size="14" font-weight="800">Ấn sâu 5–6 cm</text>
      <text x="262" y="76" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="700">100–120 nhịp/phút</text>
    </svg>`,
  },

  seizureSafety: {
    label: 'Minh họa xử trí đang co giật: lót khăn mềm dưới đầu, dọn vật sắc nhọn xung quanh, tuyệt đối không nhét đũa, thìa hay ngón tay vào miệng.',
    svg: `<svg viewBox="0 0 360 150" width="100%" height="145" role="img" aria-label="Lót mềm dưới đầu và cấm nhét vật vào miệng khi co giật">
      <rect x="8" y="8" width="344" height="134" rx="16" fill="#FFFBEB" stroke="#B45309" stroke-width="1.5"/>
      <!-- Soft folded towel under head -->
      <rect x="40" y="96" width="80" height="22" rx="10" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
      <circle cx="80" cy="80" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
      <rect x="102" y="78" width="104" height="34" rx="14" fill="#115E59" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Crossed-out spoon/object near mouth -->
      <g transform="translate(248, 42)">
        <circle cx="34" cy="34" r="30" fill="#FEF2F2" stroke="#B91C1C" stroke-width="3"/>
        <line x1="16" y1="50" x2="52" y2="18" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
        <line x1="13" y1="13" x2="55" y2="55" stroke="#B91C1C" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      <text x="122" y="34" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="700">Lót mềm dưới đầu · Dứt cơn mới xoay nghiêng</text>
      <text x="282" y="126" text-anchor="middle" fill="#991B1B" font-size="14" font-weight="800">CẤM nhét vật vào miệng</text>
    </svg>`,
  },

  awakeRest: {
    label: 'Minh họa người bệnh còn tỉnh táo: nằm nghỉ yên thoải mái, nới lỏng cổ áo và thắt lưng, tuyệt đối không uống thuốc hạ áp, Aspirin, An Cung hay nước lọc.',
    svg: `<svg viewBox="0 0 360 150" width="100%" height="145" role="img" aria-label="Nằm nghỉ yên tĩnh, nới lỏng quần áo, không cho ăn uống hay uống thuốc">
      <rect x="8" y="8" width="344" height="134" rx="16" fill="#F1F5F4" stroke="#115E59" stroke-width="1.5"/>
      <!-- Gentle comfortable rest -->
      <path d="M36 116 L112 92 L310 116" fill="none" stroke="#64748B" stroke-width="4" stroke-linecap="round"/>
      <circle cx="82" cy="74" r="17" fill="#FDE68A" stroke="#0F172A" stroke-width="2.5"/>
      <rect x="102" y="76" width="98" height="32" rx="13" fill="#115E59" stroke="#0F172A" stroke-width="2.5"/>
      <!-- Crossed-out cup & pill -->
      <g transform="translate(246, 36)">
        <circle cx="34" cy="34" r="28" fill="#FEF2F2" stroke="#B91C1C" stroke-width="3"/>
        <rect x="24" y="22" width="20" height="24" rx="3" fill="none" stroke="#0F172A" stroke-width="2.5"/>
        <line x1="14" y1="14" x2="54" y2="54" stroke="#B91C1C" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      <text x="128" y="34" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="700">Nằm yên · Nới cổ áo · Chờ xe 115</text>
      <text x="280" y="124" text-anchor="middle" fill="#991B1B" font-size="14" font-weight="800">CẤM ăn uống & thuốc</text>
    </svg>`,
  },
};

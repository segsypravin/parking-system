/* ════════════════════════════════════════════
   ParkIQ – app.js
   DB-Only data · Large Dr. Driving Animation
   ════════════════════════════════════════════ */

// ── DB DATA (exactly as in parkingdb.sql) ──────────────
const USERS = [
    { user_id: 1, name: 'Vaishnavi Narker', contact_no: '9876543210', user_type: 'Student' },
    { user_id: 2, name: 'Pravin Nath', contact_no: '9123456780', user_type: 'Staff' },
    { user_id: 3, name: 'Jiya Kamble', contact_no: '9012345678', user_type: 'Visitor' },
    { user_id: 4, name: 'Shlok Mishra', contact_no: '9988776655', user_type: 'Student' },
    { user_id: 5, name: 'Jiya Kamble', contact_no: '9876501234', user_type: 'Staff' },
];
const VEHICLES = [
    { vehicle_id: 101, vehicle_no: 'MH12AB1234', vehicle_type: 'Car', frequent_visitor: 'Y', user_id: 1 },
    { vehicle_id: 102, vehicle_no: 'MH14CD5678', vehicle_type: 'Bike', frequent_visitor: 'N', user_id: 2 },
    { vehicle_id: 103, vehicle_no: 'MH01EF9999', vehicle_type: 'Car', frequent_visitor: 'Y', user_id: 3 },
    { vehicle_id: 104, vehicle_no: 'MH02GH2222', vehicle_type: 'Car', frequent_visitor: 'N', user_id: 4 },
    { vehicle_id: 105, vehicle_no: 'MH03IJ3333', vehicle_type: 'Bike', frequent_visitor: 'Y', user_id: 5 },
];
const RECORDS = [
    { record_id: 1001, vehicle_id: 101, slot_id: 1, entry_time: '2026-02-25 20:15:34', exit_time: null, parking_duration: 2, rotation_status: 'Active', charges: 50.00 },
    { record_id: 1002, vehicle_id: 102, slot_id: 7, entry_time: '2026-02-25 19:45:34', exit_time: null, parking_duration: 1, rotation_status: 'Active', charges: 20.00 },
    { record_id: 1003, vehicle_id: 103, slot_id: 14, entry_time: '2026-02-25 17:30:00', exit_time: '2026-02-25 20:30:00', parking_duration: 3, rotation_status: 'Completed', charges: 75.00 },
    { record_id: 1004, vehicle_id: 104, slot_id: 26, entry_time: '2026-02-25 16:00:00', exit_time: null, parking_duration: 2, rotation_status: 'Active', charges: 50.00 },
    { record_id: 1005, vehicle_id: 105, slot_id: 42, entry_time: '2026-02-25 18:50:34', exit_time: null, parking_duration: 1, rotation_status: 'Active', charges: 20.00 },
];
const SLOTS = Array.from({ length: 48 }, (_, i) => {
    const s_id = i + 1;
    const activeRec = RECORDS.find(r => r.slot_id === s_id && r.rotation_status === 'Active');
    return {
        slot_id: s_id,
        slot_type: s_id % 5 === 0 ? 'Bike' : 'Car',
        slot_level: s_id <= 24 ? 1 : 2,
        slot_priority: (s_id === 1 || s_id === 25) ? 'Reserved' : 'Standard',
        slot_status: activeRec ? 'Occupied' : 'Available'
    };
});

function getDetails(slotId) {
    const r = RECORDS.find(r => r.slot_id === slotId);
    if (!r) return null;
    const v = VEHICLES.find(v => v.vehicle_id === r.vehicle_id);
    const u = USERS.find(u => u.user_id === v?.user_id);
    return { r, v, u };
}

// ── NAVBAR & SCROLL ────────────────────────────────────
window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    nb.classList.toggle('scrolled', scrollY > 50);
    ['hero', 'stats', 'map', 'activity'].forEach(id => {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - 120) {
            document.querySelectorAll('.nav-link').forEach(a =>
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
            );
        }
    });
});
document.getElementById('navToggle').addEventListener('click', () =>
    document.getElementById('navLinks').classList.toggle('open'));

// ── STAT COUNTERS ──────────────────────────────────────
let countered = false;
function runCounters() {
    document.querySelectorAll('[data-to]').forEach(el => {
        const target = +el.dataset.to, prefix = el.dataset.prefix || '';
        let n = 0, step = Math.max(1, Math.ceil(target / 55));
        const t = setInterval(() => {
            n = Math.min(n + step, target);
            el.textContent = prefix + n.toLocaleString();
            if (n >= target) clearInterval(t);
        }, 25);
    });
    setTimeout(() => {
        document.querySelectorAll('.sbar-fill').forEach(b => {
            const w = getComputedStyle(b).getPropertyValue('--w');
            b.style.width = '0';
            setTimeout(() => b.style.width = w, 60);
        });
    }, 80);
}
new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !countered) { countered = true; runCounters(); }
}, { threshold: 0.3 }).observe(document.getElementById('stats'));

// ── PARKING MAP ─────────────────────────────────────────
let curLevel = 1;

function slotIcon(type, status) {
    if (status === 'Available') return type === 'Bike' ? '🛵' : '🅿️';
    return type === 'Bike' ? '🏍️' : '🚗';
}

function renderLot(level) {
    const lot = document.getElementById('parkingLot');
    const slots = SLOTS.filter(s => s.slot_level === level);
    lot.innerHTML = '';

    // We have 24 slots, arranged in 4 columns of 6.
    // Let's create an approximate coordinate map for them in percentages over the image.
    // You will need to tweak these slightly depending on your exact image proportions.

    // Y positions for the 6 rows (from top to bottom)
    const yPos = [18, 30, 42, 54, 66, 78];
    // X positions for the 4 columns
    const xPos = [9.5, 29.5, 56.5, 76.5];

    slots.forEach((slot) => {
        const isOcc = slot.slot_status === 'Occupied';
        const isRes = slot.slot_priority === 'Reserved';
        const el = document.createElement('div');
        el.className = `pslot ${isOcc ? 'occ' : (isRes ? 'res' : 'avl')}`;

        // Calculate grid position mapping 1-24 for level 1, and 25-48 for level 2 into the same 24-slot map background
        let localId = ((slot.slot_id - 1) % 24) + 1;
        let colIndex = 0;
        if (localId > 18) colIndex = 3;
        else if (localId > 12) colIndex = 2;
        else if (localId > 6) colIndex = 1;

        let rowIndex = (localId - 1) % 6;

        el.style.left = `${xPos[colIndex]}%`;
        el.style.top = `${yPos[rowIndex]}%`;

        el.innerHTML = `
      <div class="slot-pulse"></div>
      <div class="slot-car-big" title="${slot.slot_type}">${isRes && !isOcc ? '🚧' : slotIcon(slot.slot_type, slot.slot_status)}</div>
    `;
        if (isOcc) {
            el.title = `Click to view vehicle in Slot ${slot.slot_id}`;
            el.addEventListener('click', () => openModal(slot));
        }
        lot.appendChild(el);
    });
}

document.querySelectorAll('.ltab').forEach(btn =>
    btn.addEventListener('click', () => {
        document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        curLevel = +btn.dataset.level;
        renderLot(curLevel);
    })
);

// ── MODAL ───────────────────────────────────────────────
const modalOv = document.getElementById('modalOv');
const modalBody = document.getElementById('modalBody');

function userBadge(t) {
    return { Student: 'mb-student', Staff: 'mb-staff', Visitor: 'mb-visitor' }[t] || 'mb-visitor';
}
function openModal(slot) {
    const d = getDetails(slot.slot_id);
    if (!d) return;
    const { r, v, u } = d;
    document.getElementById('modalTag').textContent = `Slot ${slot.slot_id} – Level ${slot.slot_level}`;
    const dur = r.exit_time
        ? `${r.parking_duration} hr${r.parking_duration > 1 ? 's' : ''}`
        : `Active (since ${r.entry_time.split(' ')[1]})`;
    modalBody.innerHTML = `
    <div class="m-section">
      <div class="m-label">Vehicle</div>
      <div class="m-grid">
        <div class="m-field"><div class="mf-label">Plate No.</div><div class="mf-val">${v.vehicle_no}</div></div>
        <div class="m-field"><div class="mf-label">Type</div><div class="mf-val">${v.vehicle_type} ${v.vehicle_type === 'Bike' ? '🏍️' : '🚗'}</div></div>
        <div class="m-field"><div class="mf-label">Frequent Visitor</div><div class="mf-val">${v.frequent_visitor === 'Y' ? '✅ Yes' : '❌ No'}</div></div>
        <div class="m-field"><div class="mf-label">Priority</div><div class="mf-val">${slot.slot_priority}</div></div>
      </div>
    </div>
    <div class="m-section">
      <div class="m-label">Owner</div>
      <div class="m-grid">
        <div class="m-field"><div class="mf-label">Name</div><div class="mf-val">${u?.name || '—'}</div></div>
        <div class="m-field"><div class="mf-label">Contact</div><div class="mf-val">📞 ${u?.contact_no || '—'}</div></div>
        <div class="m-field full"><div class="mf-label">User Type</div><div class="mf-val"><span class="mbadge ${userBadge(u?.user_type)}">${u?.user_type}</span></div></div>
      </div>
    </div>
    <div class="m-section">
      <div class="m-label">Parking Record</div>
      <div class="m-grid">
        <div class="m-field"><div class="mf-label">Record ID</div><div class="mf-val">#${r.record_id}</div></div>
        <div class="m-field"><div class="mf-label">Status</div><div class="mf-val"><span class="mbadge ${r.rotation_status === 'Active' ? 'mb-active' : 'mb-done'}">${r.rotation_status}</span></div></div>
        <div class="m-field"><div class="mf-label">Entry</div><div class="mf-val">⏰ ${r.entry_time}</div></div>
        <div class="m-field"><div class="mf-label">Duration</div><div class="mf-val">⏱ ${dur}</div></div>
        <div class="m-field full"><div class="mf-label">Amount</div><div class="mf-val" style="color:#F59E0B;font-size:1.1rem;font-weight:700">💰 ₹${r.charges.toFixed(2)}</div></div>
      </div>
    </div>`;
    modalOv.classList.add('show');
}
document.getElementById('modalX').addEventListener('click', () => modalOv.classList.remove('show'));
modalOv.addEventListener('click', e => { if (e.target === modalOv) modalOv.classList.remove('show'); });

// ── ACTIVITY FEED ───────────────────────────────────────
function renderFeed() {
    const feed = document.getElementById('activityFeed');
    const items = RECORDS.map(r => {
        const v = VEHICLES.find(v => v.vehicle_id === r.vehicle_id);
        const u = USERS.find(u => u.user_id === v?.user_id);
        const slot = SLOTS.find(s => s.slot_id === r.slot_id);
        const isActive = r.rotation_status === 'Active';
        return `<div class="feed-item" style="animation-delay:${RECORDS.indexOf(r) * 0.08}s">
      <div class="feed-ico ${isActive ? 'ico-in' : 'ico-out'}">${v?.vehicle_type === 'Bike' ? '🏍️' : '🚗'}</div>
      <div class="feed-info">
        <div class="feed-title">${v?.vehicle_no} ${isActive ? 'parked' : 'exited'}</div>
        <div class="feed-sub">Slot ${r.slot_id} (${slot?.slot_type}) · ${u?.name}</div>
      </div>
      <div class="feed-meta">
        <div class="feed-time">${r.entry_time.split(' ')[1]}</div>
        ${!isActive ? `<span class="feed-charge">₹${r.charges.toFixed(2)}</span>` : ''}
        <span class="feed-badge ${isActive ? 'b-active' : 'b-completed'}">${r.rotation_status}</span>
      </div>
    </div>`;
    });
    feed.innerHTML = items.join('');
}

// ── Background Video Theme Matching ──────────────────────
const videoEl = document.querySelector('.hero-video');
if (videoEl) {
    // Attempt playback if autoplay was blocked by browser
    videoEl.play().catch(e => console.log('Autoplay might have been prevented:', e));
}

// ── Kick things off ───────────────────────────────────
renderLot(1);
renderFeed();

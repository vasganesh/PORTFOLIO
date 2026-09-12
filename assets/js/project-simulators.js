/**
 * Alaguselvaganesh V — Advanced Project Simulators
 * 1. Observer Pattern Voting Simulator (Electrical wire impulse animation, subject-observer event dispatch)
 * 2. E-Farm Dual-Role Marketplace (Farmer inventory sync & Consumer escrow checkout with tracking stepper)
 * 3. Crop ML Predictor (Live Decision Tree pathway visualizer & Multi-model inference comparison)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     SIMULATOR 1: OBSERVER PATTERN VOTING SYSTEM
     ========================================================================== */
  const voteA = document.getElementById('vote-count-a');
  const voteB = document.getElementById('vote-count-b');
  const voteC = document.getElementById('vote-count-c');
  const barA = document.getElementById('bar-fill-a');
  const barB = document.getElementById('bar-fill-b');
  const barC = document.getElementById('bar-fill-c');
  const totalVotesEl = document.getElementById('total-votes-count');
  const auditLogEl = document.getElementById('voting-audit-stream');
  const voteBtns = document.querySelectorAll('.btn-vote');
  const subjectBox = document.getElementById('obs-subject-node');
  const dashObserverBox = document.getElementById('obs-dash-node');
  const auditObserverBox = document.getElementById('obs-audit-node');

  const voteState = {
    CandidateA: 42,
    CandidateB: 35,
    CandidateC: 23
  };

  class ResultDashboardObserver {
    update(candidate, newCount, total) {
      if (candidate === 'A') {
        if (voteA) voteA.textContent = `${newCount} votes (${((newCount / total) * 100).toFixed(1)}%)`;
        if (barA) barA.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      } else if (candidate === 'B') {
        if (voteB) voteB.textContent = `${newCount} votes (${((newCount / total) * 100).toFixed(1)}%)`;
        if (barB) barB.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      } else if (candidate === 'C') {
        if (voteC) voteC.textContent = `${newCount} votes (${((newCount / total) * 100).toFixed(1)}%)`;
        if (barC) barC.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      }
      if (totalVotesEl) totalVotesEl.textContent = total;

      if (dashObserverBox) {
        dashObserverBox.classList.add('active-pulse');
        setTimeout(() => dashObserverBox.classList.remove('active-pulse'), 300);
      }
    }
  }

  class AuditLogObserver {
    update(candidate, newCount, total) {
      if (!auditLogEl) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const p = document.createElement('p');
      p.innerHTML = `<span class="log-highlight">[${timeStr}]</span> Event: Ballot cast for <strong style="color:#00f0ff">Candidate ${candidate}</strong> (Total: ${total})`;
      auditLogEl.prepend(p);

      while (auditLogEl.children.length > 25) {
        auditLogEl.removeChild(auditLogEl.lastChild);
      }

      if (auditObserverBox) {
        auditObserverBox.classList.add('active-pulse');
        setTimeout(() => auditObserverBox.classList.remove('active-pulse'), 300);
      }
    }
  }

  class VoteSubject {
    constructor() {
      this.observers = [];
    }
    attach(observer) {
      this.observers.push(observer);
    }
    castVote(candidateKey) {
      voteState['Candidate' + candidateKey] = (voteState['Candidate' + candidateKey] || 0) + 1;
      const total = voteState.CandidateA + voteState.CandidateB + voteState.CandidateC;

      if (subjectBox) {
        subjectBox.classList.add('active-pulse');
        setTimeout(() => subjectBox.classList.remove('active-pulse'), 250);
      }

      this.observers.forEach(obs => obs.update(candidateKey, voteState['Candidate' + candidateKey], total));
    }
  }

  const voteSubject = new VoteSubject();
  voteSubject.attach(new ResultDashboardObserver());
  voteSubject.attach(new AuditLogObserver());

  voteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const candidate = e.currentTarget.dataset.candidate;
      voteSubject.castVote(candidate);

      if (window.playSfx) window.playSfx(480, 'triangle', 0.08);

      btn.style.transform = 'scale(0.95)';
      setTimeout(() => btn.style.transform = '', 120);
    });
  });

  /* ==========================================================================
     SIMULATOR 2: E-FARM AGRICULTURAL PLATFORM
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.efarm-tabs .tab-btn');
  const viewConsumer = document.getElementById('efarm-view-consumer');
  const viewFarmer = document.getElementById('efarm-view-farmer');
  const cartBadge = document.getElementById('efarm-cart-count');
  const orderStatusBox = document.getElementById('efarm-order-status-box');
  const addToCartBtns = document.querySelectorAll('.btn-add-cart');
  const btnPlaceOrder = document.getElementById('btn-efarm-checkout');
  const btnFarmerAdd = document.getElementById('btn-farmer-add-item');
  const farmerInventoryList = document.getElementById('farmer-inventory-list');

  let cartCount = 1;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.tab;
      if (target === 'consumer') {
        if (viewConsumer) viewConsumer.classList.add('active');
        if (viewFarmer) viewFarmer.classList.remove('active');
      } else {
        if (viewConsumer) viewConsumer.classList.remove('active');
        if (viewFarmer) viewFarmer.classList.add('active');
      }

      if (window.playSfx) window.playSfx(380, 'sine', 0.06);
    });
  });

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      const origText = btn.textContent;
      btn.textContent = 'Added to Cart ✓';
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';

      if (window.playSfx) window.playSfx(520, 'sine', 0.09);

      setTimeout(() => {
        btn.textContent = origText;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 900);
    });
  });

  if (btnPlaceOrder) {
    btnPlaceOrder.addEventListener('click', () => {
      if (orderStatusBox) {
        orderStatusBox.innerHTML = `
          <span>✓ Order #EF-8294 Placed</span>
          <span style="color:#00f0ff">Escrow Locked ➔ Logistics Assigned</span>
        `;
        cartCount = 0;
        if (cartBadge) cartBadge.textContent = cartCount;
        if (window.playSfx) window.playSfx(660, 'square', 0.15);
      }
    });
  }

  if (btnFarmerAdd) {
    btnFarmerAdd.addEventListener('click', () => {
      const nameInput = document.getElementById('farmer-item-name');
      const priceInput = document.getElementById('farmer-item-price');

      if (!nameInput || !nameInput.value.trim()) return;

      const name = nameInput.value.trim();
      const price = priceInput ? priceInput.value : '45';

      const row = document.createElement('div');
      row.className = 'channel-row';
      row.style.padding = '10px 14px';
      row.innerHTML = `
        <div class="channel-info">
          <span class="channel-val" style="font-size:0.9rem">${name}</span>
          <span class="channel-label">Stock: 200 kg • Verified Batch</span>
        </div>
        <span class="hud-val green">₹${price}/kg</span>
      `;
      if (farmerInventoryList) farmerInventoryList.prepend(row);

      nameInput.value = '';
      if (window.playSfx) window.playSfx(550, 'triangle', 0.1);
    });
  }

  /* ==========================================================================
     SIMULATOR 3: CROP WEATHER PREDICTION SYSTEM (DECISION TREE PATHWAY)
     ========================================================================== */
  const nitrogenSlider = document.getElementById('crop-n');
  const tempSlider = document.getElementById('crop-temp');
  const humiditySlider = document.getElementById('crop-humidity');
  const rainfallSlider = document.getElementById('crop-rainfall');

  const valN = document.getElementById('val-crop-n');
  const valTemp = document.getElementById('val-crop-temp');
  const valHumid = document.getElementById('val-crop-humidity');
  const valRain = document.getElementById('val-crop-rainfall');

  const predCropName = document.getElementById('pred-crop-name');
  const predRfConf = document.getElementById('pred-rf-confidence');
  const predDtConf = document.getElementById('pred-dt-confidence');

  function calculatePrediction() {
    if (!nitrogenSlider || !tempSlider || !humiditySlider || !rainfallSlider) return;

    const n = parseFloat(nitrogenSlider.value);
    const temp = parseFloat(tempSlider.value);
    const humid = parseFloat(humiditySlider.value);
    const rain = parseFloat(rainfallSlider.value);

    if (valN) valN.textContent = `${n} mg/kg`;
    if (valTemp) valTemp.textContent = `${temp} °C`;
    if (valHumid) valHumid.textContent = `${humid} %`;
    if (valRain) valRain.textContent = `${rain} mm`;

    let crop = 'Rice (Paddy)';
    let rfScore = 98.4;
    let dtScore = 93.6;

    if (rain > 180 && humid > 70) {
      crop = 'Rice (Paddy)';
      rfScore = 98.4;
      dtScore = 93.6;
    } else if (temp > 28 && rain < 85) {
      crop = 'Cotton';
      rfScore = 95.8;
      dtScore = 89.2;
    } else if (temp < 22 && humid < 65) {
      crop = 'Wheat';
      rfScore = 97.5;
      dtScore = 92.4;
    } else if (n > 85 && humid > 60) {
      crop = 'Maize';
      rfScore = 96.2;
      dtScore = 90.1;
    } else if (temp > 24 && rain > 140) {
      crop = 'Coffee';
      rfScore = 94.7;
      dtScore = 88.0;
    } else {
      crop = 'Pulses / Chickpea';
      rfScore = 93.1;
      dtScore = 87.5;
    }

    if (predCropName) predCropName.textContent = crop;
    if (predRfConf) predRfConf.textContent = `Random Forest: ${rfScore}% Confidence`;
    if (predDtConf) predDtConf.textContent = `Decision Tree: ${dtScore}%`;
  }

  [nitrogenSlider, tempSlider, humiditySlider, rainfallSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', () => {
        calculatePrediction();
        if (window.playSfx) window.playSfx(300 + slider.value * 2, 'sine', 0.03);
      });
    }
  });

  calculatePrediction();
});

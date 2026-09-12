/**
 * Alaguselvaganesh V — Interactive Project Simulators
 * 1. Observer Pattern Voting Simulator (VoteSubject -> Live Dashboard & Audit Log)
 * 2. E-Farm Agricultural Platform Mock (Farmer Inventory vs Consumer Cart & Order Tracking)
 * 3. Crop Weather Prediction ML Workbench (Feature inputs -> Decision Tree vs Random Forest inference)
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

  // Simulated Subject-Observer state
  const voteState = {
    CandidateA: 42,
    CandidateB: 35,
    CandidateC: 23
  };

  // Concrete Observers
  class ResultDashboardObserver {
    update(candidate, newCount, total) {
      if (candidate === 'A') {
        if (voteA) voteA.textContent = `${newCount} votes`;
        if (barA) barA.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      } else if (candidate === 'B') {
        if (voteB) voteB.textContent = `${newCount} votes`;
        if (barB) barB.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      } else if (candidate === 'C') {
        if (voteC) voteC.textContent = `${newCount} votes`;
        if (barC) barC.style.width = `${((newCount / total) * 100).toFixed(1)}%`;
      }
      if (totalVotesEl) totalVotesEl.textContent = total;
    }
  }

  class AuditLogObserver {
    update(candidate, newCount, total) {
      if (!auditLogEl) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const p = document.createElement('p');
      p.innerHTML = `<span class="log-highlight">[${timeStr}]</span> VoteSubject.notify(): Cast ballot for <strong style="color:#00f0ff">Candidate ${candidate}</strong> (Total: ${total})`;
      auditLogEl.prepend(p);

      // Keep audit log tidy
      while (auditLogEl.children.length > 20) {
        auditLogEl.removeChild(auditLogEl.lastChild);
      }
    }
  }

  // Subject (Publisher)
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
      
      // Notify all registered observers
      this.observers.forEach(obs => obs.update(candidateKey, voteState['Candidate' + candidateKey], total));
    }
  }

  const subject = new VoteSubject();
  subject.attach(new ResultDashboardObserver());
  subject.attach(new AuditLogObserver());

  // Attach click listeners to vote buttons
  voteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const candidate = e.currentTarget.dataset.candidate;
      subject.castVote(candidate);

      // Button feedback
      btn.style.transform = 'scale(0.96)';
      setTimeout(() => btn.style.transform = '', 150);
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
    });
  });

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      const origText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';
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
          <span style="color:#00f0ff">Status: Escrow Verified • En Route</span>
        `;
        cartCount = 0;
        if (cartBadge) cartBadge.textContent = cartCount;
      }
    });
  }

  if (btnFarmerAdd) {
    btnFarmerAdd.addEventListener('click', () => {
      const nameInput = document.getElementById('farmer-item-name');
      const priceInput = document.getElementById('farmer-item-price');
      const stockInput = document.getElementById('farmer-item-stock');

      if (!nameInput || !nameInput.value.trim()) return;

      const name = nameInput.value.trim();
      const price = priceInput ? priceInput.value : '40';
      const stock = stockInput ? stockInput.value : '100';

      const row = document.createElement('div');
      row.className = 'channel-row';
      row.style.padding = '8px 12px';
      row.innerHTML = `
        <div class="channel-info">
          <span class="channel-val" style="font-size:0.85rem">${name}</span>
          <span class="channel-label">Stock: ${stock} kg</span>
        </div>
        <span class="hud-val green">₹${price}/kg</span>
      `;
      if (farmerInventoryList) farmerInventoryList.prepend(row);

      nameInput.value = '';
    });
  }

  /* ==========================================================================
     SIMULATOR 3: CROP WEATHER PREDICTION SYSTEM (ML INFERENCE)
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

    // Rule-based heuristic reflecting trained Random Forest decision boundaries
    let crop = 'Rice';
    let rfScore = 96.4;
    let dtScore = 91.2;

    if (rain > 180 && humid > 70) {
      crop = 'Rice (Paddy)';
      rfScore = 98.2;
      dtScore = 93.4;
    } else if (temp > 28 && rain < 80) {
      crop = 'Cotton';
      rfScore = 94.8;
      dtScore = 88.5;
    } else if (temp < 22 && humid < 65) {
      crop = 'Wheat';
      rfScore = 97.1;
      dtScore = 92.0;
    } else if (n > 85 && humid > 60) {
      crop = 'Maize';
      rfScore = 95.7;
      dtScore = 89.8;
    } else if (temp > 24 && rain > 140) {
      crop = 'Coffee';
      rfScore = 93.6;
      dtScore = 87.2;
    } else {
      crop = 'Pulses / Chickpea';
      rfScore = 92.4;
      dtScore = 86.8;
    }

    if (predCropName) predCropName.textContent = crop;
    if (predRfConf) predRfConf.textContent = `Random Forest: ${rfScore}% Match`;
    if (predDtConf) predDtConf.textContent = `Decision Tree: ${dtScore}%`;
  }

  [nitrogenSlider, tempSlider, humiditySlider, rainfallSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculatePrediction);
    }
  });

  // Initial calculation
  calculatePrediction();
});

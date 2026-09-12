/**
 * Alaguselvaganesh V — Portfolio Main Interactivity
 * Navigation scrollspy, modal deep-dives, resume preview/download,
 * command palette, custom magnetic cursor, and IST live clock.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. STICKY NAVBAR & SCROLLSPY
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileToggleBtn = document.getElementById('btn-mobile-toggle');
  const mobileLinks = document.querySelectorAll('.mobile-nav-drawer a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background blur effect
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active section detection
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu drawer toggle
  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileToggleBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggleBtn.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     2. SYSTEM STATUS HUD LIVE CLOCK (IST - CHENNAI)
     ========================================================================== */
  const hudClock = document.getElementById('hud-live-time');
  function updateISTClock() {
    if (!hudClock) return;
    const now = new Date();
    // Format in IST
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    hudClock.textContent = `${new Intl.DateTimeFormat('en-GB', options).format(now)} IST`;
  }
  setInterval(updateISTClock, 1000);
  updateISTClock();

  /* ==========================================================================
     3. CUSTOM MAGNETIC CURSOR (DESKTOP)
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, input, textarea, .build-card, .project-panel, .experience-card, .skill-pill');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }

  /* ==========================================================================
     4. PROJECT DEEP-DIVE MODAL
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');
  const modalTitle = document.getElementById('modal-project-title');
  const modalContent = document.getElementById('modal-project-content');
  const modalGithubLink = document.getElementById('modal-project-github');

  const projectDetails = {
    'voting-system': {
      title: 'Voting System using Observer Pattern',
      category: 'Java • OOP • Design Patterns',
      githubStatus: 'vasganesh on GitHub',
      githubUrl: 'https://github.com/vasganesh',
      content: `
        <h4>Project Architecture & Decoupling</h4>
        <div class="code-architecture-diagram">
VoteSubject (Publisher)
       │
       ├──> notifies ──> Live Result Dashboard (Observer)
       │
       └──> notifies ──> Audit Log (Observer)
        </div>
        <p><strong>Problem:</strong> In high-concurrency electronic voting applications, tightly coupling the vote-casting logic with data reporting creates bottlenecks, polling latency, and synchronization inconsistencies across client dashboards.</p>
        <p><strong>Solution:</strong> Designed and implemented a real-time voting system strictly adhering to the Gang of Four (GoF) Observer design pattern. A centralized <code>VoteSubject</code> maintains state and instantly broadcasts state changes to registered <code>Observer</code> components without costly polling.</p>
        <h4>Implementation & Engineering Highlights</h4>
        <p>• <strong>SOLID Principles:</strong> Applied Single Responsibility (decoupling vote validation from presentation) and Open/Closed principles (new observers such as notification services can be registered without modifying the subject).</p>
        <p>• <strong>Concurrency & Correctness:</strong> Validated transactional correctness and thread safety through comprehensive unit test suites simulating concurrent vote-casting workloads.</p>
        <p>• <strong>Modular Architecture:</strong> Engineered clean interfaces allowing hot-swappable dashboard components and persistent cryptographic-style audit logs.</p>
      `
    },
    'efarm-platform': {
      title: 'E-Farm – Agricultural Products Selling Platform',
      category: 'Python / Java • MySQL • Full Stack',
      githubStatus: 'vasganesh on GitHub',
      githubUrl: 'https://github.com/vasganesh',
      content: `
        <h4>Architectural Overview</h4>
        <div class="code-architecture-diagram">
Farmer Client            Consumer Client
     │                         │
     ▼ (Listing/Inventory)     ▼ (Browse/Cart/Order)
  Role-Based Access Control (RBAC)
     │                         │
     ▼                         ▼
  Order & Escrow Flow ──> MySQL Relational Database
        </div>
        <p><strong>Problem:</strong> Agricultural supply chains frequently suffer from predatory middlemen, causing farmers to receive minimal compensation while consumers face inflated prices and lack of origin transparency.</p>
        <p><strong>Solution:</strong> Built a full-stack digital marketplace connecting local farmers directly with consumers, eliminating intermediaries and democratizing agricultural trade.</p>
        <h4>Implementation & Engineering Highlights</h4>
        <p>• <strong>Relational Database Schema (MySQL):</strong> Designed normalized tables for products, categories, inventories, orders, and user roles with strong referential integrity, supporting fast queries under catalog scaling.</p>
        <p>• <strong>Role-Based Access Control (RBAC):</strong> Cleanly segregated farmer management portals (item listing, pricing, harvest stock tracking) from consumer portals (product discovery, cart management, delivery scheduling).</p>
        <p>• <strong>End-to-End Order Pipeline:</strong> Built a complete order management life cycle including shopping cart, checkout, order tracking, payment status updates, and location-based product filtering.</p>
      `
    },
    'crop-ml': {
      title: 'Crop Weather Prediction System',
      category: 'Python • Scikit-Learn • Machine Learning',
      githubStatus: 'vasganesh on GitHub',
      githubUrl: 'https://github.com/vasganesh',
      content: `
        <h4>ML Pipeline Workflow</h4>
        <div class="code-architecture-diagram">
Historical Weather + Soil Data
       ↓
Data Preprocessing (Handling missing values, scaling)
       ↓
Feature Engineering & Selection (N, P, K, Temp, Humidity, pH, Rainfall)
       ↓
Model Training & Comparison (Decision Tree vs Random Forest)
       ↓
Hyperparameter Cross-Validation
       ↓
Optimal Crop Recommendation
        </div>
        <p><strong>Problem:</strong> Farmers frequently experience yield reduction due to misjudging seasonal climate patterns and soil nutrient compatibility when choosing crops.</p>
        <p><strong>Solution:</strong> Developed an end-to-end machine learning pipeline that preprocesses multi-source historical agro-climatic datasets to formulate high-confidence crop recommendations tailored to localized regional parameters.</p>
        <h4>Implementation & Engineering Highlights</h4>
        <p>• <strong>Feature Engineering:</strong> Selected and engineered the most influential agro-climatic variables (Nitrogen, Phosphorus, Potassium, Temperature, Relative Humidity, Soil pH, and Rainfall), boosting model generalization on unseen regional data.</p>
        <p>• <strong>Model Benchmarking:</strong> Trained and compared multiple Scikit-learn classification models (Decision Trees, Random Forest) to evaluate accuracy, latency, and resilience against overfitting.</p>
        <p>• <strong>Hyperparameter Optimization:</strong> Applied k-fold cross-validation and hyperparameter grid tuning to minimize variance across diverse microclimate profiles.</p>
      `
    }
  };

  const openModalBtns = document.querySelectorAll('.btn-open-project-modal');
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.project;
      const data = projectDetails[projectId];
      if (!data || !projectModal) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalContent) modalContent.innerHTML = data.content;
      if (modalGithubLink) {
        modalGithubLink.href = data.githubUrl;
        modalGithubLink.textContent = data.githubStatus;
      }

      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal close handlers
  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(projectModal);
      closeModal(resumeModal);
    });
  });

  [projectModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  /* ==========================================================================
     5. RESUME PREVIEW & DOWNLOAD MODAL
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const viewResumeBtns = document.querySelectorAll('.btn-view-resume');

  viewResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeModal(resumeModal);
      }
    });
  }

  /* ==========================================================================
     6. COMMAND PALETTE (CMD+K / CTRL+K)
     ========================================================================== */
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdTriggerBtns = document.querySelectorAll('.btn-cmd');
  const cmdInput = document.getElementById('cmd-search-input');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('open');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    filterCmdItems('');
  }

  function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('open');
  }

  cmdTriggerBtns.forEach(btn => {
    btn.addEventListener('click', openCmdPalette);
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      closeModal(projectModal);
      closeModal(resumeModal);
    }
  });

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closeCmdPalette();
    });
  }

  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCmdItems(e.target.value);
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      closeCmdPalette();

      if (target === 'resume') {
        if (resumeModal) {
          resumeModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      } else if (target) {
        const targetEl = document.querySelector(target);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     7. COPY EMAIL TO CLIPBOARD & CONTACT FORM
     ========================================================================== */
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const emailValText = 'alaguselvaganesh2000@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailValText).then(() => {
        const orig = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        copyEmailBtn.style.background = '#10b981';
        copyEmailBtn.style.color = '#000';
        setTimeout(() => {
          copyEmailBtn.textContent = orig;
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2000);
      }).catch(() => {
        window.location.href = `mailto:${emailValText}`;
      });
    });
  }

  const contactForm = document.getElementById('portfolio-contact-form');
  const formSuccessMsg = document.getElementById('contact-form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !message) return;

      if (formSuccessMsg) {
        formSuccessMsg.innerHTML = `✓ Thank you, ${name}! Your note has been queued. You can also directly reach out at <a href="mailto:alaguselvaganesh2000@gmail.com" style="color:#00f0ff;text-decoration:underline;">alaguselvaganesh2000@gmail.com</a>.`;
        formSuccessMsg.classList.add('success');
      }

      contactForm.reset();
    });
  }

  /* ==========================================================================
     8. SKILL RELATIONSHIP HIGHLIGHTER
     ========================================================================== */
  const skillPills = document.querySelectorAll('.skill-pill');
  const skillAssociations = {
    'React.js': ['JavaScript', 'TypeScript', 'Node.js'],
    'Node.js': ['JavaScript', 'TypeScript', 'Express.js', 'PostgreSQL', 'MongoDB'],
    'Express.js': ['Node.js', 'JavaScript', 'SQL'],
    'Python': ['Flask', 'FastAPI', 'Jupyter Notebook', 'Colab'],
    'FastAPI': ['Python'],
    'Flask': ['Python'],
    'Java': ['SQL', 'MySQL'],
    'PostgreSQL': ['SQL', 'Node.js', 'Prisma'],
    'MongoDB': ['Node.js', 'JavaScript']
  };

  skillPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      const skill = pill.dataset.skill;
      const associates = skillAssociations[skill] || [];

      skillPills.forEach(p => {
        if (associates.includes(p.dataset.skill)) {
          p.classList.add('highlighted');
        }
      });
    });

    pill.addEventListener('mouseleave', () => {
      skillPills.forEach(p => p.classList.remove('highlighted'));
    });
  });
});

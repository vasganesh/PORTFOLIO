/**
 * Alaguselvaganesh V — Interactive Hero Visualization
 * Concept: Central glowing node "GANESH" connected to satellite engineering nodes:
 * React, Node.js, AI, Java, Python, PostgreSQL, Cloud, Research.
 * High-performance 60fps HTML5 Canvas with smooth cursor reactivity and mobile optimization.
 */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let animationFrameId;

  // Track mouse coordinates
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isHovered: false
  };

  // Satellite node definitions matching resume competencies
  const satellitesData = [
    { label: 'React', angle: 0, distance: 135, speed: 0.0035, radius: 24, color: '#00f0ff', accent: 'rgba(0, 240, 255, 0.4)' },
    { label: 'Node.js', angle: Math.PI * 0.25, distance: 165, speed: -0.0028, radius: 25, color: '#22c55e', accent: 'rgba(34, 197, 94, 0.4)' },
    { label: 'AI', angle: Math.PI * 0.5, distance: 125, speed: 0.0042, radius: 22, color: '#a855f7', accent: 'rgba(168, 85, 247, 0.4)' },
    { label: 'Java', angle: Math.PI * 0.75, distance: 175, speed: -0.0032, radius: 24, color: '#f97316', accent: 'rgba(249, 115, 22, 0.4)' },
    { label: 'Python', angle: Math.PI, distance: 140, speed: 0.0038, radius: 25, color: '#38bdf8', accent: 'rgba(56, 189, 248, 0.4)' },
    { label: 'PostgreSQL', angle: Math.PI * 1.25, distance: 180, speed: -0.0025, radius: 27, color: '#60a5fa', accent: 'rgba(96, 165, 250, 0.4)' },
    { label: 'Cloud', angle: Math.PI * 1.5, distance: 130, speed: 0.0045, radius: 23, color: '#fbbf24', accent: 'rgba(251, 191, 36, 0.4)' },
    { label: 'Research', angle: Math.PI * 1.75, distance: 160, speed: -0.0036, radius: 26, color: '#ec4899', accent: 'rgba(236, 72, 153, 0.4)' }
  ];

  // Data pulse packets traveling along edges
  const packets = [];
  satellitesData.forEach((_, index) => {
    packets.push({
      satelliteIndex: index,
      progress: Math.random(),
      speed: 0.006 + Math.random() * 0.006,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  });

  // Background ambient floating particles
  const ambientParticles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 16 : 32;

  function initAmbientParticles() {
    ambientParticles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    initAmbientParticles();
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse / Touch interaction listeners
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.targetX = (mouse.x - width / 2) * 0.14;
    mouse.targetY = (mouse.y - height / 2) * 0.14;
    mouse.isHovered = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
    mouse.isHovered = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.targetX = (mouse.x - width / 2) * 0.08;
      mouse.targetY = (mouse.y - height / 2) * 0.08;
      mouse.isHovered = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
    mouse.isHovered = false;
  });

  let time = 0;

  function render() {
    time += 0.02;

    // Smooth lerp mouse parallax offset
    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.08;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Dynamic Center Position with subtle breathing and parallax
    const centerX = width / 2 + mouse.currentX + Math.sin(time * 0.8) * 3;
    const centerY = height / 2 + mouse.currentY + Math.cos(time * 0.6) * 3;

    // Scale distances dynamically for small screen widths
    const scaleFactor = Math.min(width, height) < 420 ? 0.65 : (Math.min(width, height) < 560 ? 0.82 : 1);

    // 1. Draw Ambient Floating Particles
    ctx.fillStyle = '#ffffff';
    ambientParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. Update Satellites positions and check hover
    const computedSatellites = satellitesData.map((sat, index) => {
      sat.angle += sat.speed;
      const currentDist = sat.distance * scaleFactor;
      
      // Calculate basic position
      let sx = centerX + Math.cos(sat.angle) * currentDist;
      let sy = centerY + Math.sin(sat.angle) * currentDist;

      // Magnetic pull toward cursor if hovered
      let isNearCursor = false;
      if (mouse.isHovered) {
        const dx = mouse.x - sx;
        const dy = mouse.y - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          isNearCursor = true;
          sx += dx * 0.22;
          sy += dy * 0.22;
        }
      }

      return {
        ...sat,
        x: sx,
        y: sy,
        isNearCursor
      };
    });

    // 3. Draw Connection Lines and Data Packets
    computedSatellites.forEach((sat, index) => {
      ctx.save();

      // Line style
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sat.x, sat.y);

      const grad = ctx.createLinearGradient(centerX, centerY, sat.x, sat.y);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      grad.addColorStop(1, sat.isNearCursor ? sat.color : 'rgba(255, 255, 255, 0.12)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = sat.isNearCursor ? 2 : 1;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -time * 10;
      ctx.stroke();
      ctx.restore();
    });

    // 4. Draw Traveling Data Packets
    packets.forEach((packet) => {
      const targetSat = computedSatellites[packet.satelliteIndex];
      if (!targetSat) return;

      packet.progress += packet.speed * packet.direction;
      if (packet.progress > 1) {
        packet.progress = 1;
        packet.direction = -1;
      } else if (packet.progress < 0) {
        packet.progress = 0;
        packet.direction = 1;
      }

      const px = centerX + (targetSat.x - centerX) * packet.progress;
      const py = centerY + (targetSat.y - centerY) * packet.progress;

      ctx.save();
      ctx.fillStyle = targetSat.color;
      ctx.shadowColor = targetSat.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Draw Orbiting Satellites Nodes
    computedSatellites.forEach((sat) => {
      ctx.save();

      // Glow halo
      ctx.shadowColor = sat.color;
      ctx.shadowBlur = sat.isNearCursor ? 20 : 10;

      // Node base circle
      ctx.fillStyle = sat.isNearCursor ? '#101725' : '#0c1017';
      ctx.beginPath();
      const nodeR = sat.isNearCursor ? sat.radius * 1.15 : sat.radius;
      ctx.arc(sat.x, sat.y, nodeR, 0, Math.PI * 2);
      ctx.fill();

      // Border ring
      ctx.strokeStyle = sat.color;
      ctx.lineWidth = sat.isNearCursor ? 2.5 : 1.5;
      ctx.stroke();

      // Satellite Label
      ctx.shadowBlur = 0;
      ctx.fillStyle = sat.isNearCursor ? '#ffffff' : '#e2e8f0';
      ctx.font = `600 ${Math.max(10, Math.round(11 * scaleFactor))}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sat.label, sat.x, sat.y);

      ctx.restore();
    });

    // 6. Draw Central "GANESH" Node
    ctx.save();

    // Pulsing outer ripple ring
    const pulseSize = 48 + Math.sin(time * 2) * 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ambient radial glow behind central node
    const centralGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 60);
    centralGlow.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    centralGlow.addColorStop(0.6, 'rgba(168, 85, 247, 0.15)');
    centralGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = centralGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();

    // Central Node Body
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#060a12';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
    ctx.fill();

    // Central Node Border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Central Text: "GANESH"
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '1px';
    ctx.fillText('GANESH', centerX, centerY);

    ctx.restore();

    animationFrameId = requestAnimationFrame(render);
  }

  render();
})();

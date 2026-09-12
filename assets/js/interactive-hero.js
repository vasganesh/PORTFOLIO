/**
 * Alaguselvaganesh V — Interactive 3D Holographic Engineering Constellation
 * Central Core: "GANESH" with rotating 3D spherical orbits & laser data filaments.
 * Interactive 3D drag rotation, perspective depth, reactive particles, and sound fx.
 */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  // 3D Rotation angles and velocities
  let rotX = 0.2;
  let rotY = 0;
  let velRotX = 0;
  let velRotY = 0.003;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  // Track cursor for ambient attraction
  const mouse = {
    x: -1000,
    y: -1000,
    isOverCanvas: false,
    hoveredNode: null
  };

  // Satellite node definitions with 3D spherical coordinates (theta, phi, radius)
  const nodeDefs = [
    { label: 'React', theta: 0.2, phi: 0.4, r: 180, color: '#00f0ff', accent: 'rgba(0, 240, 255, 0.5)' },
    { label: 'Node.js', theta: 1.1, phi: 1.2, r: 195, color: '#22c55e', accent: 'rgba(34, 197, 94, 0.5)' },
    { label: 'AI', theta: 2.1, phi: 0.6, r: 175, color: '#b05bfb', accent: 'rgba(176, 91, 251, 0.5)' },
    { label: 'Java', theta: 3.3, phi: 1.3, r: 190, color: '#f97316', accent: 'rgba(249, 115, 22, 0.5)' },
    { label: 'Python', theta: 4.2, phi: 0.5, r: 185, color: '#38bdf8', accent: 'rgba(56, 189, 248, 0.5)' },
    { label: 'PostgreSQL', theta: 5.1, phi: 1.5, r: 200, color: '#60a5fa', accent: 'rgba(96, 165, 250, 0.5)' },
    { label: 'Cloud', theta: 1.8, phi: 2.1, r: 170, color: '#fbbf24', accent: 'rgba(251, 191, 36, 0.5)' },
    { label: 'Research', theta: 3.9, phi: 2.4, r: 190, color: '#ec4899', accent: 'rgba(236, 72, 153, 0.5)' }
  ];

  // Particle bursts on node clicks
  const shockwaves = [];

  // Ambient 3D starfield particles
  const stars = [];
  const STAR_COUNT = 65;

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.6 + 0.2
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

    initStars();
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse and Touch Interaction Handlers
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isOverCanvas = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;

    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      velRotY = dx * 0.005;
      velRotX = -dy * 0.005;
      rotY += velRotY;
      rotX += velRotX;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  // Touch handlers for mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      rotY += dx * 0.006;
      rotX += -dy * 0.006;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Click on canvas to spawn shockwave
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    shockwaves.push({
      x: cx,
      y: cy,
      radius: 4,
      maxRadius: 120,
      alpha: 1,
      color: '#00f0ff'
    });

    if (window.playSfx) window.playSfx(580, 'sine', 0.12);
  });

  let time = 0;

  // 3D Point Projection Helper
  function project3D(x, y, z, cx, cy, fov) {
    // Rotate around X
    let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

    // Rotate around Y
    let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);

    const scale = fov / (fov + z2);
    return {
      x2d: cx + x2 * scale,
      y2d: cy + y1 * scale,
      scale: scale,
      z: z2
    };
  }

  function render() {
    time += 0.015;

    // Natural inertia dampening
    if (!isDragging) {
      velRotY *= 0.96;
      velRotX *= 0.96;
      rotY += 0.0035 + velRotY;
      rotX += velRotX;
    }

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const FOV = 420;
    const scaleFactor = width < 480 ? 0.72 : (width < 768 ? 0.86 : 1);

    // 1. Draw Ambient Rotating 3D Stars
    ctx.fillStyle = '#ffffff';
    stars.forEach((star) => {
      const proj = project3D(star.x, star.y, star.z, centerX, centerY, FOV);
      if (proj.scale > 0) {
        ctx.save();
        ctx.globalAlpha = star.alpha * Math.min(1, proj.scale);
        ctx.beginPath();
        ctx.arc(proj.x2d, proj.y2d, Math.max(0.5, star.size * proj.scale), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // 2. Compute 3D Coordinates for Satellite Nodes
    const satellites = nodeDefs.map((def, idx) => {
      // Gentle orbital movement over time
      const currentTheta = def.theta + time * 0.15 * (idx % 2 === 0 ? 1 : -1);
      const currentPhi = def.phi + Math.sin(time * 0.3 + idx) * 0.15;
      const radius = def.r * scaleFactor;

      const x = radius * Math.sin(currentPhi) * Math.cos(currentTheta);
      const y = radius * Math.cos(currentPhi);
      const z = radius * Math.sin(currentPhi) * Math.sin(currentTheta);

      const proj = project3D(x, y, z, centerX, centerY, FOV);

      // Check distance to mouse
      let isHovered = false;
      if (mouse.isOverCanvas) {
        const dist = Math.hypot(mouse.x - proj.x2d, mouse.y - proj.y2d);
        if (dist < 32) isHovered = true;
      }

      return {
        ...def,
        x3d: x,
        y3d: y,
        z3d: z,
        x2d: proj.x2d,
        y2d: proj.y2d,
        scale: proj.scale,
        z: proj.z,
        isHovered
      };
    });

    // 3. Sort Nodes by Depth (Z-Buffer Painter's Algorithm)
    satellites.sort((a, b) => b.z - a.z);

    // 4. Central Core Coordinates
    const coreProj = project3D(0, 0, 0, centerX, centerY, FOV);

    // 5. Draw Laser Connectors & Traveling Data Filaments
    satellites.forEach((sat) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(coreProj.x2d, coreProj.y2d);
      ctx.lineTo(sat.x2d, sat.y2d);

      const grad = ctx.createLinearGradient(coreProj.x2d, coreProj.y2d, sat.x2d, sat.y2d);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
      grad.addColorStop(1, sat.isHovered ? sat.color : 'rgba(255, 255, 255, 0.15)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = sat.isHovered ? 2.5 : Math.max(0.8, 1.2 * sat.scale);
      ctx.stroke();

      // Traveling data spark along laser
      const pulseT = (time * 0.8 + sat.theta) % 1;
      const pulseX = coreProj.x2d + (sat.x2d - coreProj.x2d) * pulseT;
      const pulseY = coreProj.y2d + (sat.y2d - coreProj.y2d) * pulseT;

      ctx.fillStyle = sat.color;
      ctx.shadowColor = sat.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 2.5 * sat.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // 6. Draw Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 3.5;
      sw.alpha = 1 - sw.radius / sw.maxRadius;

      if (sw.alpha <= 0) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${sw.alpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // 7. Draw Satellite Nodes in 3D Depth
    satellites.forEach((sat) => {
      ctx.save();
      const nodeR = (sat.isHovered ? 28 : 22) * sat.scale;

      // Glow halo
      ctx.shadowColor = sat.color;
      ctx.shadowBlur = sat.isHovered ? 26 : 14;

      // Node background
      ctx.fillStyle = sat.isHovered ? '#152136' : '#0a0e16';
      ctx.beginPath();
      ctx.arc(sat.x2d, sat.y2d, nodeR, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Ring border
      ctx.strokeStyle = sat.color;
      ctx.lineWidth = sat.isHovered ? 2.8 : 1.8;
      ctx.stroke();

      // Label with 3D scaling
      ctx.shadowBlur = 0;
      ctx.fillStyle = sat.isHovered ? '#ffffff' : '#e2e8f0';
      const fontSize = Math.max(9, Math.round((sat.isHovered ? 12 : 11) * sat.scale));
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sat.label, sat.x2d, sat.y2d);

      ctx.restore();
    });

    // 8. Draw Central "GANESH" Core
    ctx.save();

    // Pulsing outer halo rings
    const corePulse = 46 + Math.sin(time * 3) * 6;
    ctx.beginPath();
    ctx.arc(coreProj.x2d, coreProj.y2d, corePulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const corePulse2 = 56 + Math.cos(time * 2.2) * 8;
    ctx.beginPath();
    ctx.arc(coreProj.x2d, coreProj.y2d, corePulse2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(176, 91, 251, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();

    // Central Core Sphere
    const radial = ctx.createRadialGradient(coreProj.x2d - 6, coreProj.y2d - 6, 4, coreProj.x2d, coreProj.y2d, 38);
    radial.addColorStop(0, '#00f0ff');
    radial.addColorStop(0.4, '#081a30');
    radial.addColorStop(1, '#03060c');

    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 35;
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(coreProj.x2d, coreProj.y2d, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Core Label: GANESH
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText('GANESH', coreProj.x2d, coreProj.y2d);

    ctx.restore();

    requestAnimationFrame(render);
  }

  render();
})();

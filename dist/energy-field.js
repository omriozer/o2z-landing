// O2Z Energy Field - Inspired by Obot Avatar
// Nodes spawn from center, flow outward, disappear
// Subtle orbital rings hint at the avatar system

(function() {
    'use strict';

    const canvas = document.getElementById('field');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let w, h, centerX, centerY;
    let time = 0;
    const nodes = [];
    const maxNodes = 80;
    const rings = [];

    class EnergyNode {
        constructor() {
            this.reset();
        }

        reset() {
            // Spawn from center
            this.x = centerX;
            this.y = centerY;

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            // Lifecycle
            this.life = 0;
            this.maxLife = 2 + Math.random() * 3; // 2-5 seconds
            this.size = 2 + Math.random() * 3;
            this.opacity = 0;
        }

        update(dt) {
            this.life += dt;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Add drift (organic feel)
            this.vx += (Math.random() - 0.5) * 0.03;
            this.vy += (Math.random() - 0.5) * 0.03;

            // Fade in/out
            if (this.life < 0.3) {
                this.opacity = this.life / 0.3;
            } else if (this.life > this.maxLife - 0.5) {
                this.opacity = (this.maxLife - this.life) / 0.5;
            } else {
                this.opacity = 1;
            }

            // Reset if dead or off-screen
            if (this.life > this.maxLife ||
                this.x < -100 || this.x > w + 100 ||
                this.y < -100 || this.y > h + 100) {
                this.reset();
            }
        }

        draw(isDark) {
            if (this.opacity <= 0) return;

            const color = isDark ? '0, 184, 204' : '0, 120, 180';

            // Glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(${color}, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `rgba(${color}, ${this.opacity * 0.9})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class OrbitalRing {
        constructor(radius, speed) {
            this.radius = radius;
            this.speed = speed;
            this.angle = Math.random() * Math.PI * 2;
            this.opacity = 0.08 + Math.random() * 0.04;
        }

        update(dt) {
            this.angle += this.speed * dt;
        }

        draw(isDark) {
            const color = isDark ? '255, 255, 255' : '10, 10, 10';

            ctx.strokeStyle = `rgba(${color}, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Subtle glow point on ring
            const x = centerX + Math.cos(this.angle) * this.radius;
            const y = centerY + Math.sin(this.angle) * this.radius;

            const accentColor = isDark ? '0, 184, 204' : '0, 120, 180';
            ctx.fillStyle = `rgba(${accentColor}, ${this.opacity * 3})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        centerX = w / 2;
        centerY = h / 2;

        // Reset rings
        rings.length = 0;
        const ringCount = 3;
        const minRadius = Math.min(w, h) * 0.15;
        const maxRadius = Math.min(w, h) * 0.4;

        for (let i = 0; i < ringCount; i++) {
            const radius = minRadius + (maxRadius - minRadius) * (i / (ringCount - 1));
            const speed = (0.0002 + Math.random() * 0.0001) * (i % 2 === 0 ? 1 : -1);
            rings.push(new OrbitalRing(radius, speed));
        }
    }

    // Initialize nodes
    for (let i = 0; i < maxNodes; i++) {
        const node = new EnergyNode();
        node.life = Math.random() * node.maxLife; // Stagger
        nodes.push(node);
    }

    function animate() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Update and draw rings
        rings.forEach(ring => {
            ring.update(0.016);
            ring.draw(isDark);
        });

        // Update and draw nodes
        nodes.forEach(node => {
            node.update(0.016);
            node.draw(isDark);
        });

        // Connect nearby nodes (creates web)
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];

                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * Math.min(n1.opacity, n2.opacity) * 0.3;
                    const color = isDark ? '0, 184, 204' : '0, 120, 180';
                    ctx.strokeStyle = `rgba(${color}, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        }

        time++;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    resize();
    animate();

})();

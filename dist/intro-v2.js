// O2Z Intro - Professional Consciousness Field
// Simple, elegant, powerful

(function() {
    'use strict';

    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, time = 0;
    const particles = [];
    const maxParticles = 200;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();

    // Professional particle system - subtle energy field
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Spawn from center, flow outward
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;

            this.x = w / 2;
            this.y = h / 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 0;
            this.maxLife = 3 + Math.random() * 2;
            this.size = 1 + Math.random() * 2;
        }

        update(dt) {
            this.life += dt;
            this.x += this.vx;
            this.y += this.vy;

            // Add slight drift for organic feel
            this.vx += (Math.random() - 0.5) * 0.02;
            this.vy += (Math.random() - 0.5) * 0.02;

            if (this.life > this.maxLife) {
                this.reset();
            }
        }

        draw() {
            // Fade in then out
            let alpha;
            if (this.life < 0.5) {
                alpha = this.life / 0.5;
            } else if (this.life > this.maxLife - 1) {
                alpha = (this.maxLife - this.life);
            } else {
                alpha = 1;
            }

            // Cyan energy
            const opacity = alpha * 0.4;
            ctx.fillStyle = `rgba(0, 184, 204, ${opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow effect for some particles
            if (Math.random() > 0.95) {
                ctx.fillStyle = `rgba(0, 184, 204, ${opacity * 0.3})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Initialize particles with staggered spawning
    for (let i = 0; i < maxParticles; i++) {
        const p = new Particle();
        p.life = -Math.random() * 2; // Negative life = delayed spawn
        particles.push(p);
    }

    // Logo element (will fade in over particles)
    const logoImg = new Image();
    logoImg.src = '/logo.svg';
    let logoOpacity = 0;
    let logoScale = 0.95;

    function animate() {
        time += 0.016;

        // Dark background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        // Update and draw particles
        particles.forEach(p => {
            p.update(0.016);
            if (p.life > 0) { // Only draw if spawned
                p.draw();
            }
        });

        // Logo fade in (starts at 0.5s, completes by 2s)
        if (time > 0.5 && time < 2) {
            logoOpacity = Math.min(1, (time - 0.5) / 1.5);
            logoScale = 0.95 + (logoOpacity * 0.05); // Subtle scale-up
        } else if (time >= 2) {
            logoOpacity = 1;
            logoScale = 1;
        }

        // Draw logo centered
        if (logoOpacity > 0 && logoImg.complete) {
            ctx.save();
            ctx.globalAlpha = logoOpacity;

            const logoWidth = Math.min(w * 0.6, 600);
            const logoHeight = logoWidth * 0.3; // Approximate aspect ratio

            ctx.translate(w / 2, h / 2);
            ctx.scale(logoScale, logoScale);
            ctx.drawImage(
                logoImg,
                -logoWidth / 2,
                -logoHeight / 2,
                logoWidth,
                logoHeight
            );
            ctx.restore();
        }

        // Fade out entire scene (starts at 3.5s)
        if (time > 3.5) {
            const fadeProgress = Math.min(1, (time - 3.5) / 0.6);
            ctx.fillStyle = `rgba(10, 10, 10, ${fadeProgress})`;
            ctx.fillRect(0, 0, w, h);

            if (fadeProgress >= 1) {
                document.getElementById('loading-screen').classList.add('hidden');
                return; // Stop animation
            }
        }

        requestAnimationFrame(animate);
    }

    // Start when logo is loaded
    logoImg.onload = () => {
        animate();
    };

    // Fallback if logo fails to load
    setTimeout(() => {
        if (!logoImg.complete) {
            animate();
        }
    }, 100);

})();

// O2Z Night Sky - Stars and Shooting Stars
(function() {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.id = 'stars';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let w, h;
    const stars = [];
    const shootingStars = [];
    const starCount = 250;
    const nebulae = [];

    class Star {
        constructor() {
            this.reset();
            this.twinkleOffset = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.001 + Math.random() * 0.002;
            // 30% of stars twinkle more dramatically
            this.twinkleType = Math.random() < 0.3 ? 'dramatic' : 'subtle';
        }

        reset() {
            // Create star clusters - 40% chance of being in a cluster
            if (Math.random() < 0.4 && stars.length > 0) {
                // Near another star (clustering)
                const nearStar = stars[Math.floor(Math.random() * stars.length)];
                const clusterRadius = 150;
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * clusterRadius;
                this.x = nearStar.x + Math.cos(angle) * dist;
                this.y = nearStar.y + Math.sin(angle) * dist;

                // Keep in bounds
                this.x = Math.max(0, Math.min(w, this.x));
                this.y = Math.max(0, Math.min(h, this.y));
            } else {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
            }

            // More size variation - some very small, some larger
            const sizeRandom = Math.random();
            if (sizeRandom < 0.7) {
                this.size = 0.3 + Math.random() * 1; // Tiny stars
            } else if (sizeRandom < 0.95) {
                this.size = 1 + Math.random() * 1.5; // Medium stars
            } else {
                this.size = 2 + Math.random() * 2; // Bright stars
            }

            this.baseOpacity = 0.3 + Math.random() * 0.7;

            // 10% of stars have subtle color tint
            if (Math.random() < 0.1) {
                const colorChoice = Math.random();
                if (colorChoice < 0.5) {
                    this.color = '200, 220, 255'; // Slight blue tint
                } else {
                    this.color = '255, 245, 220'; // Slight warm tint
                }
            } else {
                this.color = '255, 255, 255'; // White
            }
        }

        draw(time) {
            let twinkle;
            if (this.twinkleType === 'dramatic') {
                // Dramatic twinkle: fade to near zero and back
                twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.6 + 0.4;
            } else {
                // Subtle twinkle: slight brightness variation
                twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.2 + 0.8;
            }
            const opacity = this.baseOpacity * twinkle;

            // Glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(${this.color}, ${opacity * 0.9})`);
            gradient.addColorStop(1, `rgba(${this.color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `rgba(${this.color}, ${opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Nebula {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.radius = 100 + Math.random() * 200;
            this.opacity = 0.02 + Math.random() * 0.03;
            this.color = Math.random() < 0.5 ? '100, 150, 255' : '150, 100, 255'; // Blue or purple tint
            this.driftSpeed = 0.05 + Math.random() * 0.1;
            this.driftAngle = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += Math.cos(this.driftAngle) * this.driftSpeed;
            this.y += Math.sin(this.driftAngle) * this.driftSpeed;

            // Wrap around screen
            if (this.x < -this.radius) this.x = w + this.radius;
            if (this.x > w + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = h + this.radius;
            if (this.y > h + this.radius) this.y = -this.radius;
        }

        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${this.color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            // Start from random position in upper portion of screen
            this.x = Math.random() * w;
            this.y = Math.random() * h * 0.3;

            // Random angle (mostly downward and to the side)
            const angle = Math.PI * 0.25 + Math.random() * Math.PI * 0.3;
            const speed = 5 + Math.random() * 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.life = 0;
            this.maxLife = 1 + Math.random() * 1.5; // 1-2.5 seconds
            this.tailLength = 40 + Math.random() * 60;
            this.active = true;
        }

        update(dt) {
            this.life += dt;
            this.x += this.vx;
            this.y += this.vy;

            if (this.life > this.maxLife || this.x < 0 || this.x > w || this.y > h) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;

            // Fade in quickly, fade out slowly
            let opacity;
            if (this.life < 0.2) {
                opacity = this.life / 0.2;
            } else if (this.life > this.maxLife - 0.5) {
                opacity = (this.maxLife - this.life) / 0.5;
            } else {
                opacity = 1;
            }

            // Tail
            const tailX = this.x - this.vx * (this.tailLength / Math.sqrt(this.vx * this.vx + this.vy * this.vy));
            const tailY = this.y - this.vy * (this.tailLength / Math.sqrt(this.vx * this.vx + this.vy * this.vy));

            const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();

            // Head glow
            const headGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6);
            headGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            headGradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.5})`);
            headGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.fillStyle = headGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;

        // Reset stars
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        // Create nebulae (subtle background clouds)
        nebulae.length = 0;
        const nebulaCount = 3 + Math.floor(Math.random() * 3); // 3-5 nebulae
        for (let i = 0; i < nebulaCount; i++) {
            nebulae.push(new Nebula());
        }
    }

    let lastShootingStar = 0;
    function spawnShootingStar(time) {
        // Spawn shooting star every 3-8 seconds
        const minInterval = 3000; // 3 seconds
        const maxInterval = 8000; // 8 seconds
        const timeSinceLastStar = time - lastShootingStar;

        // Calculate next spawn time randomly between min and max
        if (lastShootingStar === 0) {
            lastShootingStar = time;
        } else if (timeSinceLastStar > minInterval) {
            const randomChance = (timeSinceLastStar - minInterval) / (maxInterval - minInterval);
            if (Math.random() < randomChance * 0.02) {
                shootingStars.push(new ShootingStar());
                lastShootingStar = time;
            }
        }
    }

    let time = 0;
    function animate() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Only show in dark mode
        if (!isDark) {
            ctx.clearRect(0, 0, w, h);
            requestAnimationFrame(animate);
            return;
        }

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Draw nebulae (behind stars)
        nebulae.forEach(nebula => {
            nebula.update();
            nebula.draw();
        });

        // Draw stars
        stars.forEach(star => star.draw(time));

        // Update and draw shooting stars
        spawnShootingStar(time);
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const shootingStar = shootingStars[i];
            shootingStar.update(0.016);
            shootingStar.draw();
            if (!shootingStar.active) {
                shootingStars.splice(i, 1);
            }
        }

        time++;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    resize();
    animate();

})();

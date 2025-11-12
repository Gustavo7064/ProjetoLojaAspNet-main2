// home.js – micro interações DreamerGames (slider, parallax, reveal, interactions)
(function () {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

    // ===== Smooth scroll para ofertas =====
    const btnOfertas = $('.hero-buttons .btn-outline');
    const promoSection = $('#ofertas-semana');
    if (btnOfertas && promoSection) {
        btnOfertas.addEventListener('click', (e) => {
            e.preventDefault();
            promoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ===== HERO SLIDER =====
    const slider = $('#hero-slider');
    if (slider) {
        const slides = $$('.hero-slide', slider);
        const dots = $$('.hero-dot', slider);
        const btnPrev = $('.hero-prev', slider);
        const btnNext = $('.hero-next', slider);

        let currentIndex = 0;
        let autoTimer = null;
        const AUTO_DELAY = 7000;

        const updateActive = (index) => {
            if (!slides.length) return;
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentIndex);
                slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === currentIndex);
                dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
            });
        };

        const nextSlide = () => updateActive(currentIndex + 1);
        const prevSlide = () => updateActive(currentIndex - 1);

        const startAuto = () => { stopAuto(); autoTimer = setInterval(nextSlide, AUTO_DELAY); };
        const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

        if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); startAuto(); });
        if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startAuto(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = Number(dot.dataset.index || 0);
                updateActive(idx); startAuto();
            });
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); updateActive(currentIndex + 1); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); updateActive(currentIndex - 1); }
            });
        });

        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { nextSlide(); startAuto(); }
            if (e.key === 'ArrowLeft') { prevSlide(); startAuto(); }
        });

        if (slides.length > 1) startAuto(); else updateActive(0);
    }

    // ===== Gêneros clicáveis =====
    const genreChips = $$('.genre-chip, .hero-pill');
    genreChips.forEach(chip => {
        chip.tabIndex = 0;
        chip.addEventListener('click', () => {
            const genre = (chip.dataset.genre || chip.textContent || '').trim();
            if (genre) window.location.href = '/Jogos?genero=' + encodeURIComponent(genre);
            else window.location.href = '/Jogos';
        });
        chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
        });
    });

    // ===== Press effect para cards =====
    const pressables = [...$$('.game-card'), ...$$('.promo-card'), ...$$('.genre-chip'), ...$$('.hero-pill')];
    pressables.forEach(el => {
        el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
        ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(ev =>
            el.addEventListener(ev, () => el.classList.remove('is-pressed'))
        );
    });

    // ===== Parallax para blobs =====
    const blobs = $$('.bg-blobs .blob');
    if (blobs.length) {
        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            blobs.forEach((blob, index) => {
                const speed = 0.04 + index * 0.03;
                const xOffset = (index % 2 === 0) ? (y * speed * -0.2) : (y * speed * 0.2);
                blob.style.transform = `translate3d(${xOffset}px, ${y * speed}px, 0)`;
            });
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
    }

    // ===== Reveal on scroll =====
    const revealTargets = [...$$('.reveal-on-scroll'), ...$$('.game-card'), ...$$('.promo-card')];
    revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });
        revealTargets.forEach(el => observer.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('is-visible'));
    }

    // ===== Search Enter vai para /Jogos?search=... =====
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim();
                if (q) window.location.href = '/Jogos?search=' + encodeURIComponent(q);
            }
        });
    }

    // ===== SAGAS ICÔNICAS – Carrossel (4 visíveis, anda 1 por clique, infinito) =====
    const carousels = $$('.highlight-carousel');
    carousels.forEach((carousel) => {
        const track = $('.carousel-track', carousel);
        const btnPrev = $('.carousel-btn.prev', carousel);
        const btnNext = $('.carousel-btn.next', carousel);

        if (!track) return;

        const getGap = () => {
            const cs = getComputedStyle(track);
            // "gap" cobrirá row/column; fallback para "columnGap" em navegadores antigos
            const g = parseFloat(cs.gap || cs.columnGap || '0');
            return isNaN(g) ? 0 : g;
        };

        const getStep = () => {
            const first = track.children[0];
            if (!first) return 0;
            const itemWidth = first.getBoundingClientRect().width;
            return itemWidth + getGap(); // largura do item + gap
        };

        let isAnimating = false;

        const toNext = () => {
            if (isAnimating) return; isAnimating = true;
            const step = getStep();
            track.style.transition = 'transform .45s cubic-bezier(.16,.84,.36,1)';
            track.style.transform = `translateX(${-step}px)`;

            const onEnd = () => {
                track.removeEventListener('transitionend', onEnd);
                // move o primeiro para o fim e reseta o transform
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateX(0)';
                // força reflow para limpar
                void track.offsetHeight;
                track.style.transition = '';
                isAnimating = false;
            };
            track.addEventListener('transitionend', onEnd, { once: true });
        };

        const toPrev = () => {
            if (isAnimating) return; isAnimating = true;
            const step = getStep();
            // traz o último para o início e anima voltando
            track.style.transition = 'none';
            track.prepend(track.lastElementChild);
            track.style.transform = `translateX(${-step}px)`;
            void track.offsetHeight; // reflow
            track.style.transition = 'transform .45s cubic-bezier(.16,.84,.36,1)';
            track.style.transform = 'translateX(0)';

            const onEnd = () => {
                track.removeEventListener('transitionend', onEnd);
                isAnimating = false;
            };
            track.addEventListener('transitionend', onEnd, { once: true });
        };

        btnNext && btnNext.addEventListener('click', toNext);
        btnPrev && btnPrev.addEventListener('click', toPrev);

        // teclado (setas) quando o container estiver focado
        carousel.tabIndex = 0;
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') toNext();
            if (e.key === 'ArrowLeft') toPrev();
        });

        // Se redimensionar, só garante que não ficou “travado”
        window.addEventListener('resize', () => {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            void track.offsetHeight;
            track.style.transition = '';
        });
    });

    // small accessibility: allow dots to be focused by keyboard
    $$('.hero-dot').forEach(d => d.tabIndex = 0);
})();

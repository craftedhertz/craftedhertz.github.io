document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }

    function initScrollAnimations() {
        const revealElements = document.querySelectorAll(".gs-reveal");
        revealElements.forEach((elem) => {
            let delay = 0;
            if(elem.classList.contains('delay-1')) delay = 0.2;
            if(elem.classList.contains('delay-2')) delay = 0.4;
            gsap.fromTo(elem, { y: 30, opacity: 0 }, { scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }, y: 0, opacity: 1, duration: 0.8, delay: delay, ease: "power3.out" });
        });

        const revealLeft = document.querySelectorAll(".gs-reveal-left");
        revealLeft.forEach((elem) => {
            gsap.fromTo(elem, { x: -60, opacity: 0 }, { scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }, x: 0, opacity: 1, duration: 1, ease: "power3.out" });
        });

        const revealDown = document.querySelectorAll(".gs-reveal-down");
        revealDown.forEach((elem) => {
            let delay = elem.classList.contains('delay-1') ? 0.2 : 0;
            gsap.fromTo(elem, { y: -40, opacity: 0 }, { scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }, y: 0, opacity: 1, duration: 1, delay: delay, ease: "power3.out" });
        });
    }
    
    initScrollAnimations();

    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    const trackModal = document.getElementById('trackModal');
    const closeModalBtn = document.getElementById('closeModal');
    const mCover = document.getElementById('modalCover');
    const mTitle = document.getElementById('modalTitle');
    const mArtist = document.getElementById('modalArtist');
    const mDesc = document.getElementById('modalDesc');
    const mSpot = document.getElementById('modalSpotify');
    const mYt = document.getElementById('modalYoutube');

    function openModal(track) {
        mCover.src = track.cover;
        mTitle.innerText = track.title;
        mArtist.innerText = track.artist;
        mDesc.innerText = track.description;
        mSpot.href = track.spotify;
        mYt.href = track.youtube;
        trackModal.classList.add('active');
    }

    function closeModal() {
        trackModal.classList.remove('active');
        setTimeout(() => { mCover.src = ''; }, 300);
    }

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(trackModal) trackModal.addEventListener('click', (e) => { if(e.target === trackModal) closeModal(); });

    async function loadCatalog() {
        try {
            const res = await fetch('/catalog.json?t=' + new Date().getTime());
            const data = await res.json();
            
            const latestContainer = document.getElementById('latest-releases-container');
            if (latestContainer) {
                latestContainer.innerHTML = '';
                const latest = data.slice(0, 3);
                latest.forEach((track, index) => {
                    const delayClass = index === 1 ? 'delay-1' : index === 2 ? 'delay-2' : '';
                    const card = document.createElement('div');
                    card.className = `release-card gs-reveal ${delayClass}`;
                    card.innerHTML = `<div class="artwork" style="background-image: url('${track.cover}');"><div class="play-overlay"><span>LISTEN</span></div></div><div class="release-info"><h3>${track.title}</h3><p>${track.artist}</p></div>`;
                    card.addEventListener('click', () => openModal(track));
                    latestContainer.appendChild(card);
                });
            }

            const fullContainer = document.getElementById('full-catalog-container');
            if (fullContainer) {
                fullContainer.innerHTML = '';
                data.forEach((track) => {
                    const card = document.createElement('div');
                    card.className = `release-card gs-reveal`;
                    card.innerHTML = `<div class="artwork" style="background-image: url('${track.cover}');"><div class="play-overlay"><span>LISTEN</span></div></div><div class="release-info"><h3>${track.title}</h3><p>${track.artist}</p></div>`;
                    card.addEventListener('click', () => openModal(track));
                    fullContainer.appendChild(card);
                });
            }
            initScrollAnimations();
        } catch (err) {}
    }

    loadCatalog();

    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('a.nav-link');
        if (link) {
            const url = new URL(link.href);
            if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
                return; 
            }
            if (url.origin === location.origin && link.target !== "_blank") {
                e.preventDefault();
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
                const targetUrl = link.href;
                const mainContent = document.getElementById('page-content');
                mainContent.classList.add('fade-out');
                try {
                    const response = await fetch(targetUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const newContent = doc.getElementById('page-content').innerHTML;
                    
                    if (typeof gtag === 'function') {
                        gtag('config', 'G-G6CNWTSHW6', { 'page_path': url.pathname });
                    }

                    setTimeout(() => {
                        mainContent.innerHTML = newContent;
                        history.pushState({}, "", targetUrl);
                        ScrollTrigger.getAll().forEach(t => t.kill());
                        window.scrollTo(0, 0);
                        if (url.hash) {
                            const targetElement = document.querySelector(url.hash);
                            if (targetElement) window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
                        }
                        mainContent.classList.remove('fade-out');
                        loadCatalog();
                    }, 400); 
                } catch (err) { window.location.href = targetUrl; }
            }
        }
    });

    window.addEventListener('popstate', async () => {
        const mainContent = document.getElementById('page-content');
        mainContent.classList.add('fade-out');
        try {
            const response = await fetch(location.href);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            setTimeout(() => {
                mainContent.innerHTML = doc.getElementById('page-content').innerHTML;
                ScrollTrigger.getAll().forEach(t => t.kill());
                mainContent.classList.remove('fade-out');
                loadCatalog();
            }, 400);
        } catch(err) { window.location.reload(); }
    });

    const cookieBanner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");
    if (!localStorage.getItem("craftedHertzCookies")) { setTimeout(() => { if (cookieBanner) cookieBanner.classList.add("show"); }, 1000); }
    if (acceptBtn) { acceptBtn.addEventListener("click", function() { localStorage.setItem("craftedHertzCookies", "true"); if (cookieBanner) cookieBanner.classList.remove("show"); }); }

    document.body.addEventListener('submit', async (e) => {
        if (e.target.matches('.contact-form')) {
            e.preventDefault();
            const form = e.target;
            const status = form.querySelector('#form-status');
            const btn = form.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('span');
            const originalText = btnText.innerText;
            btnText.innerText = "SENDING...";
            btn.style.pointerEvents = "none";
            const data = new FormData(form);
            try {
                const response = await fetch(form.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) { status.innerText = "MESSAGE SENT SUCCESSFULLY!"; status.style.color = "var(--accent)"; status.style.display = "block"; form.reset(); } 
                else { status.innerText = "ERROR SENDING MESSAGE."; status.style.color = "#ff3333"; status.style.display = "block"; }
            } catch (error) { status.innerText = "ERROR SENDING MESSAGE."; status.style.color = "#ff3333"; status.style.display = "block"; }
            btnText.innerText = originalText;
            btn.style.pointerEvents = "auto";
            setTimeout(() => { status.style.display = "none"; }, 5000);
        }
    });
});

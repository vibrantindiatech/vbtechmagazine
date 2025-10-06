// index.js (Final Working Setup)

// Utility function to load and inject HTML content
function loadComponent(url, selector, callback) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById(selector).innerHTML = data;
            if (typeof callback === "function") callback();
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}

// ----------------------------------------------------
// MAIN LOADING LOGIC
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("/components/header.html", "header", initHeaderAnimations);
    loadComponent("/components/main.html", "main", initMainAnimations);
    loadComponent("/components/footer.html", "footer", initFooterAnimations);
});

// ----------------------------------------------------
// 🎯 HEADER ANIMATIONS (GSAP)
// ----------------------------------------------------
function initHeaderAnimations() {
    const navbar = document.querySelector(".navbar");

    // Scroll shrink effect
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    // GSAP entrance animation
    if (typeof gsap !== "undefined") {
        gsap.timeline()
            .from(".navbar-brand", {
                y: -60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
            .from(".nav-link", {
                y: -20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.7")
            .from(".btn-gradient", {
                scale: 0.8,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.5");
    }
}

// ----------------------------------------------------
// 🌀 MAIN CONTENT ANIMATIONS (AOS + GSAP)
// ----------------------------------------------------
function initMainAnimations() {
    // AOS scroll animations
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            once: true,
            offset: 150
        });
    }

    // GSAP section animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        initGSAPMainAnimations();
    }
}

// GSAP animations for hero, stats, features, issue section
function initGSAPMainAnimations() {
    // Hero timeline
    gsap.timeline()
        .from(".animate-hero-1", { y: 30, opacity: 0, duration: 1, ease: "power3.out" })
        .from(".animate-hero-2", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, 0.2)
        .from(".animate-hero-3", { x: -30, opacity: 0, duration: 0.7, ease: "back.out(1.7)" }, 0.4)
        .from(".animate-hero-4", { x: 30, opacity: 0, duration: 0.7, ease: "back.out(1.7)" }, 0.6);

    // Section titles fade up
    gsap.utils.toArray(".animate-section-title").forEach(title => {
        gsap.from(title, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                once: true
            }
        });
    });

    // Stats counter zoom
    const counters = document.querySelectorAll(".stat-count");
    ScrollTrigger.create({
        trigger: ".stats-container",
        start: "top center",
        once: true,
        onEnter: () => {
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target, 10);
                const needsKPlus = target >= 1000;
                gsap.fromTo(counter, { innerText: 0 }, {
                    innerText: target,
                    duration: 2.5,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate: function () {
                        let value = Math.floor(this.targets()[0].innerText);
                        if (needsKPlus) {
                            counter.textContent = (value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(".0", "") + "K+";
                        } else {
                            counter.textContent = value + "+";
                        }
                    }
                });
            });
        }
    });

    // Feature cards fade
    gsap.utils.toArray(".animate-feature-card").forEach(card => {
        const delay = card.getAttribute("data-delay") || 0;
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: parseFloat(delay),
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                once: true
            }
        });
    });

    // Latest issue section
    const issueSection = document.getElementById("latest-issue-section");
    if (issueSection) {
        gsap.from(".animate-issue-image", {
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: issueSection,
                start: "top 75%",
                once: true
            }
        });
        gsap.from(".animate-issue-content", {
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: issueSection,
                start: "top 75%",
                once: true
            }
        });
    }
}

// ----------------------------------------------------
// ⚙️ FOOTER ANIMATIONS (GSAP + ScrollTrigger)
// ----------------------------------------------------
function initFooterAnimations() {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.timeline({
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom-=100"
            }
        })
            .from(".footer-logo", { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" })
            .from(".footer h5, .footer h6", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.5")
            .from(".footer-link", { x: -20, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.3")
            .from(".footer-social", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.3");
    } else if (typeof gsap !== "undefined") {
        gsap.from("footer", { opacity: 0, duration: 1, ease: "power2.out" });
    }
}

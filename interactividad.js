// --- Modo oscuro ---
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    toggle.textContent =
        document.body.classList.contains("dark")
        ? "Modo claro"
        : "Modo oscuro";
});

// --- Animación suave al hacer scroll ---
window.addEventListener("scroll", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const pos = card.getBoundingClientRect().top;
        if (pos < window.innerHeight - 100) {
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }
    });
});

// Estilos iniciales para animación
document.querySelectorAll(".card").forEach(card => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "0.6s ease";
});

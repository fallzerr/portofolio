document.addEventListener("DOMContentLoaded", () => {
    const tiltElements = document.querySelectorAll("[data-tilt]");
    tiltElements.forEach(element => {
        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = -((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    });
});
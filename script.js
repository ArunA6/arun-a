const spotlight = document.getElementById('spotlight');

if (spotlight) {
  window.addEventListener('mousemove', (e) => {
    spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    spotlight.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.home, .about, .projects, .experience, .contact, .footer');
  
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: Array.from({ length: 101 }, (_, i) => i / 100) // Threshold array from 0 to 1 in increments of 0.01
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.55) {
          entry.target.classList.add('fade-in');
          entry.target.classList.remove('fade-out');
        } else if (entry.intersectionRatio < 0.3) {
          entry.target.classList.add('fade-out');
          entry.target.classList.remove('fade-in');
        }
      });
    }, observerOptions);
  
    sections.forEach(section => {
      section.classList.add('hidden'); // Start with sections hidden
      observer.observe(section);
    });
  });
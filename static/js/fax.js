// script.js
document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const paper = document.getElementById('paper');
  
    // Adjust the paper's position based on the scroll
    paper.style.top = `${-150 + scrollPosition / 5}%`;
    console.log(scrollPosition)
  });
  
let previousWidth = window.innerWidth;

window.addEventListener('resize', function() {
    const currentWidth = this.window.innerWidth;

    if (currentWidth !== previousWidth) {
        details = this.document.getElementsByClassName("project-details")
        for (let i = 0; i < details.length; i++) {
            if (details[i].style.height && details[i].style.height !== 0) {
                details[i].style.height = "auto";
                details[i].style.height = details[i].scrollHeight + "px";
            }
        }
    }
})


function toggleProject(element) {
    const details = element.nextElementSibling; // Get the project-details div
    
    if (details.style.height === "0px" || !details.style.height) {
      details.style.height = details.scrollHeight + "px"; // Set height to content height
      details.style.padding = "15px"; // Add padding to make it look better
    } else {
      details.style.height = "0px"; // Collapse to zero height
      details.style.padding = "0 15px"; // Reduce padding for a smooth effect
    }
  }
  
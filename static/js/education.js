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

function toggle(element) {
    const open = element.nextElementSibling;
    
    if (open.style.height === "0px" || !open.style.height) {
        open.style.height = open.scrollHeight + "px";
        open.style.padding = "15px";
    } else {
        open.style.height = "0px";
        open.style.padding = "0 15px";
    }
}

function toggle2(element) {
    const expand = element.parentNode;
    const open = element.nextElementSibling;

    if (open.style.height === "0px" || !open.style.height) {
        expand.style.height = (parseInt(expand.scrollHeight) + open.scrollHeight) + "px"
    } else {
        expand.style.height = (parseInt(expand.style.height) - open.scrollHeight) + "px";
    }

    toggle(element)
}
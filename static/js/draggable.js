document.querySelectorAll('.draggable').forEach(dragElement);

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector('.draggableheader');
    
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    // Add event listener to resizer for resizing functionality
    const resizer = elmnt.querySelector('.resize-handle');
    if (resizer) {
        resizer.addEventListener('mousedown', initResize);
    }

    // Dragging functionality
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // Resizing functionality
    function initResize(e) {
        e.preventDefault();
        document.onmouseup = stopResize;
        document.onmousemove = resizeElement;
    }

    function resizeElement(e) {
        e.preventDefault();
        const width = e.clientX - elmnt.offsetLeft;
        const height = e.clientY - elmnt.offsetTop;
        elmnt.style.width = width + 'px';
        elmnt.style.height = height + 'px';
    }

    function stopResize() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

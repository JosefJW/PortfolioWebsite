// Typing effect
let i = 0;
let text = "I am passionate about coding, learning new technologies, and building amazing things!";
let speed = 50;

function typeWriter() {
    if (i < text.length) {
        document.querySelector(".typing-text").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
typeWriter();

/*
const funFacts = [
    ""
];

document.getElementById('fun-fact').innerText = funFacts[Math.floor(Math.random() * funFacts.length)];
*/

const slidesData = [
    {
      "image": "eoxlogo.jpg",
      "title": "HDO - Trophy Trucking",
      "deadline": "2024-07-01T00:00:00",
      "active": true
    },
    {
      "image": "eoxlogo.jpg",
      "title": "HDO - Workers Comp",
      "deadline": "2024-06-24T00:00:00",
      "active": true
    },
    {
      "image": "eoxlogo.jpg",
      "title": "True North Feedback",
      "deadline": "2024-06-18T00:00:00",
      "active": false
    }
];

let intervalId;
let currentIndex = 0;
let activeSlides = [];

function pauseResume() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    } else {
        intervalId = setInterval(nextSlide, 5000);
    }
}

function updateCountdown() {
    let now = new Date();
    activeSlides.forEach((slide, index) => {
        let endTime = new Date(slide.deadline);
        let countdownElem = document.getElementById(`countdown-${index + 1}`);
        let countdownLabelElem = document.getElementById(`countdown-label-${index + 1}`);
        let delayedMessageElem = document.querySelector(`.slide:nth-child(${index + 1}) .delayed-message`);
        let slideElement = document.querySelector(`.slide:nth-child(${index + 1})`);

        let countdown = calculateCountdown(now, endTime);
        countdownElem.textContent = countdown.time;
        countdownLabelElem.textContent = countdown.label;

        if (countdown.label === "DELAYED") {
            delayedMessageElem.style.display = "block";
        } else {
            delayedMessageElem.style.display = "none";
        }

        if (countdown.label === "DEADLINE CROSSED") {
            slideElement.remove();
            activeSlides.splice(index, 1);
            currentIndex = currentIndex % activeSlides.length;
            showSlide(currentIndex);
        }
    });
}

function calculateCountdown(now, endTime) {
    let timeDifference = endTime - now;
    if (timeDifference > 0) {
        let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        return {
            time: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            label: 'Time Left'
        };
    } else {
        return {
            time: '',
            label: 'DEADLINE CROSSED'
        };
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % activeSlides.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + activeSlides.length) % activeSlides.length;
    showSlide(currentIndex);
}

function showSlide(index) {
    let slides = document.querySelector('.slides');
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateCountdown();
}

window.onload = function () {
    let slidesContainer = document.querySelector('.slides');
    slidesData.forEach((slide, index) => {
        if (slide.active) {
            let slideElement = document.createElement('div');
            slideElement.classList.add('slide');
            slideElement.innerHTML = `
              <img src="${slide.image}" alt="${slide.title} Logo">
              <h2>${slide.title}</h2>
              <div class="delayed-message">DELAYED</div>
              <div class="countdown" id="countdown-${activeSlides.length + 1}"></div>
              <div class="countdown-label" id="countdown-label-${activeSlides.length + 1}"></div>
              <div class="controls">
                <button onclick="prevSlide()">Previous</button>
                <button onclick="pauseResume()">Pause/Resume</button>
                <button onclick="nextSlide()">Next</button>
              </div>
            `;
            slidesContainer.appendChild(slideElement);
            activeSlides.push(slide);
        }
    });

    updateCountdown();
    intervalId = setInterval(nextSlide, 5000);
};


// ==============================
// Mobile Menu
// ==============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    const isOpen = navLinks.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", isOpen);

    menuBtn.textContent = isOpen ? "✕" : "☰";

});


// Close Menu After Clicking a Link

document.querySelectorAll(".nav-links a").forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("open");

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.textContent = "☰";

    });

});


// Close Menu With Escape

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        navLinks.classList.remove("open");

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.textContent = "☰";

    }

});


// ==============================
// Text To Speech
// ==============================

const textInput = document.getElementById("textInput");

const speakBtn = document.getElementById("speakBtn");

const stopBtn = document.getElementById("stopBtn");

const audioStatus = document.getElementById("audioStatus");


// Check Browser Support

const speechSupported = "speechSynthesis" in window;


// Get Available Arabic Voice

function getArabicVoice() {

    const voices = window.speechSynthesis.getVoices();

    return voices.find(function (voice) {
        return voice.lang.toLowerCase() === "ar-eg";
    }) || voices.find(function (voice) {
        return voice.lang.toLowerCase().startsWith("ar");
    });

}


// Update Available Voices When Loaded

if (speechSupported) {

    window.speechSynthesis.onvoiceschanged = function () {

        window.speechSynthesis.getVoices();

    };

} else {

    audioStatus.textContent =
        "عذراً، المتصفح لا يدعم خاصية تحويل النص إلى صوت.";

    speakBtn.disabled = true;
    stopBtn.disabled = true;

}


// ==============================
// Play Audio
// ==============================

speakBtn.addEventListener("click", function () {

    if (!speechSupported) {

        audioStatus.textContent =
            "المتصفح لا يدعم تشغيل الصوت.";

        return;

    }


    const text = textInput.value.trim();

    if (text === "") {

        audioStatus.textContent =
            "من فضلك اكتب نصاً أولاً.";

        textInput.focus();

        return;

    }


    // Stop Previous Audio

    window.speechSynthesis.cancel();


    // Create New Speech

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "ar-EG";

    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    // Select Arabic Voice If Available

    const arabicVoice = getArabicVoice();

    if (arabicVoice) {

        speech.voice = arabicVoice;

    }


    // Audio Started

    speech.onstart = function () {

        audioStatus.textContent =
            "يتم تشغيل الصوت الآن...";

        speakBtn.disabled = true;

    };


    // Audio Finished

    speech.onend = function () {

        audioStatus.textContent =
            "انتهى تشغيل الصوت بنجاح.";

        speakBtn.disabled = false;

    };


    // Audio Error

    speech.onerror = function (event) {

        speakBtn.disabled = false;

        if (event.error === "canceled" ||
            event.error === "interrupted") {
            return;
        }

        audioStatus.textContent =
            "حدث خطأ أثناء تشغيل الصوت. حاول مرة أخرى.";

    };


    // Start Speaking

    window.speechSynthesis.speak(speech);

});


// ==============================
// Stop Audio
// ==============================

stopBtn.addEventListener("click", function () {

    if (speechSupported) {

        window.speechSynthesis.cancel();

    }

    speakBtn.disabled = false;

    audioStatus.textContent =
        "تم إيقاف الصوت.";

});


// ==============================
// Stop Audio When Leaving Page
// ==============================

window.addEventListener("beforeunload", function () {

    if (speechSupported) {

        window.speechSynthesis.cancel();

    }

});

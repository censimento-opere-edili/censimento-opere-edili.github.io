document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelectorAll(".griglia .foto"),
          previewBox = document.querySelector(".fullimg"),
          previewImg = previewBox.querySelector("img"),
          closeIcon = document.querySelector(".fullimg .x"),
          captionText = document.getElementById("caption"),
          prevBtn = document.querySelector(".prev"),
          nextBtn = document.querySelector(".next"),
          loader = document.querySelector(".loader");

    let currentIndex = 0;
    let touchStartX = 0;
    let isMultiTouch = false;  // Flag per rilevare pinch
    const swipeThreshold = 100;

    function preview(index) {
        currentIndex = index;

        const selectedImg = gallery[index].querySelector("img");
        const thumbSrc = selectedImg.src;
        const largeSrc = thumbSrc.replace("/thumb/", "/large/");

        previewImg.classList.add("loading");
        captionText.classList.add("loading");
        loader.style.display = "block";

        previewImg.onload = () => {
            previewImg.classList.remove("loading");
            captionText.classList.remove("loading");
            loader.style.display = "none";
        };

        previewImg.src = largeSrc;
        captionText.textContent = selectedImg.alt || "Immagine";
        previewBox.classList.add("show");
    }

    gallery.forEach((img, index) => {
        img.addEventListener("click", () => {
            preview(index);
        });
    });

    closeIcon.addEventListener("click", () => {
        previewBox.classList.remove("show");
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            preview(currentIndex - 1);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < gallery.length - 1) {
            preview(currentIndex + 1);
        }
    });

    previewBox.addEventListener("touchstart", (e) => {
        if (e.touches.length > 1) {
            isMultiTouch = true; // Più dita = pinch attivo
        } else {
            isMultiTouch = false;
            touchStartX = e.touches[0].clientX;
        }
    });

    previewBox.addEventListener("touchend", (e) => {
        if (isMultiTouch) return; // Ignora swipe se pinch attivo

        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) > swipeThreshold) {
            if (distance > 0 && currentIndex > 0) {
                preview(currentIndex - 1); // swipe destra
            } else if (distance < 0 && currentIndex < gallery.length - 1) {
                preview(currentIndex + 1); // swipe sinistra
            }
        }
    });
});
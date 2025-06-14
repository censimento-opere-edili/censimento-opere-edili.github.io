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
    let touchStartY = 0;
    let isMultiTouch = false;
    const swipeThreshold = 100;
    const verticalThreshold = 100;

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
            isMultiTouch = true;
        } else {
            isMultiTouch = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    });

    previewBox.addEventListener("touchend", (e) => {
        if (isMultiTouch) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const distX = touchEndX - touchStartX;
        const distY = touchEndY - touchStartY;

        if (Math.abs(distX) > Math.abs(distY)) {
            // swipe orizzontale
            if (Math.abs(distX) > swipeThreshold) {
                if (distX > 0 && currentIndex > 0) {
                    preview(currentIndex - 1);
                } else if (distX < 0 && currentIndex < gallery.length - 1) {
                    preview(currentIndex + 1);
                }
            }
        } else {
            // swipe verticale
            if (distY < -verticalThreshold) {
                previewBox.classList.remove("show"); // swipe verso l'alto
            }
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelectorAll(".griglia .foto"),
          previewBox = document.querySelector(".fullimg"),
          previewImg = previewBox.querySelector("img"),
          closeIcon = document.querySelector(".fullimg .x"),
          captionText = document.getElementById("caption"),
          prevBtn = document.querySelector(".prev"),
          nextBtn = document.querySelector(".next");

    let currentIndex = 0;
    let clickImgIndex = 0;

   function preview(index) {
  const selectedImg = gallery[index].querySelector("img");
  const thumbSrc = selectedImg.src;
  const largeSrc = thumbSrc.replace("/thumb/", "/large/");
  
  previewImg.classList.add("loading");
  captionText.classList.add("loading");
  document.querySelector(".loader").style.display = "block";

  previewImg.onload = () => {
    previewImg.classList.remove("loading");
    captionText.classList.remove("loading");
    document.querySelector(".loader").style.display = "none";
  };

  previewImg.src = largeSrc;
  captionText.textContent = selectedImg.alt;

  prevBtn.style.display = (index === 0) ? "none" : "block";
  nextBtn.style.display = (index >= gallery.length - 1) ? "none" : "block";
}

    gallery.forEach((item, i) => {
        item.onclick = () => {
            currentIndex = i;
            clickImgIndex = i;
            preview(currentIndex);
            previewBox.classList.add("show");
        }
    });

    prevBtn.onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            preview(currentIndex);
        }
    };

    nextBtn.onclick = () => {
        if (currentIndex < gallery.length - 1) {
            currentIndex++;
            preview(currentIndex);
        }
    };

    closeIcon.onclick = () => {
        previewBox.classList.remove("show");
        currentIndex = clickImgIndex; 
    };

    let touchStartX = 0;
    let touchEndX = 0;

    previewBox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    previewBox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchEndX < touchStartX - 40) {
            if(currentIndex < gallery.length - 1) {
                currentIndex++;
                preview(currentIndex);
            }
        }
        if (touchEndX > touchStartX + 40) {
            if(currentIndex > 0) {
                currentIndex--;
                preview(currentIndex);
            }
        }
    }
});
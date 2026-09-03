document.addEventListener("DOMContentLoaded", () => {

    const galleryItems = document.querySelectorAll(".griglia .foto");
    const previewBox = document.querySelector(".fullimg");
    const previewImg = previewBox.querySelector("img");
    const closeBtn = previewBox.querySelector(".x");
    const caption = document.getElementById("caption");
    const prevBtn = previewBox.querySelector(".prev");
    const nextBtn = previewBox.querySelector(".next");
    const loader = previewBox.querySelector(".loader");

    let currentIndex = 0;

    let touchStartX = 0;
    let touchStartY = 0;
    let isMultiTouch = false;

    let scrollPosition = 0;

    // Indica se la galleria è attualmente aperta
    let galleryOpen = false;

    const SWIPE_THRESHOLD = 100;
    const VERTICAL_THRESHOLD = 100;


    /*
    ============================================================
    APERTURA GALLERIA
    ============================================================
    */

    const showPreview = (index) => {

        currentIndex = index;

        const img = galleryItems[index].querySelector("img");

        const largeSrc = img.src.replace("/thumb/", "/large/");


        /*
        --------------------------------------------------------
        BLOCCO SCROLL
        --------------------------------------------------------
        */

        if (!galleryOpen) {

            scrollPosition =
                window.pageYOffset ||
                document.documentElement.scrollTop;

            document.body.style.top = `-${scrollPosition}px`;

            document.body.classList.add("noscroll");
        }


        /*
        --------------------------------------------------------
        CARICAMENTO IMMAGINE
        --------------------------------------------------------
        */

        loader.style.display = "block";

        previewImg.classList.add("loading");
        caption.classList.add("loading");


        previewImg.onload = () => {

            previewImg.classList.remove("loading");
            caption.classList.remove("loading");

            loader.style.display = "none";
        };


        previewImg.src = largeSrc;

        caption.textContent = img.alt || "Immagine";


        /*
        --------------------------------------------------------
        APERTURA VISIVA
        --------------------------------------------------------
        */

        previewBox.classList.add("show");


        /*
        --------------------------------------------------------
        HISTORY
        --------------------------------------------------------

        Aggiungiamo una sola entry quando la galleria
        viene aperta.

        Cambiare foto NON modifica la history.
        */

        if (!galleryOpen) {

            history.pushState(
                {
                    gallery: true
                },
                "",
                window.location.href
            );

            galleryOpen = true;
        }
    };


    /*
    ============================================================
    CHIUSURA VISIVA
    ============================================================
    */

    const hidePreview = () => {

        previewBox.classList.remove("show");

        document.body.classList.remove("noscroll");

        document.body.style.top = "";

        window.scrollTo(0, scrollPosition);

        galleryOpen = false;
    };


    /*
    ============================================================
    CHIUSURA GALLERIA
    ============================================================

    Questa funzione NON chiude direttamente la galleria.

    Chiede al browser di tornare indietro nella history.

    Il successivo "popstate" si occuperà della chiusura.
    ============================================================
    */

    const closePreview = () => {

        if (!galleryOpen) {
            return;
        }

        history.back();
    };


    /*
    ============================================================
    CLICK SULLE FOTO
    ============================================================
    */

    galleryItems.forEach((item, index) => {

        item.addEventListener("click", () => {

            showPreview(index);

        });

    });


    /*
    ============================================================
    PULSANTE X
    ============================================================
    */

    closeBtn.addEventListener("click", () => {

        closePreview();

    });


    /*
    ============================================================
    TASTO INDIETRO ANDROID / IPHONE / BROWSER
    ============================================================

    Quando l'utente preme il tasto Indietro:

        history
              ↓
        popstate
              ↓
        chiudi galleria

    NON richiamiamo history.back() qui.
    ============================================================
    */

    window.addEventListener("popstate", () => {

        if (galleryOpen) {

            hidePreview();

        }

    });


    /*
    ============================================================
    FOTO PRECEDENTE
    ============================================================
    */

    prevBtn.addEventListener("click", () => {

        if (currentIndex > 0) {

            showPreview(currentIndex - 1);

        }

    });


    /*
    ============================================================
    FOTO SUCCESSIVA
    ============================================================
    */

    nextBtn.addEventListener("click", () => {

        if (currentIndex < galleryItems.length - 1) {

            showPreview(currentIndex + 1);

        }

    });


    /*
    ============================================================
    TOUCH START
    ============================================================
    */

    previewBox.addEventListener("touchstart", (e) => {

        isMultiTouch = e.touches.length > 1;

        if (!isMultiTouch) {

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;

        }

    });


    /*
    ============================================================
    TOUCH END
    ============================================================
    */

    previewBox.addEventListener("touchend", (e) => {

        if (isMultiTouch) {
            return;
        }


        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;


        /*
        --------------------------------------------------------
        SWIPE ORIZZONTALE
        --------------------------------------------------------
        */

        if (Math.abs(deltaX) > Math.abs(deltaY)) {

            if (Math.abs(deltaX) > SWIPE_THRESHOLD) {

                // Swipe verso destra
                if (
                    deltaX > 0 &&
                    currentIndex > 0
                ) {

                    showPreview(currentIndex - 1);

                }


                // Swipe verso sinistra
                else if (
                    deltaX < 0 &&
                    currentIndex < galleryItems.length - 1
                ) {

                    showPreview(currentIndex + 1);

                }

            }

        }


        /*
        --------------------------------------------------------
        SWIPE VERTICALE
        --------------------------------------------------------
        */

        else if (deltaY < -VERTICAL_THRESHOLD) {

            closePreview();

        }

    });

});
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    let supportedFileType = dropZoneElement.getElementsByTagName("input")[0].accept;
    if (!file.name.endsWith(supportedFileType)) {
        alert("Only supports " + supportedFileType);
        return;
    }

    // First time - disable the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        $(dropZoneElement.querySelector(".drop-zone__prompt")).removeClass("d-flex").addClass("d-none");
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        $(thumbnailElement).add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    } else {
        $(thumbnailElement).removeClass("d-none");
    }

    thumbnailElement.getElementsByTagName("label")[0].innerHTML = file.name;
}

/**
 * Reset a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 */
function resetDropZone(dropZoneElement) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - enable the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        $(dropZoneElement.querySelector(".drop-zone__prompt")).removeClass("d-none").addClass("d-flex");
    }

    $(thumbnailElement).addClass("d-none");

    // thumbnailElement.dataset.label = file.name;
    thumbnailElement.getElementsByTagName("label")[0].innerHTML = '';

    // remove file from drop zone input
    dropZoneElement.getElementsByTagName("input")[0].value = '';
}

// $(document).ready(function () {
//   var pg = thisPage();
//   pg.init();
// });
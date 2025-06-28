document.addEventListener("DOMContentLoaded", function() {
    const runShowPlayerElement = document.getElementById('runShowPlayer');
    runShowPlayerElement?.addEventListener('click', showPlayer);
});

function showPlayer() {
    var playerPreview = document.getElementById("player-preview");
    /** @type {HTMLIFrameElement} */
    var player = document.getElementById("player");
    if (playerPreview) {
        playerPreview.parentElement.removeChild(playerPreview);
    }
    player.style.display = "block";

    // Clear the iframe before using it
    player.removeAttribute("src");
    player.src = "about:blank";

    // Get code from textarea
    var code = document.getElementById("basic-code").value;
    console.log('code', code);
    var blob = new Blob([code], { type: "text/plain" });
    var dataUrl = URL.createObjectURL(blob);

    player.setAttribute("src", "package/index.html?p=" + dataUrl);
    player.focus();
}
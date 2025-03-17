const loadingScreen = {
    show() {
        document.body.classList.remove('loaded');
        const existingLoadingScreen = document.querySelector('.loading-screen');
        if (existingLoadingScreen) return;

        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
    <div class="loading-content">
        <img src="${chrome.runtime.getURL('images/loading.gif')}" alt="Firka" class="loading-logo">
        <div class="loading-text">Betöltés alatt...</div>
        <div class="loading-text2">Kis türelmet!</div>
    </div>
    `;
        document.body.appendChild(loadingScreen);
        document.body.classList.add('loaded');
    },

    hide() {
        document.body.classList.add('loaded');
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.remove();
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const manifest = chrome.runtime.getManifest();
    const urls = [];

    if (manifest.content_scripts) {
        manifest.content_scripts.forEach(script => {
            if (script.matches) {
                urls.push(...script.matches);
            }
        });
    }

    if (urls.some(url => url.includes(location.pathname))) {
        loadingScreen.show();
    }
});
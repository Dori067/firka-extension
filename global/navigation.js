const COOKIE_KEYS = {
    SCHOOL_NAME: 'schoolName',
    SCHOOL_CODE: 'schoolCode',
    USER_NAME: 'userName',
    SCHOOL_SUBDOMAIN: 'schoolSubdomain'
};

const DEFAULT_VALUES = {
    SCHOOL: 'Iskola',
    USER: 'Felhasználó',
    TIMER: '45:00'
};

const cookies = {
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }
};




function updateHeaderInfo() {
    const schoolName = document.querySelector('.nav-school-name');
    const userName = document.querySelector('.nav-user-name');
    const logoutTimer = document.querySelector('.nav-logout-timer');
    
    const userData = {
        schoolName: cookies.getCookie(COOKIE_KEYS.SCHOOL_NAME) || DEFAULT_VALUES.SCHOOL,
        schoolId: cookies.getCookie(COOKIE_KEYS.SCHOOL_CODE) || '',
        name: cookies.getCookie(COOKIE_KEYS.USER_NAME) || DEFAULT_VALUES.USER,
        time: document.querySelector('.usermenu_timer')?.textContent?.trim() || DEFAULT_VALUES.TIMER
    };
    
    if (schoolName) {
        schoolName.textContent = `${userData.schoolId} - ${userData.schoolName}`;
    }
    
    if (userName) {
        userName.textContent = userData.name;
    }
    
    if (logoutTimer) {
        startLogoutTimer(userData.time);
    }
}

function startLogoutTimer(timeString) {
    const startTime = parseInt(timeString?.match(/\d+/)?.[0] || "45");
    let timeLeft = startTime * 60;
    const timerElement = document.querySelector('.nav-logout-timer');
    
    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            window.location.href = '/Home/Logout';
        }
        timeLeft--;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}


document.addEventListener('DOMContentLoaded', () => {
    updateHeaderInfo();
});

function setupUserDropdown() {
    const userBtn = document.querySelector('.user-dropdown-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    userBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        userDropdown?.classList.remove('show');
    });
}

function setupSettingsButton() {
    document.getElementById('settingsBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = chrome.runtime.getURL('settings/index.html');
        window.open(url, '_blank', 'width=400,height=600');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    updateHeaderInfo();
    setupUserDropdown();
    setupSettingsButton();
});

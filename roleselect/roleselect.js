(() => {
  
  const setCookie = (name, value, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; domain=.e-kreta.hu`;
  };

  const startLogoutTimer = () => {
    let timeLeft = 45 * 60;
    const timerElement = document.getElementById('logoutTimer');
    
    const updateTimer = () => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      
      if (timerElement) {
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      
      timeLeft <= 0 ? window.location.href = '/Home/Logout' : timeLeft--;
    };

    updateTimer();
    return setInterval(updateTimer, 1000);
  };

  const handleRoleChange = async (role) => {
    try {
      const response = await fetch('/Adminisztracio/SzerepkorValaszto/ChangeRole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Role: role })
      });
      
      const data = await response.json();
      if (data.Success) {
        window.location.assign(data.Url);
      } else {
        throw new Error('Role change failed');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Hiba történt a szerepkör váltása közben.');
    }
  };

  const createHTML = (schoolCode, fullSchoolName, userName) => `
    <div class="kreta-container">
      <header class="kreta-header">
        <div class="school-info">
          <p class="logo-text">
            <img src=${chrome.runtime.getURL('images/firka_logo.png')} alt="Firka" class="logo">
            Firka
          </p>
          <div class="school-details">
            <span>${schoolCode || ''} - ${fullSchoolName || 'Iskola'}</span>
          </div>
        </div>
        <div class="user-profile">
          <div class="user-info">
            <span class="user-name">${userName}</span>
            <span class="logout-timer" id="logoutTimer">5:00</span>
          </div>
        </div>
      </header>

       <main class="role-container">
        <div class="role-grid">
          <div class="main-role">
            <div class="role-card" data-role="Ellenorzo">
              <div class="role-icon">
                <img src="${chrome.runtime.getURL('icons/naplo.svg')}" alt="Napló ikon">
              </div>
              <div class="role-text">
                Ellenőrzőkönyv
                <div class="role-description">Jegyek, hiányzások, órarended és egyéb információk megtekintése.</div>
              </div>
            </div>
          </div>

          <div class="side-roles">
            <div class="role-card" data-role="DKT">
              <div class="role-icon">
                <img src="${chrome.runtime.getURL('icons/dkt.svg')}" alt="DKT ikon">
              </div>
              <div class="role-text">
                Digitális Kollaborációs Tér (DKT)
                <div class="role-description">Osztálytermi kommunikáció és feladatok.</div>
              </div>
            </div>

            <div class="role-card logout-card">
              <div class="role-icon">
                <img src="${chrome.runtime.getURL('icons/logout.svg')}" alt="Kijelentkezés ikon">
              </div>
              <div class="role-text">
                Kijelentkezés
                <div class="role-description">Kilépés a rendszerből</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  const transformRoleSelectPage = async () => {
    try {
      if (document.readyState !== 'complete') {
        await new Promise(resolve => window.addEventListener('load', resolve));
      }

      
      const schoolNameEl = document.querySelector('.IntezmenyNev');
      const schoolName = schoolNameEl?.textContent.trim() || 'Iskola neve';
      const [schoolCode, fullSchoolName] = schoolName.split(' - ');

      
      const schoolSubdomain = window.location.hostname.split('.')[0];

      const userNameEl = document.querySelector('.UserName');
      const userName = userNameEl?.textContent.trim() || 'Felhasználónév';

      
      if (schoolCode && fullSchoolName) {
        setCookie('schoolCode', schoolCode);
        setCookie('schoolName', fullSchoolName);
        setCookie('schoolSubdomain', schoolSubdomain);
      }
      if (userName) {
        setCookie('userName', userName);
      }

      
      document.body.innerHTML = createHTML(schoolCode, fullSchoolName, userName);

      
      const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Figtree:wght@300..900&display=swap', rel: 'stylesheet' }
      ];

      links.forEach(link => {
        const linkElement = document.createElement('link');
        Object.entries(link).forEach(([key, value]) => linkElement[key] = value);
        document.head.appendChild(linkElement);
      });

      
      const timerInterval = startLogoutTimer();

      
      document.querySelector('.role-card[data-role="Ellenorzo"]')?.addEventListener('click', () => {
        handleRoleChange('Ellenorzo');
      });

      document.querySelector('.role-card[data-role="DKT"]')?.addEventListener('click', () => {
        window.location.href = '/Adminisztracio/BelepesKezelo/DKTTanuloOrGondviselo';
      });

      document.querySelector('.logout-card')?.addEventListener('click', async () => {
        try {
          clearInterval(timerInterval);
          await fetch('/Home/LogOut', { method: 'POST' });
        } catch {
          window.location.replace("https://idp.e-kreta.hu/Account/Logout");
        } finally {
          window.location.replace("https://idp.e-kreta.hu/Account/Logout");
        }
      });

    } catch (error) {
      console.error('Error transforming page:', error);
    }
  };

  
  if (window.location.href.includes('/Adminisztracio/BelepesKezelo')) {
    transformRoleSelectPage();
  }
})();
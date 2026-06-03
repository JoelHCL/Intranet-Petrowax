// ==================== RECURSOS POWER BI ====================
const resources = {
    otif: { type: 'report', name: 'OTIF', icon: '📦', description: 'On-Time In-Full<br>Desempeño de entregas',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiOTMzYTY4NmYtOGM1ZC00YzNhLTlmYTQtZjg4MGEwZGIyYWMwIiwidCI6IjA2ZjZlNmQ4LWY0OWMtNDZiZC1hYmIyLTE3YTY5YzU3NGNjYyJ9' },
    metricas: { type: 'report', name: 'Métricas', icon: '📈', description: 'Indicadores clave<br>y análisis de negocio',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiNGQ4YjQ4ZmYtMGI3ZC00ZGI0LThkNGYtMjIzZGRjZjVkODkyIiwidCI6IjA2ZjZlNmQ4LWY0OWMtNDZiZC1hYmIyLTE3YTY5YzU3NGNjYyJ9' },
    inventario: { type: 'report', name: 'Inventario', icon: '🗒️', description: 'Indicador de<br>existencias',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiNTMwMjVjYWEtNWQ5ZC00ZDY1LWFjMzUtNTdhZTkzNzUxYTk5IiwidCI6IjA2ZjZlNmQ4LWY0OWMtNDZiZC1hYmIyLTE3YTY5YzU3NGNjYyJ9' },
    metricasVentas: { type: 'report', name: 'Métricas de Ventas', icon: '📊', description: 'Análisis de ventas<br>y rendimiento comercial',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiMGU2NzJhNDktOTVhZC00Y2Y5LWI1YTctZGZlNjFmMWQxMjEwIiwidCI6IjA2ZjZlNmQ4LWY0OWMtNDZiZC1hYmIyLTE3YTY5YzU3NGNjYyJ9' }
};

// ==================== MANUALES ====================
const manualesData = [
   //{ area: "Almacén", nombre: "Manual para alta de depósitos", archivo: "Almacén-Manual para alta de depositos.pdf", tamaño: "3,975 KB" },
   //{ area: "Almacén", nombre: "Proceso Transporte App V.3", archivo: "App Almacén-Proceso Transporte V.3.pdf", tamaño: "180 KB" },
    //{ area: "Mesa de control", nombre: "Documentación Power BI Métricas", archivo: "Mesa de control-Documentacion_PowerBI_Metricas.pdf", tamaño: "3,884 KB" }
];

const manualesPorArea = {};
manualesData.forEach(manual => {
    if (!manualesPorArea[manual.area]) manualesPorArea[manual.area] = [];
    manualesPorArea[manual.area].push(manual);
});

// ==================== PERMISOS DE USUARIOS Y CONTRASEÑAS POR DEFECTO ====================
const defaultPasswords = {
    almacen: '12345',
    ventas: 'ventas1',
    'mesa de control': '13579',
    gerente: '13579',
    admin: '2235',
    gina: 'control',
    perla: 'logistica',
    luiscruz: 'luiscruz2024',
    claudia: 'claudia2024',
    joselara: 'joselara2024'
};

const userPermissions = {
    almacen: ['otif', 'metricas',],
    ventas: ['otif', 'metricasVentas'],
    'mesa de control': ['otif', 'metricas', 'inventario', 'metricasVentas'],
    gerente: ['otif', 'metricas', 'inventario', 'metricasVentas'],
    admin: ['otif', 'metricas', 'inventario', 'metricasVentas'],
    gina: ['otif', 'metricas','metricasVentas'],
    perla: ['metricas','otif','metricasVentas'],
    luiscruz: ['otif', 'metricas'],
    claudia: ['otif', 'metricas','metricasVentas'],
    joselara: ['otif', 'metricas','metricasVentas']
};

// ---------------------- FUNCIONES DE CONTRASEÑA (con localStorage) ----------------------
function getStoredPassword(username) {
    const custom = localStorage.getItem(`customPassword_${username}`);
    if (custom) return custom;
    return defaultPasswords[username];
}

function setStoredPassword(username, newPassword) {
    localStorage.setItem(`customPassword_${username}`, newPassword);
}

function verifyPassword(username, password) {
    return getStoredPassword(username) === password;
}

// ---------------------- ESTADO ----------------------
let currentUser = null;
let currentResource = null;

// ---------------------- DOM ELEMENTS ----------------------
const menuScreen = document.getElementById('menuScreen');
const navBar = document.getElementById('navBar');
const iframeWrapper = document.getElementById('iframeWrapper');
const dynamicIframe = document.getElementById('dynamicIframe');
const cardsContainer = document.getElementById('cardsContainer');
const dynamicNavButtons = document.getElementById('dynamicNavButtons');
const loginModal = document.getElementById('loginModal');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginError = document.getElementById('loginError');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalLoginBtn = document.getElementById('modalLoginBtn');
const btnMenuInicio = document.getElementById('btnMenuInicio');
const btnLogout = document.getElementById('btnLogout');
const btnManuales = document.getElementById('btnManuales');
const btnCambiarPassword = document.getElementById('btnCambiarPassword');
const manualModal = document.getElementById('manualModal');
const manualesListado = document.getElementById('manualesListado');
const btnCerrarManual = document.getElementById('btnCerrarManual');

// Elementos del modal de cambio de contraseña
const cambioModal = document.getElementById('cambioPasswordModal');
const cambioUsernameSpan = document.getElementById('cambioUsername');
const currentPassInput = document.getElementById('currentPass');
const newPassInput = document.getElementById('newPass');
const confirmNewPassInput = document.getElementById('confirmNewPass');
const cambioError = document.getElementById('cambioError');
const cambioCancelBtn = document.getElementById('cambioCancelBtn');
const cambioConfirmBtn = document.getElementById('cambioConfirmBtn');

// ---------------------- FUNCIONES PRINCIPALES ----------------------
function isValidUser(username) {
    return defaultPasswords.hasOwnProperty(username);
}

function getAllowedResources(username) {
    return userPermissions[username] || [];
}

function showLoginModal() {
    loginUser.value = '';
    loginPass.value = '';
    loginError.innerText = '';
    loginModal.classList.add('active');
}

function hideLoginModal() {
    loginModal.classList.remove('active');
}

function loadResource(resourceId) {
    if (!currentUser) return false;
    const resource = resources[resourceId];
    if (!resource) return false;
    if (resource.type === 'report') {
        let url = resource.url;
        if (currentUser === 'perla' && resourceId === 'metricas') {
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}navContentPaneEnabled=false`;
        }
        dynamicIframe.src = url;
        dynamicIframe.title = resource.name;
        currentResource = resourceId;
        menuScreen.style.display = 'none';
        iframeWrapper.classList.add('visible');
        navBar.classList.add('visible');
    }
    return true;
}

function renderMenuCards() {
    if (!currentUser) return;
    const allowed = getAllowedResources(currentUser);
    cardsContainer.innerHTML = '';
    allowed.forEach(resId => {
        const res = resources[resId];
        if (res) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<div class="card-icon">${res.icon}</div><h3>${res.name}</h3><p>${res.description}</p>`;
            card.addEventListener('click', () => {
                if (currentResource === resId && res.type === 'report') return;
                loadResource(resId);
            });
            cardsContainer.appendChild(card);
        }
    });
}

function renderNavButtons() {
    if (!currentUser) return;
    const allowed = getAllowedResources(currentUser);
    dynamicNavButtons.innerHTML = '';
    allowed.forEach(resId => {
        const res = resources[resId];
        if (res && res.type === 'report') {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.innerHTML = `${res.icon} ${res.name}`;
            btn.addEventListener('click', () => {
                if (currentResource !== resId) loadResource(resId);
            });
            dynamicNavButtons.appendChild(btn);
        }
    });
}

function mostrarManuales() {
    if (!currentUser) {
        alert("Debes iniciar sesión primero.");
        return;
    }
    let html = '';
    for (const [area, manuales] of Object.entries(manualesPorArea)) {
        html += `<h3 style="margin-top: 1rem; background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 0.5rem;">📁 ${area}</h3>`;
        html += `<table style="width:100%; margin-bottom: 1rem;">`;
        html += `<thead><tr><th>Nombre</th><th>Fecha modificación</th><th>Tipo</th><th>Tamaño</th></tr></thead><tbody>`;
        manuales.forEach(manual => {
            const urlPDF = `Manuales/${encodeURIComponent(manual.archivo)}`;
            html += `<tr onclick="window.open('${urlPDF}', '_blank')">
                        <td>📄 ${manual.nombre}</td>
                        <td>05/05/2026</td><td>PDF</td><td>${manual.tamaño}</td>
                      </tr>`;
        });
        html += `</tbody></table>`;
    }
    manualesListado.innerHTML = html;
    manualModal.classList.add('active');
}

function cerrarManuales() {
    manualModal.classList.remove('active');
}

// Cambio de contraseña
function mostrarModalCambioPassword() {
    if (!currentUser) return;
    cambioUsernameSpan.innerText = currentUser;
    currentPassInput.value = '';
    newPassInput.value = '';
    confirmNewPassInput.value = '';
    cambioError.innerText = '';
    cambioModal.classList.add('active');
}

function ocultarModalCambioPassword() {
    cambioModal.classList.remove('active');
}

function handleCambioPassword() {
    const currentPass = currentPassInput.value;
    const newPass = newPassInput.value;
    const confirmPass = confirmNewPassInput.value;

    if (!currentPass || !newPass || !confirmPass) {
        cambioError.innerText = '❌ Todos los campos son obligatorios';
        return;
    }
    if (newPass.length < 4) {
        cambioError.innerText = '❌ La nueva contraseña debe tener al menos 4 caracteres';
        return;
    }
    if (newPass !== confirmPass) {
        cambioError.innerText = '❌ La nueva contraseña y la confirmación no coinciden';
        return;
    }
    if (!verifyPassword(currentUser, currentPass)) {
        cambioError.innerText = '❌ Contraseña actual incorrecta';
        return;
    }
    // Guardar nueva contraseña
    setStoredPassword(currentUser, newPass);
    ocultarModalCambioPassword();
    alert('✅ Contraseña actualizada correctamente. Serás redirigido para iniciar sesión nuevamente.');
    // Cerrar sesión para forzar ingreso con nueva contraseña
    logoutAndGoToMenu();
}

function logoutAndGoToMenu() {
    currentUser = null;
    currentResource = null;
    dynamicIframe.src = 'about:blank';
    navBar.classList.remove('visible');
    iframeWrapper.classList.remove('visible');
    menuScreen.style.display = 'flex';
    cardsContainer.innerHTML = '';
    dynamicNavButtons.innerHTML = '';
    hideLoginModal();
    ocultarModalCambioPassword();
    showLoginModal();
}

function attemptLogin() {
    const username = loginUser.value.trim().toLowerCase();
    const password = loginPass.value;
    if (!username || !password) {
        loginError.innerText = '❌ Ingrese usuario y contraseña';
        return;
    }
    if (!isValidUser(username)) {
        loginError.innerText = '❌ Usuario no registrado';
        return;
    }
    if (!verifyPassword(username, password)) {
        loginError.innerText = '❌ Contraseña incorrecta';
        return;
    }
    currentUser = username;
    hideLoginModal();
    renderMenuCards();
    renderNavButtons();
    menuScreen.style.display = 'flex';
    iframeWrapper.classList.remove('visible');
    navBar.classList.remove('visible');
    dynamicIframe.src = 'about:blank';
    currentResource = null;
}

// ---------------------- EVENTOS ----------------------
btnMenuInicio.addEventListener('click', () => {
    if (currentUser) {
        menuScreen.style.display = 'flex';
        iframeWrapper.classList.remove('visible');
        navBar.classList.remove('visible');
        renderMenuCards();
        renderNavButtons();
        dynamicIframe.src = 'about:blank';
        currentResource = null;
    } else {
        logoutAndGoToMenu();
    }
});

btnLogout.addEventListener('click', logoutAndGoToMenu);
btnManuales.addEventListener('click', mostrarManuales);
btnCerrarManual.addEventListener('click', cerrarManuales);
btnCambiarPassword.addEventListener('click', mostrarModalCambioPassword);

modalLoginBtn.addEventListener('click', attemptLogin);
modalCancelBtn.addEventListener('click', () => {
    hideLoginModal();
    if (!currentUser) setTimeout(() => showLoginModal(), 200);
});
loginUser.addEventListener('keypress', e => { if (e.key === 'Enter') attemptLogin(); });
loginPass.addEventListener('keypress', e => { if (e.key === 'Enter') attemptLogin(); });

cambioConfirmBtn.addEventListener('click', handleCambioPassword);
cambioCancelBtn.addEventListener('click', ocultarModalCambioPassword);

window.addEventListener('load', () => {
    if (!currentUser) showLoginModal();
});
const toggleSidebarButton = document.querySelector('#toggle-sidebar');
const sidebar = document.querySelector('#sidebar');
const appContainer = document.querySelector('#app');
const patientsListContainer = document.querySelector('#patients');
const mobileMenu = document.querySelector('#mobile-menu');


let sidebarHidden = true;

if (window.innerWidth <= 690) {
    sidebar.style.display = 'none';
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 690) {
        sidebar.style.display = 'flex';
        appContainer.classList.remove('hide');
    } else if (sidebarHidden) {
        sidebar.style.display = 'none';
        appContainer.classList.remove('hide');
        toggleSidebarButton.innerText = 'menu';
    }
}, false);

toggleSidebarButton.addEventListener('click', () => {
    if (sidebarHidden) {
        sidebar.style.display = 'flex';
        appContainer.classList.add('hide');
        toggleSidebarButton.innerText = 'arrow_back';

        sidebarHidden = false;
    } else {
        sidebar.style.display = 'none';
        appContainer.classList.remove('hide');
        toggleSidebarButton.innerText = 'menu';

        sidebarHidden = true;
    }
}, false);

patientsListContainer.addEventListener('touchmove', e => {
    if (window.pageYOffset > 10) {
        mobileMenu.classList.add('menu-shadow');
    } else {
        mobileMenu.classList.remove('menu-shadow');
    }
}, false);

import addFunctionToNavbar from "../utils/toggleNavbar.js";

const navbar = document.getElementById('navbar')
const openNavbarButton = document.getElementById('openNavbarButton')
const closeNavbarButton = document.getElementById('closeNavbarButton')
addFunctionToNavbar(navbar, openNavbarButton, closeNavbarButton)

const form = document.getElementById('form')
form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(form)
    const pjskGoogleSheetsID = formData.get('googleSheetsID')
    localStorage.setItem('pjskGoogleSheetsID', pjskGoogleSheetsID)
    window.location.href = 'dashboard.html'
})
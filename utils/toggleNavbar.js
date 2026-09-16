export default function addFunctionToNavbar(navbar, openNavbarButton, closeNavbarButton) {
    openNavbarButton.addEventListener('click', () => {
        navbar.classList.remove('hidden')
        openNavbarButton.classList.add('hidden')
        closeNavbarButton.classList.remove('hidden')
    })

    closeNavbarButton.addEventListener('click', () => {
        navbar.classList.add('hidden')
        openNavbarButton.classList.remove('hidden')
        closeNavbarButton.classList.add('hidden')
    })
}
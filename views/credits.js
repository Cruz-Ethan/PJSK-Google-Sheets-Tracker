import addFunctionToNavbar from "../utils/toggleNavbar.js";

const navbar = document.getElementById('navbar')
const openNavbarButton = document.getElementById('openNavbarButton')
const closeNavbarButton = document.getElementById('closeNavbarButton')
addFunctionToNavbar(navbar, openNavbarButton, closeNavbarButton)
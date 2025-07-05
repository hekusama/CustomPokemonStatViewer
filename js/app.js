import { initialize } from "./modules/init.js";
import { fix } from "./modules/mobileFix.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    const userAgent = navigator.userAgent;

    const isMobile = /Mobile|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

    if (isMobile) {
        fix();
    }

    initialize();
}
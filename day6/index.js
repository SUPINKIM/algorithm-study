// 프래그먼트 식별자

// 6-2. 기본 SPA 구성 요소

import createRouter from "./router.js";
import createPages from "./pages.js";

const main = document.querySelector("#main");

const router = createRouter();
const pages = createPages(main);

const PATH = {
  HOME: "#/",
  LIST: "#list/",
};

router
  .addRouter(PATH.HOME, pages.home)
  .addRouter(PATH.LIST, pages.list)
  .setNotFound(pages.notFound)
  .start();

/**
 *
 *@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */

const NAV_BTN_SELECTOR = "button[data-navigate]";

document.body.addEventListener("click", (e) => {
  const { target } = e;

  if (target.matches(NAV_BTN_SELECTOR)) {
    const { navigate } = target.dataset;

    router.navigate(navigate);
  }
});

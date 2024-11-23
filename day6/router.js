export default () => {
  const router = {};

  const routes = [];

  let notFound = () => {};

  const checkRoutes = () => {
    const found = routes.find(
      (route) => route.fragment === window.location.hash
    );

    if (!found) {
      notFound();
      return;
    }

    found.component();
  };

  router.addRouter = (fragment, component) => {
    routes.push({ fragment, component });

    return router;
  };

  router.setNotFound = (component) => {
    notFound = component;
    return router;
  };

  router.start = () => {
    window.addEventListener("hashchange", checkRoutes);

    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    checkRoutes();
  };

  /**
   * 프로그래밍 방식으로 다른 뷰로 이동하도록 라우터에 새로운 공개 메서드를 생성했다.
   * 이 메서드는 새 프래그먼트를 가져와 location 객체에서 대체한다.
   * 리스트 6-8에서 navigate 메서드의 코드를 볼 수 있다.
   *
   */

  router.navigate = (fragment) => {
    window.location.hash = fragment;
  };

  return router;
};

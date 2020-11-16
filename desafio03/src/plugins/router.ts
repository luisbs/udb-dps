import createRouter from "router5";
import loggerPlugin from "router5-plugin-logger";
import browserPlugin from "router5-plugin-browser";

export default function configureRouter() {
  const router = createRouter(
    [
      { name: "sucursales", path: "/sucursales" },
      { name: "resultados", path: "/resultados" },
      { name: "login", path: "/login" },
    ],
    {
      defaultRoute: "sucursales",
    }
  );

  router.usePlugin(loggerPlugin);

  router.usePlugin(browserPlugin());

  return router;
}

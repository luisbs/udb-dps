import createRouter from "router5";
import loggerPlugin from "router5-plugin-logger";
import browserPlugin from "router5-plugin-browser";

export const nameRoutes = ["home", "login"];

const routes = [] as Record<"name" | "path", string>[];
for (const name of nameRoutes) {
  if (name === "home") routes.push({ name, path: "/" });
  else routes.push({ name, path: `/${name}` });
}

export default function configureRouter() {
  const router = createRouter(routes, {
    defaultRoute: "home",
  });

  router.usePlugin(loggerPlugin);

  router.usePlugin(browserPlugin());

  return router;
}

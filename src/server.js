import Hapi from "@hapi/hapi";
import { routes } from "./routes.js";

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    response.header("Content-Type", "application/json; charset=utf-8");

    return h.continue;
  });

  server.route(routes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();

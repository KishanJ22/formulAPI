import loadApp from "./app.js";

const start = async () => {
    const app = await loadApp();
    app.listen({ port: app.config.PORT }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`Server listening at ${address}`);
    });
};

start().catch((err) => {
    console.error("Error starting server: ", err);
});
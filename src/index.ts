import app from "./app.js";
import getDrivers from "./routes/drivers/drivers.get.js";
import registerUser from "./routes/auth/auth.register.js";
import getToken from "./routes/auth/auth.get-token.js";
import verifyToken from "./routes/auth/auth.verify-token.js";

app.register(registerUser);
app.register(getToken);
app.register(verifyToken);

app.register(getDrivers);

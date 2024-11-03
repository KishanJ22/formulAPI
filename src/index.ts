import app from "./app.js";
import registerUser from "./routes/auth/auth.register.js";
import getToken from "./routes/auth/auth.get-token.js";
import verifyToken from "./routes/auth/auth.verify-token.js";
import getDrivers from "./routes/drivers/drivers.get.js";
import getCircuits from "./routes/circuits/circuits.get.js";

// /auth
app.register(registerUser);
app.register(getToken);
app.register(verifyToken);

// /drivers
app.register(getDrivers);

// /circuits
app.register(getCircuits);
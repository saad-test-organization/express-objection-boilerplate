import app from "./app.js";
import logger from "./config/logger.js";

const port = process.env.PORT || 3001;

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});


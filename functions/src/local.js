const app = require("./app");
const env = require("./config/env");

const port = env.LOCAL_PORT || 5001;

app.listen(port, () => {
  console.log(`ScheMatch backend running on http://localhost:${port}`);
});

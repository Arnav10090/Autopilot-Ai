import 'dotenv/config';

import app from "./app.js";
import { getBackendPublicUrl } from "./utils/runtimeConfig.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Public backend URL: ${getBackendPublicUrl()}`);
});

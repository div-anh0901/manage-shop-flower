const express = require("express");

const dotenv = require("dotenv");
const router = require('./routers');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const connectDB = require("./configs/connectDB");
const errorMiddleware = require("./utils/errorMiddleware");
const logMiddleware = require("./utils/logMiddleware");
const path = require("path");
dotenv.config();
const app = express();
const allowedOrigins = process?.env?.FRONTEND_URLS.split(',');

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

// Middleware
app.use(logMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

//connectDB
connectDB();

// Cho phép truy cập thư mục 'files' tĩnh
app.use("/files", express.static(path.join(__dirname, "../../files")));

// Import routes
app.use("/api", router);

// 🔥 Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const winston = require("winston");
require("winston-daily-rotate-file");
require("colors");
const morgan = require("morgan");
require("dotenv").config();

// ╔═══════════════════════════════════════╗
// ║            COLOR FUNCTIONS            ║
// ╚═══════════════════════════════════════╝
const levelColors = {
  error: (txt) => txt.red.bold,
  warn: (txt) => txt.yellow.bold,
  info: (txt) => txt.cyan.bold,
  http: (txt) => txt.magenta.bold,
  debug: (txt) => txt.green.bold,
};

// Safe stringify for objects
function safeMsg(msg) {
  if (typeof msg === "string") return msg;
  return JSON.stringify(msg, null, 2);
}

// ╔═══════════════════════════════════════╗
// ║          BEAUTIFUL CONSOLE LOG        ║
// ╚═══════════════════════════════════════╝
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  const colorFn = levelColors[level] || ((txt) => txt.white);

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅  ${timestamp.toString().green}
${colorFn(level.toUpperCase().padEnd(7))}  
${safeMsg(message)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
});

// ╔═══════════════════════════════════════╗
// ║       DAILY ROTATION LOG FILE         ║
// ╚═══════════════════════════════════════╝
const fileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxFiles: "30d",
});

// ╔═══════════════════════════════════════╗
// ║    CREATE WINSTON LOGGER INSTANCE     ║
// ╚═══════════════════════════════════════╝
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // file logs are JSON
  ),
  transports: [
    fileTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleFormat
      ),
    }),
  ],
});

// ╔═══════════════════════════════════════╗
// ║     REQUEST LOGGER (Morgan + Colors)  ║
// ╚═══════════════════════════════════════╝
logger.requestLogger = morgan(function (tokens, req, res) {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const time = tokens["response-time"](req, res) + "ms";

  const ip = req.ip;
  const agent = req.headers["user-agent"];

  // Determine Access Type
  let userId = "guest";

  if (req.headers["x-dev-access"] === process.env.DEV_ID) {
    userId = "Developer";
  } else if (
    req.headers.origin === process.env.FRONTEND_URL ||
    req.headers.origin === "http://localhost:5173"
  ) {
    userId = "Production";
  }

  const log = {
    type: "http",
    method,
    url,
    status: Number(status),
    time,
    userId,
    ip,
    agent,
  };

  logger.info(log);

  return `
${"HTTP REQUEST".blue.bold}
${"Method:".yellow} ${method}
${"URL:".yellow} ${url}
${"Status:".yellow} ${status}
${"Time:".yellow} ${time}
${"User:".yellow} ${userId}
${"IP:".yellow} ${ip}
${"Agent:".yellow} ${agent}
`;
});

// ╔═══════════════════════════════════════╗
// ║    SHORTCUT HELPERS (success/error)   ║
// ╚═══════════════════════════════════════╝

// success logging
logger.success = (message, meta = {}) => {
  logger.info({ success: true, message, ...meta });
};

// error logging
logger.fail = (message, meta = {}) => {
  logger.error({ success: false, message, ...meta });
};

module.exports = logger;

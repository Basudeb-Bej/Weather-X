const os = require("os");

function normalizeIpAddress(ipAddress) {
  if (!ipAddress) {
    return null;
  }

  const value = String(ipAddress).trim();

  if (!value) {
    return null;
  }

  if (value === "::1") {
    return "127.0.0.1";
  }

  if (value.startsWith("::ffff:")) {
    return value.slice(7);
  }

  return value;
}

function getLocalIPv4Address() {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    for (const networkInterface of entries ?? []) {
      if (networkInterface && networkInterface.family === "IPv4" && !networkInterface.internal) {
        return normalizeIpAddress(networkInterface.address);
      }
    }
  }

  return null;
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = typeof forwardedFor === "string" ? forwardedFor.split(",")[0]?.trim() : null;
  const realIp = typeof req.headers["x-real-ip"] === "string" ? req.headers["x-real-ip"].trim() : null;
  const cfConnectingIp =
    typeof req.headers["cf-connecting-ip"] === "string" ? req.headers["cf-connecting-ip"].trim() : null;
  const proxyChainIp = Array.isArray(req.ips) && req.ips.length > 0 ? req.ips[0] : null;
  const socketIp = req.socket?.remoteAddress ?? req.connection?.remoteAddress ?? null;

  return (
    normalizeIpAddress(forwardedIp) ||
    normalizeIpAddress(realIp) ||
    normalizeIpAddress(cfConnectingIp) ||
    normalizeIpAddress(proxyChainIp) ||
    normalizeIpAddress(socketIp) ||
    normalizeIpAddress(req.ip)
  );
}

function getDisplayClientIp(req) {
  const clientIp = getClientIp(req);

  if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
    return clientIp;
  }

  return getLocalIPv4Address() || clientIp;
}

module.exports = {
  getClientIp,
  getDisplayClientIp,
  normalizeIpAddress,
};
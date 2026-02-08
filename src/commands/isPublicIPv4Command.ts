export function isPublicIPv4Command(ip: string): boolean {
  if (!ip) return false;

  // Must be IPv4
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

  if (!ipv4Regex.test(ip)) return false;

  // Private / reserved ranges
  return !(
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip === '127.0.0.1' ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

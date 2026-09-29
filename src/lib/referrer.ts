export function siteHost() {
  try {
    return new URL(process.env.SITE_URL || "http://localhost:3000").host;
  } catch {
    return "";
  }
}

export function externalReferrer(referrer: string, host: string | null) {
  try {
    const from = new URL(referrer).host;
    return from === host || from === siteHost() ? "" : referrer;
  } catch {
    return referrer;
  }
}

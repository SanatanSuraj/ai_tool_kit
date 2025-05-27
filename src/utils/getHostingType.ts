export const getHostingType = (str: string) => {
  if (/cloudflare/i.test(str)) return "CDN / Cloud Hosting";
  if (/amazon/i.test(str)) return "Cloud Hosting (AWS)";
  if (/google/i.test(str)) return "Cloud Hosting (GCP)";
  if (/microsoft/i.test(str)) return "Cloud Hosting (Azure)";
  return "Web Hosting";
};

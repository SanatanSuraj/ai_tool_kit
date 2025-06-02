export const getWebsite = (str: string) => {
  if (/cloudflare/i.test(str)) return "https://cloudflare.com";
  if (/amazon/i.test(str)) return "https://aws.amazon.com";
  if (/google/i.test(str)) return "https://cloud.google.com";
  if (/microsoft/i.test(str)) return "https://azure.microsoft.com";
  return "";
};

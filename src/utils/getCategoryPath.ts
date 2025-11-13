/**
 * Maps a tool path to its corresponding category path
 * @param toolPath - The path of the tool (e.g., '/tools/dns-lookup')
 * @returns The category path (e.g., '/categories/checker-tools')
 */
export function getCategoryPath(toolPath: string): string {
  // Extract tool name from path
  const toolName = toolPath.replace('/tools/', '');

  // Checker Tools
  const checkerTools = [
    'dns-lookup',
    'whois-lookup',
    'website-hosting-checker',
    'ip-lookup',
    'ssl-checker',
    'http-status-checker',
    'hosting-checker',
    'ping',
  ];
  if (checkerTools.includes(toolName)) {
    return '/categories/checker-tools';
  }

  // Image Tools
  const imageTools = [
    'image-compressor',
    'image-resizer',
    'image-cropper',
    'image-converter',
    'image-background-remover',
  ];
  if (imageTools.includes(toolName)) {
    return '/categories/image-tools';
  }

  // Developer Tools
  const developerTools = [
    'json-formatter',
    'html-formatter',
    'markdown-editor',
    'css-minifier',
    'jwt-debugger',
    'regex-tester',
  ];
  if (developerTools.includes(toolName)) {
    return '/categories/developer-tools';
  }

  // Generator Tools
  const generatorTools = [
    'password-generator',
    'qr-code-generator',
    'meta-tag-generator',
    'lorem-ipsum-generator',
    'uuid-generator',
    'css-gradient-generator',
    'cron-expression-generator',
  ];
  if (generatorTools.includes(toolName)) {
    return '/categories/generator-tools';
  }

  // Unit Converter
  const unitConverterTools = [
    'length-converter',
    'weight-converter',
    'area-converter',
    'volume-converter',
    'speed-converter',
    'pressure-converter',
  ];
  if (unitConverterTools.includes(toolName)) {
    return '/categories/unit-converter';
  }

  // Converter Tools
  const converterTools = [
    'temperature-converter',
    'timezone-converter',
    'time-zone-converter',
    'number-base-converter',
    'color-converter',
    'text-case-converter',
  ];
  if (converterTools.includes(toolName)) {
    return '/categories/converter-tools';
  }

  // Calculator
  const calculatorTools = [
    'date-calculator',
    'time-duration-calculator',
    'epoch-converter',
    'unix-timestamp-converter',
    'age-calculator',
    'business-days-calculator',
  ];
  if (calculatorTools.includes(toolName)) {
    return '/categories/calculator';
  }

  // Data Converter
  const dataConverterTools = [
    'json-to-csv',
    'csv-to-json',
    'xml-to-json',
    'yaml-converter',
    'base64-converter',
    'url-encoder',
  ];
  if (dataConverterTools.includes(toolName)) {
    return '/categories/data-converter';
  }

  // Text Tools
  const textTools = [
    'text-to-speech',
    'text-difference',
    'case-converter',
    'word-counter',
  ];
  if (textTools.includes(toolName)) {
    return '/categories/text-tools';
  }

  // Misc Tools
  const miscTools = [
    'serp-checker',
    'keyword-research',
    'youtube-thumbnail-downloader',
    'exif-reader',
  ];
  if (miscTools.includes(toolName)) {
    return '/categories/misc-tools';
  }

  // Default fallback to home if category not found
  return '/';
}


import { ContentType } from "@/types";
import QRCode, { QRCodeErrorCorrectionLevel } from "qrcode";

export const generateQRCode = ({
  contentType,
  content,
  color,
  backgroundColor,
  errorCorrectionLevel,
  size,
}: {
  contentType: ContentType;
  content: string;
  color: string;
  backgroundColor: string;
  errorCorrectionLevel: QRCodeErrorCorrectionLevel;
  size: number;
}) => {
  const data = formatQRData(contentType, content);

  const options = {
    errorCorrectionLevel,
    color: {
      dark: color,
      light: backgroundColor,
    },
    width: size,
  };

  return QRCode.toDataURL(data, options);
};

const formatQRData = (contentType: ContentType, content: string): string => {
  switch (contentType) {
    case "url":
      return content;
    case "text":
      return content;
    case "email":
      return `mailto:${content}`;
    case "phone":
      return `tel:${content}`;
    case "sms":
      return `sms:${content}`;
    case "wifi": {
      const [ssid, password, encryption = "WPA"] = content.split(";");
      if (!ssid || !password) throw new Error("Invalid WiFi content format");
      return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }
    case "contact": {
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        ...content
          .split(";")
          .filter(Boolean)
          .map((v) => v.trim()),
        "END:VCARD",
      ].join("\n");
    }
    default:
      return content;
  }
};

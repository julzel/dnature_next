import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// Reusable WhatsApp link wrapper
// Props:
// - phone: string (digits only or with country code)
// - className: string (styling classes passed from parent)
// - display: optional custom display text (fallbacks to formatted phone)
// - children: optional custom children; if provided they override display text
// - targetBlank: boolean (default true) whether to open in new tab
//
// Usage: <WhatsAppLink phone="71848868" className={styles.contactItem} />
// Will link to https://wa.me/71848868
const WhatsAppLink = ({
  phone,
  className,
  display,
  children,
  targetBlank = true,
  withIcon = false,
  iconOnly = false,
  ...rest
}) => {
  if (!phone) return null;
  const sanitized = String(phone).replace(/[^0-9]/g, "");
  const href = `https://wa.me/${sanitized}`;
  const content = children || display || formatPhoneForDisplay(sanitized);
  // We purposefully keep rel static when targetBlank so ESLint can verify the security tokens.
  const { rel: _ignoredRel, ...otherProps } = rest; // ignore custom rel when opening a new tab

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "flex", flexFlow: "column", alignItems: "center" }}
      {...otherProps}
    >
      {(withIcon || iconOnly) && (
        <span style={{ fontSize: "14px" }}>
          <FontAwesomeIcon icon={faWhatsapp} size="2x" />
        </span>
      )}
      {!iconOnly && content}
    </a>
  );
};

function formatPhoneForDisplay(num) {
  // Simple formatting: 4 - 4 if length 8, else raw
  if (num.length === 8) return `${num.slice(0, 4)} - ${num.slice(4)}`;
  return num;
}

export default WhatsAppLink;

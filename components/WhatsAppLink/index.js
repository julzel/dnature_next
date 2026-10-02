import React from "react";
import { TextIcon } from '../Icon';
import { whatsappSymbol } from '../Icon';

// Reusable WhatsApp link wrapper
// Props:
// - phone: string (digits only or with country code)
// - display: optional custom display text (fallbacks to formatted phone)
// - children: optional custom children; if provided they override display text
// - targetBlank: boolean (default true) whether to open in new tab
//
// Use the shared DNAture E.164 number from constants/contact for official links.
const WhatsAppLink = ({
  phone,
  className,
  display,
  children,
  targetBlank = true,
  withIcon = false,
  iconOnly = false,
  ...props
}) => {
  if (!phone) return null;
  const sanitized = String(phone).replace(/[^0-9]/g, "");
  const href = `https://wa.me/${sanitized}`;
  const content = children || display || formatPhoneForDisplay(sanitized);
  return (
    <a
      className={className}
      href={href}
      aria-label={iconOnly ? `Contactar por WhatsApp al ${content}` : undefined}
      {...props}
      {...(targetBlank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {(withIcon || iconOnly) && (
        <span>
          <TextIcon symbol={whatsappSymbol} size={22} />
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

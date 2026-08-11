/**
 * Icon: the academy's natural vector icon set.
 *
 * Hand-drawn, stroke-based SVG icons (Lucide/Feather style) that render in
 * `currentColor`, so they inherit any surrounding text colour automatically.
 * Pure server-safe component: no client JS required.
 *
 * Usage:  <Icon name="rocket" size={18} />
 */

const paths = {
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 5-7" />
    </>
  ),
  bars: (
    <>
      <path d="M4 21V11" />
      <path d="M10 21V4" />
      <path d="M16 21v-7" />
      <path d="M21 21V8" />
    </>
  ),
  code: (
    <>
      <path d="M8 6l-6 6 6 6" />
      <path d="M16 6l6 6-6 6" />
    </>
  ),
  braces: (
    <>
      <path d="M8.5 4C6.5 4 5.5 5 5.5 7v3c0 1.5-1 2-2 2 1 0 2 .5 2 2v3c0 2 1 3 3 3" />
      <path d="M15.5 4c2 0 3 1 3 3v3c0 1.5 1 2 2 2-1 0-2 .5-2 2v3c0 2-1 3-3 3" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </>
  ),
  feather: (
    <>
      <path d="M20.2 4.4c-6.2-.4-11.8 3.4-14 9.4L3.5 21l7.2-2.7c6-2.2 9.9-7.8 9.5-13.9z" />
      <path d="M5.5 18.5L19 5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.6-1.6 5-4.5 5h-2a2.5 2.5 0 0 0-1.9 4.1c.2.2.4.6.4.9 0 .5-.4 1-1 1z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9.4l5.2 2.6L10 14.6z" fill="currentColor" stroke="none" />
    </>
  ),
  clapper: (
    <>
      <path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
      <path d="M3.6 6.2L5.2 10H8L6.4 6.2" />
      <path d="M20.4 10L19 6.2" />
      <path d="M12.8 3.4L14.4 10M8.6 3.4L10.2 10M17 3.4L18.6 10M4.4 3.4L6 10" />
      <path d="M3 10L4.4 3.4h.4L19 3.4a2 2 0 0 1 2 2V10" fill="none" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  tshirt: (
    <path d="M20.4 3.6L16 2a4 4 0 0 1-8 0L3.6 3.6a2 2 0 0 0-1.5 1.9L2 9l3.2 1v11a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1V10L22 9l-.1-3.5a2 2 0 0 0-1.5-1.9z" />
  ),
  briefcase: (
    <>
      <rect x="2.8" y="7.5" width="18.4" height="13" rx="2.5" />
      <path d="M8.5 7.5V5.8A2.3 2.3 0 0 1 10.8 3.5h2.4a2.3 2.3 0 0 1 2.3 2.3v1.7" />
      <path d="M2.8 13.5h18.4" />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.5" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.2 9.8h.01M17.8 14.2h.01" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.8 18.5h2.4" />
    </>
  ),
  cpu: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <rect x="8.5" y="2.5" width="7" height="4" rx="1.5" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4.5 15.5V18a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.4 2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8.5 21h7" />
      <path d="M12 17.2V21" />
      <path d="M7 4h10v5.2a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.2a3.3 3.3 0 0 0 3.3 3.3" />
      <path d="M17 5.5h2.8a3.3 3.3 0 0 1-3.3 3.3" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.5" r="5" />
      <path d="M8.6 10L6.5 3.5h4L12 7.5l1.5-4h4L15.4 10" />
    </>
  ),
  star: (
    <path d="M12 3.4l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.6l5.9-.8z" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.2 20c.6-3.2 2.9-4.9 5.8-4.9s5.2 1.7 5.8 4.9" />
      <path d="M15.9 4.8a3.4 3.4 0 0 1 0 6.5" />
      <path d="M18.2 15.5c1.5.8 2.5 2.2 2.9 4.2" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.4l2.8 2.8 5.4-5.6" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  sparkles: (
    <>
      <path d="M11.5 4.5l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" />
      <path d="M18.5 3l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
      <path d="M5 15.5l.7 1.8 1.8.7-1.8.7L5 20.5l-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.4 3.9 5.6 3.9 9s-1.4 6.6-3.9 9c-2.5-2.4-3.9-5.6-3.9-9S9.5 5.4 12 3z" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a4.6 4.6 0 0 0-6.1 5.5L3.4 17a2.15 2.15 0 0 0 0 3 2.15 2.15 0 0 0 3 0l5.2-5.2a4.6 4.6 0 0 0 5.5-6.1l-2.8 2.8-2.4-2.4z" />
  ),
  message: (
    <path d="M21 11.6a8.6 8.6 0 0 1-8.6 8.5c-1.5 0-3-.4-4.3-1L3 20.6l1.5-5.1a8.6 8.6 0 1 1 16.5-3.9z" />
  ),
  chat: (
    <>
      <path d="M21 11.6a8.6 8.6 0 0 1-8.6 8.5c-1.5 0-3-.4-4.3-1L3 20.6l1.5-5.1a8.6 8.6 0 1 1 16.5-3.9z" />
      <circle cx="8.5" cy="11.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.6" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  cap: (
    <>
      <path d="M2 9.2L12 4l10 5.2-10 5.2z" />
      <path d="M6.2 11.6v4.6c0 1.5 2.6 2.9 5.8 2.9s5.8-1.4 5.8-2.9v-4.6" />
      <path d="M22 9.2v5.6" />
    </>
  ),
  robot: (
    <>
      <rect x="4.5" y="8.5" width="15" height="11" rx="2.5" />
      <path d="M12 8.5V5.6" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="9.2" cy="13" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="13" r="1.15" fill="currentColor" stroke="none" />
      <path d="M9.5 16.3c1.7.8 3.3.8 5 0" />
      <path d="M2.5 12.5v3.5M21.5 12.5v3.5" />
    </>
  ),
  phone: (
    <path d="M5.2 3h3.6l1.4 4.8-2.3 1.6a13.2 13.2 0 0 0 5.7 5.7l1.6-2.3L20 14.2v3.6a2 2 0 0 1-2.1 2A16.9 16.9 0 0 1 3.2 5.1a2 2 0 0 1 2-2.1z" />
  ),
  pin: (
    <>
      <path d="M12 21.5S5 15.7 5 10a7 7 0 0 1 14 0c0 5.7-7 11.5-7 11.5z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  book: (
    <>
      <path d="M4 19.2V6a2.5 2.5 0 0 1 2.5-2.5H20V17H6.5A2.5 2.5 0 0 0 4 19.2z" />
      <path d="M4 19.2A2.5 2.5 0 0 0 6.5 21.5H20V17" />
    </>
  ),
  laptop: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="2" />
      <path d="M2 19.5h20" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3.5 12.8L12 17.5l8.5-4.7" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 2.8v4M16 2.8v4" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.3 1.4 1.5 2.2h4.2c.2-.8.7-1.6 1.5-2.2A6 6 0 0 0 12 3z" />
    </>
  ),
  bolt: <path d="M13 2.5L4.5 13.5h6L9.8 21.5l8.7-11h-6z" />,
  warn: (
    <>
      <path d="M12 3.5L22 20H2z" />
      <path d="M12 9.5V14" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  heart: (
    <path d="M12 20.6S3.4 15.4 3.4 9.4A4.6 4.6 0 0 1 8 4.8c1.7 0 3.2.8 4 2.1a4.9 4.9 0 0 1 4-2.1 4.6 4.6 0 0 1 4.6 4.6c0 6-8.6 11.2-8.6 11.2z" />
  ),
  shield: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10v-6z" />
      <path d="M8.8 12l2.3 2.3 4.2-4.4" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M15.5 10.4l6-3.4v10l-6-3.4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M8.8 21h6.4" />
    </>
  ),
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
    />
  ),
  send: (
    <>
      <path d="M21 3.5L3 10.8l6.2 2.6 2.6 6.2z" />
      <path d="M21 3.5L9.2 13.4" />
    </>
  ),
}

export default function Icon({ name, size = 18, strokeWidth = 1.9, style, className, ...rest }) {
  const content = paths[name] || paths.sparkles
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style }}
      {...rest}
    >
      {content}
    </svg>
  )
}

export function WeatherIcon({ icon, className = "h-10 w-10" }) {
  if (icon === "sunny") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <circle cx="32" cy="32" r="12" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <path d="M32 6v8" />
          <path d="M32 50v8" />
          <path d="M6 32h8" />
          <path d="M50 32h8" />
          <path d="M14 14l6 6" />
          <path d="M44 44l6 6" />
          <path d="M14 50l6-6" />
          <path d="M44 20l6-6" />
        </g>
      </svg>
    );
  }

  if (icon === "rain") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path
          d="M20 42h25a10 10 0 0 0 1-20 16 16 0 0 0-31 3 9 9 0 0 0 5 17Z"
          fill="currentColor"
          opacity="0.9"
        />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="4">
          <path d="M22 48l-3 8" />
          <path d="M32 48l-3 8" />
          <path d="M42 48l-3 8" />
        </g>
      </svg>
    );
  }

  if (icon === "snow") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path d="M20 24a14 14 0 1 1 24 10H19a10 10 0 0 1 1-10Z" fill="currentColor" opacity="0.9" />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="3">
          <path d="M22 46h0" />
          <path d="M32 46h0" />
          <path d="M42 46h0" />
          <path d="M22 42l0 8" />
          <path d="M18 46h8" />
          <path d="M32 42l0 8" />
          <path d="M28 46h8" />
          <path d="M42 42l0 8" />
          <path d="M38 46h8" />
        </g>
      </svg>
    );
  }

  if (icon === "storm") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path
          d="M19 41h24a11 11 0 0 0 1-22 15 15 0 0 0-29 4 9 9 0 0 0 4 18Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M30 39l-4 10h6l-3 9 11-14h-6l4-5z" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "mist") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path
          d="M18 27a12 12 0 0 1 22-7 10 10 0 0 1 8 16H19a9 9 0 0 1-1-9Z"
          fill="currentColor"
          opacity="0.9"
        />
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="4" opacity="0.7">
          <path d="M14 44h28" />
          <path d="M20 51h24" />
          <path d="M16 37h32" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M19 42h26a10 10 0 0 0 0-20 15 15 0 0 0-28 4 9 9 0 0 0 2 16Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="30" cy="30" r="6" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
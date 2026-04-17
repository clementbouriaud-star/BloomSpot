export function MapPinMarker({ variant, letter, className }) {
  const fill = variant === "subject" ? "#c53636" : "#2f5d45";
  return (
    <span className={`map-pin map-pin--${variant} ${className ?? ""}`}>
      <span className="map-pin__letter">{letter}</span>
      <svg className="map-pin__shape" viewBox="0 0 36 44" width="36" height="44" aria-hidden>
        <path
          d="M18 2C11.4 2 6 7.1 6 13.4c0 4.5 2.8 9.6 6.5 14.1 2.8 3.4 5.5 5.8 5.5 5.8s2.7-2.4 5.5-5.8c3.7-4.5 6.5-9.6 6.5-14.1C30 7.1 24.6 2 18 2Z"
          fill={fill}
        />
        <circle cx="18" cy="14" r="5" fill="#fff" />
      </svg>
    </span>
  );
}

export function MapPinGrey({ className }) {
  return (
    <span className={`map-pin map-pin--grey ${className ?? ""}`} aria-hidden>
      <svg className="map-pin__shape map-pin__shape--sm" viewBox="0 0 36 44" width="22" height="28">
        <path
          d="M18 4c-5.5 0-10 4.3-10 9.6 0 3.8 2.3 8 5.4 11.7 2.2 2.7 4.6 4.7 4.6 4.7s2.4-2 4.6-4.7c3.1-3.7 5.4-7.9 5.4-11.7C28 8.3 23.5 4 18 4Z"
          fill="#9a9a9a"
        />
        <circle cx="18" cy="13.5" r="3.2" fill="#fff" />
      </svg>
    </span>
  );
}

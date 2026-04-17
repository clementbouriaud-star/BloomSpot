function BrandMark() {
  return (
    <span className="brand__mark" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path
          d="M12 7a3 3 0 0 0-3 3c0 2.5 3 6 3 6s3-3.5 3-6a3 3 0 0 0-3-3Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

export function BrandLogoLink() {
  return (
    <a href="#" className="brand" aria-label="BloomSpot, accueil">
      <BrandMark />
      <span className="brand__name">BloomSpot</span>
    </a>
  );
}

export function BrandLogoButton({ onClick }) {
  return (
    <button type="button" className="brand brand--btn" onClick={onClick} aria-label="BloomSpot, accueil">
      <BrandMark />
      <span className="brand__name">BloomSpot</span>
    </button>
  );
}

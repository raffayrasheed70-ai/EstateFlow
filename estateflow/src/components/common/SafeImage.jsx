import { useState } from 'react'

// <img> that shows a neutral placeholder when the URL is empty or fails to load.
// Keyed by `src` internally so changing the URL resets the error state.
function Inner({ src, alt, className }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className || ''}`} role="img" aria-label={alt}>
        <i className="bi bi-house-door" aria-hidden="true" />
        <span>No image</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export default function SafeImage(props) {
  return <Inner key={props.src} {...props} />
}

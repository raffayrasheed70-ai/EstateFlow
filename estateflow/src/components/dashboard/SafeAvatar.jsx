import { useState } from 'react'

function Inner({ src, name }) {
  const [failed, setFailed] = useState(false)
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  if (!src || failed) {
    return (
      <span className="avatar avatar-lg" aria-hidden="true">
        {letters || '?'}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      className="avatar avatar-lg avatar-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

// Round avatar image with an initials fallback when the image fails to load.
export default function SafeAvatar(props) {
  return <Inner key={props.src} {...props} />
}

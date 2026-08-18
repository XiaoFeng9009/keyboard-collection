export default function Icon({ name, size = 16, style }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  }

  let children = null

  if (name === 'home') {
    children = (
      <>
        <path d='M3 10.5 12 3l9 7.5' />
        <path d='M5 9.5V21h14V9.5' />
        <path d='M9 21v-6h6v6' />
      </>
    )
  } else if (name === 'grid') {
    children = (
      <>
        <rect x='3' y='3' width='7' height='7' rx='1' />
        <rect x='14' y='3' width='7' height='7' rx='1' />
        <rect x='3' y='14' width='7' height='7' rx='1' />
        <rect x='14' y='14' width='7' height='7' rx='1' />
      </>
    )
  } else if (name === 'archive') {
    children = (
      <>
        <path d='M4 6h16' />
        <path d='M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6' />
        <path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
        <path d='M9 12h6' />
      </>
    )
  } else if (name === 'tag') {
    children = (
      <>
        <path d='M12 3H5a2 2 0 0 0-2 2v7l9 9 7-7 3-3' />
        <circle cx='8.5' cy='8.5' r='1.5' />
      </>
    )
  } else if (name === 'search') {
    children = (
      <>
        <circle cx='11' cy='11' r='7' />
        <path d='m20 20-4-4' />
      </>
    )
  }

  return <svg {...common} style={style}>{children}</svg>
}

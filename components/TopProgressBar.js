import { useState, useEffect } from 'react'

export default function TopProgressBar({ active }) {
  var [visible, setVisible] = useState(false)

  useEffect(function() {
    if (active) { setVisible(true) }
    else {
      var t = setTimeout(function() { setVisible(false) }, 500)
      return function() { clearTimeout(t) }
    }
  }, [active])

  if (!visible) return null

  return (
    <div style={{position:'fixed',top:0,left:0,zIndex:99999,width:'100%',height:3,opacity:active?1:0,transition:'opacity .5s ease'}}>
      <div style={{height:'100%',background:'#FBFB45',animation:'progressSlide 1.5s ease-in-out infinite',borderRadius:'0 2px 2px 0'}} />
    </div>
  )
}

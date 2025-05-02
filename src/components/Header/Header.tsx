import React from 'react'

export default function Header() {
  return (
    <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <h2 className="font-bold text-2xl text-yellow-400">Tarantino Kino</h2>
        </div>
        <div className="flex-none">
          <a className="btn bg-yellow-400 border-none text-gray-800" href='/'>Logout</a>
        </div>
      </div>
  )
}

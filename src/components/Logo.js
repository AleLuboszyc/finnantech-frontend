import React from 'react';


const Logo = ({ color = '#ffffff' }) => (
  <svg viewBox="0 0 400 100">
    <g>
        <circle cx="50" cy="50" r="20" fill="#2962ff"/>
        <circle cx="90" cy="30" r="15" fill="#00e5ff"/>
        <circle cx="90" cy="70" r="15" fill="#00e5ff"/>
        <line x1="68" y1="50" x2="80" y2="35" stroke="#64b5f6" strokeWidth="4"/>
        <line x1="68" y1="50" x2="80" y2="65" stroke="#64b5f6" strokeWidth="4"/>
    </g>
    <text x="130" y="65" fontFamily="Poppins, sans-serif" fontSize="40" fontWeight="700" fill={color}>
        Finnantech
    </text>
  </svg>
);

export default Logo;
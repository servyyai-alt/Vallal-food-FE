import React from 'react';

const ConnectorAnimation = () => {
    return (
        <div className="connector-animation-container">
            <svg
                viewBox="120 70 560 100"
                className="connector-svg"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Left Connector Group */}
                <g className="connector-left">
                    {/* Left Cable Tail */}
                    <path
                        d="M 315 120 C 265 120, 245 150, 195 150 L 130 150"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    
                    {/* Left Plug Body */}
                    <path
                        d="M 345 90 L 370 90 A 5 5 0 0 1 375 95 L 375 145 A 5 5 0 0 1 370 150 L 345 150 A 30 30 0 0 1 315 120 A 30 30 0 0 1 345 90 Z"
                        fill="#FFFFFF"
                        stroke="#475569"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    
                    {/* Prongs */}
                    <path
                        d="M 375 104 L 389 104 A 4 4 0 0 1 393 108 A 4 4 0 0 1 389 112 L 375 112"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 375 128 L 389 128 A 4 4 0 0 1 393 132 A 4 4 0 0 1 389 136 L 375 136"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Decorative details inside left body */}
                    <circle cx="339" cy="120" r="4.5" stroke="#94A3B8" strokeWidth="2" fill="none" />
                    <path
                        d="M 350 114 A 8 8 0 0 1 350 126"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                {/* Right Connector Group */}
                <g className="connector-right">
                    {/* Right Cable Tail */}
                    <path
                        d="M 485 120 C 535 120, 555 150, 605 150 L 670 150"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    
                    {/* Right Plug Body */}
                    <path
                        d="M 455 90 A 30 30 0 0 1 485 120 A 30 30 0 0 1 455 150 L 430 150 A 5 5 0 0 1 425 145 L 425 95 A 5 5 0 0 1 430 90 Z"
                        fill="#FFFFFF"
                        stroke="#475569"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />

                    {/* Receptacle Slots */}
                    <path
                        d="M 425 105 L 433 105 A 3 3 0 0 1 436 108 A 3 3 0 0 1 433 111 L 425 111"
                        fill="#F1F5F9"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 425 129 L 433 129 A 3 3 0 0 1 436 132 A 3 3 0 0 1 433 135 L 425 135"
                        fill="#F1F5F9"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Decorative details inside right body */}
                    <circle cx="461" cy="120" r="3.5" fill="#CBD5E1" />
                    <line x1="451" y1="102" x2="451" y2="138" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Center Pulse Group (Red X is exactly at X = 400) */}
                <g className="connector-center-x">
                    {/* Red X */}
                    <path
                        d="M 393 113 L 407 127 M 407 113 L 393 127"
                        stroke="#EF4444"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />
                </g>

                {/* Sparks Group */}
                <g className="connector-sparks">
                    {/* Top spark */}
                    <line x1="400" y1="92" x2="400" y2="84" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Top-Right spark */}
                    <line x1="418" y1="102" x2="424" y2="96" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Right spark */}
                    <line x1="426" y1="120" x2="434" y2="120" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Bottom-Right spark */}
                    <line x1="418" y1="138" x2="424" y2="144" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Bottom spark */}
                    <line x1="400" y1="148" x2="400" y2="156" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Bottom-Left spark */}
                    <line x1="382" y1="138" x2="376" y2="144" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Left spark */}
                    <line x1="374" y1="120" x2="366" y2="120" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    {/* Top-Left spark */}
                    <line x1="382" y1="102" x2="376" y2="96" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                </g>
            </svg>
        </div>
    );
};

export default ConnectorAnimation;
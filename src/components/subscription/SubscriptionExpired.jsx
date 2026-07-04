import React, { useMemo } from 'react';
import webbyLogo from './webby.png';
import ConnectorAnimation from './ConnectorAnimation';
import './SubscriptionExpired.css';

const SubscriptionExpired = ({ status = 'suspended' }) => {
    // Generate random background particles in a stable way
    const particles = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            id: i,
            top: `${(i * 17) % 100}%`,
            left: `${(i * 23) % 100}%`,
            size: `${((i * 7) % 3) + 1.2}px`,
            delay: `${-((i * 13) % 12)}s`,
            duration: `${((i * 9) % 15) + 15}s`,
        }));
    }, []);

    return (
        <div className="subscription-expired-root">
            {/* Subtle Grid Blueprint Pattern */}
            <div className="bg-blueprint" />

            {/* Floating Background Particles */}
            <div className="bg-particles">
                {particles.map((p) => (
                    <span
                        key={p.id}
                        className="bg-particle"
                        style={{
                            top: p.top,
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}
            </div>

            {/* Left Side: Floating Network Visualization */}
            <div className="bg-network-left">
                <svg viewBox="0 0 320 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {/* Connecting Lines (color: #3B82F6) */}
                    <line x1="50" y1="100" x2="120" y2="180" stroke="#3B82F6" strokeWidth="1.2" className="net-line l1" />
                    <line x1="50" y1="100" x2="220" y2="140" stroke="#3B82F6" strokeWidth="1.2" className="net-line l2" />
                    <line x1="120" y1="180" x2="80" y2="280" stroke="#3B82F6" strokeWidth="1.2" className="net-line l3" />
                    <line x1="120" y1="180" x2="180" y2="240" stroke="#3B82F6" strokeWidth="1.2" className="net-line l4" />
                    <line x1="120" y1="180" x2="220" y2="140" stroke="#3B82F6" strokeWidth="1.2" className="net-line l5" />
                    <line x1="80" y1="280" x2="180" y2="240" stroke="#3B82F6" strokeWidth="1.2" className="net-line l6" />
                    <line x1="80" y1="280" x2="90" y2="420" stroke="#3B82F6" strokeWidth="1.2" className="net-line l7" />
                    <line x1="180" y1="240" x2="220" y2="140" stroke="#3B82F6" strokeWidth="1.2" className="net-line l8" />
                    <line x1="180" y1="240" x2="200" y2="360" stroke="#3B82F6" strokeWidth="1.2" className="net-line l9" />
                    <line x1="90" y1="420" x2="200" y2="360" stroke="#3B82F6" strokeWidth="1.2" className="net-line l10" />
                    <line x1="90" y1="420" x2="150" y2="480" stroke="#3B82F6" strokeWidth="1.2" className="net-line l11" />
                    <line x1="90" y1="420" x2="60" y2="520" stroke="#3B82F6" strokeWidth="1.2" className="net-line l12" />
                    <line x1="200" y1="360" x2="150" y2="480" stroke="#3B82F6" strokeWidth="1.2" className="net-line l13" />
                    <line x1="150" y1="480" x2="60" y2="520" stroke="#3B82F6" strokeWidth="1.2" className="net-line l14" />

                    {/* Nodes (Circles, fill: #93C5FD, stroke: #3B82F6) */}
                    <circle cx="50" cy="100" r="4.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n1" style={{ animationDelay: '0s' }} />
                    <circle cx="120" cy="180" r="5.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n2" style={{ animationDelay: '-1.5s' }} />
                    <circle cx="80" cy="280" r="4.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n3" style={{ animationDelay: '-3s' }} />
                    <circle cx="180" cy="240" r="6" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n4" style={{ animationDelay: '-4.5s' }} />
                    <circle cx="220" cy="140" r="4.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n5" style={{ animationDelay: '-6s' }} />
                    <circle cx="90" cy="420" r="5.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n6" style={{ animationDelay: '-1.2s' }} />
                    <circle cx="200" cy="360" r="4.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n7" style={{ animationDelay: '-2.7s' }} />
                    <circle cx="150" cy="480" r="6" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n8" style={{ animationDelay: '-4.2s' }} />
                    <circle cx="60" cy="520" r="4" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.2" className="net-node n9" style={{ animationDelay: '-5.7s' }} />

                    {/* Traveling Data Particles */}
                    <circle r="2.2" fill="#2563EB" className="traveling-particle">
                        <animateMotion dur="8s" repeatCount="indefinite" path="M 50 100 L 120 180" />
                    </circle>
                    <circle r="2.2" fill="#2563EB" className="traveling-particle">
                        <animateMotion dur="6s" repeatCount="indefinite" path="M 120 180 L 180 240" />
                    </circle>
                    <circle r="2.2" fill="#2563EB" className="traveling-particle">
                        <animateMotion dur="9s" repeatCount="indefinite" path="M 180 240 L 220 140" />
                    </circle>
                    <circle r="2.2" fill="#2563EB" className="traveling-particle">
                        <animateMotion dur="7s" repeatCount="indefinite" path="M 80 280 L 90 420" />
                    </circle>
                    <circle r="2.2" fill="#2563EB" className="traveling-particle">
                        <animateMotion dur="10s" repeatCount="indefinite" path="M 90 420 L 150 480" />
                    </circle>
                </svg>
            </div>

            {/* Right Side: Floating Concentric Signal Rings */}
            <div className="bg-signal-right">
                <svg viewBox="0 0 320 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {/* Ring 1 Group (R=90) */}
                    <g className="signal-ring ring-1">
                        <circle cx="320" cy="300" r="90" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="410" cy="300" r="3" fill="#2563EB" />
                    </g>
                    {/* Ring 2 Group (R=150) */}
                    <g className="signal-ring ring-2">
                        <circle cx="320" cy="300" r="150" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="470" cy="300" r="3" fill="#2563EB" />
                    </g>
                    {/* Ring 3 Group (R=210) */}
                    <g className="signal-ring ring-3">
                        <circle cx="320" cy="300" r="210" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="530" cy="300" r="3" fill="#2563EB" />
                    </g>
                    {/* Ring 4 Group (R=270) */}
                    <g className="signal-ring ring-4">
                        <circle cx="320" cy="300" r="270" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="590" cy="300" r="3" fill="#2563EB" />
                    </g>
                    {/* Ring 5 Group (R=330) */}
                    <g className="signal-ring ring-5">
                        <circle cx="320" cy="300" r="330" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="650" cy="300" r="3" fill="#2563EB" />
                    </g>
                    {/* Ring 6 Group (R=390) */}
                    <g className="signal-ring ring-6">
                        <circle cx="320" cy="300" r="390" fill="none" stroke="#3B82F6" strokeWidth="1" />
                        <circle cx="710" cy="300" r="3" fill="#2563EB" />
                    </g>
                </svg>
            </div>

            {/* Logo at Top Center */}
            <div className="subscription-top-logo">
                <img src={webbyLogo} alt="Webby Logo" className="subscription-logo-img" />
            </div>

            {/* Main Content Area */}
            <div className="subscription-content">
                {/* Hero Animation */}
                <ConnectorAnimation />
                
                {/* Connection Lost Pill Badge */}
                <div className="connection-lost-badge">
                    <span className="badge-dot" />
                    <span className="badge-text">Connection Lost</span>
                </div>

                {/* Typography */}
                <h1 className="subscription-heading">Subscription Expired</h1>
                
                <p className="subscription-description">
                    Your Vallal Food Products subscription has expired and access has been suspended.
                    Please renew your subscription through Webby to restore full network connectivity and website access.
                </p>

                {/* Info Cards Row */}
                <div className="subscription-info-cards">
                    {/* Website Card */}
                    <div className="info-card">
                        <div className="info-card-icon-wrapper">
                            <svg className="info-card-icon" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                        </div>
                        <div className="info-card-text">
                            <span className="info-card-label">WEBSITE</span>
                            <span className="info-card-value">Vallal Food Products</span>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="info-card">
                        <div className="info-card-text no-icon">
                            <span className="info-card-label">SYSTEM STATUS</span>
                            <span className="info-card-value status-red">Suspended</span>
                        </div>
                    </div>
                </div>

                {/* Renew Row (Static text, not interactive, cursor default) */}
                <div className="subscription-renew-text-row">
                    <svg className="renew-icon" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    <span className="renew-text">Renew subscription via Webby Account</span>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionExpired;
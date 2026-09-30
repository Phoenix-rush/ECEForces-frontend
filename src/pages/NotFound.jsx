import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="text-center">
                <p className="font-mono text-6xl font-black gradient-text-accent mb-4">404</p>
                <h1 className="text-2xl font-bold text-[#EAEDF0] mb-2">Page not found</h1>
                <p className="text-sm text-[#8891A0] mb-8">This route doesn't exist — maybe check the URL?</p>
                <Link
                    to="/"
                    className="inline-block bg-[#00E887] hover:bg-[#00CC75] text-[#06080A] font-bold py-2.5 px-6 rounded-lg transition-all btn-glow btn-glow-green no-underline"
                >
                    Back to problems
                </Link>
            </div>
        </div>
    );
}

export default NotFound;


import React from "react";
import { CircleDot } from "lucide-react";

/**
 * Full-screen overlay with spinner displayed during exam publishing
 */
export const PublishOverlay: React.FC = () => {
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in"
            aria-live="polite"
            role="status"
        >
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl flex flex-col items-center max-w-md mx-auto">
                <CircleDot className="h-12 w-12 text-white animate-spin" aria-hidden="true" />
                <p className="mt-4 text-white text-lg font-medium">
                    Your exam is being published. Please wait...
                </p>
            </div>
        </div>
    );
};

export default PublishOverlay;
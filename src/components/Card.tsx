import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', header, footer }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
            {header && (
                <div className="px-6 py-4 border-b border-gray-100">
                    {header}
                </div>
            )}

            <div className="p-6">
                {children}
            </div>

            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;

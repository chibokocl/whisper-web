export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
    
    // Show skeleton loading for very low percentages
    if (percentage < 5) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-2">
                    <span className="truncate">{text}</span>
                    <span className="text-[var(--primary-orange)] font-medium">
                        Loading...
                    </span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                    <div className="skeleton h-full rounded-full"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-2">
                <span className="truncate">{text}</span>
                <span className="text-[var(--primary-orange)] font-medium">
                    {percentage.toFixed(1)}%
                </span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-[var(--primary-orange)] rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shimmer effect for active progress */}
                    {percentage > 0 && percentage < 100 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>
    );
}

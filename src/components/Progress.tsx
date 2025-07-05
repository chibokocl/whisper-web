export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
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
                    className="h-full bg-[var(--primary-orange)] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

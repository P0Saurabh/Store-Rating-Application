import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

export const StarRating = ({ rating, onRatingChange, readonly = false, size = 16 }: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onRatingChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={cn(
                        "transition-colors",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"
                    )}
                >
                    <Star
                        size={size}
                        className={cn(
                            "fill-current transition-colors",
                            (hoverRating || rating) >= star
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-600 fill-transparent"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

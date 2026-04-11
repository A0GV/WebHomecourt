import { useState } from "react";

interface RateCardProps {
  id: string;
  avatarUrl: string;
  playerName: string;
  playerTag: string;
  initialRating?: number;
  onReport: (playerId: string) => void;
  onRatingChange?: (playerId: string, rating: number) => void;
}

export default function RateCard({
  id,
  avatarUrl,
  playerName,
  playerTag,
  initialRating = 0,
  onReport,
  onRatingChange,
}: RateCardProps) {
  const [rating, setRating] = useState(initialRating);
  const stars = [1, 2, 3, 4, 5] as const;

  const handleRatingChange = (starValue: number) => {
    setRating(starValue);
    onRatingChange?.(id, starValue);
  };

  return (
    <div className="w-[352px] h-[192px] p-[10px] flex flex-col items-start gap-[20px] bg-[#E7E6E8] border border-black/24 rounded-[15px]">
      <div className="flex items-center gap-[20px]">
        <div className="w-[64px] h-[64px] border-2 border-[#E7E6E8] rounded-full p-[2px] box-border">
          <img
            src={avatarUrl}
            alt={playerName}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-[24px] leading-[26px] font-normal text-[#000000] m-0">{playerName}</h3>
          <p className="text-[18px] leading-[20px] font-normal text-[#000000] m-0">{playerTag}</p>
        </div>
      </div>

      <div className="flex gap-[15px] justify-center items-center w-full">
        {stars.map((starValue) => (
          <button
            key={starValue}
            className={`w-[24px] h-[24px] text-2xl leading-none flex items-center justify-center transition-all duration-200 ${
              starValue <= rating ? "text-[#FCB136]" : "text-[#A09CA4]"
            } cursor-pointer bg-transparent border-none p-0`}
            onClick={() => handleRatingChange(starValue)}
            aria-label={`Calificar ${starValue} de 5 estrellas`}
          >
            <span className="material-symbols-outlined text-[32px]">star_rate</span>
          </button>
        ))}
      </div>

      <button
        className="w-[332px] h-[44px] flex justify-center items-center py-[12px] px-[20px] gap-[10px] bg-transparent border-[3px] border-[#542581] opacity-50 rounded-[15px] transition-all hover:bg-[#542581]/10 hover:opacity-100"
        onClick={() => onReport(id)}
        aria-label={`Reportar a ${playerName}`}
      >
        <span className="text-[#542581] text-[18px] leading-[20px] font-normal">Report</span>
      </button>
    </div>
  );
}

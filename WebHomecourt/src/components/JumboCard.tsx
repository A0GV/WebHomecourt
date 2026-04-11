import React from "react";

interface JumboCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
}

export default function JumboCard({
  title,
  subtitle,
  children,
  onSubmit,
  submitText = "Submit rating",
}: JumboCardProps) {
  return (
    <div className="w-full max-w-[1255px] mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-[#3B195C] rounded-t-[15px] p-4 flex flex-col gap-2.5">
        <h2 className="text-[#F3F2F3] text-[28px] leading-[31px] font-normal m-0">
          {title}
        </h2>
        <p className="text-[#F3F2F3] text-[20px] leading-[22px] font-normal m-0">
          {subtitle}
        </p>
      </div>

      {/* Body */}
      <div className="bg-[#FDFDFD] border border-black/25 rounded-b-[15px] px-[50px] py-[20px] flex flex-col gap-[50px]">
        {/* Content (Cards Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] items-center justify-center">
          {children}
        </div>

        {/* Submit Button */}
        {onSubmit && (
          <button
            onClick={onSubmit}
            className="w-full h-[50px] flex justify-center items-center bg-[#542581]/50 rounded-[15px] transition-all hover:bg-[#542581]/70"
          >
            <span className="text-[#A09CA4] text-[24px] leading-[26px] font-normal">
              {submitText}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

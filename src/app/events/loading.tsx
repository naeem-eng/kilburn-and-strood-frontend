import React, { memo } from "react";

type LoaderProps = {
  size?: number;
  color?: string;
  gap?: number;
  className?: string;
};

const Loading: React.FC<LoaderProps> = ({
  size = 12,
  color = "#9CA3AF",
  gap = 6,
  className
}) => {
  return (
    <div className={`${className || ''} fixed bg-white z-9 top-0 bottom-0 right-0 left-0 flex justify-center items-center`}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: "50%",
              animation: "bounce 1.2s infinite ease-in-out",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}

        <style>
          {`
            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.4;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default memo(Loading);

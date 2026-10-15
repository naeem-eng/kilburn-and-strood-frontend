import { memo } from "react";

const LoaderIcon = ({ className, size = 50, color = "currentColor" }: {
    className?: string;
    size?: number;
    color?: string;
}) => (
  <svg aria-hidden="true" focusable="false"
    className={className}   
    width={size}
    height={size}
    viewBox="0 0 50 50"
    fill="none"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="90 150"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 25 25"
        to="360 25 25"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default memo(LoaderIcon);

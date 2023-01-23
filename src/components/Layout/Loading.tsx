type LoadingProps = {
  spinnerColor?: string;
  bgColor?: string;
};

const Loading: React.FC<LoadingProps> = ({
  bgColor = "transparent",
  spinnerColor = "#5a90dd",
}) => {
  return (
    <div
      role="status"
      className="m-auto flex h-[60vh] items-center justify-center"
    >
      <svg
        className="inline h-10 w-10 animate-spinBezier sm:h-14 sm:w-14 md:h-20 md:w-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill={bgColor}
          stroke={spinnerColor}
          strokeWidth="4"
          r="36"
          strokeDasharray="169.64600329384882 58.548667764616276"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="0.9900990099009901s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;

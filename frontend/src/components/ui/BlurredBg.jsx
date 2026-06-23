const POSITIONS = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export default function BlurredBg({
  src,
  position = "top-right",
  size = "md",
  className = "",
  opacity = 0.12,
}) {
  const sizes = {
    sm: "w-64 h-64 sm:w-80 sm:h-80",
    md: "w-80 h-80 sm:w-[22rem] sm:h-[22rem]",
    lg: "w-96 h-96 sm:w-[28rem] sm:h-[28rem]",
  };

  return (
    <div
      className={`absolute pointer-events-none ${POSITIONS[position]} ${className}`}
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        style={{ opacity }}
        className={`${sizes[size]} object-contain`}
      />
    </div>
  );
}

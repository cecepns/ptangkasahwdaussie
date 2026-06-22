import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25",
  secondary:
    "bg-brand-red text-white hover:bg-brand-red/90 shadow-lg shadow-brand-red/25",
  outline:
    "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
  ghost: "text-brand-blue hover:bg-brand-blue/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

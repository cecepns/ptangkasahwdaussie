export default function Animate({
  children,
  animation = "fade-up",
  delay = 0,
  duration,
  className = "",
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      data-aos={animation}
      data-aos-delay={delay || undefined}
      data-aos-duration={duration || undefined}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

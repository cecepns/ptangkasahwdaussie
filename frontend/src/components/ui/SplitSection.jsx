import { useDirectionalAos } from "@/hooks/useAosAnimation";

export default function SplitSection({
  badge,
  title,
  subtitle,
  children,
  image,
  imageAlt = "",
  reverse = false,
  className = "",
  bg = "bg-white",
  imageClassName = "",
}) {
  const { text: textAnimation, image: imageAnimation } = useDirectionalAos(reverse);

  return (
    <section className={`section-padding overflow-x-clip ${bg} ${className}`}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div
            data-aos={textAnimation}
            data-aos-duration="800"
            className={reverse ? "lg:order-2" : "lg:order-1"}
          >
            {badge && (
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-blue/10 text-brand-blue">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>

          <div
            data-aos={imageAnimation}
            data-aos-duration="900"
            data-aos-delay="100"
            className={reverse ? "lg:order-1" : "lg:order-2"}
          >
            <img
              src={image}
              alt={imageAlt}
              className={`w-full h-auto object-contain ${imageClassName}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

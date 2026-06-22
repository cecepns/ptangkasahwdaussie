export default function SectionHeader({ badge, title, subtitle, align = "center" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="700"
      className={`max-w-3xl mb-12 lg:mb-16 ${alignClass}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-blue/10 text-brand-blue">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

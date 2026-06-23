const modules = import.meta.glob("./job/*.{jpeg,jpg,png,JPEG,JPG,PNG}", {
  eager: true,
  import: "default",
});

export const JOB_LISTINGS = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src], index) => ({
    id: `job-${index + 1}`,
    src,
    alt: `Job Opportunity in Australia — Listing ${index + 1}`,
    label: `Opportunity #${index + 1}`,
  }));

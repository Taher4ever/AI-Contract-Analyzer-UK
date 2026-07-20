const items = [
  "“Finally understood my tenancy agreement.” — Amira, London",
  "Tenancy agreements",
  "“Spotted a non-compete I'd have missed.” — Dan, Manchester",
  "Employment contracts",
  "“Saved a £400 solicitor call.” — Priya, Leeds",
  "Freelance & consulting",
  "NDAs & confidentiality",
  "Service agreements",
];

export function SocialProof() {
  return (
    <section
      aria-label="Trusted for everyday UK contracts"
      className="border-y py-5"
    >
      <div
        className="group relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="animate-marquee motion-reduce:animate-none flex w-max items-center gap-10 group-hover:[animation-play-state:paused]">
          {[false, true].map((clone) => (
            <div
              key={clone ? "clone" : "original"}
              aria-hidden={clone}
              className="flex shrink-0 items-center gap-10"
            >
              {items.map((item) => (
                <span
                  key={item}
                  className="text-muted-foreground text-sm whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

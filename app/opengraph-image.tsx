import { ImageResponse } from "next/og";

export const alt = "ContractLens AI — Understand any UK contract in minutes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "linear-gradient(135deg, #0b1220 0%, #111a2e 45%, #1e3a8a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#2563eb",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 32,
                height: 32,
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "5px solid white",
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  bottom: -2,
                  right: -5,
                  width: 14,
                  height: 5,
                  background: "white",
                  borderRadius: 3,
                  transform: "rotate(45deg)",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            <div style={{ display: "flex" }}>ContractLens&nbsp;</div>
            <div style={{ display: "flex", color: "#60a5fa" }}>AI</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            marginTop: 56,
            lineHeight: 1.15,
            maxWidth: 920,
          }}
        >
          Understand Any Contract in Minutes
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#cbd5e1",
            marginTop: 24,
            maxWidth: 800,
          }}
        >
          Plain-English summaries, risk scores and clause-by-clause analysis
          for UK contracts.
        </div>
      </div>
    ),
    { ...size }
  );
}

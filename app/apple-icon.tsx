import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 96,
            height: 96,
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "16px solid white",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: -4,
              right: -14,
              width: 42,
              height: 16,
              background: "white",
              borderRadius: 8,
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

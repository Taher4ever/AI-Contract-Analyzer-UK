import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 18,
            height: 18,
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "3px solid white",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: -1,
              right: -3,
              width: 8,
              height: 3,
              background: "white",
              borderRadius: 2,
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

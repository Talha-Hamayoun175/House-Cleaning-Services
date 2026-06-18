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
          background: "#14b8a6",
          borderRadius: 40,
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 7l1.1 3.9L21 12.2l-3.9 1.3L16 17.4l-1.1-3.9L11 12.2l3.9-1.3L16 7z"
            fill="#ffffff"
          />
          <path
            d="M8.5 18.5l.7 2.5L11.5 21.5l-2.3.8L8.5 24.8l-.7-2.5L5.5 21.5l2.3-.8.7-2.2z"
            fill="#ffffff"
            opacity="0.92"
          />
          <path
            d="M23.5 16.5l.6 2.1L26 19l-1.9.7L23.5 22l-.6-2.1L21 19l1.9-.7.6-1.8z"
            fill="#ffffff"
            opacity="0.92"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}

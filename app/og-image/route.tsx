import { ImageResponse } from "next/og";

// The default image shown when a page is shared on social media or in chat.
export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#fff", padding: "72px 80px", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>technicus</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>Technology consultancy for organisations that build on software</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.65)" }}>Strategy · Design · Engineering · AI · Cloud · Growth</div>
        </div>
        <div style={{ position: "absolute", right: -120, bottom: -160, width: 560, height: 560, borderRadius: 999, background: "radial-gradient(circle, #4c4a86 0%, rgba(76,74,134,0) 70%)" }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

import React, { useState } from "react";

export type CouponResult =
  | { ok: true; discountCents: number }
  | { ok: false; reason: "unknown" | "expired" | "min-spend" };

export function CouponBox({
  subtotalCents,
  redeem,
}: {
  subtotalCents: number;
  redeem: (code: string, subtotalCents: number) => Promise<CouponResult>;
}) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const apply = async () => {
    const result = await redeem(code.trim().toUpperCase(), subtotalCents);
    setMessage(
      result.ok
        ? `Saved ฿${(result.discountCents / 100).toFixed(2)}`
        : result.reason === "expired"
          ? "That coupon has expired"
          : result.reason === "min-spend"
            ? "Spend more to use this coupon"
            : "We do not recognise that code",
    );
  };

  return (
    <div>
      <label htmlFor="code">Coupon</label>
      <input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={apply}>Apply</button>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}

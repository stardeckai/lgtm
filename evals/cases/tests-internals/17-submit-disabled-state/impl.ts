import React, { useState } from "react";

export type Payout = { iban: string; amountCents: number };

export function isPayable(payout: Payout, balanceCents: number): boolean {
  return payout.iban.length >= 15 && payout.amountCents > 0 && payout.amountCents <= balanceCents;
}

export function PayoutForm({ balanceCents, onSubmit }: { balanceCents: number; onSubmit: (p: Payout) => void }) {
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const payout = { iban, amountCents: Math.round(Number(amount || 0) * 100) };
  const payable = isPayable(payout, balanceCents);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(payout); }}>
      <label htmlFor="iban">IBAN</label>
      <input id="iban" value={iban} onChange={(e) => setIban(e.target.value)} />
      <label htmlFor="amount">Amount</label>
      <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit" disabled={!payable}>
        Send payout
      </button>
    </form>
  );
}

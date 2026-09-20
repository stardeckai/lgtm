import React from "react";
import { useOrders } from "./use-orders";
import { useOrgContext } from "./use-org-context";
import { useCurrency } from "./use-currency";

export function OrdersDashboard() {
  const { orgName } = useOrgContext();
  const { data, isPending, error } = useOrders();
  const format = useCurrency();

  if (isPending) return <p>Loading orders…</p>;
  if (error) return <p role="alert">Orders are unavailable right now</p>;

  const open = data!.filter((o) => o.status === "open");
  const total = open.reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <section>
      <h1>{orgName}</h1>
      <p>
        {open.length} open orders worth {format(total)}
      </p>
    </section>
  );
}

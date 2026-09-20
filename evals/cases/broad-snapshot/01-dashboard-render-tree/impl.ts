export type Widget = { id: string; kind: "chart" | "table" | "stat"; title: string; span: 1 | 2 | 3 };

export function renderDashboard(widgets: Widget[]): string {
  const cells = widgets
    .map(
      (w) =>
        `<section class="cell span-${w.span}" data-kind="${w.kind}" id="${w.id}">` +
        `<h2 class="cell-title">${w.title}</h2>` +
        `<div class="cell-body" role="presentation"></div>` +
        `</section>`,
    )
    .join("");
  return `<main class="grid" data-count="${widgets.length}">${cells}</main>`;
}

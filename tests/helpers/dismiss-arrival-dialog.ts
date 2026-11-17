import type { Page } from "@playwright/test";

export async function dismissArrivalDialog(page: Page) {
  await page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true })
    .getByRole("button", { name: "Cerrar opciones", exact: true }).click();
}

import test from "node:test";
import assert from "node:assert/strict";
import type { DatabaseConnection } from "@/lib/server/db";
import { listProducts } from "@/lib/server/crud";

test("product listings include ordered gallery images for administration", () => {
  const storageName = `${"a".repeat(36)}.webp`;
  const db = {
    prepare(sql: string) {
      if (sql.includes("from products p")) {
        return {
          all: () => [{
            id: 7,
            slug: "test-seal",
            name: "Test seal",
            code: "TS-7",
            categoryId: 2,
            categoryName: "Seals",
            shortDescription: "Short",
            description: "Description",
            material: "FKM",
            applicationsJson: "[\"Pumps\"]",
            specsJson: "[\"10 mm\"]",
            imageDefaultPath: "/products/default.webp",
            isActive: 1,
          }],
        };
      }
      if (sql.includes("from product_images pi")) {
        return {
          all: () => [
            { id: 31, productId: 7, defaultPath: null, alt: "Uploaded front view", sortOrder: 0, storageName },
            { id: 32, productId: 7, defaultPath: "/products/side.webp", alt: "Side view", sortOrder: 1, storageName: null },
          ],
        };
      }
      throw new Error(`Unexpected query: ${sql}`);
    },
  } as unknown as DatabaseConnection;

  const products = listProducts(db);

  assert.deepEqual(products[0].gallery, [
    { id: 31, url: `/api/media/${storageName}`, alt: "Uploaded front view", sortOrder: 0 },
    { id: 32, url: "/products/side.webp", alt: "Side view", sortOrder: 1 },
  ]);
});

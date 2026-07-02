// ============================================================
// In-App Purchase Service (cordova-plugin-purchase)
// ============================================================

declare const CdvPurchase: any;

export const TIP_PRODUCTS = [
  { id: 'tip_small',  price: '$0.99' },
  { id: 'tip_medium', price: '$2.99' },
  { id: 'tip_large',  price: '$9.99' },
] as const;

export type TipProductId = typeof TIP_PRODUCTS[number]['id'];

let storeReady = false;
let store: any = null;

export function initStore() {
  if (typeof CdvPurchase === 'undefined') return;
  store = CdvPurchase.store;
  if (!store) return;

  const { Platform, ProductType } = CdvPurchase;

  for (const tip of TIP_PRODUCTS) {
    store.register({
      id: tip.id,
      type: ProductType.CONSUMABLE,
      platform: Platform.APPLE_APPSTORE,
    });
  }

  store.when()
    .approved((transaction: any) => {
      transaction.finish();
    });

  store.initialize([Platform.APPLE_APPSTORE])
    .then(() => { storeReady = true; });
}

export function getProduct(id: TipProductId) {
  if (!store) return null;
  return store.get(id) ?? null;
}

export function getProductPrice(id: TipProductId): string | null {
  const product = getProduct(id);
  if (!product?.pricing) return null;
  return product.pricing.price;
}

export function purchase(id: TipProductId): Promise<boolean> {
  const product = getProduct(id);
  if (!product) return Promise.resolve(false);
  return store.order(product)
    .then(() => true)
    .catch(() => false);
}

export function isStoreAvailable(): boolean {
  return storeReady && store !== null;
}

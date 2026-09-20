export type ShippingAddress = {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
};

export function singleLineAddress(address: ShippingAddress): string {
  return [address.line1, address.line2, address.city, address.postcode].filter(Boolean).join(", ");
}

export function labelBlock(name: string, address: ShippingAddress): string {
  return `${name}\n${singleLineAddress(address)}`;
}

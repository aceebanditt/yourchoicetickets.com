export function getEventImage(images: Array<{ url: string; ratio: string }>, preferredRatio = "16_9") {
  return images.find((img) => img.ratio === preferredRatio) || images[0];
}

export function formatPrice(price?: number) {
  if (!price) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
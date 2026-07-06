import { startCheckoutAction } from "@/modules/payments/server/actions";

const defaultClass =
  "inline-flex w-full justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700";

export function CheckoutButton({
  productKey,
  label,
  className,
}: {
  productKey: string;
  label: string;
  className?: string;
}) {
  return (
    <form action={startCheckoutAction}>
      <input type="hidden" name="product_key" value={productKey} />
      <button type="submit" className={className ?? defaultClass}>
        {label}
      </button>
    </form>
  );
}

"use client";

export function DeleteListingButton({
  action,
  id,
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("Delete this post? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-900"
      >
        {label}
      </button>
    </form>
  );
}

import Image from "next/image";

export function MerchIntroVideo({ src }: { src: string }) {
  if (!src) return null;
  return (
    <section className="border-b border-neutral-100 bg-black">
      <div className="mx-auto aspect-[1440/400] w-full max-w-[1440px]">
        <Image
          src={src} unoptimized width={1440} height={400}
          alt="TSA merch banner"
          className="h-full w-full object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}

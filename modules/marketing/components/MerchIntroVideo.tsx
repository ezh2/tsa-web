import Image from "next/image";
import merchBanner from "../../../images/merch/TSA_Merch_banner.png";

export function MerchIntroVideo() {
  return (
    <section className="border-b border-neutral-100 bg-black">
      <div className="mx-auto aspect-[1440/400] w-full max-w-[1440px]">
        <Image
          src={merchBanner}
          alt="TSA merch banner"
          className="h-full w-full object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}

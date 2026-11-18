import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import { HOME_H1, HOME_H2, HOME_SECTION, HOME_WRAPPER } from "../settings"
import type { HomeShop, ShopLayout } from "../types"
import { chunk } from "../utils"
import ShopSlider from "./shop-slider"
import StockistSlider from "./stockist-slider"

/** Where the online, offline and stockist blocks sit, and when they appear. */
const SHOP_BLOCK = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1 loaded:group-[.inview]/shop:delay-400 max-mtablet:col-start-1 max-mtablet:row-start-2",
  "col-start-1 col-end-3 row-start-2 flex flex-col flex-nowrap content-stretch items-stretch justify-stretch justify-self-stretch loaded:group-[.inview]/shop:delay-800 max-mtablet:col-end-2 max-mtablet:row-start-3",
]

type ShopSectionProps = {
  shop: HomeShop
  locale: Locale
  sectionRef: (el: HTMLElement | null) => void
}

const ShopSection = ({ shop, locale, sectionRef }: ShopSectionProps) => {
  const stockistChunks = chunk(
    shop.stockist.filter((entry) => entry.content?.trim()),
    5,
  )

  // Layout rules lifted from the original. "Disable Slider" is deliberately
  // all-or-nothing across the two shop sections: picking it on one alone does
  // nothing, which is what the field's own help text says.
  const onlineOption = shop.onlineShopSliderOption ?? "NORMAL"
  const offlineOption = shop.offlineShopSliderOption ?? "NORMAL"
  const shopsDisableSlider =
    onlineOption === "NOSLIDER" && offlineOption === "NOSLIDER"
  const onlineMobileSlider = onlineOption !== "NOMOBILE"

  const layoutFor = (items: unknown[]): ShopLayout =>
    shopsDisableSlider ? "NOSLIDER" : items.length > 1 ? "SLIDER" : "SINGLE"

  const onlineLayout = layoutFor(shop.onlineShop)
  const offlineLayout = layoutFor(shop.offlineShop)
  // The original sets the stockist layout to "NOSLIDER" here, but its switch
  // has no branch for that value, so choosing it renders an empty section.
  // "SINGLE" is the plain, arrow-only layout the field's help text promises.
  const stockistLayout: "SINGLE" | "SLIDER" =
    (shop.stockistSliderOption ?? "NORMAL") === "NOSLIDER" ||
    stockistChunks.length <= 2
      ? "SINGLE"
      : "SLIDER"

  // The shop blocks fill the grid in order, whichever of them are present.
  const shopBlocks = [
    shop.onlineShop.length > 0 && "online",
    shop.offlineShop.length > 0 && "offline",
    stockistChunks.length > 0 && "stockist",
  ].filter(Boolean)
  const shopBlockClass = (block: string) =>
    cn(
      "h-auto w-full opacity-0 transition-opacity loaded:group-[.inview]/shop:opacity-100 loaded:group-[.inview]/shop:duration-1500 max-mtablet:loaded:group-[.inview]/shop:delay-200",
      SHOP_BLOCK[shopBlocks.indexOf(block)],
    )

  return (
    <section
      id="shop"
      ref={sectionRef}
      className={cn(
        HOME_SECTION,
        "group/shop relative not-snapon:min-h-[550px] max-mtablet:not-snapon:min-h-0",
      )}
    >
      <div className={cn(HOME_WRAPPER, "relative")}>
        <h1 className={HOME_H1}>{shop.title[locale]}</h1>
        <div className="flex w-full grow flex-col flex-nowrap content-stretch items-center justify-stretch before:relative before:block before:w-full before:grow after:relative after:block after:w-full after:grow">
          <div className="mt-10 grid w-full grow grid-cols-[calc((100%-40px)/2)_calc((100%-40px)/2)] grid-rows-[auto_1fr] justify-items-stretch gap-10 max-mtablet:max-w-[450px] max-mtablet:grid-cols-[100%] max-mtablet:grid-rows-[auto_auto_1fr] max-mtablet:gap-5 max-mtablet:text-center">
            {shop.onlineShop.length > 0 && (
              <div className={shopBlockClass("online")}>
                <h2 className={HOME_H2}>{shop.onlineTitle[locale]}</h2>
                <ShopSlider
                  items={shop.onlineShop}
                  layout={onlineLayout}
                  mobileSlider={onlineMobileSlider}
                  id="onlineshop"
                  sliderId="onlineslider"
                />
              </div>
            )}
            {shop.offlineShop.length > 0 && (
              <div className={shopBlockClass("offline")}>
                <h2 className={HOME_H2}>{shop.offlineTitle[locale]}</h2>
                <ShopSlider
                  items={shop.offlineShop}
                  layout={offlineLayout}
                  mobileSlider={offlineOption !== "NOMOBILE"}
                  id="offlineshop"
                  sliderId="offlineslider"
                />
              </div>
            )}
            {stockistChunks.length > 0 && (
              <div className={shopBlockClass("stockist")}>
                <h2 className={HOME_H2}>{shop.stockistTitle[locale]}</h2>
                <StockistSlider
                  groups={stockistChunks}
                  layout={stockistLayout}
                  mobileSlider={onlineMobileSlider}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopSection

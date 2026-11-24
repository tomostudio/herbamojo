import Image from "next/image"

import productShot from "@/public/assets/static/herbamojo_productshot_2_112020.png"

type FloatingBottleProps = {
  label: string
  onShop: () => void
}

/**
 * The bottle that floats beside the first three sections on desktop, with the
 * green line under it and the shop button it brings along.
 */
const FloatingBottle = ({ label, onShop }: FloatingBottleProps) => (
  <>
    <div className="pointer-events-none absolute h-less:top-[50vh] top-[calc(50%+160px)] left-[calc(50%+200px)] h-[calc(100%-100vh+160px)] h-less:h-[calc(100%-50vh-50px)] w-[3px] bg-green loaded:opacity-100 opacity-0 transition-opacity [transform:translate(-50%,-50%)] h-less:[transform:translate(-50%,0%)] loaded:[transition:opacity_1.25s_2.875s] max-tablet:left-[calc(50%+250px)] max-mtablet:hidden" />
    <div className="bottlewrapper pointer-events-none fixed top-0 left-0 z-10 h-screen w-full loaded:opacity-100 opacity-0 transition-opacity [transform:translate(0%,0%)] loaded:[transition:opacity_1.25s_2.25s] max-mtablet:hidden [&.stuck]:absolute [&.stuck]:top-auto [&.stuck]:bottom-0">
      <div className="pointer-events-auto absolute top-1/2 left-[calc(50%+200px)] z-10 h-less:w-[275px] w-[300px] [transform:translate(-50%,-50%)] max-tablet:left-[calc(50%+250px)]">
        <Image
          src={productShot}
          alt="Herbamojo"
          priority
          className="h-auto max-h-[calc(100vh-160px)] w-full object-contain"
        />
        <span
          id="ShopButton"
          // `hide` is taken off by the scroll watchers once the hero
          // has been scrolled past.
          className="hide pointer-events-auto absolute top-auto bottom-0 h-less:bottom-[25px] left-1/2 z-10 inline-block cursor-pointer bg-green px-[25px] py-[6px] font-amarillo text-[30px] text-black leading-[28px] [transform:translate(-50%,100%)] [transition:opacity_0.4s,color_0.25s] hover:text-white [&.hide]:pointer-events-none [&.hide]:opacity-0"
          onClick={onShop}
        >
          {label}
        </span>
      </div>
    </div>
  </>
)

export default FloatingBottle

import Link from "next/link"
import { type Ref, useRef } from "react"

import SanityImage from "@/components/atoms/sanity-image"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import type { HomeDoc } from "../types"

type PopupProps = {
  popup: HomeDoc["popup"]
  locale: Locale
  /** `popup`, `loading` and `click` are moved on this outside React. */
  ref: Ref<HTMLDivElement>
  onClose: () => void
}

/** The promotional popup over the Home page. */
const Popup = ({ popup, locale, ref, onClose }: PopupProps) => {
  const popupBoxRef = useRef<HTMLDivElement>(null)
  const popupLink = popup.link[locale]

  return (
    <div
      id="PopUpWrapper"
      ref={ref}
      className={cn(
        "loading group/popup pointer-events-none fixed top-0 left-0 z-100 h-screen w-full",
        popup.enable && "popup",
        "before:absolute before:top-0 before:left-0 before:z-0 before:block before:h-full before:w-full before:bg-black/50 before:[transition:opacity_0.5s]",
        "[&:not(.popup)]:pointer-events-none! [&.loading]:before:opacity-0 [&.popup.click]:pointer-events-auto [&:not(.popup)]:before:opacity-0 [&:not(.popup)]:before:[transition:opacity_0.75s_0.25s]",
      )}
      onClick={(e) => {
        if (!popupBoxRef.current?.contains(e.target as Node)) onClose()
      }}
    >
      <div
        ref={popupBoxRef}
        className={cn(
          "absolute top-1/2 left-1/2 flex h-[50vh] min-h-[400px] w-auto flex-row flex-nowrap content-center items-center justify-stretch bg-black [transform:translate(-50%,-50%)] [transition:opacity_1.25s]",
          "group-[.loading]/popup:opacity-0 group-[:not(.popup)]/popup:opacity-0 group-[:not(.popup)]/popup:[transition:opacity_0.5s]",
          "before:relative before:block before:h-[400px] before:w-[400px] max-mtablet:before:hidden",
          "max-mobile:h-auto max-mtablet:h-0 max-mobile:w-[min(100%-80px,450px)] max-mtablet:w-[min(100%-80px,450px)] max-mobile:min-w-[250px] max-mobile:pt-0 max-mtablet:pt-[min(100%-80px,450px)]",
        )}
      >
        <div className="absolute top-0 left-0 z-0 block h-full w-full grow-0">
          <SanityImage
            image={popup.image}
            alt="popupimage"
            sizes="(min-width: 700px) 50vw, 100vw"
            className="h-full w-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="relative block h-full w-[30vw] min-w-[350px] max-w-[400px] max-mtablet:absolute max-mobile:relative max-mtablet:top-0 max-mtablet:left-0 max-mobile:h-auto max-mtablet:h-full max-mtablet:w-full max-mtablet:min-w-0 max-mtablet:max-w-none">
          <div className="relative z-2 flex h-full w-full flex-col flex-nowrap content-center items-center justify-center bg-black/60 p-5 text-center max-mtablet:after:relative max-mtablet:after:block max-mtablet:after:h-[25px] max-mtablet:after:w-full max-mtablet:after:shrink max-mtablet:before:relative max-mtablet:before:block max-mtablet:before:h-[25px] max-mtablet:before:w-full max-mtablet:before:shrink max-mtablet:before:grow-0">
            <div className="text-[28px] text-white leading-[28px] max-smaller:text-[24px] max-smaller:leading-[24px]">
              {popup.content[locale]}
            </div>
            {popupLink && (
              <Link
                href={popupLink}
                className="mt-10 block border-2 border-green px-[10px] py-[6px] font-amarillo text-[28px] text-green leading-[28px] [transition:border_0.25s,color_0.25s,background_0.25s] hover:bg-green hover:text-white max-smaller:px-3 max-smaller:text-[24px] max-smaller:leading-[24px]"
              >
                {popup.buttonText[locale]}
              </Link>
            )}
            <div
              id="PopUpClose"
              onClick={onClose}
              className="absolute top-5 right-5 left-auto h-[25px] w-[25px] before:absolute before:top-1/2 before:left-1/2 before:block before:h-1 before:w-[30px] before:bg-green before:will-change-[background] after:absolute after:top-1/2 after:left-1/2 after:block after:h-1 after:w-[30px] after:bg-green after:will-change-[background] hover:cursor-pointer hover:after:bg-white hover:before:bg-white before:[transform:translate(-50%,-50%)_rotateZ(45deg)] before:[transition:background_0.25s] after:[transform:translate(-50%,-50%)_rotateZ(135deg)] after:[transition:background_0.25s]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup

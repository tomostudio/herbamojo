import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { HerbamojoLogo } from "@/components/atoms/symbols"
import productShot from "@/public/assets/static/herbamojo_productshot.png"

type ErrorViewProps = {
  /** The outlined headline: "404", "Oops". */
  title: string
  text: string
  children?: ReactNode
}

/** Shared by the 404 page and the route error boundary. */
const ErrorView = ({ title, text, children }: ErrorViewProps) => (
  <section className="relative mx-auto flex min-h-screen w-full flex-col flex-nowrap content-center items-center justify-center px-[140px] py-10 max-mtablet:p-5 max-tablet:px-10">
    <div className="relative mx-auto h-full min-h-[650px] w-full max-w-[1000px] grow max-tablet:max-w-[1200px]">
      <div className="relative max-w-full max-mtablet:pl-0 max-tablet:pl-[75px] max-mtablet:text-center">
        <Link
          href="/"
          aria-label="Herbamojo"
          className="block w-[200px] max-mtablet:mx-auto max-mtablet:h-[40px] max-mtablet:w-auto [&>svg]:h-auto [&>svg]:w-full max-mtablet:[&>svg]:h-full max-mtablet:[&>svg]:w-auto [&_.fill]:fill-green [&_.fill]:transition-[fill] hover:[&_.fill]:fill-white"
        >
          <HerbamojoLogo />
        </Link>
      </div>
      <div className="absolute top-1/2 left-0 z-2 max-w-full font-amarillo [transform:translate(0%,-50%)] max-mtablet:top-[calc(50%+40px)] max-mtablet:left-1/2 max-mtablet:w-full max-mtablet:[transform:translate(-50%,-50%)]">
        <span className="relative left-[-20px] flex h-auto flex-row flex-nowrap content-center items-center justify-start whitespace-nowrap pb-10 text-[400px] leading-[300px] [-webkit-text-fill-color:rgba(255,255,255,0)] [-webkit-text-stroke:6px_white] max-smaller:pb-0 max-smaller:text-[150px] max-smaller:leading-[125px] max-[1250px]:left-[-15px] max-mtablet:left-0 max-mtablet:justify-center max-mtablet:pb-5 max-mtablet:text-center max-[1250px]:text-[350px] max-mobile:text-[200px] max-mtablet:text-[250px] max-[1250px]:leading-[280px] max-mobile:leading-[150px] max-mtablet:leading-[175px] max-[1250px]:[-webkit-text-stroke:4px_white] max-mobile:[-webkit-text-stroke:3px_white]">
          {title}
        </span>
        <span className="absolute top-auto bottom-0 left-0 flex w-auto flex-row flex-nowrap content-center items-center justify-start whitespace-nowrap text-[125px] leading-[80px] [transform:translate(0%,100%)] max-smaller:px-0 max-mtablet:relative max-mtablet:top-0 max-mtablet:bottom-auto max-mtablet:left-0 max-mtablet:justify-center max-mtablet:whitespace-pre-line max-mobile:px-5 max-mtablet:px-10 max-mtablet:text-center max-[1250px]:text-[100px] max-mobile:text-[75px] max-mtablet:text-[100px] max-[1250px]:leading-[60px] max-mobile:leading-[75px] max-mtablet:leading-[95px] max-mtablet:[transform:translate(0%,0%)]">
          {text}
        </span>
        {children}
      </div>
      <div className="absolute top-1/2 right-[-100px] left-auto z-0 block h-[calc(100%-100px)] max-h-[650px] w-auto max-w-full [transform:translate(0%,-50%)] max-mtablet:top-[calc(50%+40px)] max-mtablet:right-auto max-tablet:right-0 max-mtablet:left-1/2 max-mobile:h-[calc(80%-80px)] max-mtablet:h-[80%] max-[1250px]:max-h-[550px] max-mobile:max-h-[calc(100%-120px)] max-mtablet:max-h-[550px] max-mtablet:w-[calc(100%-40px)] max-mobile:max-w-[250px] max-mtablet:max-w-[300px] max-mtablet:opacity-75 max-mtablet:[transform:translate(-50%,-50%)]">
        <Image
          src={productShot}
          alt="Herbamojo"
          className="mx-auto block h-full w-auto max-w-none object-contain max-mtablet:w-full max-mtablet:object-center"
        />
      </div>
    </div>
  </section>
)

export default ErrorView

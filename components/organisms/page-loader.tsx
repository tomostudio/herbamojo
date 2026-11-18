import { cn } from "@/utils/cn"

/**
 * The overlay every page loads behind. It carries no timing of its own: each
 * page's own loader decides when to put `loaded` on the body, once its images
 * have finished loading.
 */
const PageLoader = () => (
  <div
    id="LoaderWrapper"
    className="pointer-events-none fixed top-0 left-0 z-100 h-screen w-screen overflow-hidden bg-black p-10 not-loaded:opacity-100 opacity-0 transition-opacity duration-500"
  >
    <div
      className={cn(
        "absolute bottom-0 left-0 h-[5px] w-full",
        "max-mtablet:top-0 max-mtablet:right-auto max-mtablet:bottom-auto max-mtablet:left-0 max-mtablet:z-3 max-mtablet:h-full max-mtablet:w-[10px] max-mtablet:[transform:rotate(180deg)]",
        "before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:bg-green",
        "after:absolute after:top-0 after:left-0 after:block after:h-full after:w-full after:bg-white",
        "not-loaded:before:animate-[loadingbefore_3s_ease_infinite_forwards] max-mtablet:not-loaded:before:animate-[loadingbeforemobile_1.5s_ease_infinite_forwards] max-tablet:not-loaded:before:animate-[loadingbefore_2s_ease_infinite_forwards]",
        "not-loaded:after:animate-[loadingafter_3s_ease_infinite_forwards] max-mtablet:not-loaded:after:animate-[loadingaftermobile_1.5s_ease_infinite_forwards]",
      )}
    />
    <div
      className={cn(
        "absolute top-auto right-[-20px] bottom-10 left-auto font-amarillo text-[60px] text-green leading-[40px] transition-all duration-500",
        "max-mtablet:top-[15px] max-mtablet:right-auto max-mtablet:bottom-auto max-mtablet:left-[calc(-70px+env(safe-area-inset-left))] max-mtablet:z-2 max-mtablet:origin-top-left max-mtablet:text-[25vh] max-mtablet:leading-[70%] max-mtablet:[transform:rotate(90deg)_translate(0%,-100%)]",
        "not-loaded:right-10 not-loaded:transition-none max-mtablet:not-loaded:right-auto max-mtablet:not-loaded:left-[calc(30px+env(safe-area-inset-left))]",
      )}
    >
      LOADING
    </div>
  </div>
)

export default PageLoader

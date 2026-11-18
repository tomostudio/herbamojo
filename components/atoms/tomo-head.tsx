import Script from "next/script"

const TOMO_SIGNATURE = `
 _____ ___  __  __  ___    ____ _____ _   _ ____ ___ ___
|_   _/ _ \\|  \\/  |/ _ \\  / ___|_   _| | | |  _ \\_ _/ _ \\
  | || | | | |\\/| | | | | \\___ \\ | | | | | | | | | | | |
  | || |_| | |  | | |_| |  ___) || | | |_| | |_| | | |_| |
  |_| \\___/|_|  |_|\\___/  |____/ |_|  \\___/|____/___\\___/

  Crafted by TOMO Studio — https://tomostudio.id
`

const TOMOStudioHead = () => (
  <Script id="tomo-studio-signature" strategy="afterInteractive">
    {`console.log(${JSON.stringify(TOMO_SIGNATURE)})`}
  </Script>
)

export default TOMOStudioHead

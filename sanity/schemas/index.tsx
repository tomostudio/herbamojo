import { blockContent } from "./block"
import { post } from "./list"
import { home } from "./pages"
import { footer, generalSettings } from "./settings"
import { localeString, localeText } from "./shared"

export const schemaTypes = [
  generalSettings,
  footer,
  home,
  post,
  blockContent,
  localeString,
  localeText,
]

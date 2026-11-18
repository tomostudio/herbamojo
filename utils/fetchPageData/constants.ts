import type { QueriesMap } from "@/utils/queryEntry"

export const BASE_QUERIES: QueriesMap = {
  settingAPI: `*[_type == "generalSettings"][0]`,
  footerAPI: `*[_type == "footer"][0]`,
}

import type { StructureResolver } from "sanity/structure"

import { hiddenDocumentTypes } from "./constants"
import { createJournalSection } from "./journal-section"
import { createPagesSection } from "./pages-section"
import { createSettingsSection } from "./settings-section"

const structure: StructureResolver = (S, _context) =>
  S.list()
    .title("Content")
    .items([
      createPagesSection(S),
      createJournalSection(S),
      createSettingsSection(S),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocumentTypes.includes(listItem.getId() ?? ""),
      ),
    ])

export default structure

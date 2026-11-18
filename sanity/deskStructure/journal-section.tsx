import { BiNews } from "react-icons/bi"
import type { StructureBuilder } from "sanity/structure"

export const createJournalSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Journal")
    .icon(() => <BiNews />)
    .child(S.documentTypeList("post").title("Journal"))

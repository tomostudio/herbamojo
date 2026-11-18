import { BiFile, BiHome } from "react-icons/bi"
import type { StructureBuilder } from "sanity/structure"

// One singleton document per page; documentId matches the schema type.
export const createPagesSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Pages")
    .icon(() => <BiFile />)
    .child(
      S.list()
        .title("Pages")
        .items([
          S.listItem()
            .title("Home")
            .icon(() => <BiHome />)
            .child(S.document().schemaType("home").documentId("home")),
        ]),
    )

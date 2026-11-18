import { BiCog, BiDockBottom, BiSliderAlt } from "react-icons/bi"
import type { StructureBuilder } from "sanity/structure"

export const createSettingsSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Settings")
    .icon(() => <BiCog />)
    .child(
      S.list()
        .title("Settings")
        .items([
          S.listItem()
            .title("General")
            .icon(() => <BiSliderAlt />)
            .child(
              S.document()
                .schemaType("generalSettings")
                .documentId("generalSettings"),
            ),
          S.listItem()
            .title("Footer")
            .icon(() => <BiDockBottom />)
            .child(S.document().schemaType("footer").documentId("footer")),
        ]),
    )

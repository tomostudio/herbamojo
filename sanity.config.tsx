import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import StudioLogo from "./sanity/components/studio-logo"
import deskStructure from "./sanity/deskStructure"
import { apiVersion, dataset, projectId } from "./sanity/env"
import { schemaTypes } from "./sanity/schemas"

export default defineConfig({
  title: "Herbamojo",
  icon: StudioLogo,
  basePath: "/admin",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
})

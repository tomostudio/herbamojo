"use client"

import { NextStudio } from "next-sanity/studio"

import config from "@/sanity.config"

const StudioClient = () => <NextStudio config={config} />

export default StudioClient

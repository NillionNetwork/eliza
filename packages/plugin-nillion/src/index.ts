import { Plugin } from "@elizaos/core";
import { NillionUpload } from "./actions/upload";

export const nillionPlugin: Plugin = {
    description: "Nillion's nilDB Plugin for Eliza",
    name: "Nillion",
    actions: [NillionUpload],
    evaluators: [],
    providers: [],
};

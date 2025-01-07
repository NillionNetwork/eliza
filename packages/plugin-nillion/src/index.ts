import { Plugin } from "@elizaos/core";
import { nillionUpload } from "./actions/upload";

export const zgPlugin: Plugin = {
    description: "Nillion's nilDB Plugin for Eliza",
    name: "Nillion",
    actions: [nillionUpload],
    evaluators: [],
    providers: [],
};

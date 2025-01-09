import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    Content,
    ActionExample,
    generateObject,
} from "@elizaos/core";
import { nilql } from "@nillion/nilql";
import { composeContext } from "@elizaos/core";
import { uploadTemplate } from "../templates/upload";
import axios from "axios"; // TODO(@jimouris): check fetch instead
import assert from "assert";
import { v4 as uuid4 } from "uuid"; // Ensure you have `uuid` installed

export interface UploadContent extends Content {
    secret: string;
}

function isUploadContent(
    _runtime: IAgentRuntime,
    content: any
): content is UploadContent {
    console.log("Content for upload", content);
    return typeof content.secret === "string";
}

export const NillionUpload: Action = {
    name: "NILLION_UPLOAD",
    similes: [
        "UPLOAD_SECRET_TO_NILLION",
        "UPLOAD_SECRET_TO_NILDB",
        "STORE_SECRET_ON_NILLION",
        "STORE_SECRET_ON_NILDB",
        "SAVE_SECRET_TO_NILLION",
        "SAVE_SECRET_TO_NILDB",
        "UPLOAD_TO_NILLION",
        "UPLOAD_TO_NILDB",
        "STORE_ON_NILLION",
        "STORE_ON_NILDB",
        "SHARE_SECRET_ON_NILLION",
        "SHARE_SECRET_ON_NILDB",
        "PUBLISH_SECRET_TO_NILLION",
        "PUBLISH_SECRET_TO_NILDB",
    ],
    description: "Encrypt and store secrets using Nillion NilDB",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const schemaId = runtime.getSetting("NILLION_NILDB_SCHEMA_ID");
        const nodes =
            runtime.getSetting("NILLION_NILDB_NODE_IDS")?.split(",") || [];
        console.log("NILLION_UPLOAD validate called");
        return schemaId && nodes.length > 0;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        console.log("NILLION_UPLOAD handler called");
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose upload context
        const uploadContext = composeContext({
            state,
            template: uploadTemplate,
        });

        // Generate upload content
        const content = await generateObject({
            runtime,
            context: uploadContext,
            modelClass: ModelClass.LARGE,
        });

        // Validate upload content
        if (!isUploadContent(runtime, content)) {
            console.error("Invalid content for UPLOAD action.");
            if (callback) {
                await callback({
                    text: "Unable to process Nillion nilDB upload request. Invalid content provided.",
                    content: { error: "Invalid upload content" },
                });
            }
            return false;
        }

        try {
            const schemaId = runtime.getSetting("NILLION_NILDB_SCHEMA_ID");
            const nodeIds =
                runtime.getSetting("NILLION_NILDB_NODE_IDS")?.split(",") || [];
            const nodeUrls =
                runtime.getSetting("NILLION_NILDB_NODE_URLS")?.split(",") || [];
            const nodeJwts =
                runtime.getSetting("NILLION_NILDB_NODE_JWTS")?.split(",") || [];

            assert(
                nodeIds.length === nodeUrls.length,
                "Mismatch in node IDs and URLs count"
            );
            assert(
                nodeIds.length === nodeJwts.length,
                "Mismatch in node IDs and JWTs count"
            );

            const cluster = {
                nodes: Array.from({ length: nodeIds.length }, () => ({})),
            };
            const secretKey = await nilql.secretKey(cluster, { store: true });
            const sharesOfSecret = await nilql.encrypt(
                secretKey,
                content.secret
            );
            const dataId = uuid4();

            const uploadPromises = nodeIds.map(async (nodeId, i) => {
                const nodeUrl = `${nodeUrls[i]}/data/upload`;
                const nodeJwt = `Bearer ${nodeJwts[i]}`;
                const headers = {
                    Authorization: nodeJwt,
                    "Content-Type": "application/json",
                };
                const payload = {
                    schema: schemaId,
                    data: [
                        {
                            _id: dataId,
                            data: sharesOfSecret[i].toString(),
                        },
                    ],
                };

                try {
                    const response = await axios.post(nodeUrl, payload, {
                        headers,
                    });
                    if (response.status === 200) {
                        console.log(
                            `Data uploaded successfully to ${nodeId}:`,
                            response.data
                        );
                    } else {
                        console.error(
                            `Error uploading to ${nodeId}:`,
                            response.data
                        );
                    }
                } catch (error) {
                    console.error(`Error uploading to ${nodeId}:`, error);
                }
            });

            await Promise.all(uploadPromises);

            await callback({
                text: "Data uploaded to all Nillion nodes successfully.",
            });
            return true;
        } catch (error) {
            console.error("Error in Nillion upload handler:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "upload my secret 'PRIVACY' to Nillion",
                    action: "NILLION_UPLOAD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "can you help me upload my password 'passw0rd'?",
                    action: "NILLION_UPLOAD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I need to upload the password from file file://password.txt",
                    action: "NILLION_UPLOAD",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;

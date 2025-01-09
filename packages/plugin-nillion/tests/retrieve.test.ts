import { test, describe, expect } from "vitest";
import { nilql } from "@nillion/nilql";
import dotenv from "dotenv";

describe("its alive", () => {
    test("upload secret", async () => {
        dotenv.config({ path: "../../.env" });
        const schemaId = process.env.NILLION_NILDB_SCHEMA_ID;
        const nodeIds = process.env.NILLION_NILDB_NODE_IDS.split(",");
        const nodeUrls = process.env.NILLION_NILDB_URLS.split(",");
        const nodeJwts = process.env.NILLION_NILDB_NODE_JWTS.split(",");

        const cluster = {
            nodes: Array.from({ length: nodeIds.length }, () => ({})),
        };
        const secretKey = await nilql.secretKey(cluster, { store: true });
        // const sharesOfSecret = await nilql.encrypt(secretKey, "foobarbaz");
        const sharesOfSecret = ["foo", "bar", "baz"];
        const dataId = "4c74cf1f-aefb-4593-92d7-142517e6d464";
        console.log(dataId);

        const readPromises = nodeIds.map(async (nodeId, i) => {
            const payload = {
                schema: schemaId,
                filter: {
                    _id: dataId,
                },
            };

            const response = await fetch(`${nodeUrls[i]}/data/read`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${nodeJwts[i]}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            expect(response.status).toBe(200);

            const body = await response.json();
            console.log(body);

            expect(body.data[0]._id).toContain(dataId);
        });

        await Promise.all(readPromises);
    });
});

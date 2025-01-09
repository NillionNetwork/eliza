import { test, describe, expect } from "vitest";
import { nilql } from "@nillion/nilql";
import { v4 as uuid4 } from "uuid";
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
        const dataId = uuid4();

        const uploadPromises = nodeIds.map(async (nodeId, i) => {
            const nodeUrl = `${nodeUrls[i]}/data/create`;
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

            const response = await fetch(nodeUrl, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            expect(response.status).toBe(200);
            const body: { data: { created: string[]; errors: string[] } } =
                await response.json();
            expect(body.data.errors).toHaveLength(0);
            expect(body.data.created).toContain(dataId);
        });

        await Promise.all(uploadPromises);
    });
});

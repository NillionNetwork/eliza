export const uploadTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "secret": null,
    "description": "I want to upload a secret"
}
\`\`\`

{{recentMessages}}

Extract the user's intention to upload a secret from the conversation. Users might express this in various ways, such as:
- "I want to upload a secret"
- "upload a password"
- "send confidential information"
- "upload a key"
- "let me share a secret"

If the user provides any specific description of the secret, include that as well.

Respond with a JSON markdown block containing only the extracted values.`;

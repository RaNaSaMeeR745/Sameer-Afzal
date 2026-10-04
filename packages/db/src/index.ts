export const PACKAGE_NAME = "@scoutline/db" as const;

export * from "./schema/index.js";
export { createDb, setTenantContext, type Db } from "./client.js";

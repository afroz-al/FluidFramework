import * as cors from "cors";
import { Router } from "express";
import { Provider } from "nconf";
import { IDocumentStorage, ITenantManager } from "../../../core";
import * as utils from "../../../utils";
import { IAlfredTenant } from "../../tenant";
import * as api from "./api";
import * as deltas from "./deltas";
import * as documents from "./documents";
import * as tenants from "./tenants";

export function create(
    config: Provider,
    tenantManager: ITenantManager,
    storage: IDocumentStorage,
    mongoManager: utils.MongoManager,
    producer: utils.IProducer,
    appTenants: IAlfredTenant[]): Router {

    const router: Router = Router();
    const deltasRoute = deltas.create(config, mongoManager, appTenants);
    const documentsRoute = documents.create(storage, appTenants);
    const tenantsRoute = tenants.create(config, appTenants);
    const apiRoute = api.create(producer, appTenants, tenantManager);

    router.use(cors());
    router.use("/deltas", deltasRoute);
    router.use("/documents", documentsRoute);
    router.use("/api/tenants", tenantsRoute);
    router.use("/api/v1", apiRoute);

    return router;
}

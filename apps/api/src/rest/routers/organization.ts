import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { RestContext } from "../types";
import { getOrganizationById } from "@api/db/queries/organization";
import { organizationResponseSchema } from "@api/schemas/organization";
import { validateResponse } from "@api/utils/validate-response";

const app = new OpenAPIHono<RestContext>();

app.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    summary: "Retrieve an organization",
    description:
      "Retrieve an organization by its ID for the authenticated organization.",
    tags: ["Organizations"],
    responses: {
      200: {
        description: "Organization details",
        content: {
          "application/json": {
            schema: organizationResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const db = c.get("db");
    const organizationId = c.req.param("id");

    const result = await getOrganizationById(db, organizationId);

    return c.json(validateResponse(result, organizationResponseSchema));
  }
);

export const organizationRouter = app;

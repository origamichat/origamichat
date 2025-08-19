import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema, z } from "zod";
import type { RestContext } from "../rest/types";

export const validateResponse = <T>(data: T, schema: ZodSchema<T>) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const cause = result.error.flatten();

    console.error(cause);

    throw new HTTPException(400, {
      message: "Response validation failed",
      cause,
    });
  }
  return result.data;
};

type BaseExtractedData = {
  db: RestContext["Variables"]["db"];
  website: RestContext["Variables"]["website"];
  organization: RestContext["Variables"]["organization"];
  visitorIdHeader: string | null;
};

type ExtractedDataWithBody<T> = BaseExtractedData & {
  body: T;
};

type ExtractedDataWithoutBody = BaseExtractedData & {
  body: null;
};

type ExtractedDataWithQuery<T> = BaseExtractedData & {
  query: T;
};

type ExtractedDataWithoutQuery = BaseExtractedData & {
  query: null;
};

// Function overloads for proper typing
export async function safelyExtractRequestData<T>(
  c: Context<RestContext, string, Record<string, unknown>>,
  schema: ZodSchema<T>
): Promise<ExtractedDataWithBody<T>>;

export async function safelyExtractRequestData(
  c: Context<RestContext, string, Record<string, unknown>>
): Promise<ExtractedDataWithoutBody>;

// Implementation
export async function safelyExtractRequestData<T>(
  c: Context<RestContext, string, Record<string, unknown>>,
  schema?: ZodSchema<T>
): Promise<ExtractedDataWithBody<T> | ExtractedDataWithoutBody> {
  const db = c.get("db");
  const website = c.get("website");
  const organization = c.get("organization");

  const visitorIdHeader = c.req.header("X-Visitor-Id") ?? null;

  // If no schema is provided, return with null body
  if (!schema) {
    return {
      db,
      website,
      organization,
      body: null,
      visitorIdHeader,
    };
  }

  // Schema is provided, parse and validate the JSON body
  let body: unknown;

  try {
    body = await c.req.json();
  } catch (error) {
    throw new HTTPException(400, {
      message: "Invalid JSON in request body",
      cause: error,
    });
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    const cause = result.error.flatten();

    throw new HTTPException(400, {
      message: "Request validation failed",
      cause,
    });
  }

  return {
    db,
    website,
    organization,
    body: result.data,
    visitorIdHeader,
  };
}

// Function overloads for query extraction
export async function safelyExtractRequestQuery<T>(
  c: Context<RestContext, string, Record<string, unknown>>,
  schema: ZodSchema<T>
): Promise<ExtractedDataWithQuery<T>>;

export async function safelyExtractRequestQuery(
  c: Context<RestContext, string, Record<string, unknown>>
): Promise<ExtractedDataWithoutQuery>;

// Implementation for query extraction
export async function safelyExtractRequestQuery<T>(
  c: Context<RestContext, string, Record<string, unknown>>,
  schema?: ZodSchema<T>
): Promise<ExtractedDataWithQuery<T> | ExtractedDataWithoutQuery> {
  const db = c.get("db");
  const website = c.get("website");
  const organization = c.get("organization");

  const visitorIdHeader = c.req.header("X-Visitor-Id") ?? null;

  // If no schema is provided, return with null query
  if (!schema) {
    return {
      db,
      website,
      organization,
      query: null,
      visitorIdHeader,
    };
  }

  // Get query parameters from the request
  const queryParams = c.req.query();

  const result = schema.safeParse(queryParams);

  if (!result.success) {
    const cause = result.error.flatten();

    throw new HTTPException(400, {
      message: "Query parameter validation failed",
      cause,
    });
  }

  return {
    db,
    website,
    organization,
    query: result.data,
    visitorIdHeader,
  };
}

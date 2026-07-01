import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

/**
 * Base query with automatic token refresh on 401 errors.
 */
export const createBaseQueryWithReauth = (baseUrl: string): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> => {
  const baseQuery = fetchBaseQuery({ 
    baseUrl,
    credentials: "include",
  });

  return async (args, api, extraOptions) => {
    // Execute the original query.
    const result = await baseQuery(args, api, extraOptions);

    // Isolated challenge: the retrieval endpoints are public, so there is no
    // token-refresh / login-redirect dance. Return the backend result as-is.
    return result;
  };
};

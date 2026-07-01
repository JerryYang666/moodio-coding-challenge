import { getRequestConfig } from "next-intl/server";
import messages from "../messages/en.json";

// The isolated challenge ships English only and has no locale routing/cookies.
// This static config satisfies next-intl's server integration during SSR.
export default getRequestConfig(async () => ({
  locale: "en",
  messages,
}));

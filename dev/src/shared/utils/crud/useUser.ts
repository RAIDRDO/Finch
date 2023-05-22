import { useQuery } from "react-query";
import { constructReadQueryFn } from "./index";
import { config } from "../../../config";

// Query token
export default function useUser() {
  const url = config.apiUrl + 'web/currentUser';
  return useQuery(['user'], constructReadQueryFn(url), {
    staleTime: config.tokenRefreshTime
  });
}
import { useQuery } from "react-query";
import { constructReadQueryFn } from "./index";
import { config } from "../../../config";

// Query token
export default function useUser() {
  const url = config.apiUrl + 'web/getuserbyid(2)';
  return useQuery(['user'], constructReadQueryFn(url), {
    staleTime: config.tokenRefreshTime
  });
}
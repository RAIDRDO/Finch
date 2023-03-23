import { useQuery } from "react-query";
import { constructReadQueryFn } from "./index";
import { config } from "../../../config";

// Query token
export default function useToken() {
  const url = config.apiUrl + 'contextinfo';

  return useQuery(['token'], constructReadQueryFn(url), {
    staleTime: config.tokenRefreshTime
  });
}
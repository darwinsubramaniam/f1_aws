import useApi from "./useApi";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {USE_AUTH} from "../constants";

const KEY = "static"

export const useStaticData = () => {
  const {get} = useApi()
  const {event} = useParams()

  return useQuery([KEY, event], () => get(`/event/${event}/static`)
    .catch(err => {
      console.error(err)
      throw new Error(`Unable to retrieve driver data. Please verify the API endpoint and API Key (if configured on the API) ${USE_AUTH ? "and Cognito " : ""}environment variables have the correct values and that the API Gateway is auth is configured correctly`);
    })
    .then(res => {
      if (!res?.drivers || res?.drivers?.length === 0) {
        throw new Error(`No drivers returned in API response. Check the static data lambda function`);
      }
      return res
    }), {
    retry: 1,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
  })
}

export default useStaticData

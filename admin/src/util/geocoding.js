import { GOOGLE_MAP_API } from "../config/google-maps.config";
import Axios from "axios";

export const ReverseGeoding = (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API}`;

  return Axios.get(url);
};

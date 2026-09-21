import axios from "axios";
import { assets } from "../assets/assets";

export const getOrganizationStructure =
  async () => {

    const post = {

      function:
        "getOrganizationStructure",
      payload: {}

    };

    const response =
      await axios.post(
        assets.API_URL,
        post,
        {
          headers: {
            "Content-Type":
              "text/plain"
          }
        }
      );

    return response.data.data;

  };

export const getOrganizationSummary =
  async (
    org,
    divisionCode,
    departmentCode
  ) => {

    const post = {

      function:
        "getOrganizationSummary",

      payload: {
        org,
        divisionCode,
        departmentCode
      }

    };

    const response =
      await axios.post(
        assets.API_URL,
        post,
        {
          headers: {
            "Content-Type":
              "text/plain"
          }
        }
      );

    return response.data.data;

  };
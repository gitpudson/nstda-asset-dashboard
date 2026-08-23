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
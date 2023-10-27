export const upsertFile = async (formData,apiKey
) => {
  try {
    console.log(formData);
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/upsert-files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error upserting files: ${error.message}`);
    return error;
  }
};

export const getBotResponse = async (input,apiKey
) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/ask-question",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ question: input }),
      }
    );
    console.log("apiKey", apiKey);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error upserting files: ${error.message}`);
    return error;
  }
};

export const getFilePreviews = async (apiKey) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-previews",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data.previews;
  } catch (error) {
    console.error(`Error getting file previews: ${error.message}`);
    return error;
  }
};

export const getFile = async (
  fileName,
  apiKey
) => {
  try {
    console.log("file name:", fileName);
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + "/get-file",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ file_name: fileName }),
      }
    );
    const data = await response.json();
    console.log(data);
    return data.signed_url;
  } catch (error) {
    console.error(`Error getting file: ${error.message}`);
    return error;
  }
};

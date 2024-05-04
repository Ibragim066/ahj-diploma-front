const createRequest = async (
  options = {
    url,
    sendMethod,
    method,
    id,
    data,
    callback,
  },
) => {
  let strRequest = `${options.url}/${options.method}`;
  if (options.id) {
    strRequest += `&id=${options.id}`;
  }

  if (options.sendMethod === 'GET') {
    fetch(strRequest)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        options.callback(data);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  } else if (options.sendMethod === 'POST') {
    fetch(strRequest, {
      method: 'POST',
      body: JSON.stringify(options.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        options.callback(data);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  } else if (options.sendMethod === 'PUT') {
    fetch(strRequest, {
      method: 'PUT',
      body: options.data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        options.callback(data);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }
};

export default createRequest;

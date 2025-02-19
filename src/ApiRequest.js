import axios from 'axios';

async function callApi(url, method, data = null, headers = {}) {
    // console.log("methoddd",method)
  try {
    const response = await axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      // throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    // console.error('API call error:', error);
    // throw error;
  }
}

export default callApi;
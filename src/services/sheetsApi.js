const postOrder = (token, sheetId, sheetName, rowValues) => {
  const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;

  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({values: [rowValues]}),
  });
};

export default postOrder;

/**
 * Appends a single row of values to a Google Sheets tab.
 * Thin wrapper around the Google Sheets API v4 append endpoint.
 *
 * @param {string} token - Google OAuth access token (set by Login,
 *   stored in localStorage)
 * @param {string} sheetId - Spreadsheet ID from the Google Sheets
 *   URL (CI env var)
 * @param {string} sheetName - Name of the tab to append to,
 *   e.g. "Orders" (CI env var)
 * @param {Array<string|number>} rowValues - Positional array of
 *   values to write as a new row
 * @return {Promise<Response>} The raw fetch Response — caller handles ok/error
 */
const postOrder = (token, sheetId, sheetName, rowValues) => {
  // valueInputOption=USER_ENTERED tells Sheets to parse values the same way a
  // user would type them — so "$6.00" becomes currency, dates are parsed, etc.
  const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;

  return fetch(API_URL, {
    method: 'POST',
    headers: {
      // Bearer token authenticates the request as the signed-in Google user.
      // This token is scoped to spreadsheets only (see Login component).
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // The Sheets API expects values as a 2D array (array of rows).
    // We always send exactly one row.
    body: JSON.stringify({values: [rowValues]}),
  });
};

export default postOrder;

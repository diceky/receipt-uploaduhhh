const Sheety = async (data, fileLink) => {

    const rowData = JSON.parse(data);

    let response = '';    
    const url = process.env['REACT_APP_SHEETY_ENDOINT'];
    //console.log(url);
    const body = {
        expenseZapier: {
            ...rowData,
            "receipt": fileLink,
            "reimbursed?": false,
        }
    }
    //console.log(body);
    
    await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env['REACT_APP_SHEETY_API_KEY']}`},
        body: JSON.stringify(body)
    })
    .then((res) => res.json())
    .then((json) => {
        //console.log(json);
        //console.log(JSON.stringify(json, undefined, 2));
        response = json;
    })
    .catch(() => alert("error"));

    return response;
}

export default Sheety;
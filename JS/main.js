const makeAPICall = async (url) => {
    try {
        const response = await fetch(url);
        if(response.ok) {
            const data = response.json();
            return data
        } else {
            console.error(`Error fetching data: ${response.error}`);
        }
    } catch(e) {
        return e;
    }
}

const cleanResponseData = (data) => {
    if(data.length === 0) {
        return null;
    }
    return data.map(elem => {
        return {
            excuse: elem.excuse,
            category: elem.category
        }
    });
}

(async() => {
    const URL = "https://excuser-three.vercel.app/v1/excuse/developers/4";
    const responseData = await makeAPICall(URL);
    const execuses = cleanResponseData(responseData);

    console.log(execuses);
})();
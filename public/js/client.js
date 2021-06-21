class Client {
    constructor() { }

    request(requestType, request=null) {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    resolve(xhttp.responseText);
                }
            };

            if (request !== null) {
                xhttp.open(requestType, request);
            } else {
                xhttp.open(requestType);
            }

            try {
                xhttp.send();
            } catch(e) {
                reject(e);
            }
        });
    }
}

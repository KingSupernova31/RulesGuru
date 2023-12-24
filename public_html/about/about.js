const getAdminData = function() {
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 10000;
	httpRequest.onabort = getAdminData;
	httpRequest.onerror = getAdminData;
	httpRequest.ontimeout = getAdminData;
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				if (httpRequest.response === "Unauthorized") {
					throw new Error("Unauthorized")
				} else {
					adminData = JSON.parse(httpRequest.response);
					let contributors = [];
					for (let i in adminData) {
						if (adminData[i].roles.owner) {
							contributors.push(adminData[i].name);
						}
					}
					for (let i in adminData) {
						if (!adminData[i].roles.owner && Object.values(adminData[i].roles).includes(true)) {
							contributors.push(adminData[i].name);
						}
					}
					let contributorsString = "";
					for (let i in contributors) {
						if (Number(i) === contributors.length - 1) {
							contributorsString += " and"
						}
						contributorsString += " " + contributors[i];
						if (Number(i) !== contributors.length - 1) {
							contributorsString += ","
						}
					}
					document.getElementById("adminNames").textContent = contributorsString;

				}
			} else {
				getAdminData();
			}
		} else {
			getAdminData();
		}
	}
	httpRequest.open("POST", "/getAdminData", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({"includeSensitiveData": false}));
}

getAdminData();

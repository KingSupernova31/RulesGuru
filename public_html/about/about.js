const getAdminData = async function() {
	try {
		const response = await fetch("/getAdminData", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			signal: AbortSignal.timeout(10000),
			body: JSON.stringify({ includeSensitiveData: false })
		});
		if (!response.ok) {throw new Error(response.statusText);}
		const adminData = await response.json();
		return adminData;
	} catch (e) {
		console.error(e)
		return await getAdminData();
	}
};

const displayAdminData = function(adminData) {
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
};

(async function() {
	const adminData = await getAdminData();
	displayAdminData(adminData);
})();
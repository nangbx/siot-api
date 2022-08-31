const validateEmail = (email: string | undefined) => {
	if (!email) {
		return false;
	}
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	} else {
		return false;
	}
};
export default {
	validateEmail,
};

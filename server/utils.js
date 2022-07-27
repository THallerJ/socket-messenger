module.exports = {
	filterRecipients: function (recipients, recipient) {
		return recipients.filter((sentTo) => sentTo !== recipient);
	},
};

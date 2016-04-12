function Exception(msg, fatal) {
	this.message = msg;
	this.fatal = fatal;

	this.isFatal = function() {
		return this.fatal;
	}
	this.getMessage = function() {
		return this.message;
	}
	return this;
}
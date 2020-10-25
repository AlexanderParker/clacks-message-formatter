/*

	Clacks message formatter plugin - reinforces message structure

	options = {
		optional: ["fields"],
		required: ["fields"],
		rejectInvalid: boolean,
		errorStatus: <HTTP status>
	}

*/

module.exports = function(options) {

	// Core fields required by all formatter-compliant messages
	var requiredFieldsCore = [
		"class"
	]

	// If true, the formatter will reject invalid messages (they will not be added to the local queue)
	var rejectInvalidMessage = true

	// Reject HTTP error code
	var rejectErrorCode = 500

	// Additional fields that are allowed (any fields not in the list will cause the formatter to quit)
	var optionalAllowedFields = []

	// Additional fields that are required (any fields not in the list will cause the formatter to quit)
	var optionalRequiredFields = []

	// Parse options overrides if provided
	if (typeof options == 'object') {
		// Override optional allowed and required fields
		optionalAllowedFields = typeof options.optional != 'undefined' && Array.isArray(options.optional) ? options.optional : []
		optionalRequiredFields = typeof options.required != 'undefined' && Array.isArray(options.required) ? options.required : []
		// Don't allow optional fields to override core fields
		var illegalCoreOverrides = (optionalAllowedFields.concat(optionalRequiredFields).filter((el) => requiredFieldsCore.includes(el)))
		if (illegalCoreOverrides.length > 0) throw 'Illegal Core Overrides: ' + illegalCoreOverrides.join(',')
		// Override rejection flag
		if (typeof options.rejectInvalid == 'boolean') rejectInvalidMessage = options.rejectInvalid
		// Override rejection error code
		if (typeof options.errorStatus == 'boolean') rejectInvalidMessage = options.errorStatus
	}

	var allRequiredFields = requiredFieldsCore.concat(optionalRequiredFields)	
	var allAllowedFields = allRequiredFields.concat(optionalAllowedFields)

	function invalidate(res, reason) {
		if (rejectInvalidMessage) {
			if (!!rejectErrorCode) {
				res.writeHead(rejectErrorCode)
				res.write(reason)				
			}
			return false
		}
		return true
	}

	// Returns clacks plugin callback
	return function(peer, payload, req, res) {
		// Don't process if payload is missing
		if (!payload) return invalidate(res, 'Invalid Payload: ' + JSON.stringify(payload))

		// Don't process if message is missing
		if (!payload.message) return invalidate(res, 'Missing Message: ' + JSON.stringify(payload))

		// Don't process if type is not message
		if (!payload.type || !payload.type == "message") return invalidate(res, 'Invalid Message Type: ' + payload.type)

		// Message must be an object
		if (typeof payload.message != 'object' || !!payload.message.isArray) return invalidate(res, 'Message Not an Object: ' + JSON.stringify(payload.message))

		// Object must have keys
	 	var parsedMessageObjectKeys = Object.keys(payload.message)
	 	if (parsedMessageObjectKeys.length == 0) return invalidate(res, 'Payload Message Empty:' + JSON.stringify(payload))

		// No fields are allowed to exist beyond optional and required list
		var unknownFields = parsedMessageObjectKeys.filter((el) => !allAllowedFields.includes(el))
		if (unknownFields.length > 0) return invalidate(res, 'Unknown Fields: ' + unknownFields.join(','))

	 	// Required fields must exist
	 	for (var i in allRequiredFields) {
	 		if (!parsedMessageObjectKeys.includes(allRequiredFields[i])) return invalidate(res, 'Required Fields Missing')
	 	}	 
	}
}

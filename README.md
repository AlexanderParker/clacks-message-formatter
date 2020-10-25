# What is clacks-message-formatter?

This is a plugin for the [clacks](https://github.com/AlexanderParker/clacks) p2p messaging system.

Its simple purpose is to allow custom message formats to be defined, allowing clacks peers to validate and reject messages that do not conform.

# Basic Usage

**Prerequisites**

This plugin requires [clacks](https://github.com/AlexanderParker/clacks)

**Installing**

    > npm install clacks-message-formatter

**Loading**

Clacks plugins are loaded into an instance with the "extend" function, as demonstrated below (assuming you have created a clacksInstance already):
	
	MessageFormatter = require('clacks-message-formatter')
    clacksInstance.extend(new MessageFormatter({<options>}))

**Options**

When instantiating the message formatter, you can provide some basic options if you wish

* **optional** - An array of optional field names (*empty by default*)
* **required** - An array of required fields (*empty by default*)
* **rejectInvalid** - A boolean that determines whether invalid messages are rejected with an error (*true by default*). If set to false, the invalid message will still be processed.
* **errorStatus** - A HTTP status code to be issues on error (*500 by default*)

In addition to the optional and required fields, there is a core required field called "class" that all applications must define. The "class" may be useful to identify which application or family a message belongs to.

So, for example, if we're creating an imaginary file sharing application called 'file spreader' that splits files into chunks, you'd require a count of the pieces it was originally broken up into, you most likely want hashes of each chunk, as well as a hash of the full file, and of course the actual chunk data itself. Optionally, the creator may wish to share some tagline and maybe an address they can be reached on. To achieve this, we'd define the formatter / validator thusly:

    new MessageFormatter({
    	class: 'file-spreader',
    	required: ['piecesCount', 'chunkHashes', 'finalHash', 'chunkData'],
    	optional: ['createdBy', 'homeAddress']
    });

# Test Example

You can view a test example in the [clacks-tests repository](https://github.com/AlexanderParker/clacks-tests/blob/main/plugins/clacks-message-formatter.js).

# Contributing

If this project interests you, all contributions are welcome, from pull requests to suggestions and bug reports.

For clacks-logger specific issues, please use this [issue tracker](https://github.com/AlexanderParker/clacks-message-formatter/issues) if you spot any problems, have general questions, ideas or feedback.

For core clacks-p2p issues, please use the main [issue tracker](https://github.com/AlexanderParker/clacks/issues) instead.
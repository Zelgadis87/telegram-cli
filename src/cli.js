
let TelegramBot = require( '@zelgadis87/telegram-bot' )
	, Bluebird = require( 'bluebird' )
	, yargs = require( 'yargs' )
	, fs = require( 'fs' )
	;

function cli( args ) {

	let parser = yargs
		.usage( 'Usage: node $0 --token [token] <command> <parameters>' )
		.option( 'token', {
			alias: 't',
			demandOption: true,
			description: 'The Bot token to use',
			requiresArg: true,
			type: 'string'
		} )
		.demandCommand()
		.command( 'me', 'Returns basic information about the bot.', {}, argv => argv.exec( 'getMe' ) )
		.command( 'updates [offset] [limit]', 'Returns all received updates since the offset one.', {
			offset: {
				alias: 'o',
				description: 'The ID of the last received update',
				type: 'number'
			},
			limit: {
				alias: 'l',
				description: 'The maximum number of updates to receive',
				type: 'number'
			}
		}, argv => argv.exec( 'getUpdates', argv.offset, argv.limit ) )
		.command( 'message <chat> <message>', 'Sends a message in the given chat.', {
			chat: {
				alias: 'c',
				demandOption: true,
				description: 'The ID of the chat',
				type: 'number'
			},
			message: {
				alias: 'm',
				demandOption: true,
				description: 'The message to send',
				type: 'string'
			}
		}, argv => argv.exec( 'sendMessage', argv.chat, argv.message ) )
		.command( 'message-file <chat> <file>', 'Sends a message in the given chat using the given file as input.', {
			chat: {
				alias: 'c',
				demandOption: true,
				description: 'The ID of the chat',
				type: 'number'
			},
			file: {
				alias: 'f',
				demandOption: true,
				description: 'The file to use',
				type: 'string'
			}
		}, argv => {
			let options = {};
			if ( argv.file.match( /^.+\.md$/ ) )
				options.parse_mode = 'Markdown';
			else if ( argv.file.match( /^.+\.html$/ ) )
				options.parse_mode = 'HTML';
			argv.exec( 'sendMessage', argv.chat, fs.readFileSync( argv.file, 'UTF-8' ), options );
		} )
		.help();

	return new Bluebird( ( resolve, reject ) => {

		let ctx = {};
		ctx.exec = function( fn, ...args ) {
			let bot = new TelegramBot( this.token );
			resolve( bot[ fn ].apply( bot, args ) ).catch( reject );
		};

		return parser.parse( args, ctx, ( err, argv, output ) => {
			if ( err ) reject( new Error( output ) );
			else resolve( output );
		} );

	} );

}

module.exports = cli;
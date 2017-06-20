#!/usr/bin/env node
let cli = require( './src/cli.js' )
	, process = require( 'process' )
	, util = require( 'util' )
	, console = require( 'console' )
	;

cli( process.argv.slice( 2 ) ).then( d => console.info( d ), e => console.error( e.message ) );
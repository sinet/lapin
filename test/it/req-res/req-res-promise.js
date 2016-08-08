'use strict';

/* eslint no-unused-expressions:0 */

const requireNew = require( 'require-new' );
const expect     = require( 'chai' ).expect;

describe( 'Perform request( PROMISE )  respond', function () {
	const rabbit = requireNew( 'rabbot' );
	const Lapin  = requireNew( process.cwd() );

	let lapin;

	describe( '- Success -', function () {
		let errorResponse = null;
		let response, request;

		before( function ( done ) {
			lapin = new Lapin( rabbit );
			require( '../init' )( {
				done,
				rabbit
			} );
		} );

		before( function ( done ) {
			lapin.respond( 'v1.reqres-promise.get', function ( requestData, send ) {
				request = requestData;
				send.success( 'users' );
			} )

				.on( 'error', done )
				.on( 'ready', function () {
					lapin.requestPromise( 'v1.reqres-promise.get', { 'user' : 'Testfoo' } )
						.then( function ( data ) {
							response = data;
						} )
						.catch( function ( error ) {
							errorResponse = error;
						} )
						.finally( function () {
							setTimeout( done, 1000 );
						} );
				} );
		} );

		it( '-- should receive correct requestData', function () {
			expect( request ).be.an( 'object' );
			expect( request.user ).to.exist.and.to.equal( 'Testfoo' );
		} );

		it( '-- should return SUCCESS data', function () {
			expect( response ).be.an( 'object' );
			expect( response.status ).to.exist.and.to.equal( 'success' );
			expect( response.data ).to.exist.and.to.equal( 'users' );
		} );

		it( '-- should have a null error response', function () {
			expect( errorResponse ).to.be.an( 'null' );
		} );
	} );

	describe( '- Error -', function () {
		let response      = null;
		let errorResponse = null;
		let request       = null;

		before( function ( done ) {
			lapin.respond( 'v1.reqres-promise.post', function ( requestData, send ) {
				request   = requestData;
				const error = new Error( 'Something went wrong' );

				send.error( error.message, error, 500 );
			} )
				.on( 'error', done )
				.on( 'ready', function () {
					lapin.requestPromise( 'v1.reqres-promise.post', { 'user' : 'Foo' } )
						.then( function ( data ) {
							response = data;
						} )
						.catch( function ( error ) {
							errorResponse = error;
						} )
						.finally( function () {
							setTimeout( done, 1000 );
						} );
				} );
		} );

		it( '-- should receive correct requestData', function () {
			expect( request ).be.an( 'object' );
			expect( request.user ).to.exist.and.to.equal( 'Foo' );
		} );

		it( '-- should return ERROR data', function (  ) {
			expect( errorResponse ).be.an( 'object' );
			expect( errorResponse.status ).to.exist.and.to.equal( 'error' );
			expect( errorResponse.message ).to.exist.and.to.equal( 'Something went wrong' );
			expect( errorResponse.code ).to.exist.and.to.equal( 500 );
			expect( errorResponse.data ).to.exist;
		} );

		it( '-- should have a null response', function () {
			expect( response ).to.be.an( 'null' );
		} );
	} );

	describe( '- Fail -', function () {
		let response     = null;
		let failResponse = null;
		let request      = null;

		before( function ( done ) {
			lapin.respond( 'v1.reqres-promise.put', function ( requestData, send ) {
				request = requestData;
				send.fail( 'Invalid data' );
			} )
				.on( 'error', done )
				.on( 'ready', function () {
					lapin.requestPromise( 'v1.reqres-promise.put', { 'user' : 'Foo' } )
						.then( function ( data ) {
							response = data;
						} )
						.catch( function ( error ) {
							failResponse = error;
						} )
						.finally( function () {
							setTimeout( done, 1000 );
						} );
				} );
		} );

		it( '-- should receive correct requestData', function () {
			expect( request ).be.an( 'object' );
			expect( request.user ).to.exist.and.to.equal( 'Foo' );
		} );

		it( '-- should return FAIL data', function () {
			expect( failResponse ).be.an( 'object' );
			expect( failResponse.status ).to.exist.and.to.equal( 'fail' );
			expect( failResponse.data ).to.exist.and.to.equal( 'Invalid data' );
		} );

		it( '-- should have a null response', function () {
			expect( response ).to.be.an( 'null' );
		} );
	} );
} );

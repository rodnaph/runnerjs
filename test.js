
var assert = require( 'assert' );

function runTest( name, func ) {
    console.log( '✔ ', name );
    func();
}
    
runTest( 'Functions are run in series', function() {
    var runner = require( './index' ).make();
    var x = 0;
    runner.run([
        function firstFunc( next ) { x++; next(); },
        function secondFunc( next ) { x++; next(); }
    ]);
    assert.equal( x, 2 );
});

runTest( 'Chain stops when a function passes an error to its callback', function() {
    var runner = require( './index' ).make();
    var x = 0;
    runner.run([
        function( next ) { next('error'); },
        function() { x=1; }
    ]);
    assert.equal( 0, x );
});

runTest( 'First function can receive seed arguments', function() {
    var runner = require( './index' ).make();
    var bar = 'asdasd';
    runner.run([
            function( next, foo ) { assert.equal(foo,bar); },
        ],
        function() {},
        [ bar ]
    );
});

runTest( 'Arguments are passed from function to next in chain', function() {
    var runner = require( './index' ).make();
    runner.run([
        function( next ) { next(null,'foo'); },
        function( next, foo ) { assert.equal('foo',foo); }
    ]);
});

runTest( 'Callback is called when chain finishes', function() {
    var runner = require( './index' ).make();
    var called = false;
    runner.run(
        [],
        function() { called=true; }
    );
    assert.ok( called );
});

runTest( 'Callback is called with error when a function calls an error', function() {
    var runner = require( './index' ).make();
    runner.run([
        function( next ) { next('error'); }
    ], function(err) {
        assert.equal('error',err);
    });
});


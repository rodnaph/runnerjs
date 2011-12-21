
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

runTest( 'Completion function gets result of last function in chain', function() {
    var runner = require( './index' ).make();
    runner.run(
        [ function(next) { next(false,'foo'); } ],
        function( err, foo ) {
            assert.equal( 'foo', foo );
        }
    );
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

runTest( 'Callback gets no error when all goes ok', function() {
    var runner = require( './index' ).make();
    runner.run([
        function( next ) { next(null,'foo'); },
    ],
    function( err, foo ) {
        assert.ok( !err );
    });
});

runTest( 'Seeds are available via seeds property', function() {
    var runner = require( './index' ).make();
    runner.run([
            function( next ) {
                assert.equal( 'bar', next.seeds[0] );
            }
        ],
        function() {},
        [ 'bar' ]
    );
});

runTest( 'Seeds property is empty by default', function() {
    var runner = require( './index' ).make();
    runner.run([
        function( next ) { assert.equal(0,next.seeds.length); }
    ]);
});

runTest( 'Map calls all functions in chain', function() {
    var runner = require( './index' ).make();
    var x = 0;
    runner.map(
        [1,2],
        function( callback ) { x++; callback(); }
    );
    assert.equal( 2, x );
});

runTest( 'Map passes each data item to function in chain', function() {
    var runner = require( './index' ).make();
    var x = 0;
    runner.map(
        [ 2, 3, 5 ],
        function( callback, y ) { x += y; callback(); }
    );
    assert.equal( 10, x );
});

runTest( 'Map stops when function passes error to callback', function() {
    var runner = require( './index' ).make();
    var x = 0;
    runner.map( [0,1,0], function(callback,y) {
        if ( y ) { callback('error'); }
        else {
            x += 5; callback();
        }
    });
    assert.equal( 5, x );
});

runTest( 'Callback is executed after all functions complete in map', function() {
    var runner = require( './index' ).make();
    var called = false;
    runner.map(
        [ 1, 2 ],
        function( next ) { next(); },
        function() { called=true; }
    );
    assert.ok( called );
});

runTest( 'Map accumulates the callbacks non error arguments and gives them to the completion function', function() {
    var runner = require( './index' ).make();
    runner.map( [3,5], function(callback,x) {
        callback( false, x );
    }, function(err,acc) {
        assert.equal( 2, acc.length );
        assert.equal( 3, acc[0] );
        assert.equal( 5, acc[1] );
    });
});


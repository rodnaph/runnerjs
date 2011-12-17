
RunnerJS
--------

RunnerJS runs a series of functions, passing the results of each function
on to the next in the chain.  Chains can also been seeded.

<pre>
var runner = require( 'runnerjs' ).make();
runner.run([
        function( next, seed ) { next(null,'foo'); },
        function( next, foo ) { next(); },
    ],
    [ 'seed argument' ]
);
</pre>


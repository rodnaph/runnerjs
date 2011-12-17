
RunnerJS
========

RunnerJS runs a series of functions, passing the results of each function
on to the next in the chain.  Chains can also been seeded.

<pre>
var runner = require( 'runnerjs' ).make();
runner.run([
        function( next, seed ) { next(null,'foo'); },
        function( next, foo ) { next(); },
    ],
    function(err) {
        // chain finished, maybe with error
    },
    [ 'seed argument' ]
);
</pre>

Each function receives a reference to the next function in the chain, and some arguments.
The functions should call the next() method when they are done, giving it the standard
error object as the first argument and then some arbitrary parameters.

Completion Function
-------------------

The second argument to run() is the completion function.  This will be called either then the
last function in the chain completes, or when an error occurs.


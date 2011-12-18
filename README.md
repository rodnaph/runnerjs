
RunnerJS
========

RunnerJS aims to make it easier and more readable to run chains of async functions. This
can be useful when doing data processing that involves async operations like database
queries/writes, and file/network operations.

run()
-----

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

The second argument to run() is the completion function.  This will be called either then the
last function in the chain completes, or when an error occurs.

map()
-----

You can also use the map method to map a function onto an array, and execute
async code on each callback.  Any function returning an error stops the chain.

<pre>
runner.map(
    [ 1, 2, 3 ],
    function( callback, data ) {
        // ...
        callback();
    },
    onComplete
);
</pre>

The completion function fires either at the end of the chain, or when the first error occurs.
Each function in the chain should use the callback passed in to carry on the chain, giving an
error as the first argument if something went wrong.

Installation
------------

RunnerJS can be installed through NPM.

<pre>
npm install runnerjs
</pre>


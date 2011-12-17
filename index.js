
function Runner() {}

Runner.prototype = {

    /**
     * Specify abilities for Binder
     */
    can: [
        'runnerChain:run'
    ],

    /**
     * Start a chain with the specified seeds
     *
     * @param Array functions
     * @param Function callback
     * @param Array seed arguments
     */
    run: function( functions, callback, seeds ) {

        callback = callback || function() {};

        var next = function( err ) {

            var func = functions.shift();
            var args = Array.prototype.slice.call( arguments );

            if ( err || !func ) {
                callback.apply( 
                    this, 
                    [ err ].concat( args )
                );
            }

            else {
                func.apply( this, [next].concat(args.slice(1)) );
            }

        };

        next.apply( this, [false].concat(seeds) );

    }

};

exports.make = function() {

    return new Runner();

};


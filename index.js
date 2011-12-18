
function Runner() {}

Runner.prototype = {

    /**
     * Specify abilities for Binder
     */
    can: [
        'runnerChain:run',
        'runnerMap:map'
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

            var args = Array.prototype.slice.call( arguments );

            if ( err || !functions.length ) {
                callback.apply( 
                    this, 
                    [ err ].concat( args )
                );
            }

            else {
                functions.shift()
                         .apply( this, [next].concat(args.slice(1)) );
            }

        };

        next.seeds = seeds || [];
        next.apply( this, [false].concat(seeds) );

    },

    /**
     * Maps the results of a function to a chain of functions
     *
     * @param Array data
     * @param Function func
     * @param Function callback
     * @param Arrat seeds
     */
    map: function( data, func, callback, seeds ) {

        callback = callback || function() {};

        var chain = function( err ) {

            if ( err || !data.length ) {
                callback( err );
            }

            else {
                func.apply( 
                    this, 
                    [ chain, data.shift()]
                        .concat( seeds )
                );
            }

        };

        chain();

    }

};

exports.Runner = Runner;

exports.make = function() {

    return new Runner();

};


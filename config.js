define(function () {
    'use strict';

    return function (require) {
        require.config({
            paths: {
                knockout: "libs/knockout/knockout",
                "knockout-select": "libs/knockout-select/knockout-select.min",
            },
        });
    }
});
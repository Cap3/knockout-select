define(['./config'], function (config) {
    requirejs.nodeRequire = window.requireNode;
    config(requirejs);
    requirejs([
        'knockout',
        'knockout-select'
    ],
		function (ko) {
			//#region init
			var Country = function (name, population) {
				this.countryName = name;
				this.countryPopulation = population;
			};
			var viewModel = {
				example01: {
					options: ['item 01', 'item 02', 'item 03', 'item 04'],
					selectedValue: ko.observable()
				},
				example02: {
					options: ['item 01', 'item 02', 'item 03', 'item 04'],
					selectedValues: ko.observableArray()
				},
				example03: {
					availableCountries: ko.observableArray([
						new Country("UK", 65000000),
						new Country("USA", 320000000),
						new Country("Sweden", 29000000),
						new Country("Germany", 81000000)]),
					selectedCountry: ko.observable() // Nothing selected by default
				}
			};

			ko.applyBindings(viewModel);
			//#endregion
		});

});
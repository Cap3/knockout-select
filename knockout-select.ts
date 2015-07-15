///<reference path="./DefinitelyTyped/knockout/knockout.d.ts" />
import * as ko from 'knockout';
/**
 * Knockout Custom Binding for styled drop-down select elements, works with normal select tags as long as there is an
 * options binding and a binding for the selection result
 * @namespace cap3Options
 * @author Cap3 GmbH - Kalle Ott
 */
module cap3Options {
    //#region css
    var prefix = 'knockout-select';
    var dropDownSelectClass = prefix;
    var dropDownSelectButtonClass = prefix + '-button';
    var dropDownSelectContainerClass = prefix + '-container';
    var dropDownSelectArrowClass = prefix + '-arrow';
    var dropDownSelectRowClass = prefix + '-row';
    var dropDownSelectSelectedClass = prefix + '-row-selected';
    var dropDownSelectActiveClass = prefix + '-row-active';
    var zIndex = 9999;
    //#endregion

    //#region strings
    var pleaseChoose = 'Choose...';
    var elementsChosen = ' items selected';
    //#endregion
    

    class Cap3OptionsState {
        //#region members
        /**
         * dom element used to replace the original select element
         * @member cap3Options.Cap3OptionsState#captionElement
         * @public
         * @type {HTMLButtonElement}
         */
        public captionElement: HTMLButtonElement;
        /**
         * dom element which displays the options to select from
         * @member cap3Options.Cap3OptionsState#containerDiv
         * @public
         * @type {HTMLDivElement}
         */
        public containerDiv: HTMLDivElement;
        /**
         * dom element which displays information about the actual selection
         * @member cap3Options.Cap3OptionsState#captionText
         * @private
         * @type {HTMLSpanElement}
         */
        private captionText: HTMLSpanElement;
        /**
         * the select element this binding is bound to
         * @member cap3Options.Cap3OptionsState#element
         * @private
         * @type {HTMLSelectElement}
         */
        private element: HTMLSelectElement;
        /**
         * array of options to choose from
         * @member cap3Options.Cap3OptionsState#options
         * @private
         * @type {KnockoutObservableArray<Object | string> | Object[]| string[]}
         */
        private options: KnockoutObservableArray<Object | string> | Object[]| string[];
        /**
         * array of selected options, used when multiple flag is set
         * @member cap3Options.Cap3OptionsState#selectedOptions
         * @private
         * @type {KnockoutObservableArray<any> | any[]}
         */
        private selectedOptions: KnockoutObservableArray<any> | any[];
        /**
         * the selected value, used when no multiple flag is set
         * @member cap3Options.Cap3OptionsState#value
         * @private
         * @type {any}
         */
        private value: any;
        /**
         * enables or disables this control, support for knockout enable binding
         * @member cap3Options.Cap3OptionsState#enable
         * @private
         * @type {KnockoutObservable<boolean> | boolean}
         */
        private enable: KnockoutObservable<boolean> | boolean;
        /**
         * disables or enables this control, support for knockout disable binding
         * @member cap3Options.Cap3OptionsState#disable
         * @private
         * @type {KnockoutObservable<boolean> | boolean}
         */
        private disable: KnockoutObservable<boolean> | boolean;
        /**
         * text to display when no selection is made, support for knockout optionsCaption binding
         * @member cap3Options.Cap3OptionsState#optionsCaption
         * @private
         * @type {KnockoutObservable<string> | string}
         */
        private optionsCaption: KnockoutObservable<string> | string;
        /**
         * property-name to display this property of the options instead of the option object itself, support for knockout optionsText binding
         * @member cap3Options.Cap3OptionsState#optionsText
         * @private
         * @type {string | Function}
         */
        private optionsText: string | Function;
        /**
         * property-name to store this property of the options instead of the option object itself, support for knockout optionsValue binding
         * @member cap3Options.Cap3OptionsState#optionsValue
         * @private
         * @type {string | Function}
         */
        private optionsValue: string | Function;
        /**
         * true if multiple flag is set for the select element
         * @member cap3Options.Cap3OptionsState#multiple
         * @private
         * @type {boolean}
         */
        private multiple: boolean;
        /**
         * stores the possibly set size attribute of the select element
         * @member cap3Options.Cap3OptionsState#size
         * @private
         * @type {number}
         */
        private size: number;
        /**
         * stores the information about the element under the cursor
         * @member cap3Options.Cap3OptionsState#hoverIndex
         * @private
         * @type {KnockoutObservable<number>}
         */
        private hoverIndex: KnockoutObservable<number>;
        /**
         * stores the length of the options array
         * @member cap3Options.Cap3OptionsState#maxIndex
         * @private
         * @type {number}
         */
        private maxIndex: number;
        /**
         * shows if the cursor is inside the containerDiv element
         * @member cap3Options.Cap3OptionsState#inside
         * @private
         * @type {boolean}
         */
        private inside: boolean;
        /**
         * shows if the containerDiv is displayed or hidden
         * @member cap3Options.Cap3OptionsState#showBox
         * @private
         * @type {boolean}
         */
        private showBox: boolean;
        /**
         *  array of subscriptions used by this object
         * @member cap3Options.Cap3OptionsState#subscriptions
         * @private
         * @type {KnockoutSubscription[]}
         */
        private subscriptions: KnockoutSubscription[];
        //#endregion
        
        /**
         * Creates a new Cap3OptionsState object
         * @class cap3Options.Cap3OptionsState
         * @classdesc this class holds all the information about the status of the select element.
         * @param {KnockoutObservable<any>} valueAccessor - the accessor function to the binding value
         * @param {KnockoutObservable<any>} allBindings - the other bindings bound to the element
         * @param {HTMLSelectElement} element - the element this binding is bound to
         */
        constructor(
            valueAccessor: KnockoutObservable<any>,
            allBindings: KnockoutObservable<any>,
            element: HTMLSelectElement) {
            this.captionElement = undefined;
            this.containerDiv = document.createElement('div');
            this.captionText = undefined;
            this.element = element;
            this.options = valueAccessor() || allBindings()['options'];
            this.selectedOptions = allBindings()['selectedOptions'];
            this.value = allBindings()['cap3Value'] || allBindings()['value'];
            this.enable = allBindings()['enable'];
            this.disable = allBindings()['disable'];
            this.optionsCaption = allBindings()['optionsCaption'];
            this.optionsText = allBindings()['optionsText'];
            this.optionsValue = allBindings()['optionsValue'];
            this.multiple = element.hasAttribute('multiple');
            this.size = parseInt(element.getAttribute('size'));
            this.hoverIndex = ko.observable(-1);
            this.maxIndex = -1;
            this.inside = false;
            this.showBox = false;
            this.subscriptions = [];
        }
        //#region methods
        /**
         * gets the text representation of the option
         * @method cap3Options.Cap3OptionsState#getOptionsText
         * @private
         * @param {observable | Object | string} option - the object containing the option information
         * @returns {string}
         */
        private getOptionsText(option: KnockoutObservable<any> | Object | string) {
            if (option && this.optionsText && typeof (this.optionsText) === 'string') {
                return ko.unwrap(ko.unwrap(option)[<string>this.optionsText]);
            }
            else if (this.optionsText && typeof (this.optionsText) === 'function') {
                return (<Function>this.optionsText)(ko.unwrap(ko.unwrap(option)));
            }
            else {
                return ko.unwrap(option);
            }
        }
        /**
         * gets the value-representation of the option
         * @method cap3Options.Cap3OptionsState#getOptionsValue
         * @private
         * @param {observable | Object | string} option - the object containing the option information
         * @returns {*}
         */
        private getOptionsValue(option: KnockoutObservable<any> | Object | string) {
            if (this.optionsValue && typeof (this.optionsValue) === 'string') {
                return ko.unwrap(ko.unwrap(option)[<string>this.optionsValue]);
            }
            else if (this.optionsValue && typeof (this.optionsValue) === 'function') {
                return (<Function>this.optionsValue)(ko.unwrap(ko.unwrap(option)));
            }
            else {
                return ko.unwrap(option);
            }
        }
        
        
        /**
         * creates the button which opens the options container and replaces the normal select element
         * @method cap3Options.Cap3OptionsState#createCaptionsElement
         * @private
         */
        private createCaptionsElement() {
            this.captionElement = document.createElement('button');
            this.captionText = document.createElement('span');
            this.captionElement.appendChild(this.captionText);
            var arrowSpan = document.createElement('span');
            arrowSpan.classList.add(dropDownSelectArrowClass);
            this.captionElement.appendChild(arrowSpan);
            this.captionText.textContent = ko.unwrap(this.optionsCaption);
            this.captionElement.setAttribute('data-open', false.toString());

            if (this.element.getAttribute('tabindex')) {
                this.captionElement.setAttribute('tabindex', this.element.getAttribute('tabindex'));
                this.element.removeAttribute('tabindex');
            }
        }
        /**
         * creates a div element which holds the information of one possible select option
         * @method cap3Options.Cap3OptionsState#createOptionDiv
         * @private
         * @param {observable | Object | string} option - the object containing the option information
         * @returns {HTMLElement}
         */
        private createOptionDiv(option: KnockoutObservable<any> | Object | string) {
            var self = this;
            var div = document.createElement('div');
            div.textContent = self.getOptionsText(option)
            div.setAttribute('data-selected', false.toString());
            div.classList.add(dropDownSelectRowClass);
            div.onmouseover = self.onRowHover();
            div.onclick = self.onItemSelect();
            var touchTimer = -1;
            var touchStart = new Point(-1, -1);

            div.ontouchstart = function(event: TouchEvent) {
                if (event.touches.length === 1) {
                    touchStart.x = event.touches[0].pageX;
                    touchStart.y = event.touches[0].pageY;
                    touchTimer = event.timeStamp || new Date().getTime();
                    event.stopPropagation();
                    return self.onRowHover()(event);;
                }
                self.hoverIndex(-1);
                return true;
            };

            div.ontouchend = function(event: TouchEvent) {
                if (event.touches.length === 0 && event.changedTouches.length === 1) {
                    var touchEnd = new Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                    var movedDistance = Point.distance(touchStart, touchEnd);
                    var endTime = event.timeStamp || new Date().getTime();
                    if (endTime - touchTimer < 1000 && movedDistance < 10) {
                        event.stopPropagation();
                        return self.onItemSelect()();
                    }
                }
                self.hoverIndex(-1);
                return true;
            };
            return div;
        }
        /**
         * searches the options which belongs to the given selected-option and returns the option itself or the gui representation
         * @method cap3Options.Cap3OptionsState#findOption
         * @private
         * @param {observable[] | Object[] | string[]} options - the array with all options to select from
         * @param {observable | Object | string} selectedValue - the value to find in options
         * @returns {string | undefined}
         */
        private findOption(options: KnockoutObservable<any>[]| Object[]| string[], selectedValue: KnockoutObservable<any> | Object | string) {
            for (var i = 0; i < options.length; i++) {
                if (this.getOptionsValue(options[i]) === ko.unwrap(selectedValue)) {
                    return options[i];
                }
            }
            return undefined;
        }
        /**
         * sets class style and attribute according to the state of the given option, only used when multiple flag is set
         * @method cap3Options.Cap3OptionsState#styleOptionsDivMultiple
         * @private
         * @param {KnockoutObservable<any> | Object | string} option - option which has changed
         * @param {HTMLDivElement} optionDiv - representation of the option
         */
        private styleOptionsDivMultiple(option: KnockoutObservable<any> | Object | string, optionDiv: HTMLDivElement) {
            if (ko.unwrap(this.selectedOptions).indexOf(this.getOptionsValue(option)) >= 0) {
                optionDiv.classList.add(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', true.toString());
            }
            else {
                optionDiv.classList.remove(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', false.toString());
            }
        }
        /**
         * sets class style and attribute according to the state of the given option, only used when multiple flag is not set
         * also sets the caption text for the select element
         * @method cap3Options.Cap3OptionsState#styleOptionsDivSingle
         * @private
         * @param {observable | Object | string} option - option which has changed
         * @param {HTMLDivElement} optionDiv - representation of the option
         */
        private styleOptionsDivSingle(option: KnockoutObservable<any> | Object | string, optionDiv: HTMLDivElement) {
            var newValue = this.getOptionsValue(option);
            if (newValue && newValue === ko.unwrap(this.value)) {
                optionDiv.classList.add(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', true.toString());
                this.captionText.textContent = this.getOptionsText(option);
            }
            else {
                optionDiv.classList.remove(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', false.toString());
            }
        }

        /**
         * sets the caption of the select element, only used when multiple flag is set
         * @method cap3Options.Cap3OptionsState#setCaptionMultiple
         * @private
         */
        private setCaptionMultiple() {
            switch (ko.unwrap(this.selectedOptions).length) {
                case 0:
                    this.captionText.textContent = ko.unwrap(this.optionsCaption);
                    break;
                case 1:
                    this.captionText.textContent = this.getOptionsText(this.findOption(ko.unwrap(this.options),
                        ko.unwrap(this.selectedOptions)[0]));
                    break;
                default:
                    this.captionText.textContent = ko.unwrap(this.selectedOptions).length + elementsChosen;
                    break;
            }
        }
        
        
        /**
         * toggles the select status of an option, only used when the multiple flag is set
         * @method cap3Options.Cap3OptionsState#selectItemMultiple
         * @private
         * @param {observable | Object | string} option - option which has changed
         * @param {HTMLElement} element - element which was clicked
         */
        private selectItemMultiple(option: KnockoutObservable<any> | Object | string, element: HTMLDivElement) {
            var i,
                tmpSelected;

            tmpSelected = this.getOptionsValue(option);

            i = ko.unwrap(this.selectedOptions).indexOf(tmpSelected);
            if (i >= 0) {
                this.selectedOptions.splice(i, 1);
                element.classList.remove(dropDownSelectSelectedClass);
                element.setAttribute('data-selected', false.toString());

            }
            else {
                this.selectedOptions.push(tmpSelected);
                element.classList.add(dropDownSelectSelectedClass);
                element.setAttribute('data-selected', true.toString());
            }
        }
        /**
         * sets the selected option as value
         * @method cap3Options.Cap3OptionsState#selectItemSingle
         * @private
         * @param {observable | Object | string} option - option which got selected by the user
         * @param {NodeList} nodes - the childnodes of the options-container
         */
        private selectItemSingle(option: KnockoutObservable<any> | Object | string, nodes: NodeList) {
            if (ko.isObservable(this.value)) {
                this.value(this.getOptionsValue(option));
            }
            else {
                this.value = this.getOptionsValue(option);
                this.captionText.textContent = this.getOptionsText(option);

                var index = this.hoverIndex();
                for (var i = 0; i < nodes.length; i++) {
                    if (i === index) {
                        (<HTMLDivElement>nodes[i]).classList.add(dropDownSelectSelectedClass);
                        (<HTMLDivElement>nodes[i]).setAttribute('data-selected', true.toString());
                    }
                    else {
                        (<HTMLDivElement>nodes[i]).classList.remove(dropDownSelectSelectedClass);
                        (<HTMLDivElement>nodes[i]).setAttribute('data-selected', false.toString());
                    }
                }
            }
        }


        /**
         * returns the hover callback which changes the hover-index according to mouse-position
         * @method cap3Options.Cap3OptionsState#onRowHover
         * @private
         * @returns {Function}
         */
        private onRowHover() {
            var self = this;
            return function(event: Event) {
                var elem = event.target || event.srcElement;
                self.hoverIndex(Array.prototype.indexOf.call(self.containerDiv.childNodes, elem));
                event.stopPropagation();
                return true;
            };
        }
        
        /**
         * returns the callback for up-arrow-key, the callback reduces the hover-index by 1
         * @method cap3Options.Cap3OptionsState#onUpArrowPressed
         * @private
         * @returns {Function}
         */
        private onUpArrowPressed() {
            var self = this;
            return function() {
                if (self.maxIndex < 0) {
                    return;
                }
                if (self.hoverIndex() <= 0) {
                    self.hoverIndex(self.maxIndex);
                }
                else {
                    self.hoverIndex(self.hoverIndex() - 1);
                }
                if (self.hoverIndex() >= 0) {
                    (<HTMLDivElement>self.containerDiv.childNodes[self.hoverIndex()]).scrollIntoView(false);
                }
            };
        }
        /**
         * returns the callback for down-arrow-key, the callback increases the hover-index by 1
         * @method cap3Options.Cap3OptionsState#onDownArrowPressed
         * @private
         * @returns {Function}
         */
        private onDownArrowPressed() {
            var self = this;
            return function() {
                if (self.maxIndex < 0) {
                    return;
                }
                if (!self.showBox) {
                    self.onSelectPressed()(undefined);
                    self.hoverIndex(-1);
                }

                if (self.hoverIndex() >= self.maxIndex) {
                    self.hoverIndex(0);
                }
                else {
                    self.hoverIndex(self.hoverIndex() + 1);
                }
                if (self.hoverIndex() >= 0) {
                    (<HTMLDivElement>self.containerDiv.childNodes[self.hoverIndex()]).scrollIntoView(false);
                }
            };
        }
        /**
         * returns the callback for the select-element-button, which opens or hides the options-container
         * @method cap3Options.Cap3OptionsState#onSelectPressed
         * @private
         * @returns {Function}
         */
        private onSelectPressed() {
            var self = this;
            return function(event: Event) {
                // catch firefox specific keyboard event to get same behavior in every browser
                if ((<any>event).mozInputSource === 6) {
                    return;
                }
                if (self.showBox) {
                    self.showBox = false;
                    self.inside = false;
                    self.captionElement.setAttribute('data-open', false.toString());
                    self.containerDiv.style.display = 'none';
                }
                else {
                    self.captionElement.focus();
                    self.captionElement.setAttribute('data-open', true.toString());
                    self.showBox = true;
                    self.applyContainerStyle(self.containerDiv, self.captionElement);
                    self.containerDiv.style.display = 'block';
                    self.size = parseInt(self.element.getAttribute('size'));
                    if (self.size) {
                        self.containerDiv.style.height = (<HTMLDivElement>self.containerDiv.firstChild).getBoundingClientRect().height *
                        self.size + 'px';
                    }
                    else {
                        self.containerDiv.style.height = 'auto';
                    }
                }
            };
        }
        /**
         * returns the callback for the mouse-out event, hover-index is reset and the inside state is set to false
         * @method cap3Options.Cap3OptionsState#onMouseOut
         * @private
         * @returns {Function}
         */
        private onMouseOut() {
            var self = this;
            return function(event: MouseEvent) {
                var e = event.toElement || <Element>event.relatedTarget;
                if (e.parentNode === self.containerDiv ||
                    e === self.containerDiv) {
                    return;
                }
                self.inside = false;
            };
        }
        /**
         * returns the callback for the mouse-enter event, hover-index is reset and the inside state is set to true
         * @method cap3Options.Cap3OptionsState#onMouseEnter
         * @private
         * @returns {Function}
         */
        private onMouseEnter() {
            var self = this;
            return function() {
                self.inside = true;
            };
        }

        /**
         * returns the callback for the hover-index-changed event, which toggles the active class for a visual hover effect
         * @method cap3Options.Cap3OptionsState#onHoverChanged
         * @private
         * @returns {Function}
         */
        private onHoverChanged() {
            var self = this;
            return function(index: number) {
                self.captionElement.focus();
                var nodes = self.containerDiv.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (i === index) {
                        (<HTMLDivElement>nodes[i]).classList.add(dropDownSelectActiveClass);
                    }
                    else {
                        (<HTMLDivElement>nodes[i]).classList.remove(dropDownSelectActiveClass);
                    }
                }
            };
        }

        /**
         * returns callback which hides the options-container
         * @method cap3Options.Cap3OptionsState#onHideOptions
         * @private
         * @returns {Function}
         */
        private onHideOptions() {
            var self = this;
            return function() {
                if (!self.inside) {
                    self.showBox = false;
                    self.containerDiv.style.display = 'none';
                    self.captionElement.setAttribute('data-open', false.toString());
                }
                else {
                    self.captionElement.focus();
                }
            };
        }

        /**
         * returns the callback for the item-select event, which changes the actual selection
         * @method cap3Options.Cap3OptionsState#onItemSelect
         * @private
         * @returns {Function}
         */
        private onItemSelect() {
            var self = this;
            return function() {
                var index = self.hoverIndex();

                if (index < 0 || !self.showBox) {
                    return false;
                }

                var selected = ko.unwrap(ko.unwrap(self.options)[index]),
                    nodes = self.containerDiv.childNodes,
                    element = <HTMLDivElement>nodes[index];

                if (self.multiple) {
                    self.selectItemMultiple(selected, element);
                    self.setCaptionMultiple();
                    self.captionElement.focus();
                }
                else {
                    self.selectItemSingle(selected, nodes);
                    self.inside = false;
                    self.onHideOptions()();
                }
                return false;
            };
        }

        /**
         * returns the key-down-callback, which reacts on up-arrow, down-arrow, escape and space-bar
         * escape hides the options-container and blurs the select element
         * space-bar can be used to select the element marked by the hover-index
         * @method cap3Options.Cap3OptionsState#onKeyDown
         * @private
         * @returns {Function}
         */
        private onKeyDown() {
            var self = this;
            return function(event: KeyboardEvent) {
                event = event || <KeyboardEvent>window.event;
                switch (event.keyCode) {
                    case 38: // up-arrow
                        self.onUpArrowPressed()();
                        event.preventDefault();
                        return false;
                    case 40: // down-arrow
                        self.onDownArrowPressed()();
                        event.preventDefault();
                        return false;
                    case 27: // escape
                        self.inside = false;
                        self.showBox = false;
                        self.onHideOptions()();
                        return true;
                    case 32: // space
                        self.onItemSelect()();
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    default:
                        return true;
                }
            };
        }

        /**
         * returns the callback for the options-change-event, when the options change the dropdown element is initialized again
         * @method cap3Options.Cap3OptionsState#onOptionsChange
         * @private
         * @returns {Function}
         */
        private onOptionsChange() {
            var self = this;
            return function() {
                self.initializeDropDown();
            };
        }

        /**
         * returns the callback for the enable-event, only used when enable is bound to an observable
         * enables or disables the select element according to bound data
         * @method cap3Options.Cap3OptionsState#onEnable
         * @private
         * @returns {Function}
         */
        private onEnable() {
            var self = this;
            return function(enable: boolean) {
                self.captionElement.disabled = !enable;
            };
        }

        /**
         * returns the callback for the disable-event, only used when disable is bound to an observable
         * enables or disables the select element according to bound data
         * @method cap3Options.Cap3OptionsState#onDisable
         * @private
         * @returns {Function}
         */
        private onDisable() {
            var self = this;
            return function(disable: boolean) {
                self.captionElement.disabled = disable;
            };
        }

        /**
         * updates the selection when the value observable changes
         * @method cap3Options.Cap3OptionsState#onValueChanged
         * @private
         * @returns {Function}
         */
        private onValueChanged() {
            var self = this;
            return function(value: any) {
                var option = self.findOption(ko.unwrap(self.options), ko.unwrap(value));
                if (value === undefined) {
                    self.captionText.textContent = ko.unwrap(self.optionsCaption);
                }
                else {
                    self.captionText.textContent = self.getOptionsText(option);
                }
                var nodes = self.containerDiv.childNodes;
                var index = ko.unwrap(self.options).indexOf(option);
                for (var i = 0; i < nodes.length; i++) {
                    if (value && i === index) {
                        (<HTMLDivElement>nodes[i]).classList.add(dropDownSelectSelectedClass);
                        (<HTMLDivElement>nodes[i]).setAttribute('data-selected', true.toString());
                    }
                    else {
                        (<HTMLDivElement>nodes[i]).classList.remove(dropDownSelectSelectedClass);
                        (<HTMLDivElement>nodes[i]).setAttribute('data-selected', false.toString());
                    }
                }
            };
        }

        /**
         * updates the selection whe the selectedOptions observableArray changes
         * @method cap3Options.Cap3OptionsState#onSelectedOptionsChanged
         * @private
         * @returns {Function}
         */
        private onSelectedOptionsChanged() {
            var self = this;
            return function() {
                ko.unwrap(self.options).forEach(function(option: any, index: number) {
                    self.styleOptionsDivMultiple(option, <HTMLDivElement>self.containerDiv.childNodes[index]);
                });
                self.setCaptionMultiple();
            };
        }

        /**
         * updates the captionText when necessary
         * @method cap3Options.Cap3OptionsState#onOptionsCaptionChanged
         * @private
         * @returns {Function}
         */
        private onOptionsCaptionChanged() {
            var self = this;
            return function(value: string) {
                if (self.multiple && ko.unwrap(self.selectedOptions).length === 0) {
                    self.captionText.textContent = value;
                }
                else if (!self.multiple && self.value === undefined) {
                    self.captionText.textContent = value;
                }
            };
        }

        /**
         * Removes all event listeners from the dom element.
         * @method cap3Options.Cap3OptionsState#clearCallbacks
         * @private
         */
        private clearCallbacks() {
            this.captionElement.onkeydown = null;
            this.captionElement.onclick = null;
            this.containerDiv.onmouseenter = null;
            this.captionElement.onblur = null;
            this.containerDiv.onmouseout = null;
        }
        
        /**
         * This function applies necessary styles to the container and caption-element  ( e.g. z-index)
         * @method cap3Options.Cap3OptionsState#applyContainerStyle
         * @public
         * @param {HTMLDivElement} containerDiv - element to hold all select options
         * @param {HTMLElement} captionElement - element to show information about selection state and to open options container on click
         */
        public applyContainerStyle(containerDiv: HTMLDivElement, captionElement: HTMLSpanElement) {
            captionElement.classList.add(dropDownSelectClass);
            captionElement.classList.add(dropDownSelectButtonClass);
            containerDiv.classList.add(dropDownSelectClass);
            containerDiv.classList.add(dropDownSelectContainerClass);
            containerDiv.style.minWidth = captionElement.offsetWidth + 'px';
            containerDiv.style.width = 'auto';
            containerDiv.style.position = 'absolute';
            containerDiv.style.overflow = 'auto';
            containerDiv.style.zIndex = zIndex.toString();
        }
        
        /**
         * initializes dropdown-container and caption-element with the actual options and status
         * @method cap3Options.Cap3OptionsState#initializeDropDown
         * @public
         */
        public initializeDropDown() {
            var self = this;
            while (self.containerDiv.firstChild) {
                self.containerDiv.removeChild(self.containerDiv.firstChild);
            }
            self.maxIndex = ko.unwrap(self.options).length - 1;
            if (ko.unwrap(self.options).length > 0) {
                var tmpDiv;
                ko.unwrap(self.options).forEach(function(option) {
                    tmpDiv = self.createOptionDiv(option);
                    self.containerDiv.appendChild(tmpDiv);
                    if (self.multiple) {
                        self.styleOptionsDivMultiple(option, tmpDiv);
                    }
                    else {
                        self.styleOptionsDivSingle(option, tmpDiv);
                    }
                });
            }
            if (self.multiple) {
                self.setCaptionMultiple();
            }
        }
        
        /**
         * checks if this binding is allowed
         * @method cap3Options.Cap3OptionsState#isBindingAllowed
         * @public
         * @returns {boolean} true if binding is allowed
         */
        public isBindingAllowed() {
            if (this.multiple &&
                (this.options === undefined || this.selectedOptions === undefined)) {
                throw 'with multiple set, options and selectedOptions binding must be valid for this dropDownSelect-binding to work';
            }
            if (!this.multiple && (this.options === undefined || this.value === undefined)) {
                throw 'without multiple set, options and value binding must be valid for this dropDownSelect-binding to work';
            }
            if (this.optionsText !== undefined &&
                (typeof (this.optionsText) !== 'string' && typeof (this.optionsText) !== 'function')) {
                throw 'if optionsText is set it must be a valid string describing a property name';
            }
            if (this.optionsValue !== undefined &&
                (typeof (this.optionsValue) !== 'string' && typeof (this.optionsValue) !== 'function')) {
                throw 'if optionsValue is set it must be a valid string describing a property name';
            }
            if (this.optionsCaption !== undefined &&
                (typeof (this.optionsCaption) !== 'string' && !ko.isObservable(this.optionsCaption))) {
                throw 'if optionsCaption is set it must be a valid string';
            }
            if (this.optionsCaption === undefined) {
                this.optionsCaption = pleaseChoose;
            }

            return true;
        }
        
        /**
         * initializes all callbacks
         * @method cap3Options.Cap3OptionsState#initCallbacks
         * @public
         */
        public initCallbacks() {
            this.captionElement.onkeydown = this.onKeyDown();
            this.captionElement.onclick = this.onSelectPressed();
            this.containerDiv.onmouseenter = this.onMouseEnter();
            this.captionElement.onblur = this.onHideOptions();
            this.containerDiv.onmouseout = this.onMouseOut();
        }

        /**
         * initializes all DOM Elements
         * @method cap3Options.Cap3OptionsState#initDomElements
         * @public
         */
        public initDomElements() {
            var parent = this.element.parentNode,
                surroundingDiv = document.createElement('div');

            surroundingDiv.classList.add(dropDownSelectClass);
            this.createCaptionsElement();
            parent.replaceChild(surroundingDiv, this.element);

            this.containerDiv.style.display = 'none';
            surroundingDiv.style.position = 'relative';
            this.element.style.display = 'none';
            surroundingDiv.appendChild(this.element);
            surroundingDiv.appendChild(this.captionElement);
            surroundingDiv.appendChild(this.containerDiv);
        }
        
        /**
         * initializes all necessary subscriptions on possible observables
         * @method cap3Options.Cap3OptionsState#initSubscriptions
         * @public
         */
        public initSubscriptions() {
            this.subscriptions
                .push(this.hoverIndex.subscribe(this.onHoverChanged()));

            if (ko.isObservable(this.options)) {
                this.subscriptions
                    .push((<KnockoutObservableArray<any>>this.options).subscribe(this.onOptionsChange()));
            }
            if (this.enable !== undefined) {
                this.onEnable()(ko.unwrap(this.enable));
                if (ko.isObservable(this.enable)) {
                    this.subscriptions
                        .push((<KnockoutObservable<any>>this.enable).subscribe(this.onEnable()));
                }
            }
            if (this.disable !== undefined) {
                this.onDisable()(ko.unwrap(this.disable));
                if (ko.isObservable(this.disable)) {
                    this.subscriptions
                        .push((<KnockoutObservable<any>>this.disable).subscribe(this.onDisable()));
                }
            }
            if (this.value !== undefined && !this.multiple) {
                this.subscriptions
                    .push(this.value.subscribe(this.onValueChanged()));
            }
            if (this.selectedOptions !== undefined && this.multiple) {
                this.subscriptions
                    .push((<KnockoutObservableArray<any>>this.selectedOptions)
                        .subscribe(this.onSelectedOptionsChanged()));
            }
            if (ko.isObservable(this.optionsCaption)) {
                this.subscriptions
                    .push((<KnockoutObservable<any>>this.optionsCaption)
                        .subscribe(this.onOptionsCaptionChanged()));
            }
        }
        
        /**
         * disposes all subscriptions and cuts connections to other objects
         * @method cap3Options.Cap3OptionsState#dispose
         * @public
         */
        public dispose() {
            this.clearCallbacks();
            this.captionElement = null;
            this.containerDiv = null;
            this.captionText = null;
            this.element = null;
            this.options = null;
            this.selectedOptions = null;
            this.value = null;
            this.enable = null;
            this.disable = null;
            this.optionsCaption = null;
            this.optionsText = null;
            this.optionsValue = null;
            this.multiple = null;
            this.hoverIndex = null;

            if (this.subscriptions) {
                for (var i = 0; i < this.subscriptions.length; i++) {
                    this.subscriptions[i].dispose();
                }
                this.subscriptions = null;
            }
        }
        //#endregion
    }

    //#region helpers
    /**
     * helper class for touch events to claclulate movement
     */
    class Point {
        constructor(public x: number, public y: number) {

        }
        /**
         * calculates the distance between this and another point
         * @param {Point} other - other point
         * @returns {number} - distance between this and the other point
         */
        public distance(other: Point) {
            var xd = other.x - this.x;
            var yd = other.y - this.y;
            return Math.sqrt(xd * xd + yd * yd);
        }
        /**
         * calculates the distance between two 2d points
         * @param {Point} p1 - first point
         * @param {Point} p2 - second point
         * @returns {number} - distance between the two points
         */
        public static distance(p1: Point, p2: Point) {
            var xd = p2.x - p1.x;
            var yd = p2.y - p1.y;
            return Math.sqrt(xd * xd + yd * yd);
        }
    }
    //#endregion

    /**
    * Binding
    */
    export var Binding = {
        init(element, valueAccessor: KnockoutObservable<any>, allBindings) {

            var cap3OptionsState = new Cap3OptionsState(valueAccessor, allBindings, element);
            cap3OptionsState.isBindingAllowed();
            cap3OptionsState.initDomElements();
            cap3OptionsState.initCallbacks();
            cap3OptionsState.initSubscriptions();
            cap3OptionsState.initializeDropDown();
            cap3OptionsState.applyContainerStyle(cap3OptionsState.containerDiv, cap3OptionsState.captionElement);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                cap3OptionsState.dispose();
                cap3OptionsState = undefined;
            });
        }
    }
}

ko.bindingHandlers['cap3Options'] = cap3Options.Binding;


///<reference path="./DefinitelyTyped/knockout/knockout.d.ts" />
///<reference path="./DefinitelyTyped/requirejs/require.d.ts" />
import ko = require('knockout');
/***
 * Knockout Custom Binding for styled drop-down select elements, works with normal select tags as long as there is an
 * options binding and a binding for the selection result
 *
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
    
        /**
     * @typedef {object} StateData
     * @property {HTMLButtonElement} captionElement - dom element used to replace the original select element
     * @property {HTMLDivElement} containerDiv - dom element which displays the options to select from
     * @property {HTMLSpanElement} captionText - dom element which displays information about the actual selection
     * @property {HTMLSelectElement} element - the select element this binding is bound to
     * @property {observableArray | object[] | string[]} options - array of options to choose from
     * @property {observableArray | object[] | string[] | *[] | undefined} - selectedOptions - array of selected options, used when multiple flag is set
     * @property {observable | object | string | * | undefined} value - the selected value, used when no multiple flag is set
     * @property {observable | bool} enable - enables or disables this control, support for knockout enable binding
     * @property {observable | bool} disable - disables or enables this control, support for knockout disable binding
     * @property {?observable | ?string} optionsCaption - text to display when no selection is made, support for knockout optionsCaption binding
     * @property {?string | ?function} optionsText - property-name to display this property of the options instead of the option object itself, support for knockout optionsText binding
     * @property {?string | ?function} optionsValue - property-name to store this property of the options instead of the option object itself, support for knockout optionsValue binding
     * @property {bool} multiple - true if multiple flag is set for the select element
     * @property {?number} size - stores the possibly set size attribute of the select element
     * @property {observable} hoverIndex - stores the information about the element under the cursor
     * @property {number} maxIndex - stores the length of the options array
     * @property {bool} inside - shows if the cursor is inside the containerDiv element
     * @property {bool} showBox - shows if the containerDiv is displayed or hidden

     */
    class StateData {
        public captionElement: HTMLButtonElement;
        public containerDiv: HTMLDivElement;
        public captionText: HTMLSpanElement;
        public element: HTMLSelectElement;
        public options: KnockoutObservableArray<any> | Object[] | string[];
        public selectedOptions: KnockoutObservableArray<any>  | Object[] | string[] | any[];
        public value: KnockoutObservable<any> | Object | string | any;
        public enable: KnockoutObservable<boolean> | boolean;
        public disable: KnockoutObservable<boolean> | boolean;
        public optionsCaption: KnockoutObservable<string> | string;
        public optionsText: string | Function;
        public optionsValue: string | Function;
        public multiple: boolean;
        public size: number;
        public hoverIndex: KnockoutObservable<number>;
        public maxIndex: number;
        public inside: boolean;
        public showBox: boolean;
        public subscriptions: KnockoutSubscription[];

             /**
     * @param {Function} valueAccessor - the accessor function to the binding value
     * @param {object} allBindings - the other bindings bound to the element
     * @param {HTMLElement} element - the element this binding is bound to
     * @class
     */
        constructor (
            valueAccessor: KnockoutObservable<any>, 
            allBindings: KnockoutObservable<any>, 
            element: HTMLSelectElement) {
        this.captionElement = undefined;
        this.containerDiv = document.createElement('div');
        this.captionText = undefined;
        this.element = element;
        this.options = valueAccessor();
        this.selectedOptions = allBindings()['selectedOptions'];
        this.value = allBindings()['cap3Value'];
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
        
        /**
         * dispose
         */
        public dispose() {
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
    }

    /**
     * @typedef {object} Point
     * @property {number} x - x-coordinate
     * @property {number} y - y-coordinate
     */
    class Point {
        constructor(public x: number, public y: number) {
            
        }
    }

    //#region functions
    //#region helper functions

    /**
     * calculates the distance between to 2d points
     * @param {Point} p1 - first point
     * @param {Point} p2 - second point
     * @returns {number}
     */
    function distance(p1:Point, p2:Point) {
        var xd = p2.x - p1.x;
        var yd = p2.y - p1.y;
        return Math.sqrt(xd * xd + yd * yd);
    }
    //#endregion

    /**
     * gets the text representation of the option
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {observable | object | string} option - the object containing the option information
     * @returns {string}
     */
    function getOptionsText(stateData: StateData, option: KnockoutObservable<any> | Object | string) {
        if (option && stateData.optionsText && typeof (stateData.optionsText) === 'string') {
            return ko.unwrap(ko.unwrap(option)[<string>stateData.optionsText]);
        }
        else if (stateData.optionsText && typeof (stateData.optionsText) === 'function') {
            return (<Function>stateData.optionsText)(ko.unwrap(ko.unwrap(option)));
        }
        else {
            return ko.unwrap(option);
        }
    }

    /**
     * gets the value-representation of the option
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {observable | object | string} option - the object containing the option information
     * @returns {*}
     */
    function getOptionsValue(stateData: StateData, option: KnockoutObservable<any> | Object | string) {
        if (stateData.optionsValue && typeof (stateData.optionsValue) === 'string') {
            return ko.unwrap(ko.unwrap(option)[<string>stateData.optionsValue]);
        }
        else if (stateData.optionsValue && typeof (stateData.optionsValue) === 'function') {
            return (<Function>stateData.optionsValue)(ko.unwrap(ko.unwrap(option)));
        }
        else {
            return ko.unwrap(option);
        }
    }

    /**
     * This function applies necessary styles to the container and caption-element  ( e.g. z-index)
     * @param {HTMLDivElement} containerDiv - element to hold all select options
     * @param {HTMLElement} captionElement - element to show information about selection state and to open options container on click
     */
    function applyContainerStyle(containerDiv: HTMLDivElement, captionElement: HTMLSpanElement) {
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
     * creates the button which opens the options container and replaces the normal select element
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function createCaptionsElement( stateData : StateData) {
        stateData.captionElement = document.createElement('button');
        stateData.captionText = document.createElement('span');
        stateData.captionElement.appendChild(stateData.captionText);
        var arrowSpan = document.createElement('span');
        arrowSpan.classList.add(dropDownSelectArrowClass);
        stateData.captionElement.appendChild(arrowSpan);
        stateData.captionText.textContent = ko.unwrap(stateData.optionsCaption);
        stateData.captionElement.setAttribute('data-open', false.toString());

        if (stateData.element.getAttribute('tabindex')) {
            stateData.captionElement.setAttribute('tabindex', stateData.element.getAttribute('tabindex'));
            stateData.element.removeAttribute('tabindex');
        }
    }

    /**
     * creates a div element which holds the information of one possible select option
     * @param {observable | object | string} option - the object containing the option information
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {HTMLElement}
     */
    function createOptionDiv(option: KnockoutObservable<any> | Object | string, stateData : StateData) {

        var div = document.createElement('div');
        div.textContent = getOptionsText(stateData, option);
        div.setAttribute('data-selected', false.toString());
        div.classList.add(dropDownSelectRowClass);
        div.onmouseover = onRowHover(stateData);
        div.onclick = onItemSelect(stateData);
        var touchTimer = -1;
        var touchStart = new Point(-1, -1);

        div.ontouchstart = function (event: TouchEvent) {
            if (event.touches.length === 1) {
                touchStart.x = event.touches[0].pageX;
                touchStart.y = event.touches[0].pageY;
                touchTimer = event.timeStamp || new Date().getTime();
                event.stopPropagation();
                return onRowHover(stateData)(event);;
            }
            stateData.hoverIndex(-1);
            return true;
        };

        div.ontouchend = function (event: TouchEvent) {
            if (event.touches.length === 0 && event.changedTouches.length === 1) {
                var touchEnd = new Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                var movedDistance = distance(touchStart, touchEnd);
                var endTime = event.timeStamp || new Date().getTime();
                if (endTime - touchTimer < 1000 && movedDistance < 10) {
                    event.stopPropagation();
                    return onItemSelect(stateData)();
                }
            }
            stateData.hoverIndex(-1);
            return true;
        };
        return div;
    }

    /**
     * searches the options which belongs to the given selected-option and returns the option itself or the gui representation
     * @param {observable[] | object[] | string[]} options - the array with all options to select from
     * @param {observable | object | string} selectedValue - the value to find in options
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {string | undefined}
     */
    function findOption(options: KnockoutObservable<any>[] | Object[] | string[], selectedValue: KnockoutObservable<any> | Object | string, stateData: StateData) {
        for (var i = 0; i < options.length; i++) {
            if (getOptionsValue(stateData, options[i]) === ko.unwrap(selectedValue)) {
                return options[i];
            }
        }
        return undefined;
    }

    /**
     * sets class style and attribute according to the state of the given option, only used when multiple flag is set
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {KnockoutObservable<any> | object | string} option - option which has changed
     * @param {HTMLDivElement} optionDiv - representation of the option
     */
    function styleOptionsDivMultiple(stateData: StateData, option: KnockoutObservable<any> | Object | string, optionDiv: HTMLDivElement) {
        if (ko.unwrap(stateData.selectedOptions).indexOf(getOptionsValue(stateData, option)) >= 0) {
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
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {observable | object | string} option - option which has changed
     * @param {HTMLDivElement} optionDiv - representation of the option
     */
    function styleOptionsDivSingle(stateData: StateData, option: KnockoutObservable<any> | Object | string, optionDiv: HTMLDivElement) {
        var newValue = getOptionsValue(stateData, option);
        if (newValue && newValue === ko.unwrap(stateData.value)) {
            optionDiv.classList.add(dropDownSelectSelectedClass);
            optionDiv.setAttribute('data-selected', true.toString());
            stateData.captionText.textContent = getOptionsText(stateData, option);
        }
        else {
            optionDiv.classList.remove(dropDownSelectSelectedClass);
            optionDiv.setAttribute('data-selected', false.toString());
        }
    }

    /**
     * sets the caption of the select element, only used when multiple flag is set
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function setCaptionMultiple( stateData : StateData) {
        switch (ko.unwrap(stateData.selectedOptions).length) {
            case 0:
                stateData.captionText.textContent = ko.unwrap(stateData.optionsCaption);
                break;
            case 1:
                stateData.captionText.textContent = getOptionsText(stateData, findOption(ko.unwrap(stateData.options),
                    ko.unwrap(stateData.selectedOptions)[0], stateData));
                break;
            default:
                stateData.captionText.textContent = ko.unwrap(stateData.selectedOptions).length + elementsChosen;
                break;
        }
    }

    /**
     * initializes dropdown-container and caption-element with the actual options and status
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function initializeDropDown( stateData : StateData) {
        while (stateData.containerDiv.firstChild) {
            stateData.containerDiv.removeChild(stateData.containerDiv.firstChild);
        }
        stateData.maxIndex = ko.unwrap(stateData.options).length - 1;
        if (ko.unwrap(stateData.options).length > 0) {
            var tmpDiv;

            ko.unwrap(stateData.options).forEach(function (option) {
                tmpDiv = createOptionDiv(option, stateData);
                stateData.containerDiv.appendChild(tmpDiv);
                if (stateData.multiple) {
                    styleOptionsDivMultiple(stateData, option, tmpDiv);
                }
                else {
                    styleOptionsDivSingle(stateData, option, tmpDiv);
                }
            });

        }
        if (stateData.multiple) {
            setCaptionMultiple(stateData);
        }
    }

    /**
     * toggles the select status of an option, only used when the multiple flag is set
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {observable | object | string} option - option which has changed
     * @param {HTMLElement} element - element which was clicked
     */
    function selectItemMultiple(stateData: StateData, option: KnockoutObservable<any> | Object | string, element: HTMLDivElement) {
        var i,
            tmpSelected;

        tmpSelected = getOptionsValue(stateData, option);

        i = ko.unwrap(stateData.selectedOptions).indexOf(tmpSelected);
        if (i >= 0) {
            stateData.selectedOptions.splice(i, 1);
            element.classList.remove(dropDownSelectSelectedClass);
            element.setAttribute('data-selected', false.toString());

        }
        else {
            stateData.selectedOptions.push(tmpSelected);
            element.classList.add(dropDownSelectSelectedClass);
            element.setAttribute('data-selected', true.toString());
        }
    }

    /**
     * sets the selected option as value
     * @param {StateData} stateData - object which holds all status information about the select element
     * @param {observable | object | string} option - option which got selected by the user
     * @param {NodeList} nodes - the childnodes of the options-container
     */
    function selectItemSingle(stateData: StateData, option: KnockoutObservable<any> | Object | string, nodes: NodeList) {
        if (ko.isObservable(stateData.value)) {
            stateData.value(getOptionsValue(stateData, option));
        }
        else {
            stateData.value = getOptionsValue(stateData, option);
            stateData.captionText.textContent = getOptionsText(stateData, option);

            var index = stateData.hoverIndex();
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
     * checks if this binding is allowed
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {boolean} true if binding is allowed
     */
    function isBindingAllowed( stateData : StateData) {
        if (stateData.multiple &&
            (stateData.options === undefined || stateData.selectedOptions === undefined)) {
            throw 'with multiple set, options and selectedOptions binding must be valid for this dropDownSelect-binding to work';
        }
        if (!stateData.multiple && (stateData.options === undefined || stateData.value === undefined)) {
            throw 'without multiple set, options and value binding must be valid for this dropDownSelect-binding to work';
        }
        if (stateData.optionsText !== undefined &&
            (typeof (stateData.optionsText) !== 'string' && typeof (stateData.optionsText) !== 'function')) {
            throw 'if optionsText is set it must be a valid string describing a property name';
        }
        if (stateData.optionsValue !== undefined &&
            (typeof (stateData.optionsValue) !== 'string' && typeof (stateData.optionsValue) !== 'function')) {
            throw 'if optionsValue is set it must be a valid string describing a property name';
        }
        if (stateData.optionsCaption !== undefined &&
            (typeof (stateData.optionsCaption) !== 'string' && !ko.isObservable(stateData.optionsCaption))) {
            throw 'if optionsCaption is set it must be a valid string';
        }
        if (stateData.optionsCaption === undefined) {
            stateData.optionsCaption = pleaseChoose;
        }

        return true;
    }

    /**
     * returns the hover callback which changes the hover-index according to mouse-position
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onRowHover( stateData : StateData) {
        return function (event: Event) {
            var elem = event.target || event.srcElement;
            stateData.hoverIndex(Array.prototype.indexOf.call(stateData.containerDiv.childNodes, elem));
            event.stopPropagation();
            return true;
        };
    }

    /**
     * returns the callback for up-arrow-key, the callback reduces the hover-index by 1
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onUpArrowPressed( stateData : StateData) {
        return function () {
            if (stateData.maxIndex < 0) {
                return;
            }
            if (stateData.hoverIndex() <= 0) {
                stateData.hoverIndex(stateData.maxIndex);
            }
            else {
                stateData.hoverIndex(stateData.hoverIndex() - 1);
            }
            if (stateData.hoverIndex() >= 0) {
                (<HTMLDivElement>stateData.containerDiv.childNodes[stateData.hoverIndex()]).scrollIntoView(false);
            }
        };
    }

    /**
     * returns the callback for down-arrow-key, the callback increases the hover-index by 1
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onDownArrowPressed( stateData : StateData) {
        return function () {
            if (stateData.maxIndex < 0) {
                return;
            }
            if (!stateData.showBox) {
                onSelectPressed(stateData)(undefined);
                stateData.hoverIndex(-1);
            }

            if (stateData.hoverIndex() >= stateData.maxIndex) {
                stateData.hoverIndex(0);
            }
            else {
                stateData.hoverIndex(stateData.hoverIndex() + 1);
            }
            if (stateData.hoverIndex() >= 0) {
                (<HTMLDivElement>stateData.containerDiv.childNodes[stateData.hoverIndex()]).scrollIntoView(false);
            }
        };
    }

    /**
     * returns the callback for the select-element-button, which opens or hides the options-container
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onSelectPressed(stateData : StateData) {
        return function (event: Event) {
            // catch firefox specific keyboard event to get same behavior in every browser
            if ((<any>event).mozInputSource === 6) {
                return;
            }
            if (stateData.showBox) {
                stateData.showBox = false;
                stateData.inside = false;
                stateData.captionElement.setAttribute('data-open', false.toString());
                stateData.containerDiv.style.display = 'none';
            }
            else {
                stateData.captionElement.focus();
                stateData.captionElement.setAttribute('data-open', true.toString());
                stateData.showBox = true;
                applyContainerStyle(stateData.containerDiv, stateData.captionElement);
                stateData.containerDiv.style.display = 'block';
                stateData.size = parseInt(stateData.element.getAttribute('size'));
                if (stateData.size) {
                    stateData.containerDiv.style.height = (<HTMLDivElement>stateData.containerDiv.firstChild).getBoundingClientRect().height *
                    stateData.size + 'px';
                }
                else {
                    stateData.containerDiv.style.height = 'auto';
                }
            }
        };
    }

    /**
     * returns the callback for the mouse-out event, hover-index is reset and the inside state is set to false
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onMouseOut(stateData : StateData) {
        return function (event: MouseEvent) {
            var e = event.toElement || <Element>event.relatedTarget;
            if (e.parentNode === stateData.containerDiv ||
                e === stateData.containerDiv) {
                return;
            }
            stateData.inside = false;
        };
    }

    /**
     * returns the callback for the mouse-enter event, hover-index is reset and the inside state is set to true
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onMouseEnter(stateData : StateData) {
        return function () {
            stateData.inside = true;
        };
    }

    /**
     * returns the callback for the hover-index-changed event, which toggles the active class for a visual hover effect
     *
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onHoverChanged(stateData : StateData) {
        return function (index: number) {
            stateData.captionElement.focus();
            var nodes = stateData.containerDiv.childNodes;
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
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onHideOptions(stateData : StateData) {
        return function () {
            if (!stateData.inside) {
                stateData.showBox = false;
                stateData.containerDiv.style.display = 'none';
                stateData.captionElement.setAttribute('data-open', false.toString());
            }
            else {
                stateData.captionElement.focus();
            }
        };
    }

    /**
     * returns the callback for the item-select event, which changes the actual selection
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onItemSelect(stateData : StateData) {
        return function () {
            var index = stateData.hoverIndex();

            if (index < 0 || !stateData.showBox) {
                return false;
            }

            var selected = ko.unwrap(ko.unwrap(stateData.options)[index]),
                nodes = stateData.containerDiv.childNodes,
                element = <HTMLDivElement>nodes[index];

            if (stateData.multiple) {
                selectItemMultiple(stateData, selected, element);
                setCaptionMultiple(stateData);
                stateData.captionElement.focus();
            }
            else {
                selectItemSingle(stateData, selected, nodes);
                stateData.inside = false;
                onHideOptions(stateData)();
            }
            return false;
        };
    }

    /**
     * returns the key-down-callback, which reacts on up-arrow, down-arrow, escape and space-bar
     * escape hides the options-container and blurs the select element
     * space-bar can be used to select the element marked by the hover-index
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onKeyDown(stateData : StateData) {
        return function (event: KeyboardEvent) {
            event = event || <KeyboardEvent>window.event;
            switch (event.keyCode) {
                case 38: // up-arrow
                    onUpArrowPressed(stateData)();
                    event.preventDefault();
                    return false;
                case 40: // down-arrow
                    onDownArrowPressed(stateData)();
                    event.preventDefault();
                    return false;
                case 27: // escape
                    stateData.inside = false;
                    stateData.showBox = false;
                    onHideOptions(stateData)();
                    return true;
                case 32: // space
                    onItemSelect(stateData)();
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
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onOptionsChange(stateData : StateData) {
        return function () {
            initializeDropDown(stateData);
        };
    }

    /**
     * returns the callback for the enable-event, only used when enable is bound to an observable
     * enables or disables the select element according to bound data
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onEnable(stateData : StateData) {
        return function (enable: boolean) {
            stateData.captionElement.disabled = !enable;
        };
    }

    /**
     * returns the callback for the disable-event, only used when disable is bound to an observable
     * enables or disables the select element according to bound data
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onDisable(stateData : StateData) {
        return function (disable: boolean) {
            stateData.captionElement.disabled = disable;
        };
    }

    /**
     * updates the selection when the value observable changes
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onValueChanged(stateData : StateData) {
        return function (value: any) {
            var option = findOption(ko.unwrap(stateData.options), ko.unwrap(value), stateData);
            if (value === undefined) {
                stateData.captionText.textContent = ko.unwrap(stateData.optionsCaption);
            }
            else {
                stateData.captionText.textContent = getOptionsText(stateData, option);
            }
            var nodes = stateData.containerDiv.childNodes;
            var index = ko.unwrap(stateData.options).indexOf(option);
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
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onSelectedOptionsChanged(stateData : StateData) {
        return function () {
            ko.unwrap(stateData.options).forEach(function (option: any, index: number) {
                styleOptionsDivMultiple(stateData, option, <HTMLDivElement>stateData.containerDiv.childNodes[index]);
            });
            setCaptionMultiple(stateData);
        };
    }

    /**
     * updates the captionText when necessary
     * @param {StateData} stateData - object which holds all status information about the select element
     * @returns {Function}
     */
    function onOptionsCaptionChanged(stateData : StateData) {
        return function (value: string) {
            if (stateData.multiple && ko.unwrap(stateData.selectedOptions).length === 0) {
                stateData.captionText.textContent = value;
            }
            else if (!stateData.multiple && stateData.value === undefined) {
                stateData.captionText.textContent = value;
            }
        };
    }

    //#endregion

    //#region init
    /**
     * initializes all callbacks
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function initCallbacks(stateData : StateData) {
        stateData.captionElement.onkeydown = onKeyDown(stateData);
        stateData.captionElement.onclick = onSelectPressed(stateData);
        stateData.containerDiv.onmouseenter = onMouseEnter(stateData);
        stateData.captionElement.onblur = onHideOptions(stateData);
        stateData.containerDiv.onmouseout = onMouseOut(stateData);
    }

    /**
     * initializes all DOM Elements
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function initDomElements(stateData : StateData) {
        var parent = stateData.element.parentNode,
            surroundingDiv = document.createElement('div');

        surroundingDiv.classList.add(dropDownSelectClass);
        createCaptionsElement(stateData);
        parent.replaceChild(surroundingDiv, stateData.element);

        stateData.containerDiv.style.display = 'none';
        surroundingDiv.style.position = 'relative';
        stateData.element.style.display = 'none';
        surroundingDiv.appendChild(stateData.element);
        surroundingDiv.appendChild(stateData.captionElement);
        surroundingDiv.appendChild(stateData.containerDiv);
    }

    /**
     * initializes all necessary subscriptions on possible observables
     * @param {StateData} stateData - object which holds all status information about the select element
     */
    function initSubscriptions(stateData : StateData) {
        stateData.subscriptions
            .push(stateData.hoverIndex.subscribe(onHoverChanged(stateData)));

        if (ko.isObservable(stateData.options)) {
            stateData.subscriptions
                .push((<KnockoutObservableArray<any>>stateData.options).subscribe(onOptionsChange(stateData)));
        }
        if (stateData.enable !== undefined) {
            onEnable(stateData)(ko.unwrap(stateData.enable));
            if (ko.isObservable(stateData.enable)) {
                stateData.subscriptions
                    .push((<KnockoutObservable<any>>stateData.enable).subscribe(onEnable(stateData)));
            }
        }
        if (stateData.disable !== undefined) {
            onDisable(stateData)(ko.unwrap(stateData.disable));
            if (ko.isObservable(stateData.disable)) {
                stateData.subscriptions
                    .push((<KnockoutObservable<any>>stateData.disable).subscribe(onDisable(stateData)));
            }
        }
        if (stateData.value !== undefined && !stateData.multiple) {
            stateData.subscriptions
                .push(stateData.value.subscribe(onValueChanged(stateData)));
        }
        if (stateData.selectedOptions !== undefined && stateData.multiple) {
            stateData.subscriptions
                .push((<KnockoutObservableArray<any>>stateData.selectedOptions)
                .subscribe(onSelectedOptionsChanged(stateData)));
        }
        if (ko.isObservable(stateData.optionsCaption)) {
            stateData.subscriptions
                .push((<KnockoutObservable<any>>stateData.optionsCaption)
                .subscribe(onOptionsCaptionChanged(stateData)));
        }
    }
    //#endregion

    //#region Dispose
    /**
     * Removes all event listeners from the dom element.
     *
     */
    function clearCallbacks(stateData : StateData) {
        stateData.captionElement.onkeydown = null;
        stateData.captionElement.onclick = null;
        stateData.containerDiv.onmouseenter = null;
        stateData.captionElement.onblur = null;
        stateData.containerDiv.onmouseout = null;
    }

    /**
     * Disposes the instance related to the specified state data.
     */
    function dispose(stateData : StateData) {
        clearCallbacks(stateData);
        stateData.dispose.call(stateData);
    }
    //#endregion
     /**
     * Binding
     */
    export var Binding = {
        init (element, valueAccessor: KnockoutObservable<any>, allBindings) {

            var stateData = new StateData(valueAccessor, allBindings, element);

            isBindingAllowed(stateData);

            initDomElements(stateData);
            initCallbacks(stateData);

            initSubscriptions(stateData);

            initializeDropDown(stateData);
            applyContainerStyle(stateData.containerDiv, stateData.captionElement);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                dispose(stateData);
                stateData = undefined;
            });
        }
    }

}   

ko.bindingHandlers['cap3Options'] = cap3Options.Binding;


define(["require", "exports", 'knockout'], function (require, exports, ko) {
    var cap3Options;
    (function (cap3Options) {
        var prefix = 'knockout-select';
        var dropDownSelectClass = prefix;
        var dropDownSelectButtonClass = prefix + '-button';
        var dropDownSelectContainerClass = prefix + '-container';
        var dropDownSelectArrowClass = prefix + '-arrow';
        var dropDownSelectRowClass = prefix + '-row';
        var dropDownSelectSelectedClass = prefix + '-row-selected';
        var dropDownSelectActiveClass = prefix + '-row-active';
        var zIndex = 9999;
        var pleaseChoose = 'Choose...';
        var elementsChosen = ' items selected';
        var StateData = (function () {
            function StateData(valueAccessor, allBindings, element) {
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
            StateData.prototype.dispose = function () {
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
            };
            return StateData;
        })();
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        })();
        function distance(p1, p2) {
            var xd = p2.x - p1.x;
            var yd = p2.y - p1.y;
            return Math.sqrt(xd * xd + yd * yd);
        }
        function getOptionsText(stateData, option) {
            if (option && stateData.optionsText && typeof (stateData.optionsText) === 'string') {
                return ko.unwrap(ko.unwrap(option)[stateData.optionsText]);
            }
            else if (stateData.optionsText && typeof (stateData.optionsText) === 'function') {
                return stateData.optionsText(ko.unwrap(ko.unwrap(option)));
            }
            else {
                return ko.unwrap(option);
            }
        }
        function getOptionsValue(stateData, option) {
            if (stateData.optionsValue && typeof (stateData.optionsValue) === 'string') {
                return ko.unwrap(ko.unwrap(option)[stateData.optionsValue]);
            }
            else if (stateData.optionsValue && typeof (stateData.optionsValue) === 'function') {
                return stateData.optionsValue(ko.unwrap(ko.unwrap(option)));
            }
            else {
                return ko.unwrap(option);
            }
        }
        function applyContainerStyle(containerDiv, captionElement) {
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
        function createCaptionsElement(stateData) {
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
        function createOptionDiv(option, stateData) {
            var div = document.createElement('div');
            div.textContent = getOptionsText(stateData, option);
            div.setAttribute('data-selected', false.toString());
            div.classList.add(dropDownSelectRowClass);
            div.onmouseover = onRowHover(stateData);
            div.onclick = onItemSelect(stateData);
            var touchTimer = -1;
            var touchStart = new Point(-1, -1);
            div.ontouchstart = function (event) {
                if (event.touches.length === 1) {
                    touchStart.x = event.touches[0].pageX;
                    touchStart.y = event.touches[0].pageY;
                    touchTimer = event.timeStamp || new Date().getTime();
                    event.stopPropagation();
                    return onRowHover(stateData)(event);
                    ;
                }
                stateData.hoverIndex(-1);
                return true;
            };
            div.ontouchend = function (event) {
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
        function findOption(options, selectedValue, stateData) {
            for (var i = 0; i < options.length; i++) {
                if (getOptionsValue(stateData, options[i]) === ko.unwrap(selectedValue)) {
                    return options[i];
                }
            }
            return undefined;
        }
        function styleOptionsDivMultiple(stateData, option, optionDiv) {
            if (ko.unwrap(stateData.selectedOptions).indexOf(getOptionsValue(stateData, option)) >= 0) {
                optionDiv.classList.add(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', true.toString());
            }
            else {
                optionDiv.classList.remove(dropDownSelectSelectedClass);
                optionDiv.setAttribute('data-selected', false.toString());
            }
        }
        function styleOptionsDivSingle(stateData, option, optionDiv) {
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
        function setCaptionMultiple(stateData) {
            switch (ko.unwrap(stateData.selectedOptions).length) {
                case 0:
                    stateData.captionText.textContent = ko.unwrap(stateData.optionsCaption);
                    break;
                case 1:
                    stateData.captionText.textContent = getOptionsText(stateData, findOption(ko.unwrap(stateData.options), ko.unwrap(stateData.selectedOptions)[0], stateData));
                    break;
                default:
                    stateData.captionText.textContent = ko.unwrap(stateData.selectedOptions).length + elementsChosen;
                    break;
            }
        }
        function initializeDropDown(stateData) {
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
        function selectItemMultiple(stateData, option, element) {
            var i, tmpSelected;
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
        function selectItemSingle(stateData, option, nodes) {
            if (ko.isObservable(stateData.value)) {
                stateData.value(getOptionsValue(stateData, option));
            }
            else {
                stateData.value = getOptionsValue(stateData, option);
                stateData.captionText.textContent = getOptionsText(stateData, option);
                var index = stateData.hoverIndex();
                for (var i = 0; i < nodes.length; i++) {
                    if (i === index) {
                        nodes[i].classList.add(dropDownSelectSelectedClass);
                        nodes[i].setAttribute('data-selected', true.toString());
                    }
                    else {
                        nodes[i].classList.remove(dropDownSelectSelectedClass);
                        nodes[i].setAttribute('data-selected', false.toString());
                    }
                }
            }
        }
        function isBindingAllowed(stateData) {
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
        function onRowHover(stateData) {
            return function (event) {
                var elem = event.target || event.srcElement;
                stateData.hoverIndex(Array.prototype.indexOf.call(stateData.containerDiv.childNodes, elem));
                event.stopPropagation();
                return true;
            };
        }
        function onUpArrowPressed(stateData) {
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
                    stateData.containerDiv.childNodes[stateData.hoverIndex()].scrollIntoView(false);
                }
            };
        }
        function onDownArrowPressed(stateData) {
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
                    stateData.containerDiv.childNodes[stateData.hoverIndex()].scrollIntoView(false);
                }
            };
        }
        function onSelectPressed(stateData) {
            return function (event) {
                if (event.mozInputSource === 6) {
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
                        stateData.containerDiv.style.height = stateData.containerDiv.firstChild.getBoundingClientRect().height *
                            stateData.size + 'px';
                    }
                    else {
                        stateData.containerDiv.style.height = 'auto';
                    }
                }
            };
        }
        function onMouseOut(stateData) {
            return function (event) {
                var e = event.toElement || event.relatedTarget;
                if (e.parentNode === stateData.containerDiv ||
                    e === stateData.containerDiv) {
                    return;
                }
                stateData.inside = false;
            };
        }
        function onMouseEnter(stateData) {
            return function () {
                stateData.inside = true;
            };
        }
        function onHoverChanged(stateData) {
            return function (index) {
                stateData.captionElement.focus();
                var nodes = stateData.containerDiv.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (i === index) {
                        nodes[i].classList.add(dropDownSelectActiveClass);
                    }
                    else {
                        nodes[i].classList.remove(dropDownSelectActiveClass);
                    }
                }
            };
        }
        function onHideOptions(stateData) {
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
        function onItemSelect(stateData) {
            return function () {
                var index = stateData.hoverIndex();
                if (index < 0 || !stateData.showBox) {
                    return false;
                }
                var selected = ko.unwrap(ko.unwrap(stateData.options)[index]), nodes = stateData.containerDiv.childNodes, element = nodes[index];
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
        function onKeyDown(stateData) {
            return function (event) {
                event = event || window.event;
                switch (event.keyCode) {
                    case 38:
                        onUpArrowPressed(stateData)();
                        event.preventDefault();
                        return false;
                    case 40:
                        onDownArrowPressed(stateData)();
                        event.preventDefault();
                        return false;
                    case 27:
                        stateData.inside = false;
                        stateData.showBox = false;
                        onHideOptions(stateData)();
                        return true;
                    case 32:
                        onItemSelect(stateData)();
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    default:
                        return true;
                }
            };
        }
        function onOptionsChange(stateData) {
            return function () {
                initializeDropDown(stateData);
            };
        }
        function onEnable(stateData) {
            return function (enable) {
                stateData.captionElement.disabled = !enable;
            };
        }
        function onDisable(stateData) {
            return function (disable) {
                stateData.captionElement.disabled = disable;
            };
        }
        function onValueChanged(stateData) {
            return function (value) {
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
                        nodes[i].classList.add(dropDownSelectSelectedClass);
                        nodes[i].setAttribute('data-selected', true.toString());
                    }
                    else {
                        nodes[i].classList.remove(dropDownSelectSelectedClass);
                        nodes[i].setAttribute('data-selected', false.toString());
                    }
                }
            };
        }
        function onSelectedOptionsChanged(stateData) {
            return function () {
                ko.unwrap(stateData.options).forEach(function (option, index) {
                    styleOptionsDivMultiple(stateData, option, stateData.containerDiv.childNodes[index]);
                });
                setCaptionMultiple(stateData);
            };
        }
        function onOptionsCaptionChanged(stateData) {
            return function (value) {
                if (stateData.multiple && ko.unwrap(stateData.selectedOptions).length === 0) {
                    stateData.captionText.textContent = value;
                }
                else if (!stateData.multiple && stateData.value === undefined) {
                    stateData.captionText.textContent = value;
                }
            };
        }
        function initCallbacks(stateData) {
            stateData.captionElement.onkeydown = onKeyDown(stateData);
            stateData.captionElement.onclick = onSelectPressed(stateData);
            stateData.containerDiv.onmouseenter = onMouseEnter(stateData);
            stateData.captionElement.onblur = onHideOptions(stateData);
            stateData.containerDiv.onmouseout = onMouseOut(stateData);
        }
        function initDomElements(stateData) {
            var parent = stateData.element.parentNode, surroundingDiv = document.createElement('div');
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
        function initSubscriptions(stateData) {
            stateData.subscriptions
                .push(stateData.hoverIndex.subscribe(onHoverChanged(stateData)));
            if (ko.isObservable(stateData.options)) {
                stateData.subscriptions
                    .push(stateData.options.subscribe(onOptionsChange(stateData)));
            }
            if (stateData.enable !== undefined) {
                onEnable(stateData)(ko.unwrap(stateData.enable));
                if (ko.isObservable(stateData.enable)) {
                    stateData.subscriptions
                        .push(stateData.enable.subscribe(onEnable(stateData)));
                }
            }
            if (stateData.disable !== undefined) {
                onDisable(stateData)(ko.unwrap(stateData.disable));
                if (ko.isObservable(stateData.disable)) {
                    stateData.subscriptions
                        .push(stateData.disable.subscribe(onDisable(stateData)));
                }
            }
            if (stateData.value !== undefined && !stateData.multiple) {
                stateData.subscriptions
                    .push(stateData.value.subscribe(onValueChanged(stateData)));
            }
            if (stateData.selectedOptions !== undefined && stateData.multiple) {
                stateData.subscriptions
                    .push(stateData.selectedOptions
                    .subscribe(onSelectedOptionsChanged(stateData)));
            }
            if (ko.isObservable(stateData.optionsCaption)) {
                stateData.subscriptions
                    .push(stateData.optionsCaption
                    .subscribe(onOptionsCaptionChanged(stateData)));
            }
        }
        function clearCallbacks(stateData) {
            stateData.captionElement.onkeydown = null;
            stateData.captionElement.onclick = null;
            stateData.containerDiv.onmouseenter = null;
            stateData.captionElement.onblur = null;
            stateData.containerDiv.onmouseout = null;
        }
        function dispose(stateData) {
            clearCallbacks(stateData);
            stateData.dispose.call(stateData);
        }
        cap3Options.Binding = {
            init: function (element, valueAccessor, allBindings) {
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
        };
    })(cap3Options || (cap3Options = {}));
    ko.bindingHandlers['cap3Options'] = cap3Options.Binding;
});
//# sourceMappingURL=knockout-select.js.map
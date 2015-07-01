<a name="cap3Options"></a>
## cap3Options : <code>object</code>
Knockout Custom Binding for styled drop-down select elements, works with normal select tags as long as there is anoptions binding and a binding for the selection result

**Kind**: global namespace  
**Author:** Cap3 GmbH - Kalle Ott  

* [cap3Options](#cap3Options) : <code>object</code>
  * [.Cap3OptionsState](#cap3Options.Cap3OptionsState)
    * [new Cap3OptionsState(valueAccessor, allBindings, element)](#new_cap3Options.Cap3OptionsState_new)
    * [.getOptionsText(option)](#cap3Options.Cap3OptionsState+getOptionsText) ⇒ <code>string</code> ℗
    * [.getOptionsValue(option)](#cap3Options.Cap3OptionsState+getOptionsValue) ⇒ <code>\*</code> ℗
    * [.createCaptionsElement()](#cap3Options.Cap3OptionsState+createCaptionsElement) ℗
    * [.createOptionDiv(option)](#cap3Options.Cap3OptionsState+createOptionDiv) ⇒ <code>HTMLElement</code> ℗
    * [.findOption(options, selectedValue)](#cap3Options.Cap3OptionsState+findOption) ⇒ <code>string</code> &#124; <code>undefined</code> ℗
    * [.styleOptionsDivMultiple(option, optionDiv)](#cap3Options.Cap3OptionsState+styleOptionsDivMultiple) ℗
    * [.styleOptionsDivSingle(option, optionDiv)](#cap3Options.Cap3OptionsState+styleOptionsDivSingle) ℗
    * [.setCaptionMultiple()](#cap3Options.Cap3OptionsState+setCaptionMultiple) ℗
    * [.selectItemMultiple(option, element)](#cap3Options.Cap3OptionsState+selectItemMultiple) ℗
    * [.selectItemSingle(option, nodes)](#cap3Options.Cap3OptionsState+selectItemSingle) ℗
    * [.onRowHover()](#cap3Options.Cap3OptionsState+onRowHover) ⇒ <code>function</code> ℗
    * [.onUpArrowPressed()](#cap3Options.Cap3OptionsState+onUpArrowPressed) ⇒ <code>function</code> ℗
    * [.onDownArrowPressed()](#cap3Options.Cap3OptionsState+onDownArrowPressed) ⇒ <code>function</code> ℗
    * [.onSelectPressed()](#cap3Options.Cap3OptionsState+onSelectPressed) ⇒ <code>function</code> ℗
    * [.onMouseOut()](#cap3Options.Cap3OptionsState+onMouseOut) ⇒ <code>function</code> ℗
    * [.onMouseEnter()](#cap3Options.Cap3OptionsState+onMouseEnter) ⇒ <code>function</code> ℗
    * [.onHoverChanged()](#cap3Options.Cap3OptionsState+onHoverChanged) ⇒ <code>function</code> ℗
    * [.onHideOptions()](#cap3Options.Cap3OptionsState+onHideOptions) ⇒ <code>function</code> ℗
    * [.onItemSelect()](#cap3Options.Cap3OptionsState+onItemSelect) ⇒ <code>function</code> ℗
    * [.onKeyDown()](#cap3Options.Cap3OptionsState+onKeyDown) ⇒ <code>function</code> ℗
    * [.onOptionsChange()](#cap3Options.Cap3OptionsState+onOptionsChange) ⇒ <code>function</code> ℗
    * [.onEnable()](#cap3Options.Cap3OptionsState+onEnable) ⇒ <code>function</code> ℗
    * [.onDisable()](#cap3Options.Cap3OptionsState+onDisable) ⇒ <code>function</code> ℗
    * [.onValueChanged()](#cap3Options.Cap3OptionsState+onValueChanged) ⇒ <code>function</code> ℗
    * [.onSelectedOptionsChanged()](#cap3Options.Cap3OptionsState+onSelectedOptionsChanged) ⇒ <code>function</code> ℗
    * [.onOptionsCaptionChanged()](#cap3Options.Cap3OptionsState+onOptionsCaptionChanged) ⇒ <code>function</code> ℗
    * [.clearCallbacks()](#cap3Options.Cap3OptionsState+clearCallbacks) ℗
    * [.applyContainerStyle(containerDiv, captionElement)](#cap3Options.Cap3OptionsState+applyContainerStyle)
    * [.initializeDropDown()](#cap3Options.Cap3OptionsState+initializeDropDown)
    * [.isBindingAllowed()](#cap3Options.Cap3OptionsState+isBindingAllowed) ⇒ <code>boolean</code>
    * [.initCallbacks()](#cap3Options.Cap3OptionsState+initCallbacks)
    * [.initDomElements()](#cap3Options.Cap3OptionsState+initDomElements)
    * [.initSubscriptions()](#cap3Options.Cap3OptionsState+initSubscriptions)
    * [.dispose()](#cap3Options.Cap3OptionsState+dispose)

<a name="cap3Options.Cap3OptionsState"></a>
### cap3Options.Cap3OptionsState
this class holds all the information about the status of the select element.

**Kind**: static class of <code>[cap3Options](#cap3Options)</code>  

* [.Cap3OptionsState](#cap3Options.Cap3OptionsState)
  * [new Cap3OptionsState(valueAccessor, allBindings, element)](#new_cap3Options.Cap3OptionsState_new)
  * [.getOptionsText(option)](#cap3Options.Cap3OptionsState+getOptionsText) ⇒ <code>string</code> ℗
  * [.getOptionsValue(option)](#cap3Options.Cap3OptionsState+getOptionsValue) ⇒ <code>\*</code> ℗
  * [.createCaptionsElement()](#cap3Options.Cap3OptionsState+createCaptionsElement) ℗
  * [.createOptionDiv(option)](#cap3Options.Cap3OptionsState+createOptionDiv) ⇒ <code>HTMLElement</code> ℗
  * [.findOption(options, selectedValue)](#cap3Options.Cap3OptionsState+findOption) ⇒ <code>string</code> &#124; <code>undefined</code> ℗
  * [.styleOptionsDivMultiple(option, optionDiv)](#cap3Options.Cap3OptionsState+styleOptionsDivMultiple) ℗
  * [.styleOptionsDivSingle(option, optionDiv)](#cap3Options.Cap3OptionsState+styleOptionsDivSingle) ℗
  * [.setCaptionMultiple()](#cap3Options.Cap3OptionsState+setCaptionMultiple) ℗
  * [.selectItemMultiple(option, element)](#cap3Options.Cap3OptionsState+selectItemMultiple) ℗
  * [.selectItemSingle(option, nodes)](#cap3Options.Cap3OptionsState+selectItemSingle) ℗
  * [.onRowHover()](#cap3Options.Cap3OptionsState+onRowHover) ⇒ <code>function</code> ℗
  * [.onUpArrowPressed()](#cap3Options.Cap3OptionsState+onUpArrowPressed) ⇒ <code>function</code> ℗
  * [.onDownArrowPressed()](#cap3Options.Cap3OptionsState+onDownArrowPressed) ⇒ <code>function</code> ℗
  * [.onSelectPressed()](#cap3Options.Cap3OptionsState+onSelectPressed) ⇒ <code>function</code> ℗
  * [.onMouseOut()](#cap3Options.Cap3OptionsState+onMouseOut) ⇒ <code>function</code> ℗
  * [.onMouseEnter()](#cap3Options.Cap3OptionsState+onMouseEnter) ⇒ <code>function</code> ℗
  * [.onHoverChanged()](#cap3Options.Cap3OptionsState+onHoverChanged) ⇒ <code>function</code> ℗
  * [.onHideOptions()](#cap3Options.Cap3OptionsState+onHideOptions) ⇒ <code>function</code> ℗
  * [.onItemSelect()](#cap3Options.Cap3OptionsState+onItemSelect) ⇒ <code>function</code> ℗
  * [.onKeyDown()](#cap3Options.Cap3OptionsState+onKeyDown) ⇒ <code>function</code> ℗
  * [.onOptionsChange()](#cap3Options.Cap3OptionsState+onOptionsChange) ⇒ <code>function</code> ℗
  * [.onEnable()](#cap3Options.Cap3OptionsState+onEnable) ⇒ <code>function</code> ℗
  * [.onDisable()](#cap3Options.Cap3OptionsState+onDisable) ⇒ <code>function</code> ℗
  * [.onValueChanged()](#cap3Options.Cap3OptionsState+onValueChanged) ⇒ <code>function</code> ℗
  * [.onSelectedOptionsChanged()](#cap3Options.Cap3OptionsState+onSelectedOptionsChanged) ⇒ <code>function</code> ℗
  * [.onOptionsCaptionChanged()](#cap3Options.Cap3OptionsState+onOptionsCaptionChanged) ⇒ <code>function</code> ℗
  * [.clearCallbacks()](#cap3Options.Cap3OptionsState+clearCallbacks) ℗
  * [.applyContainerStyle(containerDiv, captionElement)](#cap3Options.Cap3OptionsState+applyContainerStyle)
  * [.initializeDropDown()](#cap3Options.Cap3OptionsState+initializeDropDown)
  * [.isBindingAllowed()](#cap3Options.Cap3OptionsState+isBindingAllowed) ⇒ <code>boolean</code>
  * [.initCallbacks()](#cap3Options.Cap3OptionsState+initCallbacks)
  * [.initDomElements()](#cap3Options.Cap3OptionsState+initDomElements)
  * [.initSubscriptions()](#cap3Options.Cap3OptionsState+initSubscriptions)
  * [.dispose()](#cap3Options.Cap3OptionsState+dispose)

<a name="new_cap3Options.Cap3OptionsState_new"></a>
#### new Cap3OptionsState(valueAccessor, allBindings, element)
Creates a new Cap3OptionsState object


| Param | Type | Description |
| --- | --- | --- |
| valueAccessor | <code>KnockoutObservable.&lt;any&gt;</code> | the accessor function to the binding value |
| allBindings | <code>KnockoutObservable.&lt;any&gt;</code> | the other bindings bound to the element |
| element | <code>HTMLSelectElement</code> | the element this binding is bound to |

<a name="cap3Options.Cap3OptionsState+getOptionsText"></a>
#### cap3OptionsState.getOptionsText(option) ⇒ <code>string</code> ℗
gets the text representation of the option

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | the object containing the option information |

<a name="cap3Options.Cap3OptionsState+getOptionsValue"></a>
#### cap3OptionsState.getOptionsValue(option) ⇒ <code>\*</code> ℗
gets the value-representation of the option

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | the object containing the option information |

<a name="cap3Options.Cap3OptionsState+createCaptionsElement"></a>
#### cap3OptionsState.createCaptionsElement() ℗
creates the button which opens the options container and replaces the normal select element

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+createOptionDiv"></a>
#### cap3OptionsState.createOptionDiv(option) ⇒ <code>HTMLElement</code> ℗
creates a div element which holds the information of one possible select option

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | the object containing the option information |

<a name="cap3Options.Cap3OptionsState+findOption"></a>
#### cap3OptionsState.findOption(options, selectedValue) ⇒ <code>string</code> &#124; <code>undefined</code> ℗
searches the options which belongs to the given selected-option and returns the option itself or the gui representation

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Array.&lt;observable&gt;</code> &#124; <code>Array.&lt;Object&gt;</code> &#124; <code>Array.&lt;string&gt;</code> | the array with all options to select from |
| selectedValue | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | the value to find in options |

<a name="cap3Options.Cap3OptionsState+styleOptionsDivMultiple"></a>
#### cap3OptionsState.styleOptionsDivMultiple(option, optionDiv) ℗
sets class style and attribute according to the state of the given option, only used when multiple flag is set

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>KnockoutObservable.&lt;any&gt;</code> &#124; <code>Object</code> &#124; <code>string</code> | option which has changed |
| optionDiv | <code>HTMLDivElement</code> | representation of the option |

<a name="cap3Options.Cap3OptionsState+styleOptionsDivSingle"></a>
#### cap3OptionsState.styleOptionsDivSingle(option, optionDiv) ℗
sets class style and attribute according to the state of the given option, only used when multiple flag is not setalso sets the caption text for the select element

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | option which has changed |
| optionDiv | <code>HTMLDivElement</code> | representation of the option |

<a name="cap3Options.Cap3OptionsState+setCaptionMultiple"></a>
#### cap3OptionsState.setCaptionMultiple() ℗
sets the caption of the select element, only used when multiple flag is set

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+selectItemMultiple"></a>
#### cap3OptionsState.selectItemMultiple(option, element) ℗
toggles the select status of an option, only used when the multiple flag is set

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | option which has changed |
| element | <code>HTMLElement</code> | element which was clicked |

<a name="cap3Options.Cap3OptionsState+selectItemSingle"></a>
#### cap3OptionsState.selectItemSingle(option, nodes) ℗
sets the selected option as value

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>observable</code> &#124; <code>Object</code> &#124; <code>string</code> | option which got selected by the user |
| nodes | <code>NodeList</code> | the childnodes of the options-container |

<a name="cap3Options.Cap3OptionsState+onRowHover"></a>
#### cap3OptionsState.onRowHover() ⇒ <code>function</code> ℗
returns the hover callback which changes the hover-index according to mouse-position

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onUpArrowPressed"></a>
#### cap3OptionsState.onUpArrowPressed() ⇒ <code>function</code> ℗
returns the callback for up-arrow-key, the callback reduces the hover-index by 1

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onDownArrowPressed"></a>
#### cap3OptionsState.onDownArrowPressed() ⇒ <code>function</code> ℗
returns the callback for down-arrow-key, the callback increases the hover-index by 1

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onSelectPressed"></a>
#### cap3OptionsState.onSelectPressed() ⇒ <code>function</code> ℗
returns the callback for the select-element-button, which opens or hides the options-container

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onMouseOut"></a>
#### cap3OptionsState.onMouseOut() ⇒ <code>function</code> ℗
returns the callback for the mouse-out event, hover-index is reset and the inside state is set to false

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onMouseEnter"></a>
#### cap3OptionsState.onMouseEnter() ⇒ <code>function</code> ℗
returns the callback for the mouse-enter event, hover-index is reset and the inside state is set to true

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onHoverChanged"></a>
#### cap3OptionsState.onHoverChanged() ⇒ <code>function</code> ℗
returns the callback for the hover-index-changed event, which toggles the active class for a visual hover effect

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onHideOptions"></a>
#### cap3OptionsState.onHideOptions() ⇒ <code>function</code> ℗
returns callback which hides the options-container

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onItemSelect"></a>
#### cap3OptionsState.onItemSelect() ⇒ <code>function</code> ℗
returns the callback for the item-select event, which changes the actual selection

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onKeyDown"></a>
#### cap3OptionsState.onKeyDown() ⇒ <code>function</code> ℗
returns the key-down-callback, which reacts on up-arrow, down-arrow, escape and space-barescape hides the options-container and blurs the select elementspace-bar can be used to select the element marked by the hover-index

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onOptionsChange"></a>
#### cap3OptionsState.onOptionsChange() ⇒ <code>function</code> ℗
returns the callback for the options-change-event, when the options change the dropdown element is initialized again

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onEnable"></a>
#### cap3OptionsState.onEnable() ⇒ <code>function</code> ℗
returns the callback for the enable-event, only used when enable is bound to an observableenables or disables the select element according to bound data

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onDisable"></a>
#### cap3OptionsState.onDisable() ⇒ <code>function</code> ℗
returns the callback for the disable-event, only used when disable is bound to an observableenables or disables the select element according to bound data

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onValueChanged"></a>
#### cap3OptionsState.onValueChanged() ⇒ <code>function</code> ℗
updates the selection when the value observable changes

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onSelectedOptionsChanged"></a>
#### cap3OptionsState.onSelectedOptionsChanged() ⇒ <code>function</code> ℗
updates the selection whe the selectedOptions observableArray changes

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+onOptionsCaptionChanged"></a>
#### cap3OptionsState.onOptionsCaptionChanged() ⇒ <code>function</code> ℗
updates the captionText when necessary

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+clearCallbacks"></a>
#### cap3OptionsState.clearCallbacks() ℗
Removes all event listeners from the dom element.

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** private  
<a name="cap3Options.Cap3OptionsState+applyContainerStyle"></a>
#### cap3OptionsState.applyContainerStyle(containerDiv, captionElement)
This function applies necessary styles to the container and caption-element  ( e.g. z-index)

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| containerDiv | <code>HTMLDivElement</code> | element to hold all select options |
| captionElement | <code>HTMLElement</code> | element to show information about selection state and to open options container on click |

<a name="cap3Options.Cap3OptionsState+initializeDropDown"></a>
#### cap3OptionsState.initializeDropDown()
initializes dropdown-container and caption-element with the actual options and status

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  
<a name="cap3Options.Cap3OptionsState+isBindingAllowed"></a>
#### cap3OptionsState.isBindingAllowed() ⇒ <code>boolean</code>
checks if this binding is allowed

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Returns**: <code>boolean</code> - true if binding is allowed  
**Access:** public  
<a name="cap3Options.Cap3OptionsState+initCallbacks"></a>
#### cap3OptionsState.initCallbacks()
initializes all callbacks

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  
<a name="cap3Options.Cap3OptionsState+initDomElements"></a>
#### cap3OptionsState.initDomElements()
initializes all DOM Elements

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  
<a name="cap3Options.Cap3OptionsState+initSubscriptions"></a>
#### cap3OptionsState.initSubscriptions()
initializes all necessary subscriptions on possible observables

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  
<a name="cap3Options.Cap3OptionsState+dispose"></a>
#### cap3OptionsState.dispose()
disposes all subscriptions and cuts connections to other objects

**Kind**: instance method of <code>[Cap3OptionsState](#cap3Options.Cap3OptionsState)</code>  
**Access:** public  

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["leonardoui"] = factory();
	else
		root["leonardoui"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj["default"]; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	// Import LESS
	
	__webpack_require__(72);
	
	// Copy files
	
	__webpack_require__(74);
	
	__webpack_require__(75);
	
	__webpack_require__(76);
	
	var _leonardoUiCore = __webpack_require__(28);
	
	_defaults(exports, _interopExportWildcard(_leonardoUiCore, _defaults));

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }
	
	var _componentsDialogDialog = __webpack_require__(29);
	
	exports.dialog = _interopRequire(_componentsDialogDialog);
	
	var _componentsPopoverPopover = __webpack_require__(31);
	
	exports.popover = _interopRequire(_componentsPopoverPopover);
	
	var _componentsTooltipTooltip = __webpack_require__(33);
	
	exports.tooltip = _interopRequire(_componentsTooltipTooltip);
	
	var _utilPositioner = __webpack_require__(32);
	
	Object.defineProperty(exports, "positionToElement", {
	  enumerable: true,
	  get: function get() {
	    return _utilPositioner.positionToElement;
	  }
	});
	Object.defineProperty(exports, "positionToCoordinate", {
	  enumerable: true,
	  get: function get() {
	    return _utilPositioner.positionToCoordinate;
	  }
	});

/***/ },

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports["default"] = dialog;
	
	var _utilOverlayManager = __webpack_require__(30);
	
	function dialog(options) {
		var content = options.content;
		var _options$shadow = options.shadow;
		var shadow = _options$shadow === undefined ? true : _options$shadow;
		var _options$closeOnEscape = options.closeOnEscape;
		var closeOnEscape = _options$closeOnEscape === undefined ? true : _options$closeOnEscape;
		var _onClose = options.onClose;
	
		var oldOverflow = document.body.style.overflow;
		var overlay = (0, _utilOverlayManager.createOverlay)({
			modal: true,
			closeOnEscape: closeOnEscape,
			closeOnOutside: false,
			onClose: function onClose() {
				document.body.style.overflow = oldOverflow;
				if (typeof _onClose === "function") {
					_onClose();
				}
			}
		});
	
		var dialogContainerElem = overlay.element;
		dialogContainerElem.classList.add("lui-dialog-container");
		dialogContainerElem.setAttribute("role", "dialog");
		dialogContainerElem.style.position = "fixed";
	
		var dialogElem = undefined;
		if (typeof content === "string") {
			var tempContainerElem = document.createElement("div");
			tempContainerElem.innerHTML = content;
			dialogElem = tempContainerElem.firstElementChild;
		} else {
			dialogElem = content;
		}
		dialogContainerElem.appendChild(dialogElem);
	
		dialogElem.setAttribute("role", "document");
		if (shadow) {
			dialogElem.classList.add("lui-dialog--shadow");
		}
	
		document.body.style.overflow = "hidden";
	
		overlay.show();
	
		return {
			element: dialogElem,
			close: function close() {
				overlay.close();
			}
		};
	}
	
	module.exports = exports["default"];

/***/ },

/***/ 30:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.removeOverlay = removeOverlay;
	exports.createOverlay = createOverlay;
	var ESCAPE_KEY = 27;
	
	var stack = [];
	
	var overlayContainer = null;
	
	function getContainer() {
		if (!overlayContainer) {
			overlayContainer = document.createElement("div");
			overlayContainer.classList.add("lui-overlay-container");
			document.body.appendChild(overlayContainer);
	
			var onKeyUp = function onKeyUp(event) {
				if (event.keyCode === ESCAPE_KEY) {
					// Close the dialog on top of the stack
					for (var i = stack.length - 1; i >= 0; i--) {
						if (stack[i].closeOnEscape === false) {
							break;
						} else if (stack[i].closeOnEscape === true) {
							stack[i].close();
							break;
						}
					}
				}
			};
	
			window.addEventListener("keyup", onKeyUp);
		}
		return overlayContainer;
	}
	
	function removeOverlay(overlay) {
		for (var i = 0; i < stack.length; i++) {
			if (overlay === stack[i]) {
				overlayContainer.removeChild(overlay.element);
				stack.splice(i, 1);
				return;
			}
		}
	}
	
	function createOverlay() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
		var container = getContainer();
	
		var element = document.createElement("div");
		element.classList.add("lui-overlay");
		element.style.visibility = "hidden";
		container.appendChild(element);
	
		var _options$modal = options.modal;
		var modal = _options$modal === undefined ? false : _options$modal;
		var onClose = options.onClose;
		var _options$closeOnEscape = options.closeOnEscape;
		var closeOnEscape = _options$closeOnEscape === undefined ? false : _options$closeOnEscape;
		var _options$closeOnOutside = options.closeOnOutside;
		var closeOnOutside = _options$closeOnOutside === undefined ? false : _options$closeOnOutside;
	
		var overlay = {
			closeOnEscape: closeOnEscape,
			element: element,
			show: function show() {
				element.style.visibility = "";
			}
		};
	
		overlay.close = function () {
			removeOverlay(overlay);
			if (typeof onClose === "function") {
				onClose();
			}
			if (closeOnOutside) {
				document.removeEventListener("mousedown", overlay.onMouseDown);
				document.removeEventListener("touchstart", overlay.onTouchStart);
			}
		};
	
		if (closeOnOutside) {
			overlay.onMouseDown = function (e) {
				if (!overlay.element.contains(e.target)) {
					overlay.close();
				}
			};
	
			overlay.onTouchStart = function (e) {
				if (overlay.element.contains(e.target)) {
					overlay.close();
				}
			};
	
			document.addEventListener("mousedown", overlay.onMouseDown);
			document.addEventListener("touchstart", overlay.onTouchStart);
		}
	
		stack.push(overlay);
	
		var overlayBGElem = document.createElement("div");
		if (modal) {
			overlayBGElem.classList.add("lui-modal-background");
		}
		element.appendChild(overlayBGElem);
	
		// Return the public API
		return {
			element: overlay.element,
			show: overlay.show,
			close: overlay.close
		};
	}

/***/ },

/***/ 31:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports["default"] = popover;
	
	var _utilPositioner = __webpack_require__(32);
	
	var _utilOverlayManager = __webpack_require__(30);
	
	var ELEM_OFFSET = 10;
	var WINDOW_OFFSET = 10;
	var EDGE_OFFSET = 10;
	
	var currentId = 0;
	
	function popover() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var _options$closeOnEscape = options.closeOnEscape;
		var closeOnEscape = _options$closeOnEscape === undefined ? true : _options$closeOnEscape;
		var _options$dock = options.dock;
		var dock = _options$dock === undefined ? "bottom" : _options$dock;
		var alignTo = options.alignTo;
		var content = options.content;
		var _options$shadow = options.shadow;
		var shadow = _options$shadow === undefined ? true : _options$shadow;
		var _onClose = options.onClose;
	
		var overlay = (0, _utilOverlayManager.createOverlay)({
			modal: false,
			closeOnEscape: closeOnEscape,
			closeOnOutside: true,
			onClose: function onClose() {
				if (typeof _onClose === "function") {
					_onClose();
				}
				if (alignTo instanceof Element) {
					alignTo.setAttribute("aria-expanded", false);
				}
			}
		});
	
		var popoverContainerElem = overlay.element;
		popoverContainerElem.classList.add("lui-popover-container");
		popoverContainerElem.setAttribute("role", "dialog");
	
		var popoverElem = undefined;
		if (typeof content === "string") {
			var tempContainerElem = document.createElement("div");
			tempContainerElem.innerHTML = content;
			popoverElem = tempContainerElem.firstElementChild; // TODO check if more than one child?
		} else {
				popoverElem = content;
			}
		popoverContainerElem.appendChild(popoverElem);
	
		var id = "lui-popover-" + ++currentId;
		popoverElem.setAttribute("id", id);
		if (shadow) {
			popoverElem.classList.add("lui-popover--shadow");
		}
	
		var posResult = undefined;
		if (alignTo instanceof Element) {
			posResult = (0, _utilPositioner.positionToElement)(popoverElem, alignTo, dock, {
				offset: ELEM_OFFSET,
				minWindowOffset: WINDOW_OFFSET,
				minEdgeOffset: EDGE_OFFSET
			});
			alignTo.setAttribute("aria-controls", id);
			alignTo.setAttribute("aria-expanded", true);
		} else {
			posResult = (0, _utilPositioner.positionToCoordinate)(popoverElem, alignTo.top, alignTo.left, dock, {
				offset: ELEM_OFFSET,
				minWindowOffset: WINDOW_OFFSET,
				minEdgeOffset: EDGE_OFFSET
			});
		}
		popoverContainerElem.style.left = posResult.position.left + "px";
		popoverContainerElem.style.top = posResult.position.top + "px";
		popoverContainerElem.style.position = "absolute";
	
		var arrowElem = document.createElement("div");
		arrowElem.classList.add("lui-popover__arrow");
		arrowElem.classList.add("lui-popover__arrow--" + (0, _utilPositioner.oppositeDock)(posResult.dock));
		if (posResult.dock === "top" || posResult.dock === "bottom") {
			arrowElem.style.left = posResult.toPosition.left - posResult.position.left + "px";
		} else {
			arrowElem.style.top = posResult.toPosition.top - posResult.position.top + "px";
		}
		popoverElem.appendChild(arrowElem);
	
		overlay.show();
	
		return {
			element: popoverElem,
			close: function close() {
				overlay.close();
			}
		};
	}
	
	module.exports = exports["default"];

/***/ },

/***/ 32:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.oppositeDock = oppositeDock;
	exports.createRect = createRect;
	exports.getDockCenterPoint = getDockCenterPoint;
	exports.tryPosition = tryPosition;
	exports.createTryRect = createTryRect;
	exports.tryDock = tryDock;
	exports.positionToRect = positionToRect;
	exports.positionToElement = positionToElement;
	exports.positionToCoordinate = positionToCoordinate;
	var oppositeDockMap = {
		"top": "bottom",
		"right": "left",
		"bottom": "top",
		"left": "right"
	};
	
	function oppositeDock(dock) {
		return oppositeDockMap[dock];
	}
	
	function createRect() {
		var top = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var left = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
		var width = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
		var height = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	
		return {
			top: top,
			right: left + width,
			bottom: top + height,
			left: left,
			width: width,
			height: height
		};
	}
	
	function getDockCenterPoint(rect, dock) {
		var top = undefined;
		var left = undefined;
		if (dock === "top") {
			top = rect.top;
			left = rect.left + rect.width / 2;
		} else if (dock === "right") {
			top = rect.top + rect.height / 2;
			left = rect.right;
		} else if (dock === "left") {
			top = rect.top + rect.height / 2;
			left = rect.left;
		} else {
			top = rect.bottom;
			left = rect.left + rect.width / 2;
		}
		return {
			top: top,
			left: left
		};
	}
	
	function tryPosition(rect, withinRect) {
		var left = rect.left >= withinRect.left;
		var right = rect.right <= withinRect.right;
		var top = rect.top >= withinRect.top;
		var bottom = rect.bottom <= withinRect.bottom;
	
		return {
			left: left,
			right: right,
			top: top,
			bottom: bottom
		};
	}
	
	function createTryRect(elemRect, toPosition, dock, offset) {
		var top = undefined;
		var left = undefined;
		if (dock === "top") {
			top = toPosition.top - elemRect.height - offset;
			left = toPosition.left - elemRect.width / 2;
		} else if (dock === "right") {
			top = toPosition.top - elemRect.height / 2;
			left = toPosition.left + offset;
		} else if (dock === "left") {
			top = toPosition.top - elemRect.height / 2;
			left = toPosition.left - elemRect.width - offset;
		} else {
			top = toPosition.top + offset;
			left = toPosition.left - elemRect.width / 2;
		}
	
		return createRect(top, left, elemRect.width, elemRect.height);
	}
	
	function tryDock(elemRect, alignToRect, windowRect, dock) {
		var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
		var _options$offset = options.offset;
		var offset = _options$offset === undefined ? 0 : _options$offset;
		var _options$minWindowOffset = options.minWindowOffset;
		var minWindowOffset = _options$minWindowOffset === undefined ? 0 : _options$minWindowOffset;
		var _options$minEdgeOffset = options.minEdgeOffset;
		var minEdgeOffset = _options$minEdgeOffset === undefined ? 0 : _options$minEdgeOffset;
	
		var windowOffsetRect = createRect(windowRect.top + minWindowOffset, windowRect.left + minWindowOffset, windowRect.width - minWindowOffset * 2, windowRect.height - minWindowOffset * 2);
	
		var toPosition = getDockCenterPoint(alignToRect, dock);
		var tryRect = createTryRect(elemRect, toPosition, dock, offset);
		var fitResult = tryPosition(tryRect, windowOffsetRect);
		if (dock === "top" || dock === "bottom") {
			if (!fitResult.left) {
				tryRect.left = Math.min(windowOffsetRect.left, toPosition.left - minEdgeOffset);
				tryRect.right = tryRect.left + tryRect.width;
				fitResult = tryPosition(tryRect, windowOffsetRect);
			}
			if (!fitResult.right) {
				tryRect.right = Math.max(windowOffsetRect.right, toPosition.left + minEdgeOffset);
				tryRect.left = tryRect.right - tryRect.width;
				fitResult = tryPosition(tryRect, windowOffsetRect);
			}
		} else {
			if (!fitResult.top) {
				tryRect.top = Math.min(windowOffsetRect.top, toPosition.top - minEdgeOffset);
				tryRect.bottom = tryRect.top + tryRect.height;
				fitResult = tryPosition(tryRect, windowOffsetRect);
			}
			if (!fitResult.bottom) {
				tryRect.bottom = Math.max(windowOffsetRect.bottom, toPosition.top + minWindowOffset);
				tryRect.top = tryRect.bottom - tryRect.height;
				fitResult = tryPosition(tryRect, windowOffsetRect);
			}
		}
	
		return {
			fits: fitResult.top && fitResult.right && fitResult.bottom && fitResult.left,
			dock: dock,
			position: {
				left: tryRect.left,
				top: tryRect.top
			},
			toPosition: getDockCenterPoint(alignToRect, dock)
		};
	}
	
	function positionToRect(element, rect) {
		var dock = arguments.length <= 2 || arguments[2] === undefined ? "bottom" : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
		var elemRect = element.getBoundingClientRect();
		var scrollTop = document.body.scrollTop;
		var scrollLeft = document.body.scrollLeft;
		var windowRect = createRect(-scrollTop, -scrollLeft, document.body.scrollWidth, document.body.scrollHeight);
	
		var docks = Array.isArray(dock) ? dock : [dock];
		var firstResult = null;
		for (var i = 0; i < docks.length; i++) {
			var result = tryDock(elemRect, rect, windowRect, docks[i], options);
			result.position.top += scrollTop;
			result.toPosition.top += scrollTop;
			result.position.left += scrollLeft;
			result.toPosition.left += scrollLeft;
			if (result.fits) {
				return result;
			}
			if (i === 0) {
				firstResult = result;
			}
		}
		// If no fit is found - return the first position
		return firstResult;
	}
	
	function positionToElement(element, alignToElement) {
		var dock = arguments.length <= 2 || arguments[2] === undefined ? "bottom" : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
		var rect = alignToElement.getBoundingClientRect();
		return positionToRect(element, rect, dock, options);
	}
	
	function positionToCoordinate(element, x, y) {
		var dock = arguments.length <= 3 || arguments[3] === undefined ? "bottom" : arguments[3];
		var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
	
		var rect = {
			top: y,
			bottom: y,
			left: x,
			right: x,
			width: 0,
			height: 0
		};
		return positionToRect(element, rect, dock, options);
	}

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports["default"] = tooltip;
	
	var _utilPositioner = __webpack_require__(32);
	
	var _utilOverlayManager = __webpack_require__(30);
	
	var ELEM_OFFSET = 10;
	var WINDOW_OFFSET = 10;
	var EDGE_OFFSET = 10;
	var currentId = 0;
	
	function tooltip(options) {
		var alignTo = options.alignTo;
		var dock = options.dock;
		var content = options.content;
	
		var title = undefined;
		var tooltipElem = undefined;
		if (typeof content === "string") {
			var tempContainerElem = document.createElement("div");
			tempContainerElem.innerHTML = content;
			tooltipElem = tempContainerElem.firstElementChild; // TODO check if more than one child?
		} else if (content instanceof Element) {
				tooltipElem = content;
			} else {
				title = alignTo.getAttribute("title");
				if (!title) {
					// Do not show if the title is empty
					return {
						element: null,
						close: function close() {}
					};
				}
				tooltipElem = document.createElement("div");
				tooltipElem.appendChild(document.createTextNode(title));
			}
	
		var id = "lui-tooltip-" + ++currentId;
		var overlay = (0, _utilOverlayManager.createOverlay)({
			closeOnOutside: false
		});
		var containerElem = overlay.element;
	
		tooltipElem.classList.add("lui-tooltip");
		tooltipElem.setAttribute("id", id);
		tooltipElem.setAttribute("role", "tooltip");
	
		containerElem.appendChild(tooltipElem);
	
		var posResult = undefined;
		if (alignTo instanceof Element) {
			posResult = (0, _utilPositioner.positionToElement)(tooltipElem, alignTo, dock, {
				offset: ELEM_OFFSET,
				minWindowOffset: WINDOW_OFFSET,
				minEdgeOffset: EDGE_OFFSET
			});
		} else {
			posResult = (0, _utilPositioner.positionToCoordinate)(tooltipElem, alignTo.top, alignTo.left, dock, {
				offset: ELEM_OFFSET,
				minWindowOffset: WINDOW_OFFSET,
				minEdgeOffset: EDGE_OFFSET
			});
		}
	
		containerElem.style.left = posResult.position.left + "px";
		containerElem.style.top = posResult.position.top + "px";
	
		var arrowElem = document.createElement("div");
		arrowElem.classList.add("lui-tooltip__arrow");
		arrowElem.classList.add("lui-tooltip__arrow--" + (0, _utilPositioner.oppositeDock)(posResult.dock));
		if (posResult.dock === "top" || posResult.dock === "bottom") {
			arrowElem.style.left = posResult.toPosition.left - posResult.position.left + "px";
		} else {
			arrowElem.style.top = posResult.toPosition.top - posResult.position.top + "px";
		}
		tooltipElem.appendChild(arrowElem);
	
		if (title) {
			alignTo.setAttribute("title", "");
		}
		if (alignTo instanceof Element) {
			alignTo.setAttribute("aria-describedby", id);
		}
	
		overlay.show();
	
		return {
			element: tooltipElem,
			close: function close() {
				if (overlay) {
					overlay.close();
					if (title) {
						alignTo.setAttribute("title", title);
					}
					if (alignTo instanceof Element) {
						alignTo.removeAttribute("aria-describedby");
					}
				}
			}
		};
	}
	
	module.exports = exports["default"];

/***/ },

/***/ 72:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "colors.less";

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "variables.less";

/***/ },

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "lui-icons.ttf";

/***/ }

/******/ })
});
;
//# sourceMappingURL=leonardo-ui.js.map
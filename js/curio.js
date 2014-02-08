/*!
 * Curio 1.0
 * https://github.com/sandeepjain/curio
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

(function () {
    'use strict';

    var emptyFunction = function () {},
        eventMatches = (function () {
            var div = document.createElement("div");
            return ["moz", "webkit", "ms", "o"].filter(function (prefix) {
                return prefix + "MatchesSelector" in div;
            })[0] + "MatchesSelector";
        })(),
        curioFactory;

    function ensureEl(el) {
        if (typeof el === 'string') {
            el = document.querySelector(el);
        }
        return el;
    }

    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^| )' + className.split(' ').join('|') + '( |$)', 'gi'), ' ');
        }
    }

    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    curioFactory = function (el, options) {
        options = options || {}
        el = ensureEl(el);

        var elContent = ensureEl(options.elContent),
            elLoader = options.elLoader ? ensureEl(options.elLoader) : false,
            onRender = options.onRender || emptyFunction,
            beforeFetch = options.beforeFetch || emptyFunction,
            doCache = typeof options.doCache != 'undefined' ? options.doCache : true,
            keepHistory = options.history || false,
            cache = [],
            xhr = false,
            elActive = false,
            linkSelector = '[href]';

        function changeContent(event) {
            var actualHref = this.href,
                href = this.getAttribute('data-ajaxhref') || actualHref;

            if (keepHistory) {
                window.history.pushState({ elurl: actualHref || href }, document.title, actualHref || href);
            }
            elActive && removeClass(elActive, 'active');
            elActive = this;

            beforeFetch();
            getContent(href);
        }

        function getContent(url) {
            // close previous request
            xhr && xhr.abort();
            elActive && addClass(elActive, 'active');

            hideResults();
            showLoader();

            if (doCache && cache[url]) {
                renderResults(cache[url]);
                return;
            }

            addClass(elActive, 'working');

            // create new request
            xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);

            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    // cache response
                    doCache && (cache[url] = xhr.responseText);
                    renderResults(xhr.responseText);
                } else {
                    throw new Error('Target server returned an error');
                }
                removeClass(elActive, 'working');
            };

            xhr.onerror = function() {
                removeClass(elActive, 'working');
                throw new Error('Target server returned an error');
            };

            xhr.send();
        }

        function showLoader() {
            if (elLoader) {
                addClass(elLoader, 'show');
            } else {
                addClass(elContent, 'loading');
            }
        }

        function hideLoader() {
            if (elLoader) {
                removeClass(elLoader, 'show');
            } else {
                removeClass(elContent, 'loading');
            }
        }

        function renderResults (html) {
            elContent.innerHTML = html;
            hideLoader();
            showResults();
            onRender(el);
        }

        function showResults() {
            elLoader && addClass(elContent, 'show');
        }

        function hideResults() {
            elLoader && removeClass(elContent, 'show');
        }

        if (keepHistory && !(window.history && window.history.pushState)) {
            keepHistory = false;
        }

        if (keepHistory) {
            window.addEventListener('popstate', function (event) {
                if (event.state) {
                    renderResults(cache[event.state.elurl]);
                }
            }, false);
        }

        el.addEventListener('click', function (event) {
            var target = event.target;

            // find node matching selector
            while( target && target !== this && !target[eventMatches](linkSelector) ) {
                target = target.parentNode;
            }
            // if required element clicked
            if( target && target !== this ) {
                event.preventDefault();
                changeContent.call(target, event);
                return false;
            }
        }, false);

    };

    // export functions
    if (typeof define === 'function' && define.amd) {
        define(curioFactory);
    } else if (typeof exports === 'object') {
        module.exports = curioFactory;
    } else {
        window.curio = curioFactory;
    }

}).call(this);


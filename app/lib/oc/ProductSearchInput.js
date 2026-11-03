angular.module('OrderCloud-ProductSearchInput', []);

angular.module('OrderCloud-ProductSearchInput')
    .directive('productsearchinput', productsearchinput)
    .directive('productsearchinputnav', productsearchinputnav)
    .controller('ProductSearchInputCtrl', ProductSearchInputCtrl)
;

function productsearchinput() {
    var directive = {
        restrict: 'E',
        template: searchTemplate,
        controller: 'ProductSearchInputCtrl'
    };
    return directive;

    function searchTemplate() {
        return [
            '<form name="productSearchInput" ng-submit="executeSearch()">',
            '<div class="view-form-icon">',
            '<div class="input-group" style="margin:0 0 10px;">',
            '<input type="text" class="form-control" placeholder="{{\'Search\' | r}} {{\'Products\' | r}}" ng-model="productSearchTerm" style="border-top-left-radius: 4px;border-bottom-left-radius: 4px;"/>',
            '<i class="fa fa-search"></i>',
            '<span class="input-group-btn">',
            '<button type="submit" class="btn btn-default searchButton" ng-disabled="productSearchTerm == null || productSearchTerm == \'\'" style="background-color: #313131;border:#313131;">{{\'Search\' | r}}</button>',
            '</span>',
            '</div>',
            '</div>',
            '</form>'
        ].join('');
    }
}

function productsearchinputnav() {
    var directive = {
        restrict: 'E',
        template: searchNavTemplate,
        controller: 'ProductSearchInputCtrl'
    };
    return directive;

    function searchNavTemplate() {
        return [
            '<style>.navbar .container .navbar-nav.pull-right li a i.fa-search,.navbar .container-view .navbar-nav.pull-right li a i.fa-search{border-radius:0;border:none;text-align:center;padding:0 10px;margin-top:0}.product-search-display{position:fixed;top:-100%;left:0;right:0;height:60px;background-color:white;padding:38px 5px;opacity:0;z-index:1030;transition:all 300ms;-moz-transition:all 300ms;-webkit-transition:all 300ms}.product-search-display.active{top:0;opacity:1;transition:all 300ms;-moz-transition:all 300ms;-webkit-transition:all 300ms}.product-search-display .fa-angle-double-up{cursor:pointer;margin-top:5px}.fa-search{color:rgb(0,38,62)!important}</style>',
            '<div class="product-search-display" ng-class="{\'active\':displayProductSearch}">',
            '<div class="row" style="display: flex;justify-content: center;">',
            '<div class="col-xs-10 col-md-6">',
            '<form name="productSearchInput" ng-submit="executeSearch()">',
            '<div class="view-form-icon">',
            '<div class="input-group" style="margin:0;">',
            '<input type="text" class="form-control" placeholder="{{\'Search\' | r}} {{\'Products\' | r}}" ng-model="productSearchTerm"/>',
            // '<i class="fa fa-search"></i>',
            '<span class="input-group-btn">',
            '<button type="submit" class="btn btn-default searchButton" ng-disabled="productSearchTerm == null || productSearchTerm == \'\'"><i class="fa fa-search"></i></button>',
            '</span>',
            '</div>',
            '</div>',
            '</form>',
            '</div>',
            '<div class="col-xs-2 col-md-1 text-center">',
            '<i class="fa fa-times" ng-click="displayProductSearch = false" style="font-size: 25px;padding-top: 8px;color: rgb(0, 38, 62);"></i>',
            '</div>',
            '</div>',
            '</div>',
            '<ul class="nav navbar-nav pull-right">',
            '<li class="search-toggle">',
            '<a class="nav-link" href ng-click="displayProductSearch = true;">',
            '<i class="fa fa-search"></i>',
            '</a>',
            '</li>',
            '</ul>'
        ].join('');
    }
}

ProductSearchInputCtrl.$inject = ['$scope','$location'];
function ProductSearchInputCtrl($scope, $location) {
    $scope.displayProductSearch = false;
    $scope.executeSearch = function() {
        var searchTerm = $scope.productSearchTerm;
        $scope.productSearchTerm = null;
        $scope.displayProductSearch = false;
        $location.path('search/' + searchTerm);
    };
}

/**
 * Search as you type (added Nov 2026)
 * From two letters on, the top product matches drop down under any search box marked with
 * product-search-suggest: image, name, SKU and price, each linking to its product page.
 * Up/Down then Enter opens the highlighted product; Enter with nothing highlighted, or
 * "See all", runs the box's normal search. The header boxes get it automatically (below), and the
 * search page box has the attribute in partials/searchView.html.
 * This block is the same on every site; only the settings line differs.
 */
(function() {
    // showPrice: the product cards on this site show prices; hidePriceSku: no price when the SKU
    // contains this text; wordStart: keep only products with a word starting with the typed word
    // (the search page on this site filters to whole words)
    var settings = { showPrice: true, hidePriceSku: '', wordStart: false };

    angular.module('OrderCloud-ProductSearchInput')
        .directive('productSearchSuggest', productSearchSuggest)
        .config(['$provide', function($provide) {
            // The header boxes keep their own markup: their input just gains the attribute before it is compiled
            angular.forEach(['productsearchinputDirective', 'productsearchinputnavDirective'], function(name) {
                $provide.decorator(name, ['$delegate', function($delegate) {
                    var d = $delegate[0], compile = d.compile;
                    d.compile = function(tElement) {
                        var box = tElement[0].querySelector('input[ng-model="productSearchTerm"]');
                        if (box && !box.hasAttribute('product-search-suggest')) {
                            box.setAttribute('product-search-suggest', 'executeSearch()');
                            box.setAttribute('product-search-picked', 'productSearchTerm = null; displayProductSearch = false');
                        }
                        return compile ? compile.apply(this, arguments) : undefined;
                    };
                    return $delegate;
                }]);
            });
        }]);

    var MENU = [
        '<div class="ps-suggest" role="listbox" id="{{s.id}}" ng-show="s.open" ng-mousedown="$event.preventDefault()">',
        '<p class="ps-suggest-note" ng-if="s.loading && !s.items.length">Searching&hellip;</p>',
        '<p class="ps-suggest-note" ng-if="s.failed">Suggestions aren\'t available right now. Press Enter to search.</p>',
        '<p class="ps-suggest-note" ng-if="!s.loading && !s.failed && !s.items.length">No products match &ldquo;{{s.term}}&rdquo;.</p>',
        '<p class="ps-suggest-head" ng-if="s.items.length">{{\'Products\' | r}}</p>',
        '<a class="ps-suggest-row" role="option" ng-repeat="p in s.items" id="{{s.id}}-{{$index}}" href="product/{{p.id}}"',
        ' ng-class="{on: $index == s.at}" aria-selected="{{$index == s.at}}" ng-click="go(p, $event)">',
        '<span class="ps-suggest-img"><img ng-if="p.img" ng-src="{{p.img}}" alt="" /><i ng-if="!p.img" class="fa fa-camera"></i></span>',
        '<span class="ps-suggest-text"><span class="ps-suggest-name" ng-bind-html="p.name"></span><span class="ps-suggest-sku">{{p.id}}</span></span>',
        '<span class="ps-suggest-price" ng-if="p.price != null">{{p.price | culturecurrency}}</span>',
        '</a>',
        '<a class="ps-suggest-all" href="" ng-if="s.items.length" ng-click="all()">',
        '{{s.count == null ? \'See all results\' : s.count == 1 ? \'See 1 result\' : \'See all \' + s.count + \' results\'}} for &ldquo;{{s.term}}&rdquo; <i class="fa fa-angle-right"></i>',
        '</a>',
        '</div>'
    ].join('');

    // Sits on <body> with fixed positioning, so header overflow, z-index and link styles can't clip or restyle it
    var CSS = [
        '.ps-suggest{position:fixed;z-index:10000;box-sizing:border-box;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.16);padding:6px 0;text-align:left;overflow-x:hidden;overflow-y:auto;font-size:14px;line-height:1.3;color:#222;}',
        '.ps-suggest p.ps-suggest-head{margin:0;padding:6px 16px 4px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#666;}',
        '.ps-suggest p.ps-suggest-note{margin:0;padding:12px 16px;font-size:13px;color:#555;}',
        '.ps-suggest a.ps-suggest-row{display:flex !important;align-items:center;gap:12px;margin:0 !important;padding:8px 16px !important;border:0 !important;background:transparent;color:#222 !important;text-decoration:none !important;text-transform:none !important;white-space:normal;}',
        '.ps-suggest a.ps-suggest-row:hover,.ps-suggest a.ps-suggest-row.on{background:#f4f4f4 !important;box-shadow:inset 3px 0 0 #333;}',
        '.ps-suggest .ps-suggest-img{flex:0 0 52px;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;color:#bbb;}',
        '.ps-suggest .ps-suggest-img img{max-width:100%;max-height:100%;width:auto;height:auto;margin:0;object-fit:contain;}',
        '.ps-suggest .ps-suggest-img i{position:static;font-size:20px;}',
        '.ps-suggest .ps-suggest-text{flex:1 1 auto;min-width:0;}',
        '.ps-suggest .ps-suggest-name{display:block;max-height:2.6em;overflow:hidden;font-size:14px;font-weight:600;line-height:1.3;}',
        '.ps-suggest .ps-suggest-sku{display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:#5f5f5f;}',
        '.ps-suggest .ps-suggest-price{flex:0 0 auto;font-size:14px;font-weight:700;}',
        '.ps-suggest a.ps-suggest-all{display:block !important;margin:4px 0 0 !important;padding:10px 16px !important;border:0 !important;border-top:1px solid #eee !important;background:transparent;font-size:13px;font-weight:700;color:#222 !important;text-decoration:none !important;text-transform:none !important;}',
        '.ps-suggest a.ps-suggest-all:hover{background:#f4f4f4 !important;}',
        '.ps-suggest a.ps-suggest-all i{position:static;margin-left:4px;}'
    ].join('');

    var cache = {}, cached = 0;   // matches per typed words, for this page load

    productSearchSuggest.$inject = ['$compile', '$resource', '$timeout', '$location', '$451'];
    function productSearchSuggest($compile, $resource, $timeout, $location, $451) {
        return { restrict: 'A', require: 'ngModel', link: link };

        function link(scope, element, attrs, ngModel) {
            var box = element[0], anchor = closest(box, 'input-group') || box;
            var timer = null, asked = 0;
            var s = { id: 'ps-suggest-' + scope.$id + '-' + Math.floor(Math.random() * 1e6), open: false, loading: false, failed: false, items: [], count: null, term: '', at: -1 };
            var menuScope = scope.$new();
            menuScope.s = s;
            menuScope.go = function(p, ev) {
                if (ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey)) return;   // new tab or window: the link does it
                if (ev) ev.preventDefault();
                pick(p);
            };
            menuScope.all = function() {
                close();
                scope.$eval(attrs.productSearchSuggest);
            };

            addStyle();
            var menu = $compile(MENU)(menuScope);
            angular.element(document.body).append(menu);

            box.setAttribute('autocomplete', 'off');
            box.setAttribute('role', 'combobox');
            box.setAttribute('aria-autocomplete', 'list');
            box.setAttribute('aria-controls', s.id);
            box.setAttribute('aria-expanded', 'false');

            // typing (not the box being cleared by code)
            ngModel.$viewChangeListeners.push(function() { suggestFor(ngModel.$viewValue); });
            // back in the box (a click when it already has focus, too) shows the list again
            element.on('focus click', function() { if (!s.open) apply(function() { suggestFor(ngModel.$viewValue); }); });
            // closed a moment after the box loses focus, so a click in the list still lands
            element.on('blur', function() { $timeout(close, 150); });
            element.on('keydown', function(ev) {
                var k = ev.keyCode, n = s.items.length;
                if (k === 27 && s.open) { apply(close); return; }                      // Escape
                if ((k === 40 || k === 38) && n) {                                       // Down / Up
                    ev.preventDefault();
                    apply(function() {
                        if (!s.open) { s.open = true; return; }
                        s.at = k === 40 ? (s.at + 1) % n : (s.at - 1 + n) % n;
                    });
                    return;
                }
                if (k === 13 && s.open && s.items[s.at]) {                               // Enter on a highlighted product
                    ev.preventDefault();
                    apply(function() { pick(s.items[s.at]); });
                }
            });

            menuScope.$watch('s.open', function(open) {
                box.setAttribute('aria-expanded', open ? 'true' : 'false');
                place();
            });
            menuScope.$watch('s.items.length', place);
            menuScope.$watch('s.at', function(at) {
                if (at > -1) box.setAttribute('aria-activedescendant', s.id + '-' + at);
                else box.removeAttribute('aria-activedescendant');
            });
            menuScope.$on('$routeChangeStart', close);
            window.addEventListener('scroll', place, true);
            window.addEventListener('resize', place);

            var cleaned = false;
            function cleanup() {
                if (cleaned) return;
                cleaned = true;
                if (timer) $timeout.cancel(timer);
                window.removeEventListener('scroll', place, true);
                window.removeEventListener('resize', place);
                menuScope.$destroy();
                menu.remove();
            }
            scope.$on('$destroy', cleanup);
            element.on('$destroy', cleanup);

            function suggestFor(text) {
                var t = (text || '').replace(/^\s+|\s+$/g, '');
                if (timer) $timeout.cancel(timer);
                if (t.length < 2) {
                    asked++;
                    s.items = []; s.term = ''; s.loading = false; s.failed = false;
                    close();
                    return;
                }
                s.open = true;
                if (t === s.term && !s.loading && !s.failed) return;   // back in the box with the same words
                s.term = t;
                s.failed = false;
                if (cache[t]) { asked++; show(cache[t]); return; }
                s.loading = true;
                timer = $timeout(function() {
                    var mine = ++asked;
                    // The Products API directly: Product.search would refill the list the category and search pages show
                    $resource($451.api('Products')).get({ SearchTerms: t, Page: 1, PageSize: settings.wordStart ? 40 : 5 }).$promise.then(function(products) {
                        var found = shape(products, t);
                        if (cached++ > 50) { cache = {}; cached = 0; }
                        cache[t] = found;
                        if (mine === asked) show(found);
                    }, function() {
                        if (mine !== asked) return;   // only the latest words count: a slow reply for "mu" must not replace "mug"
                        s.items = []; s.loading = false; s.failed = true;
                    });
                }, 250);
            }

            function shape(products, t) {
                var list = products.List || [], count = products.Count;
                if (settings.wordStart && /^[a-z]+$/i.test(t)) {
                    var re = new RegExp('\\b' + t, 'i');
                    list = list.filter(function(p) { return re.test(p.Name || '') || re.test(p.Description || ''); });
                    count = null;
                }
                var items = [];
                angular.forEach(list.slice(0, 5), function(p) {
                    items.push({ id: p.InteropID, name: p.Name, img: p.SmallImageUrl || p.LargeImageUrl, price: price(p) });
                });
                return { items: items, count: count };
            }

            // The price the product card shows, as the product page picks it
            function price(p) {
                var user = scope.user, type = scope.currentOrder && scope.currentOrder.Type;
                if (!settings.showPrice) return null;
                if (user && user.Permissions && user.Permissions.indexOf('HidePricing') > -1) return null;
                if (settings.hidePriceSku && ((p.InteropID || '') + ' ' + (p.ExternalID || '')).toUpperCase().indexOf(settings.hidePriceSku.toUpperCase()) > -1) return null;
                var ps = (type && p[type + 'PriceSchedule']) ||
                    (p.Type == 'VariableText' ? (p.ReplenishmentPriceSchedule || p.StandardPriceSchedule) : (p.StandardPriceSchedule || p.ReplenishmentPriceSchedule));
                var pb = ps && ps.PriceBreaks && ps.PriceBreaks[0];
                return pb ? pb.Price : null;
            }

            function show(found) {
                s.items = found.items;
                s.count = found.count;
                s.at = -1;
                s.loading = false;
                s.failed = false;
            }

            function pick(p) {
                close();
                if (attrs.productSearchPicked) scope.$eval(attrs.productSearchPicked);
                $location.path('product/' + p.id);
            }

            function close() {
                s.open = false;
                s.at = -1;
            }

            // Under the box, lined up with its right edge when the box is on the right of the screen
            function place() {
                if (!s.open) return;
                var r = anchor.getBoundingClientRect(), vw = document.documentElement.clientWidth;
                if (!r.width && !r.height) return;
                var w = Math.min(Math.max(r.width, 380), vw - 32);
                var left = r.left + r.width / 2 > vw / 2 ? r.right - w : r.left;
                left = Math.max(16, Math.min(left, vw - 16 - w));
                menu.css({
                    top: Math.round(r.bottom + 6) + 'px',
                    left: Math.round(left) + 'px',
                    width: Math.round(w) + 'px',
                    maxHeight: Math.max(200, Math.round(window.innerHeight - r.bottom - 22)) + 'px'
                });
            }

            function apply(fn) {
                var phase = scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') fn();
                else scope.$apply(fn);
            }
        }
    }

    function closest(el, cls) {
        for (; el && el.nodeType === 1; el = el.parentNode)
            if ((' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1) return el;
        return null;
    }

    function addStyle() {
        if (document.getElementById('ps-suggest-style')) return;
        var st = document.createElement('style');
        st.id = 'ps-suggest-style';
        st.appendChild(document.createTextNode(CSS));
        document.getElementsByTagName('head')[0].appendChild(st);
    }
})();

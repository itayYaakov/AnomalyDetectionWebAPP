import Error404View from "./views/Error404View.js"
import DashboardView from "./views/DashboardView.js";
import TableView from "./views/TableView.js"

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async() => {
    const routes = [
        { path: "/404", view: Error404View },
        { path: "/", view: DashboardView },
        { path: "/dashboard", view: DashboardView },
        { path: "/table_train", view: TableView },
        { path: "/table_test", view: TableView },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    const route_url = view.getHtml();

    $("#content").html('');
    $("#content").load(route_url);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    let url = location.pathname;
    if (url === "/") url = "/dashboard"
    let nav_links = $("#" + "accordionSidebar")[0].querySelectorAll("a[href='" + url + "']");
    if (nav_links.length > 0) {
        document.querySelectorAll(".nav-link").forEach(function(item) {
            item.classList.remove("active");
        });
        nav_links[0].classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(function(item) {
        item.addEventListener("click", e => {
            e.preventDefault();
            // remove active class from all buttons
            document.querySelectorAll(".nav-link").forEach(function(item) {
                item.classList.remove("active");
            });
            // add active class to the selected button
            let nav_link = e.currentTarget.firstElementChild;
            nav_link.classList.add("active");
            navigateTo(nav_link.href);
        });
    });
});


router();

//# sourceURL=index.js
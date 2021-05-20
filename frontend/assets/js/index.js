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
    console.log("before history push state location.pathname=", location.pathname);
    history.pushState(null, null, url);
    console.log("after history push state location.pathname=", location.pathname);
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
        console.log("default match for location.pathname= ", location.pathname, " match.route.path= ", match.route.path);
    } else {
        console.log("found match for location.pathname= ", location.pathname, " match.route.path= ", match.route.path);
    }

    const view = new match.route.view(getParams(match));

    console.log("redirect tp", view.getHtml());
    $("#content").html('');
    $("#content").load(view.getHtml());
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    [document.querySelectorAll('.nav-item')][0].forEach(function(item) {
        item.addEventListener("click", e => {
            e.preventDefault();
            navigateTo(e.currentTarget.firstElementChild.href);
        });
    });
});

router();
// document.addEventListener("DOMContentLoaded", () => {
//     document.body.addEventListener("click", e => {
//         if (e.target.matches("[nav-link]")) {
//             e.preventDefault();
//             navigateTo(e.target.href);
//         }
//     });
const express = require('express');
const db = require('./db');
const app = express();
module.exports = app;

const renderPage = (content, pages) => {
    return `
        <html>
            <head>
            <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' />
            </head>
            <body>
                <div class='container'>
                    <h1> Acme Web </h1>
                    <ul class='nav nav-tabs'>
                        ${pages.map(page => {
                            return `<li class='nav-item'>
                                <a  href='/pages/${page.id}' class='nav-link'>
                                    ${page.name}
                                <a>
                            </li>
                            `;
                        }).join('')}
                    </ul>
                    ${content.map(pageContent => {
                        return `
                            <h2>${pageContent.name}</h2>
                            <div>${pageContent.body}</div>                        
                        `
                    }).join('')}
                </div>
            </body>
        </html>
    `
}

app.use((req, res, next) => {
    db.getPages()
        .then(pages => {
            req.pages = pages;
            next();
        })
        .catch(next);
})

app.get('/', (req, res, next) => {
    const home = req.pages.find(page => page.is_home_page === true);
    res.redirect(`/pages/${home.id}`)
})

app.get('/pages/:id', (req, res, next) => {
    db.getContent(req.params.id)
        .then(content => res.send(renderPage(content, req.pages)))
        .catch(next);
});

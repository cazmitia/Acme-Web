const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_web_db');

client.connect();

const getPages = () => {
    return client.query('SELECT * from pages')
        .then(response => response.rows)
}

const getContent = (pageId) => {
    return client.query('SELECT * from content WHERE page_id = $1', [pageId])
    .then(response => response.rows)
}

const sync = () => {
    return client.query(SEED);
}

const SEED = `
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS pages;
CREATE TABLE pages(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) unique,
    is_home_page BOOLEAN
);
CREATE TABLE content(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) unique,
    body VARCHAR(1000) unique,
    page_id integer references pages(id)
);
    INSERT INTO pages(name, is_home_page) values('Home', TRUE);
    INSERT INTO pages(name, is_home_page) values('Employees', FALSE);
    INSERT INTO pages(name, is_home_page) values('Contact', FALSE);
    INSERT INTO content(name, body, page_id) values('Welcome to the Home Page', 'So looking forward to having you browse our site', 1);
    INSERT INTO content(name, body, page_id) values('Moe', 'Moe is our CEO!!!', 2); 
    INSERT INTO content(name, body, page_id) values('Larry', 'Larry is our CTO!!!', 2); 
    INSERT INTO content(name, body, page_id) values('Curly', 'Curly is our COO!!!', 2); 
    INSERT INTO content(name, body, page_id) values('Phone', 'call us 212-555-1212', 3);
    INSERT INTO content(name, body, page_id) values('Fax', 'fax us 212-555-1213', 3); 
`

module.exports = {
    getPages,
    getContent,
    sync
}

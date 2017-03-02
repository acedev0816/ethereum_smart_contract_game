/**
 * Created by avv123avv on 04.01.17.
 */
import express  from 'express';
import React    from 'react';
import ReactDom from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';

//connect Redux
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

const app = express();

app.use((req, res) => {
    const store = configureStore();
    //add react-routes match
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) { // Если необходимо сделать redirect
            return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        }

        if (error) { // Произошла ошибка любого рода
            return res.status(500).send(error.message);
        }

        if (!renderProps) { // Мы не определили путь, который бы подошел для URL
            return res.status(404).send('Not found');
        }

        const componentHTML = ReactDom.renderToString(
            <Provider store={store}>
                <RouterContext {...renderProps} />
            </Provider>
        );

        return res.end(renderHTML(componentHTML));
    });
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8051' : '/';

function renderHTML(componentHTML) {
    return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="${assetUrl}/public/assets/styles.css">
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
      </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});
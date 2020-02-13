# Welly Exchange

A funny currency exchange app made by React.

⚡️ Live demo: https://welly-exchange.netlify.com

[![build status](https://img.shields.io/travis/wellyshen/welly-exchange/master?style=flat-square)](https://travis-ci.org/wellyshen/welly-exchange)
[![coverage status](https://img.shields.io/coveralls/github/wellyshen/welly-exchange?style=flat-square)](https://coveralls.io/github/wellyshen/welly-exchange?branch=master)
[![MIT licensed](https://img.shields.io/github/license/wellyshen/welly-exchange?style=flat-square)](https://raw.githubusercontent.com/wellyshen/welly-exchange/master/LICENSE)

## Features

- ⚛️ Made by [React](https://reactjs.org) and [Redux](https://redux.js.org).
- 🎣 Based on functional components and [Hooks](https://reactjs.org/docs/hooks-intro.html).
- 💅🏻 Using [Sass](https://sass-lang.com) and [CSS modules](https://github.com/gajus/react-css-modules) for styling.
- 🧐 Runtime type-checks via [Typescript](https://www.typescriptlang.org).
- 🧪 Using [Jest](https://jestjs.io) and [React Test Library](https://testing-library.com/docs/react-testing-library/intro) for unit testing.
- 🤖 Integrating [Travis-CI](https://travis-ci.com) with [Netlify](https://www.netlify.com) for continuous development.

## Requirements

- [node](https://nodejs.org/en/) >= 10.0
- [npm](https://www.npmjs.com/) >= 6.0

## Getting Started

You can start by cloning the repository on your local machine by running:

```sh
git clone https://github.com/wellyshen/welly-exchange.git
cd welly-exchange
```

Then install all of the dependencies:

```sh
yarn install
# or
npm install
```

Run it:

```sh
yarn start
# or
npm start
```

Now the app should be running at [http://localhost:3000](http://localhost:3000)

## Script Commands

You can explore this app via the following commands.

| Key        | Description                                             |
| ---------- | ------------------------------------------------------- |
| `start`    | Runs app on the development server at `localhost:3000`. |
| `build`    | Builds the app.                                         |
| `test`     | Runs test in the interactive watch mode.                |
| `test:cov` | Runs test once with coverage report.                    |
| `lint`     | Checks coding style via eslint.                         |

## Project Overview

The structure of the app.

```
.
└── src                 # App source code
    ├── components      # App components
    │   ├── App         # Entry component (include testing)
    │   ├── Rates       # Main rate information (include testing)
    │   └── Pocket      # Pocket component (include testing)
    ├── actions         # Redux action creator (include testing)
    ├── reducers        # Redux reducers (include testing)
    ├── store           # Redux configure store
    ├── utils           # Useful tools like format-digits, test-helper etc. (include testing)
    ├── types           # Shared types
    ├── theme           # App root styles and shared variables
    └── index.ts        # App entry point
```

## Component Overview

The composition of the app as below.

<img width="370" alt="app" src="https://user-images.githubusercontent.com/21308003/73160834-09122180-4125-11ea-987f-0e7ae623fe34.png">

## Implementation

The app includes the following functions:

- Auto update API every 10 seconds.
- Dynamic rate information for GBP, EUR, USD.
- Live rate exchange between GBP, EUR, USD.
- Validating and formating input value (e.g. legal characters, auto pre-pend zero, two digits after dot etc.).
- Check if user has enough money before exchanging.
- Works well on PC and mobile devices.
- Flexible API error handling and loading status as below.

<img width="280" alt="loading" src="https://user-images.githubusercontent.com/21308003/73167109-36190100-4132-11ea-8668-12ce6d46358a.png"> <img width="280" alt="error" src="https://user-images.githubusercontent.com/21308003/73167115-3913f180-4132-11ea-87ac-69ee34223dbd.png">

> 💡 This project supports [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension). You can install it to check the API updating feature.

## API

The API provided by [European Central Bank](https://exchangeratesapi.io). The API responses the following `json` data.

```js
// GET https://api.exchangeratesapi.io/latest HTTP/1.1

{
  "base": "EUR",
  "date": "2018-04-08",
  "rates": {
    "CAD": 1.565,
    "CHF": 1.1798,
    "GBP": 0.87295,
    "SEK": 10.2983,
    "EUR": 1.092,
    "USD": 1.2234,
    ...
  }
}
```

## App Starter

This is a static web app which based on Facebook's [create-react-app](https://github.com/facebook/create-react-app).

## Unit Testing

The Revolut app isn't available in my country (TW). I checked the YouTube video many times and spent a lot of time to think the test cases. My unit testing covers the following parts.

- [All self-made components](https://github.com/wellyshen/welly-exchange/tree/master/src/components).
- [Redux action](https://github.com/wellyshen/welly-exchange/tree/master/src/actions).
- [Redux reducers](https://github.com/wellyshen/welly-exchange/tree/master/src/reducers).
- [Utils](https://github.com/wellyshen/welly-exchange/tree/master/src/utils).

## Continuous Development

Netlify provide an [auto deploy feature](https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git) by default. Which means once you push a new commit to your production branch, it'll setup the CI/CD for you. But I didn't rely on it, because I wish the deploy to be a part of my Travis-CI flow (for someday I exceed the free trial quota, I can switch to other services quickly, just kidding). Therefore, I integrated the [Netlify CLI](https://cli.netlify.com/commands/deploy) with my Travis-CI for continuous development. You can [check it out](https://github.com/wellyshen/welly-exchange/blob/master/.travis.yml).

## Know More About Welly

In my spare time, I like to contribute and maintain OSS for making people coding happier. You can check the following repositories to know more about me.

- 😎🐣 [react-cool-starter](https://github.com/wellyshen/react-cool-starter): A starter boilerplate for a universal (SSR) web app.
- 😎📍 [use-places-autocomplete](https://github.com/wellyshen/use-places-autocomplete): React hook for Google Maps Places Autocomplete. (Highlighted by [React Status](https://react.statuscode.com/issues/175))
- 😎🖱 [react-cool-onclickoutside](https://github.com/wellyshen/react-cool-onclickoutside): A React hook to listen for clicks outside of the component(s). (Collected by [React Status](https://twitter.com/reactdaily/status/1220032630172934144?s=20))
- 😎🏞 [react-cool-img](https://github.com/wellyshen/react-cool-img): A React <Img /> component let you handle image UX and performance as a Pro! (Collected by [CSS-Tricks](https://css-tricks.com/third-party-components-at-their-best))

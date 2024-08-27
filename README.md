# formulAPI

As you may have guessed, this is a Formula 1 Web API! It is driven by data from [f1db](https://github.com/f1db/f1db), the most comprehensive free open source database with all-time Formula 1 racing data and statistics!

# Getting Started
- First of all, you have to install the dependencies required to run this API. This can be done by running `npm i` in the terminal.
- Run `npm run dev` to start the API.
  - Requests can be executed easily with the Bruno Collection provided in `docs/Bruno Collection`.
- Run `npm run test` to execute the Vitest test suite.
  - `--ui` can be added to run the Vitest UI plugin, which allows for seeing the tests in a useful GUI.
  - `--coverage` can be added to run the Vitest Coverage plugin (specifically Istanbul), which allows for generating a coverage report.
  - Adding both of these to `npm run test` allows for showing the coverage report in the UI.

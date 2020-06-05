# FUO (Backend)

This repository contains the backend implementation of the FUO application.

Access our web application by heading over to [https://corona-food.herokuapp.com/landing.html](https://corona-food.herokuapp.com/landing.html).

More information about the application can be found in [FUO: README.pdf](https://github.com/MoonJiao123/FUO-backend/blob/master/FUO_%20README.pdf).

## Installation


These are the “local” installation instructions for macOS (preferred). Extra installation information will be needed for redis if using Windows.

Make sure that [Node.js](https://nodejs.org/en/download/) and the [Homebrew](https://brew.sh/) package manager are both installed on your system.

First, clone this GitHub repository (backend) to your local machine.

Then, open a terminal window from the root of the git repository, and enter the following commands:

```bash
npm i
npm install geocoder
npm install redis
npm install express-session
```

In another terminal, open redis by typing...

```bash
brew install redis
redis-server
```

Go back to the previous terminal window and type...

```bash
node server.js
```

Next, clone the frontend from this [repository](https://github.com/MoonJiao123/corona-food-app), and follow the installation instructions in that repo.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

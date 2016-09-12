## Neighborhood Map Project
Welcome to my Neighborhood Map Project repository!

This particular app focuses on the neighborhood near New York City's own **Bronx Bombers**, the **Yankees**.

On the map, you'll find some popular places to eat, as well as some of the surrounding **parks**, **fields**, and **city buildings**.

_The map is made available by the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/), and the location information is retrieved using the [Foursquare API](https://developer.foursquare.com/)._
### Setting Up

#### Running the page

Some useful tips to help you get started:

1. Check out the repository
2. To inspect the site, you can run a local server using [Python](https://www.python.org/)

  ```bash
  $> cd /path/to/project-dist-folder
  $> python -m SimpleHTTPServer 8080
  or
  $> python -m http.server 8080
  ```

3. Open a browser and visit localhost:8080
4. Download and install [ngrok](https://ngrok.com/) to make the local server accessible remotely.

  ``` bash
  $> cd /path/to/project-dist-folder
  $> ngrok http 8080
  ```

5. Copy the public URL ngrok gives you and try running it through PageSpeed Insights!

Alternatively, you could visit and test a live version of the distribution site at http://leuryr.github.io/optimization-project/

The PageSpeed Insights scores should be up to standards!

#### Running the build tools

In order to get the build tools that were used set up on your system, you must have [Node.js](https://nodejs.org/en/download/) and [Grunt](http://gruntjs.com/getting-started) installed.

* Navigate to the project folder and run `npm install`

	```bash
	$> cd /path/to/project-folder
	$> npm install
	```

	* This should install all `devDependencies` into a `node_modules` folder.

* The `watch` task is set up as the sole default action when using the `grunt` command. It handles all of the other tasks, except for `gh-pages`, which I was running manually when I was ready to publish changes, using:
	```bash
	$> grunt gh-pages
	```

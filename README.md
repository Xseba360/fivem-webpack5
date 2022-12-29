Webpack 5 for FiveM
-------------------
Since cfx archived the `cfx-server-data` repo, and webpack 4 stuff is incompatible with webpack 5, I decided to put this here.
If you looked for it - you know you need it.


Download and Install
--------------------
Clone the repo into your `resources/[system]/[builders]` and run `npm i` or any other package manager command to install the dependencies (for some reason fxserver didn't install them for me here)


Usage
-----

Add this to your `server.cfg` somewhere early, preferably next to default webpack

```
ensure webpack5
```



In YOUR RESOURCE (don't go around changing it in random resources that don't need it!), replace this:

```lua
dependencies {
    'yarn',
    'webpack'
}

webpack_config 'webpack.prod.js'
```

With this:

```lua
dependencies {
    'yarn',
    'webpack5'
}

webpack5_config 'webpack.prod.js'
```

**Now your resource should be built with webpack 5.75.0**

# Keep in mind FXServer is limited to fork of Node.js 16.9 so you WILL run into dependency issues when installing the latest and greatest stuff that might depend on Node.js 16.10+


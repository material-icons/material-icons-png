# Material design icons, updated set

Material design icons is the official [icon set](https://www.google.com/design/spec/style/icons.html#icons-system-icons) from Google.  The icons are designed under the [material design guidelines](https://material.io/guidelines/).


### Updated set

This is updated version of icons, directly from [material.io](https://material.io/resources/icons/).

You can find older version of this icons set in [google/material-design-icons](https://github.com/google/material-design-icons) repository.

Because official repository is no longer maintained, I have decided to make alternative repository with latest icons.


## Available icons

Version 3 that is available in official icons repository only includes 1 variation of each icon.

This repository includes several variations for each icon:

* baseline
* sharp
* outline
* round
* twotone

This repository includes only icons in PNG format. Icons are available in SVG format in [cyberalien/material-design-icons-updated-png](https://github.com/cyberalien/material-design-icons-updated) repository.

## PNG

PNG icons are available as black (in png/black) and white (in png/white) in 24x24, 48x48 and 96x96.

This repository is available on github.io. You can link to any PNG file like this:

```
https://cyberalien.github.io/google-material-design-icons-updated-png/png/{color}/{name}/{family}{suffix}.svg
```


where:
* {color} is color: "black" or "white".
* {name} is icon name.
* {family} is icon variation: "baseline", "outline", "round", "sharp", "twotone".
* {suffix} is optional suffix: "-2x" for 48x48 icons, "-4x" for 96x96 icons.


## Build script

This repository is automatically generated from [google/material-design-icons](https://github.com/google/material-design-icons) repository.

To build icons you need to install phantomjs. On OSX you can install it using HomeBrew `brew install phantomjs`

If you want to build custom icons or different size or different color, build script is available in build/png.js. Edit "configuration" section of png.js to change size or colors.

To build icons run this:

```
node build/png
```


Script will render only icons that are missing. To rebuild entire PNG set, run
```
node build/png --overwrite
```


## License

(copied from Google's repository)

We have made these icons available for you to incorporate into your products under the [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt). Feel free to remix and re-share these icons and documentation in your products.
We'd love attribution in your app's *about* screen, but it's not required. The only thing we ask is that you not re-sell these icons.

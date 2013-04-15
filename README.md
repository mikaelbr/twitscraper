twit-scraper
====

twit-scraper is a binary used for scraping the Twitter site for tweets and generate a ```.TSV``` file for output. 

## Installation

To install the twit-scraper, you'll need to install Node.js and NPM. To install Node.js visit the [Node.js site](http://nodejs.org) and follow the instructions. NPM is installed as a part of Node.js.

After installing Node.js you can install twit-scraper using NPM:

```
npm install -g https://dl.dropbox.com/u/2361994/twit-scraper-0.3.2.tgz
```

If you get permission-problem, run the command in sudo. 

After installing you should have ```twit-scraper``` as a global command on your system.

_This describes how to install on a UNIX system, but ```twit-scraper``` can also be used on a Windows platform._

## twit-scraper usage

```
➜ twit-scraper git:(master) twit-scraper --help

  Usage: twit-scraper [options] <input file>

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -o, --output [value]  Output file
    -d, --debug           Show debug data
```

The input file is a ```.tsv``` file containing user id, tweet id and classification label. 

If no ```-o``` is set, a default name of ```output_<CURRENT_DATE>.tsv``` will be used.

### Example

So if you want to generate dataset for file ```data/twit-dist.tsv```, you can run the following: 

```
twit-scraper data/twit-dist.tsv -o output.tsv
```

## Input file format:

The input file format should be the following:

> ```user_id``` ```tweet_id```  ```label```
> ```user_id``` ```tweet_id```  ```label```
...

Where the different columns are seperated by tab (```\t```).

### Example 
Example of input file: 

```
264221473558917120    331180650 "neutral"
264091690632105984  241608245 "neutral"
263929564907069441  223899398 "neutral"
263759328782204928  563441482 "positive"
259546192722161664  564239094 "objective"
264249030572392448  56019726  "neutral"
264123482206519296  312108161 "positive"
264255668180090880  200367404 "positive"
```
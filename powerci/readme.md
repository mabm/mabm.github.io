POWERCI
=======

Description
-----------
PowerCI is an open-source project strongly inspirated by [KernelCI](https://kernelci.org/).
Our goal is to apply continous integration on farms of boards to measuring various electrical measurements under specific tests case.

Architecture
------------
Here, you can find the front-end and the API. Front-end is requesting API to get data. API is filled by *Lava-CI* which is developped by [Linaro](https://linaro.org/).

Installation
------------
To use our front and our API, you have to install some packages :

* Apache
* PHP
* Mongod

And some PHP extensions :

* [Phalcon](https://phalconphp.com/fr/)
* [Mongo PHP Driver](http://php.net/manual/fr/mongo.installation.php)

And, finally, some Apache mod :

* URL Rewriting (rewrite_module)
* PHP (php5_module)

Usage
-----
Our API implements 4 routes (boot, token, log and graph), if you want documenting you about those, you can find a documentation for *boot* and *token* API [here](https://api.kernelci.org/). Other route's documentation will come later.

After *PowerCI* installation, you have to fill the [config.json](./config.json) file with your settings.

Feedback
--------
If you wish leave us your feedback or report a bug, you can us our [BugZilla](http://powerci.org:6060/), our [FlySpray](http://powerci.org:5050/) or [contact@powerci.org](mailto:contact@powerci.org).
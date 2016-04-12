#!/usr/bin/python

import io
import requests

from urlparse import urljoin

BACKEND_URL = "http://powerci.org:9999"
AUTHORIZATION_TOKEN = "1d35119c-621f-4a02-80d6-7852a4db6710"


def main():
    headers = {"Authorization": AUTHORIZATION_TOKEN}

    url = urljoin(BACKEND_URL, "/upload/next/next-20150116/arm64-allnoconfig/lab-name/toto")

    with io.open("test", mode="rb") as upload_file:
        response = requests.put(url, headers=headers, data=upload_file)

    print response.content

if __name__ == "__main__":
    main()

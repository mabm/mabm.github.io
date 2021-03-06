#!/usr/bin/python

try:
    import simplejson as json
except ImportError:
    import json

import requests
import urlparse

#BACKEND_URL = "http://powerci.org:9999"
BACKEND_URL = "http://localhost/powerci/api"
AUTHORIZATION_TOKEN = "4a92fd31-5283-4079-8458-41d4c2a8e4d6"

def main():
    headers = {
        "Authorization": AUTHORIZATION_TOKEN,
        "Content-Type": "application/json",
        "Accept": "*/*"
    }

    payload = {
        "version": "1.0",
        "lab_name": "lab-test",
        "kernel": "next-20161802",
        "job": "next",
        "defconfig": "arm-omap2plus_defconfig",
        "board": "omap4-superPanda3",
        "boot_result": "PASS",
        "boot_time": 10.4,
        "boot_warnings": 1,
        "endian": "little",
        "arch": "arm"
    }

url = urlparse.urljoin(BACKEND_URL, "/boot")
response = requests.post(url, data=json.dumps(payload), headers=headers)

print response.content

if __name__ == "__main__":
    main()


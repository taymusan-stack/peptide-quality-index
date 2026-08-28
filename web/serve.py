#!/usr/bin/env python3
"""Draft face preview server. Not production."""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent


class FaceHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        clean = path.split("?", 1)[0]
        if clean.startswith("/vendor/") and not clean.endswith(".html"):
            slug = clean[len("/vendor/") :].strip("/")
            if slug and "/" not in slug:
                path = "/vendor.html"
        return super().translate_path(path)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    server = ThreadingHTTPServer(("127.0.0.1", port), FaceHandler)
    print(f"Draft face at http://127.0.0.1:{port}/ (not live)")
    server.serve_forever()


if __name__ == "__main__":
    main()

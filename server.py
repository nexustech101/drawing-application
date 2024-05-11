import http.server
import os
from urllib.parse import urlparse


class SPAHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Handle Single Page Application (SPA) Routing"""
    def do_GET(self):
        # Parse the request URL
        url = urlparse(self.path)
        
        # Check if the path is a file or directory that exists
        if os.path.exists(url.path[1:]) and not url.path.endswith("/"):
            # If so, serve the file or directory as usual
            super().do_GET()
        else:
            # Otherwise, serve index.html for SPA routing
            self.path = '/index.html'
            super().do_GET()


if __name__ == '__main__':
    http.server.test(HandlerClass=SPAHTTPHandler)

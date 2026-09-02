import http.server
import socketserver
import json
import os

PORT = 8000
DIRECTORY = "."
DB_FILE = "visitors.json"

def update_visitor_count():
    data = {"total_visits": 1}
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                data["total_visits"] += 1
        except Exception:
            pass
    with open(DB_FILE, "w") as f:
        json.dump(data, f)
    return data["total_visits"]

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def do_GET(self):
        if self.path == "/api/stats":
            total = update_visitor_count()
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {
                "status": "success",
                "total_visitors": total,
                "server_env": "Python 3 Standard Library",
                "database": "JSON Flat-file"
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/exec":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                req = json.loads(post_data.decode('utf-8'))
                raw_cmd = req.get("command", "").strip()
                cmd_parts = raw_cmd.split()
                cmd = cmd_parts[0].lower() if cmd_parts else ""
                
                if cmd == "help":
                    output = "Perintah tersedia: help, whoami, uname, status, date, sysinfo, ping, echo <pesan>, clear"
                elif cmd == "whoami":
                    output = "visitor@fajarin-naufal-core"
                elif cmd == "uname":
                    output = "Linux x86_64 (Python-Virtual-Host)"
                elif cmd == "status":
                    output = "System Status: Online | CPU Load: 1.2% | RAM: 512MB"
                elif cmd == "date":
                    import datetime
                    output = f"Server Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (WIB)"
                elif cmd == "sysinfo":
                    import sys
                    output = f"Python {sys.version.split()[0]} | Platform: {sys.platform} | Encoding: utf-8"
                elif cmd == "ping":
                    output = "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms\n-> Koneksi server stabil dan optimal."
                elif cmd == "echo":
                    output = " ".join(cmd_parts[1:]) if len(cmd_parts) > 1 else ""
                elif cmd == "clear":
                    output = "__CLEAR__"
                else:
                    output = f"perintah tidak dikenal: '{raw_cmd}'. Ketik 'help' untuk bantuan."
            except Exception:
                output = "Error memproses perintah."

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"output": output}
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_error(404)
if __name__ == "__main__":
    print(f"Server backend berjalan di http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
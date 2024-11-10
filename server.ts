import { serveTls } from "https://deno.land/std@0.203.0/http/server.ts";
import { handler } from "./handler.ts";

const startPort = 8000; // Starting port number

const options = {
  certFile: "/Users/r.de.ruijter/Documents/persoonlijke-projecten/webserver/cert.pem",
  keyFile: "/Users/r.de.ruijter/Documents/persoonlijke-projecten/webserver/key.pem",
};

// Function to try starting the server on different ports
export const startServer = async (port: number) => {
  while (true) {
    try {
      await serveTls(handler, { port, ...options });
    } catch (error) {
      if (error instanceof Deno.errors.AddrInUse) {
        port++; // Increment the port number and try again
      } else {
        console.error("Unexpected error:", error);
        Deno.exit(1);
      }
    }
  }
};

await startServer(startPort);

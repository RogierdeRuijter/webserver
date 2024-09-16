import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.203.0/http/file_server.ts";
import { exists } from "https://deno.land/std@0.203.0/fs/mod.ts";
import { join, normalize } from "https://deno.land/std@0.203.0/path/mod.ts";

const startPort = 8000; // Starting port number
let currentPort = startPort;
// Define the root directory from where files can be served
const rootDirectory = Deno.cwd(); // Serve from the current working directory

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  let requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;

  // Join the root directory with the requested path
  const safePath = normalize(join(rootDirectory, requestedPath));

  // Ensure that the safePath is still within the root directory
  if (!safePath.startsWith(rootDirectory)) {
    return new Response("403 Forbidden: Access denied", { status: 403 });
  }

  // Check if the requested file exists
  const fileExists = await exists(safePath);

  // If file exists, serve it; otherwise, return 404
  if (fileExists) {
    return await serveFile(request, safePath);
  } else {
    return new Response("404 Not Found", { status: 404 });
  }
};

// Function to try starting the server on different ports
const startServer = async (port: number) => {
  while (true) {
    try {
      await serve(handler, { port });
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

// Start the server
await startServer(currentPort);


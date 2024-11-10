import { exists } from "https://deno.land/std@0.203.0/fs/mod.ts";
import { join, normalize } from "https://deno.land/std@0.203.0/path/mod.ts";

// Define the root directory from where files can be served
const rootDirectory = Deno.cwd(); // Serve from the current working directory

export const handler = async (request: Request): Promise<Response> => {
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
    const file = await Deno.open(safePath, { read: true });
    return new Response(file.readable);
  } else {
    return new Response("404 Not Found", { status: 404 });
  }
};

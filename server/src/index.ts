
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas and handlers
import { 
  createItemInputSchema, 
  searchInputSchema, 
  getItemInputSchema 
} from './schema';
import { createItem } from './handlers/create_item';
import { searchItems } from './handlers/search_items';
import { getItems } from './handlers/get_items';
import { getItem } from './handlers/get_item';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new searchable item
  createItem: publicProcedure
    .input(createItemInputSchema)
    .mutation(({ input }) => createItem(input)),
  
  // Search through items
  searchItems: publicProcedure
    .input(searchInputSchema)
    .query(({ input }) => searchItems(input)),
  
  // Get all items
  getItems: publicProcedure
    .query(() => getItems()),
  
  // Get single item by ID
  getItem: publicProcedure
    .input(getItemInputSchema)
    .query(({ input }) => getItem(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();

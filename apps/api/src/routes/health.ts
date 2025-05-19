import { createRouter } from "@/lib/create-app";

const router = createRouter();

router.get("/health", (c) => {
  return c.json({
    status: "ok",
  });
});

export default router;

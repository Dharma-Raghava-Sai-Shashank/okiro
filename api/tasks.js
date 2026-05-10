import { getTasksCollection } from "./_db.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  return new Promise((resolve, reject) => {
    let buf = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (buf += chunk));
    req.on("end", () => {
      try {
        resolve(buf ? JSON.parse(buf) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const col = await getTasksCollection();

    if (req.method === "OPTIONS") {
      res.statusCode = 200;
      res.end();
      return;
    }
    if (req.method === "GET") {
      const docs = await col
        .find({})
        .sort({ scope: 1, bucketKey: 1, order: 1 })
        .toArray();
      const tasks = docs.map((d) => ({ ...d, _id: d._id.toString() }));
      return send(res, 200, { tasks });
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const now = new Date();
      const doc = {
        title: String(body.title || "").slice(0, 200) || "Untitled",
        color: body.color || "#ede9fe",
        scope: body.scope === "day" ? "day" : "inbox",
        bucketKey: body.scope === "day" ? String(body.bucketKey || "") : "",
        order: typeof body.order === "number" ? body.order : Date.now(),
        done: !!body.done,
        subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
        progress: typeof body.progress === "number" ? body.progress : 0,
        notes: typeof body.notes === "string" ? body.notes : "",
        createdAt: now,
        updatedAt: now,
      };
      const result = await col.insertOne(doc);
      return send(res, 201, {
        task: { ...doc, _id: result.insertedId.toString() },
      });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("[api/tasks]", err);
    return send(res, 500, { error: err.message || "Internal error" });
  }
}

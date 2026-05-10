import { ObjectId } from "mongodb";
import { getTasksCollection } from "../_db.js";

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

const ALLOWED_FIELDS = new Set([
  "title",
  "color",
  "scope",
  "bucketKey",
  "order",
  "done",
  "subtasks",
  "progress",
  "notes",
]);

function sanitize(body) {
  const update = {};
  for (const [k, v] of Object.entries(body)) {
    if (!ALLOWED_FIELDS.has(k)) continue;
    if (k === "scope") {
      update[k] = v === "day" ? "day" : "inbox";
    } else if (k === "subtasks" && Array.isArray(v)) {
      update[k] = v.map((s) => ({
        id: String(s.id || ""),
        title: String(s.title || ""),
        done: !!s.done,
        date: String(s.date || ""),
      }));
    } else {
      update[k] = v;
    }
  }
  return update;
}

export default async function handler(req, res) {
  try {
    const id = req.query?.id || req.url.split("/").pop();
    let _id;
    try {
      _id = new ObjectId(id);
    } catch {
      return send(res, 400, { error: "Invalid id" });
    }

    const col = await getTasksCollection();

    if (req.method === "OPTIONS") {
      return send(res, 204, {});
    }
    if (req.method === "PATCH") {
      const body = await readJson(req);
      const update = sanitize(body);
      if (Object.keys(update).length === 0) {
        return send(res, 400, { error: "No valid fields to update" });
      }
      update.updatedAt = new Date();
      const result = await col.findOneAndUpdate(
        { _id },
        { $set: update },
        { returnDocument: "after" },
      );
      const doc = result.value || result;
      if (!doc) return send(res, 404, { error: "Not found" });
      return send(res, 200, { task: { ...doc, _id: doc._id.toString() } });
    }

    if (req.method === "DELETE") {
      const r = await col.deleteOne({ _id });
      if (r.deletedCount === 0) return send(res, 404, { error: "Not found" });
      return send(res, 200, { ok: true });
    }

    res.setHeader("Allow", "PATCH, DELETE");
    return send(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("[api/tasks/[id]]", err);
    return send(res, 500, { error: err.message || "Internal error" });
  }
}

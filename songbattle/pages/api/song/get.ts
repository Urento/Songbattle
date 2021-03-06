import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDb } from "../../../utils/connectToDb";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method.toLowerCase() === "get") {
    const id = req.body.id;

    if (typeof id !== "string") {
      res.status(400).send({
        error: true,
        message: "Bad Input",
      });
      return;
    }
    const db = await connectToDb();

    db.query("SELECT * FROM songs WHERE id=$1", [id])
      .then((r) => res.send({ info: r.rows }))
      .catch((err) =>
        res.status(400).send({ added: false, message: err.stack })
      );
  }
};

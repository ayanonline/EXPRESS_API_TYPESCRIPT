import { connect } from "mongoose";

export default async function mongooseConnect(): Promise<void> {
  const mongoDBURI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

  await connect(mongoDBURI);
}

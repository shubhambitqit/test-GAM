import { FirebaseService } from "~/server/service/firebaseService";
import {MESSAGES} from "~/engine/dto/Constants";

export default defineEventHandler(async (event) => {
  try {
    const shop = event.node.req.shop;
    const shopName = removeHttps(shop);
    const { data } = await readBody(event);

    const firebaseService = new FirebaseService();

    // Insert the data into the document
    await firebaseService.updateDataInShopDocument(shopName, data);

    // Send a response with status 201 and a success message
    event.node.res.statusCode = 201;
    event.node.res.end(JSON.stringify({ message: MESSAGES.SUCCESS }));
  } catch (error) {
    console.error("Error inserting data:", error);
    event.node.res.statusCode = 500;
    event.node.res.end(JSON.stringify({ error: MESSAGES.ERROR }));
  }
});

function removeHttps(url: string) {
  return new URL(url).host; //url.replace(/^https?:\/\//, "");
}

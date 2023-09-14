import { FirebaseService } from "~/server/service/firebaseService";
import {MESSAGES} from "~/engine/dto/Constants";


export default defineEventHandler(async (event) => {
  try {
    const shop = event.node.req.shop;
    const shopName = removeHttps(shop);

    const firebaseService = new FirebaseService();

    // Insert the data into the document
    const shopDetails = await firebaseService.getShop(shopName);

    // Send a response with status 201 and a success message
    event.node.res.statusCode = 200;
    event.node.res.end(JSON.stringify(shopDetails));
  } catch (error) {
    event.node.res.statusCode = 500;
    event.node.res.end(JSON.stringify({ error: MESSAGES.ERROR }));
  }
});

function removeHttps(url: string) {
  return new URL(url).host; //url.replace(/^https?:\/\//, "");
}

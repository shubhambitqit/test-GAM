import admin from "firebase-admin";
import {MixpanelConfig} from "~/server/config/mixpanel";
import {customAlphabet} from "nanoid";
import {NANOIDCHARACTERS} from "~/engine/dto/Constants";


const config = useRuntimeConfig();
const firebaseConfigJson = JSON.parse(Buffer.from(config.firebaseSecret, 'base64').toString());

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfigJson)
})

export class FirebaseService {
    private db: FirebaseFirestore.Firestore;

    constructor() {
        this.db = admin.firestore();
    }

    async isShopUrlPresent(shopId: string): Promise<boolean> {
        const querySnapshot = await this.db
            .collection(config.collectionName)
            .where("shop_store_url", "==", shopId)
            .where("deleted_at", "==", null)
            .get();

        return !querySnapshot.empty;
    }

    async getShop(shopUrl: string): Promise<any> {
        const res = await this.db
            .collection(config.collectionName)
            .where("shop_store_url", "==", shopUrl)
            .where("deleted_at", "==", null)
            .get();

        return res.docs.length > 0 ? res.docs[0].data() : null;
    }

    async saveAccessTokenAndShopUrl(
        accessToken: string,
        shopUrl: string,
        shopifyId: string
    ): Promise<string> {
        const docId = customAlphabet(NANOIDCHARACTERS, 16)()

        console.log(docId)
        try {
            const shopDocRef = this.db.collection(config.collectionName).doc(docId);
            await shopDocRef.set({
                shop_store_url: shopUrl,
                shopify_token: accessToken,
                customer_id: docId,
                shopify_customer_id: shopifyId,
                deleted_at: null
            });

            return docId;
        } catch (e) {
            console.log(e)
        }

    }


    async updateDataInShopDocument(
        shopId: string,
        data: MixpanelConfig
    ): Promise<void> {
        const querySnapshot = await this.db
            .collection(config.collectionName)
            .where("shop_store_url", "==", shopId)
            .where("deleted_at", "==", null)
            .get();

        const docSnapshot = querySnapshot.docs[0];
        const shopDocRef = this.db
            .collection(config.collectionName)
            .doc(docSnapshot.id);
        await shopDocRef.set({mixpanel: data}, {merge: true});
    }

    async deleteDocument(
        shopId: string
    ): Promise<void> {
        const collectionRef = await this.db
            .collection(config.collectionName)

        const querySnapshot = await collectionRef
            .where("shop_store_url", "==", shopId)
            .where("deleted_at", "==", null)
            .get();

        const updates = querySnapshot.docs.map(async (doc) => {
            const docRef = this.db.collection(config.collectionName).doc(doc.id);
            await docRef.update({deleted_at: new Date()});
            console.log(`Updated deleted_at field for document with ID: ${doc.id}`);
        });

        await Promise.all(updates);


    }

    async saveConnectors(shopifyId: string, customerId: string, connectorId: string, schema: string): Promise<string> {

        const shopDocRef = await this.db.collection(config.collectionName)
            .where("customer_id", "==", customerId)
            .where("deleted_at", "==", null)
            .get()

        const shopSnapshot = shopDocRef.docs[0];

        const shopDoc = this.db
            .collection(config.collectionName)
            .doc(shopSnapshot.id);

        await shopDoc.set({
            fivetran_id: connectorId
        }, {merge: true});

        const collectionDocRef = this.db.collection(config.connectorCollectionName).doc(connectorId);
        await collectionDocRef.set({
            customer_id: customerId,
            shopify_customer_id: shopifyId,
            fivetran_connector_id: connectorId,
            is_deleted: false,
            schema_name: schema
        });

    }

    async deleteConnector(connectorId: string): Promise<string> {
        // const docName = "test_doc"
        const connectorRef = this.db.collection(config.connectorCollectionName).doc(connectorId)
        await connectorRef.update({is_deleted: true});

    }


    async getConnector(customerId: string): Promise<any> {
        const res = await this.db
            .collection(config.connectorCollectionName)
            .where("customer_id", "==", customerId)
            .where("is_deleted", "==", false)
            .get();

        return res.docs.length > 0 ? res.docs[0].data() : null;
    }

}






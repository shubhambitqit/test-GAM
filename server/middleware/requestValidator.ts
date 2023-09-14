import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    if (process.server) {

        try {
            const config = useRuntimeConfig();


            console.log(`ClientId:`, config.clientId)
            console.log(`ClientSecret:`, config.clientSecret)
            console.log(`ClientIdpublic:`, config.public.clientId)
            console.log(`firebase:`, config.firebaseSecret)
            console.log(`fivetran:`, config.fivetranKey)
            console.log(`fietransecret:`, config.fivetranSecret)
            console.log(`base Url:`, config.public.baseUrl)

            const headers = await getRequestHeaders(event);
            const auth = headers["authorization"];

            if (!auth) return;

            const token = auth.split("Bearer")[1].trim();

            if (!token) {
                console.error("Session token missing");
                event.node.res.writeHead(401, {"Content-Type": "application/json"});
                event.node.res.end(JSON.stringify({error: "Unauthorized"}));
                return;
            }

            const decodedToken = jwt.verify(token, config.clientSecret, {
                algorithms: ["HS256"], // Specify the expected algorithm
            });

            if (decodedToken?.exp && Date.now() / 1000 < decodedToken?.exp) {

                const shopUrl = decodedToken.dest;

                event.node.req.shop = shopUrl;

                // Proceed with the next middleware or route handler
                return;
            } else {
                console.error("Invalid or expired session token");
                event.node.res.writeHead(401, {"Content-Type": "application/json"});
                event.node.res.end(JSON.stringify({error: "Unauthorized"}));
            }
        } catch (error) {
            console.error("Error verifying session token:", error);
            event.node.res.writeHead(500, {"Content-Type": "application/json"});
            event.node.res.end(JSON.stringify({error: "Internal Server Error"}));
        }
    }
});


import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import { beforeUserCreated } from "firebase-functions/v2/identity";
import { onRequest } from "firebase-functions/v2/https/onRequest";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { z } from "zod";

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Callable function to invite a user
const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "dispatcher", "tech", "accountant"]),
  companyId: z.string(),
});

export const inviteUser = onCall({ enforceAppCheck: true }, async (request) => {
  if (request.auth?.token.role !== "owner" && request.auth?.token.role !== "admin") {
    throw new onCall.HttpsError("permission-denied", "You must be an owner or admin to invite users.");
  }

  const data = inviteUserSchema.parse(request.data);

  const invite = {
    ...data,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  await db.collection("invites").add(invite);
  return { success: true, message: `Invite sent to ${data.email}` };
});

// Auth trigger when a new user is created
export const oncreateuser = beforeUserCreated(async (event) => {
  const { email } = event.data;

  if (!email) {
    throw new onCall.HttpsError("invalid-argument", "Email is required.");
  }

  const inviteQuery = await db.collection("invites")
    .where("email", "==", email)
    .where("status", "==", "pending")
    .where("expiresAt", ">", admin.firestore.Timestamp.now())
    .limit(1)
    .get();

  if (inviteQuery.empty) {
    // No valid invite found, could be a new company owner or an invalid signup.
    // For this example, we'll allow it and they can create a company later.
    return {};
  }

  const inviteDoc = inviteQuery.docs[0];
  const inviteData = inviteDoc.data();

  // Update the invite to 'accepted'
  await inviteDoc.ref.update({ status: "accepted" });

  // Set custom claims
  return {
    customClaims: {
      companyId: inviteData.companyId,
      role: inviteData.role,
    },
  };
});

// Stripe webhook for payment intents
export const stripewebhook = onRequest(async (req, res) => {
    logger.info("Stripe webhook received.");
    // Placeholder for Stripe webhook logic
    res.status(200).send("Webhook received");
});


// Function to generate a PDF invoice (placeholder)
export const generateinvoicepdf = onCall(async (request) => {
    logger.info("Generating invoice PDF for:", request.data.invoiceId);
    // Placeholder for PDF generation
    return { fileUrl: "gs://your-bucket/invoices/placeholder.pdf" };
});

// Scheduled function to compute metrics
export const computemetrics = onSchedule("every 24 hours", async () => {
    logger.info("Running scheduled job to compute metrics.");
    // Placeholder for metrics computation
    return null;
});

// When a user record is created, create a corresponding doc in /users
export const createuserprofile = auth.user().onCreate(async (user) => {
    const { uid, email, customClaims } = user;
    const companyId = customClaims?.companyId;
    const role = customClaims?.role || "owner"; // Default to owner if no claims (first user)

    if (!companyId && role === 'owner') {
        // This is a new company owner. A company document should be created client-side.
        // We will just create the user profile here.
         await db.collection("users").doc(uid).set({
            email,
            role,
            status: "active",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
    }

    if (!companyId) {
        logger.error("User created without a companyId in claims.", { uid });
        return;
    }

    await db.collection("companies").doc(companyId).collection("users").doc(uid).set({
        email,
        role,
        status: "active",
        invitedAt: admin.firestore.FieldValue.serverTimestamp(), // This assumes they were just invited/created
    });
});

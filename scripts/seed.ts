
// Use with `npm run seed`
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// --- Configuration ---
const companyId = 'demo-co';
const ownerEmail = 'owner@demo.com';
const dispatcherEmail = 'dispatcher@demo.com';
const techEmail = 'tech@demo.com';
const password = 'password';

// --- Initialize Firebase Admin SDK ---
// This will work automatically with emulators if FIRESTORE_EMULATOR_HOST is set
if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.error("FIRESTORE_EMULATOR_HOST env var not set. Are you running this outside the emulator?");
    process.exit(1);
}

try {
  admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || 'apex-contractor-suite',
  });
} catch (e) {
  // Ignore "already initialized" error
}


const db = getFirestore();
const auth = getAuth();
console.log("Firebase Admin SDK initialized.");


async function main() {
    console.log("Starting database seed...");

    // --- Clean old data ---
    console.log(`Deleting data for company: ${companyId}...`);
    const collections = ['users', 'customers', 'jobs', 'invoices', 'payments', 'settings'];
    for (const collection of collections) {
        const path = `companies/${companyId}/${collection}`;
        await db.collection(path).limit(100).get().then(snapshot => {
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            return batch.commit();
        });
        console.log(`  - Cleared ${path}`);
    }
     await db.collection('invites').limit(100).get().then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
    });
    console.log(`  - Cleared invites`);


    // --- Create Users ---
    console.log("Creating users...");
    const users = [
        { email: ownerEmail, role: 'owner' },
        { email: dispatcherEmail, role: 'dispatcher' },
        { email: techEmail, role: 'tech' },
    ];

    const userRecords: { [key: string]: admin.auth.UserRecord } = {};

    for (const user of users) {
        try {
            const existingUser = await auth.getUserByEmail(user.email);
            console.log(`  - Deleting existing user: ${user.email}`);
            await auth.deleteUser(existingUser.uid);
        } catch (error: any) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }

        const userRecord = await auth.createUser({
            email: user.email,
            password: password,
            emailVerified: true,
            disabled: false,
        });

        await auth.setCustomUserClaims(userRecord.uid, { companyId, role: user.role });
        userRecords[user.role] = userRecord;

        await db.collection(`companies/${companyId}/users`).doc(userRecord.uid).set({
            email: user.email,
            role: user.role,
            status: 'active',
            invitedAt: Timestamp.now(),
        });
        console.log(`  - Created ${user.role}: ${user.email}`);
    }


    // --- Create Customers ---
    console.log("Creating customers...");
    const customerData = [
        { name: 'Olivia Martin', phones: ['202-555-0101'], emails: ['olivia.martin@example.com'], address: '123 Maple St, Springfield, IL', notes: '', tags: ['residential'] },
        { name: 'Jackson Lee', phones: ['202-555-0102'], emails: ['jackson.lee@example.com'], address: '456 Oak Ave, Springfield, IL', notes: 'Has a friendly dog.', tags: ['residential', 'repeat'] },
        { name: 'Isabella Nguyen', phones: ['202-555-0103'], emails: ['isabella.nguyen@example.com'], address: '789 Pine Ln, Springfield, IL', notes: 'Gate code #1234', tags: ['commercial'] },
    ];

    const customerRefs: admin.firestore.DocumentReference[] = [];
    for (const cust of customerData) {
        const ref = await db.collection(`companies/${companyId}/customers`).add({
            ...cust,
            createdAt: Timestamp.now(),
        });
        customerRefs.push(ref);
        console.log(`  - Created customer: ${cust.name}`);
    }

    // --- Create Jobs ---
    console.log("Creating jobs...");
    const jobData = [
        { title: 'Kitchen Remodel', customerRef: customerRefs[0], status: 'scheduled', scheduledAt: Timestamp.fromMillis(Date.now() + 2 * 24 * 60 * 60 * 1000), durationMin: 480, assignedTechIds: [userRecords['tech'].uid], subtotal: 2400, tax: 200, total: 2600 },
        { title: 'Bathroom Plumbing', customerRef: customerRefs[1], status: 'scheduled', scheduledAt: Timestamp.fromMillis(Date.now() + 4 * 24 * 60 * 60 * 1000), durationMin: 180, assignedTechIds: [userRecords['tech'].uid], subtotal: 450, tax: 35, total: 485 },
        { title: 'Full House Repaint', customerRef: customerRefs[2], status: 'invoiced', scheduledAt: Timestamp.fromMillis(Date.now() - 5 * 24 * 60 * 60 * 1000), durationMin: 1440, assignedTechIds: [userRecords['tech'].uid], subtotal: 8000, tax: 650, total: 8650 },
    ];
    
    const jobRefs: admin.firestore.DocumentReference[] = [];
    for (const job of jobData) {
        const ref = await db.collection(`companies/${companyId}/jobs`).add({
            ...job,
            lineItems: [{ desc: 'Labor', qty: 8, unitPrice: 300 }],
            materials: [],
            photos: [],
            notes: '',
            createdAt: Timestamp.now(),
        });
        jobRefs.push(ref);
        console.log(`  - Created job: ${job.title}`);
    }

    // --- Create Invoice and Payment ---
    console.log("Creating invoice and payment...");
    const invoiceRef = await db.collection(`companies/${companyId}/invoices`).add({
        jobRef: jobRefs[2],
        customerRef: customerRefs[2],
        subtotal: 8000,
        tax: 650,
        total: 8650,
        dueDate: Timestamp.fromMillis(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'sent',
        createdAt: Timestamp.now(),
    });
    console.log(`  - Created invoice for job: ${jobData[2].title}`);

    await db.collection(`companies/${companyId}/payments`).add({
        invoiceRef: invoiceRef,
        amount: 8650,
        method: 'card',
        status: 'succeeded',
        createdAt: Timestamp.now(),
    });
    console.log(`  - Created payment for invoice.`);

    // --- Compute Metrics ---
    console.log("Computing initial metrics...");
    await db.collection(`companies/${companyId}/settings`).doc('metrics').set({
        revenueLast7d: 8650,
        unpaidInvoices: 0,
        activeJobs: 2,
        updatedAt: Timestamp.now()
    });
    console.log("  - Metrics updated.");

    console.log("\nDatabase seed complete! 🎉");
    console.log("Log in with the following users:");
    console.log("  - owner@demo.com (password: password)");
    console.log("  - dispatcher@demo.com (password: password)");
    console.log("  - tech@demo.com (password: password)");
}

main().catch(err => {
    console.error("Error seeding database:", err);
    process.exit(1);
});

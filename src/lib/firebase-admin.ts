
// src/lib/firebase-admin.ts
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin using the modular API so the same app instance
// is shared across all admin subpackages. Importing from "firebase-admin" and
// "firebase-admin/*" mixed was causing the default app to be undefined, which
// resulted in runtime errors like "Cannot read properties of undefined
// (reading 'INTERNAL')" when calling getFirestore.
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export { db, Timestamp };


export type Metric = {
    revenueLast7d: number;
    unpaidInvoices: number;
    activeJobs: number;
    updatedAt: Timestamp;
}

export type Job = {
    id: string;
    title: string;
    customerName: string; // Denormalized for easy display
    scheduledAt: Date;
    status: string;
}

export type Activity = {
    id: string;
    description: string;
    createdAt: Date;
    type: 'payment' | 'job';
}

export async function getCompanyMetrics(companyId: string): Promise<Metric> {
    const docRef = db.collection(`companies/${companyId}/settings`).doc('metrics');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        // Return default/zero metrics if none exist
        return {
            revenueLast7d: 0,
            unpaidInvoices: 0,
            activeJobs: 0,
            updatedAt: Timestamp.now()
        };
    }
    
    const data = docSnap.data();
    return {
        ...data as Metric,
        updatedAt: (data?.updatedAt as Timestamp).toDate()
    };
}


export async function getUpcomingJobs(companyId: string): Promise<Job[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const jobsRef = db.collection(`companies/${companyId}/jobs`);
    const q = jobsRef
        .where('status', '==', 'scheduled')
        .where('scheduledAt', '<=', Timestamp.fromDate(sevenDaysFromNow))
        .orderBy('scheduledAt', 'asc')
        .limit(5);

    const snapshot = await q.get();
    if (snapshot.empty) {
        return [];
    }
    
    const jobs: Job[] = [];
    for(const doc of snapshot.docs) {
        const jobData = doc.data();
        let customerName = 'Unknown Customer';
        if (jobData.customerRef) {
            const customerSnap = await jobData.customerRef.get();
            if(customerSnap.exists) {
                customerName = customerSnap.data().name;
            }
        }

        jobs.push({
            id: doc.id,
            title: jobData.title,
            customerName: customerName,
            scheduledAt: (jobData.scheduledAt as Timestamp).toDate(),
            status: jobData.status
        });
    }

    return jobs;
}

export async function getRecentActivity(companyId: string): Promise<Activity[]> {
    const paymentsRef = db.collection(`companies/${companyId}/payments`);
    const paymentsQuery = paymentsRef
        .where('status', '==', 'succeeded')
        .orderBy('createdAt', 'desc')
        .limit(5);

    const paymentsSnap = await paymentsQuery.get();
    const activities: Activity[] = [];

    paymentsSnap.forEach(doc => {
        const data = doc.data();
        activities.push({
            id: doc.id,
            description: `Payment of $${(data.amount).toLocaleString()} received.`,
            createdAt: (data.createdAt as Timestamp).toDate(),
            type: 'job'
        });
    });

    // Note: In a real app, you might want to merge job status changes too.
    // This is simplified for the example.

    return activities.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
}

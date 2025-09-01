import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import path from 'path';
import { readFileSync } from 'fs';

// 🔐 Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(process.cwd(), 'app/plant.json');

  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plantpal-5600a.firebaseio.com',
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

export async function GET() {
  try {
    const plantsSnapshot = await db.collection("plants").get();
    const tokensSnapshot = await db.collection("tokens").get();

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    const today = new Date();

    const plantsToNotify = [];

    plantsSnapshot.forEach(doc => {
      const plant = doc.data();
      console.log('abe ae lvde',plant.formdata.date)
      const lastWatered = new Date(plant.formdata.date); // this works if plant.date is a string like "2025-07-31"
      // Firestore Timestamp
      const freqDays = Number(plant.formdata.freq);

      const nextWaterDate = new Date(lastWatered);
      nextWaterDate.setDate(lastWatered.getDate() + freqDays);

      if (nextWaterDate <= today) {
        plantsToNotify.push(plant.formdata.name);
      }
    });

    if (plantsToNotify.length === 0) {
      return NextResponse.json({ message: "No plants need watering today." });
    }

    const message = {
      notification: {
        title: "🌱 Plant Watering Reminder!",
        body: `Time to water: ${plantsToNotify.join(", ")}`,
      },
      tokens: tokens,
    };
    const response = await admin.messaging().sendEachForMulticast(message);




    return NextResponse.json({ successCount: response.successCount });
  } catch (error) {
    console.error("🔥 Reminder Error:", error);
    return NextResponse.json({ error: "Error sending reminders" }, { status: 500 });
  }
} 
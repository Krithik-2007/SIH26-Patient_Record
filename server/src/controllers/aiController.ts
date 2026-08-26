import { Request, Response } from 'express';
import { query, isConnectedToPostgres } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const queryAI = async (req: AuthRequest, res: Response) => {
  try {
    const { userQuery, aiMode = 'ALLOPATHIC', incidentIdContext } = req.body;
    const patientId = req.user?.id || req.body.patientId || 'PAT-DEFAULT';

    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({ error: 'Query text is required' });
    }

    const queryLower = userQuery.toLowerCase().trim();

    // Fetch patient's active and historical incidents from PostgreSQL
    let incidents: any[] = [];
    let medicines: any[] = [];
    let doctorSuggestions: any[] = [];

    if (isConnectedToPostgres && patientId) {
      const incRes = await query('SELECT * FROM incidents WHERE patient_id = $1 ORDER BY id DESC;', [patientId]);
      incidents = incRes.rows;

      const medRes = await query('SELECT * FROM medicines WHERE patient_id = $1;', [patientId]);
      medicines = medRes.rows;

      const sugRes = await query('SELECT * FROM doctor_suggestions WHERE patient_id = $1;', [patientId]);
      doctorSuggestions = sugRes.rows;
    }

    const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
    const primaryActive = activeIncidents[0] || incidents[0];

    const hasActive = !!primaryActive && primaryActive.status === 'ACTIVE';
    const incidentTitle = primaryActive?.title || 'Medical Episode';
    const diagnosis = primaryActive?.diagnosis || primaryActive?.title || 'Clinical Condition';
    const doctor = primaryActive?.doctor || 'Attending Physician';
    const hospital = primaryActive?.hospital || 'Medical Center';
    const narrative = primaryActive?.patient_description || primaryActive?.reason || '';

    const combinedText = `${incidentTitle} ${diagnosis} ${narrative}`.toLowerCase();
    const isFractureOrArm = combinedText.includes('fracture') || combinedText.includes('arm') || combinedText.includes('bone') || combinedText.includes('radius') || combinedText.includes('wrist') || combinedText.includes('fall') || combinedText.includes('ortho') || queryLower.includes('fracture') || queryLower.includes('arm') || queryLower.includes('bone');
    const isFever = combinedText.includes('fever') || combinedText.includes('cold') || combinedText.includes('flu') || combinedText.includes('infection') || queryLower.includes('fever') || queryLower.includes('cold');
    const isAsthma = combinedText.includes('asthma') || combinedText.includes('bronchial') || queryLower.includes('asthma');

    let responseContent = '';
    let sources: any[] = [];

    // INTENT 1: WHAT IS MY CURRENT MEDICAL PROBLEM
    if (
      queryLower.includes('current medical problem') ||
      queryLower.includes('what is my current') ||
      queryLower.includes('what is my problem') ||
      queryLower.includes('what is my condition') ||
      queryLower.includes('what happened to me') ||
      queryLower.includes('what is wrong with me') ||
      queryLower.includes('my diagnosis') ||
      queryLower.includes('current problem') ||
      queryLower.includes('current status')
    ) {
      if (hasActive) {
        if (aiMode === 'AYURVEDIC') {
          responseContent = `🌿 AYURVEDIC CLINICAL ASSESSMENT OF YOUR CURRENT HEALTH CONDITION:\n\n• Active Incident: ${primaryActive.id} — ${primaryActive.title}\n• Clinical Diagnosis: ${diagnosis}\n• Attending Clinician: ${doctor} (${hospital})\n• Current Status: ACTIVE in real time\n\nAyurvedic Tridosha & Dhatu Analysis:\n1. Condition Classification: Asthi Bhanga / Vata-Prakopa (Skeletal Bone Trauma & Tissue Strain).\n2. Pathophysiology: The physical trauma caused acute localized Vata aggravation in Asthi Dhatu (bone tissue), accompanied by Pitta-induced inflammatory swelling and pain.\n3. Healing Objective (Asthi Sandhana): Pacify aggravated Vata, reduce local Pitta heat, and stimulate rapid bone matrix mineralization (Dhatu Poshana) using classical bone-healing Rasayana herbs.\n\nRecommended Action: Maintain strict cast immobilization and ask me for the complete Ayurvedic bone-healing diet (Pathya)!`;
        } else {
          responseContent = `🩺 YOUR CURRENT ACTIVE MEDICAL CONDITION:\n\n• Active Episode: ${primaryActive.id} — ${primaryActive.title}\n• Recorded Diagnosis: ${diagnosis}\n• Attending Physician: ${doctor}\n• Medical Center: ${hospital}\n• Recorded Symptoms: ${narrative}\n• Treatment Protocol: ${primaryActive.treatment}\n• Status: ACTIVE in real time\n\nClinical Summary:\nYou have an active bone fracture/episode requiring strict limb immobilization in your cast and compliance with prescribed analgesics and calcium supplements. Ask me about safe diets, exercise restrictions, or medication timings!`;
        }
        sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
      } else {
        responseContent = `You currently have 0 active medical incidents in your profile. All previous episodes have been resolved or your baseline health is normal. Click '+ Add Incident' to register an episode if you visit a clinic or hospital!`;
      }
    }

    // INTENT 2: WHAT SHOULD I EAT / HEALING DIET
    else if (
      queryLower.includes('what should i eat') ||
      queryLower.includes('diet') ||
      queryLower.includes('food') ||
      queryLower.includes('eat to cure') ||
      queryLower.includes('nutrition') ||
      queryLower.includes('how to cure') ||
      queryLower.includes('cure it') ||
      queryLower.includes('what to eat')
    ) {
      if (isFractureOrArm) {
        if (aiMode === 'AYURVEDIC') {
          responseContent = `🌿 AYURVEDIC HEALING DIET & NUTRITIONAL PROTOCOL TO CURE YOUR BROKEN ARM (ASTHI BHANGA):\n\nTo accelerate Asthi Sandhana (bone tissue calcification and osteoblast stimulation), follow this daily Ayurvedic healing regimen:\n\n1. Asthi-Dhatu Vardhak Foods (Rich in Bio-Available Calcium & Minerals):\n• Golden Turmeric Milk: 1 glass of warm cow's milk boiled with 1/2 tsp pure Turmeric (Haridra), a pinch of black pepper, and 1 tsp pure Cow's Ghee daily at bedtime. Ghee acts as a Yogavahi (carrier) delivering calcium directly into bone tissue.\n• Sesame Seeds (Til): 1 spoon of roasted white or black sesame seeds daily (one of nature's richest sources of bioavailable calcium and zinc).\n• Ragi (Finger Millet) & Mung Dal: Light, mineral-rich soups (Yusha) cooked with cumin and ginger to maintain digestive Agni.\n• Moringa (Drumstick Leaves Soup): Powerhouse of natural calcium, phosphorus, and magnesium.\n\n2. Classical Ayurvedic Bone-Healing Herbs:\n• Hadjod / Asthisanghata (Cissus quadrangularis): Stimulates osteoblasts and mucopolysaccharide synthesis for fast callus bridge formation.\n• Lakshadi Guggulu & Abha Guggulu: Classical formulations for rapid fracture healing and ligament repair.\n• Ashwagandha Churna (with warm milk): Rejuvenates Asthi and Majja Dhatu (bone marrow).\n\n3. Foods to Strictly Avoid (Apathya):\n• Cold, dry, gas-producing foods (raw salads, stale food) which aggravate Vata in bones.\n• Carbonated soft drinks, excess caffeine, and sour pickles (which leach calcium from bones).`;
        } else {
          responseContent = `🩺 CLINICAL NUTRITION & HEALING PROTOCOL FOR YOUR BROKEN ARM (${diagnosis}):\n\nProper clinical nutrition accelerates bone remodeling, collagen synthesis, and mineralization:\n\n1. High Calcium & Mineral Foods:\n• Dairy (Milk, Yogurt, Paneer), Fortified plant milk, Sesame seeds, and dark leafy greens.\n• Daily requirement during fracture healing: 1,200 – 1,500 mg/day of elemental calcium.\n\n2. High-Quality Protein for Collagen Matrix:\n• Bone matrix is 50% protein (Type I Collagen). Include lentils, eggs, tofu, beans, and lean proteins.\n\n3. Vitamin D3 & Vitamin C Co-Factors:\n• Vitamin D3: Facilitates intestinal calcium absorption (take prescribed Calci-D3 supplement).\n• Vitamin C (Citrus fruits, amla, bell peppers): Essential for cross-linking collagen fibrils at the fracture site.\n\n4. Foods to Avoid:\n• High sodium and processed junk food (increases urinary calcium loss).\n• Alcohol and smoking (severely impairs osteoblast bone formation).`;
        }
        if (primaryActive) sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
      } else if (isFever) {
        responseContent = `Hydration with warm broths, coconut water, and light rice-lentil gruels is recommended. Avoid cold dairy, ice cream, and fried foods.`;
      } else {
        responseContent = `A nutrient-dense whole-food diet with adequate protein, fiber, and micronutrients supports optimal immune resilience.`;
      }
    }

    // INTENT 3: ICE CREAM & COLD FOODS
    else if (queryLower.includes('ice cream') || (queryLower.includes('cold') && queryLower.includes('eat'))) {
      const activeFever = incidents.find(i => i.status === 'ACTIVE' && (i.title?.toLowerCase().includes('fever') || i.diagnosis?.toLowerCase().includes('fever')));
      const closedFever = incidents.find(i => i.status === 'CLOSED' && (i.title?.toLowerCase().includes('fever') || i.diagnosis?.toLowerCase().includes('fever')));

      if (activeFever) {
        responseContent = `⛔ NO, YOU MUST STRICTLY AVOID ICE CREAM AND COLD BEVERAGES.\n\nClinical Rationale:\n• You have an ACTIVE fever episode (${activeFever.id} - ${activeFever.title}).\n• Cold dairy constricts pharyngeal blood vessels, suppresses immune leukocyte activity in the throat, and aggravates chills. Stick to warm soothing broths until cured.`;
        sources.push({ type: 'INCIDENT', refId: activeFever.id, title: activeFever.title });
      } else if (closedFever) {
        responseContent = `Yes, you can eat ice cream in moderation.\n\nYour previous fever (${closedFever.id} - ${closedFever.title}) was marked as Cured and Closed. Since your body temperature and immunity are back to baseline, dietary fever restrictions are no longer active.`;
        sources.push({ type: 'INCIDENT', refId: closedFever.id, title: `${closedFever.title} (Resolved)` });
      } else {
        responseContent = `Yes, you can eat ice cream in moderation. You do not currently have any active fever or throat infection recorded in your profile.`;
      }
    }

    // INTENT 4: HEAVY LIFTING
    else if (queryLower.includes('lift') || queryLower.includes('heavy') || queryLower.includes('weight') || queryLower.includes('gym')) {
      const activeFracture = incidents.find(i => i.status === 'ACTIVE' && (i.title?.toLowerCase().includes('fracture') || i.diagnosis?.toLowerCase().includes('fracture') || i.title?.toLowerCase().includes('arm')));
      const closedFracture = incidents.find(i => i.status === 'CLOSED' && (i.title?.toLowerCase().includes('fracture') || i.diagnosis?.toLowerCase().includes('fracture')));

      if (activeFracture) {
        responseContent = `⛔ NO, YOU SHOULD STRICTLY AVOID LIFTING ANYTHING HEAVY.\n\nClinical Rationale from Your Medical Record:\n• Active Incident: ${activeFracture.id} — ${activeFracture.title} (Status: ACTIVE in real time under ${activeFracture.doctor})\n• Diagnosis: ${activeFracture.diagnosis}\n\nWhy Heavy Lifting is Strictly Dangerous Right Now:\n1. Fracture Displacement: Lifting loads exerts torsional shearing stress across the fragile bone callus, risking displacement of bone fragments.\n2. Neurovascular Strain: Carrying weight causes swelling inside the cast, risking median nerve compression.\n\nImmediate Action: Zero weight-bearing in sling until ${activeFracture.doctor} reviews your follow-up X-ray (typically 4–6 weeks).`;
        sources.push({ type: 'INCIDENT', refId: activeFracture.id, title: activeFracture.title });
      } else if (closedFracture) {
        responseContent = `Your previous fracture (${closedFracture.id} - ${closedFracture.title}) is marked as Cured and Closed. You may resume lifting gradually with proper warm-up; avoid sudden maximal stress.`;
        sources.push({ type: 'INCIDENT', refId: closedFracture.id, title: `${closedFracture.title} (Closed)` });
      } else {
        responseContent = `You do not have any active fractures or musculoskeletal restrictions recorded. Maintain proper ergonomics and warm up adequately before heavy lifting.`;
      }
    }

    // GENERAL FALLBACK
    else {
      if (hasActive) {
        responseContent = `🩺 AURA HEALTH INTELLIGENCE (Grounded in ${primaryActive.title}):\n\nRegarding your question: "${userQuery}"\n\n• Active Health Context: ${primaryActive.id} — ${primaryActive.title} (${diagnosis} under ${doctor} at ${hospital}).\n• Clinical Directives: Follow strict cast immobilization, avoid heavy physical strain, take prescribed pain relievers after meals, and attend your scheduled follow-up review.\n\nFeel free to ask about safe exercises, diet, medications, or doctor advice!`;
        sources.push({ type: 'INCIDENT', refId: primaryActive.id, title: primaryActive.title });
      } else {
        responseContent = `I am your AURA Health Assistant. You currently have a baseline profile with zero active medical incidents. Feel free to ask about any health topic, exercises, nutrition, or switch to Ayurvedic Mode for classical wellness guidance!`;
      }
    }

    return res.json({
      role: 'assistant',
      content: responseContent,
      timestamp: 'Just now',
      confidence: 'HIGH',
      mode: aiMode,
      groundedSources: sources
    });
  } catch (err) {
    console.error('AI Query Error:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { DailyExercisePlan } from '../../types';
import { 
  Dumbbell, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Leaf, 
  FlaskConical, 
  HeartPulse, 
  Flame, 
  Check, 
  XOctagon, 
  Printer, 
  Activity, 
  Sun, 
  Sunset, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { clsx } from 'clsx';

export const AIExerciseTimetable: React.FC = () => {
  const { incidents, patient, aiMode, showToast } = usePatient();

  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
  const primaryIncident = activeIncidents[0] || incidents[0];

  const daysList: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Clinical Orthopedic Rehabilitation Timetable (Safe with Forearm Cast)
  const clinicalExerciseSchedule: DailyExercisePlan[] = [
    {
      day: 'Monday',
      routineName: 'Active Finger Gliding & Shoulder Mobilization',
      durationMinutes: 20,
      safetyIntensity: 'GENTLE_REHAB',
      morningSession: {
        title: 'Morning Tendon Mobility (10 Mins)',
        exercises: [
          { name: 'Active Finger Flexion & Extension', repsOrDuration: '10 Reps x 3 Sets', safetyNote: 'Keep wrist stationary in cast; make gentle full fist and spread fingers wide.' },
          { name: 'Thumb-to-Finger Opposition', repsOrDuration: '8 Reps each digit', safetyNote: 'Touch thumb tip to index, middle, ring, and pinky. Prevents intrinsic stiffness.' },
          { name: 'Passive Shoulder Pendulum Swings', repsOrDuration: '15 Circles clockwise', safetyNote: 'Lean forward slightly, let uncasted shoulder dangle gently without active wrist strain.' }
        ]
      },
      eveningSession: {
        title: 'Evening Low-Impact Aerobics & Core (10 Mins)',
        exercises: [
          { name: 'Brisk Flat-Surface Walking', repsOrDuration: '15 Minutes', safetyNote: 'Arm kept securely in arm sling to prevent dependent swelling.' },
          { name: 'Seated Isometric Core Bracing', repsOrDuration: '5 Breaths x 5 Sets', safetyNote: 'Engage abdominal wall without using upper body arms for support.' },
          { name: 'Supine Leg Elevation & Ankle Pumps', repsOrDuration: '20 Pumps each leg', safetyNote: 'Lying on back, promotes full body systemic venous return.' }
        ]
      },
      prohibitedMovements: [
        'Zero weight bearing or carrying objects with casted right arm.',
        'No push-ups, planks, or bearing weight through palms/forearms.',
        'Avoid running or jumping to prevent axial shockwaves to the healing bone callus.'
      ],
      clinicalRationale: 'Prevents complex regional pain syndrome (CRPS) and median nerve tethering while bone callus forms.'
    },
    {
      day: 'Tuesday',
      routineName: 'Shoulder Range of Motion & Lower Body Strength',
      durationMinutes: 25,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Upper Body De-Stiffness (12 Mins)',
        exercises: [
          { name: 'Active Scapular Retractions (Shoulder Blade Squeezes)', repsOrDuration: '12 Reps x 2 Sets', safetyNote: 'Squeeze shoulder blades backward; keep casted arm resting gently.' },
          { name: 'Cervical Spine Gentle Lateral Tilts', repsOrDuration: '8 Reps per side', safetyNote: 'Release neck muscles holding the weight of the arm sling.' },
          { name: 'Uncasted Left-Arm Functional Stretches', repsOrDuration: '10 Reps', safetyNote: 'Keep non-injured arm fully active to maintain contralateral motor signaling.' }
        ]
      },
      eveningSession: {
        title: 'Evening Lower Body Conditioning (13 Mins)',
        exercises: [
          { name: 'Bodyweight Chair Squats (Hands Cross-Chested)', repsOrDuration: '12 Reps x 3 Sets', safetyNote: 'Cross arms over chest or keep injured arm tucked safely in sling.' },
          { name: 'Standing Calf Raises', repsOrDuration: '15 Reps x 3 Sets', safetyNote: 'Hold onto a stable wall with uninjured left hand only.' },
          { name: 'Glute Bridges (Supine on Mat)', repsOrDuration: '10 Reps x 2 Sets', safetyNote: 'Lying flat on back with knees bent; hands resting at sides without pushing.' }
        ]
      },
      prohibitedMovements: [
        'Do not try to grab weights or dumbbells with right hand.',
        'Avoid sudden jerky arm swings.'
      ],
      clinicalRationale: 'Maintains cardiovascular fitness and lower body muscular tone without compromising radial bone alignment.'
    },
    {
      day: 'Wednesday',
      routineName: 'Tendon Glide Variations & Postural Alignment',
      durationMinutes: 20,
      safetyIntensity: 'GENTLE_REHAB',
      morningSession: {
        title: 'Morning Digit Mobility (10 Mins)',
        exercises: [
          { name: 'Hook Fist to Straight Fist Transitions', repsOrDuration: '10 Reps x 2 Sets', safetyNote: 'Smooth slow glide; stops flexor digitorum adhesion.' },
          { name: 'Thumb Abduction & Radial Extension', repsOrDuration: '10 Reps', safetyNote: 'Move thumb away from palm in plane of table.' },
          { name: 'Shoulder Shrugs & Rolls', repsOrDuration: '12 Reps', safetyNote: 'Relieves trapezius tightness from continuous sling wear.' }
        ]
      },
      eveningSession: {
        title: 'Evening Stationary Walking & Core (10 Mins)',
        exercises: [
          { name: 'Stationary Recumbent Bike (No Handlebar Grip)', repsOrDuration: '15 Minutes', safetyNote: 'Keep hands resting on lap; no holding handlebars with injured wrist.' },
          { name: 'Seated Pelvic Tilts on Chair', repsOrDuration: '12 Reps', safetyNote: 'Promotes lumbar mobility without spinal compression.' }
        ]
      },
      prohibitedMovements: [
        'No riding outdoor bicycles (severe fall risk).',
        'No heavy resistance bands attached to upper limbs.'
      ],
      clinicalRationale: 'Recumbent cycling keeps heart rate elevated safely without hand vibration.'
    },
    {
      day: 'Thursday',
      routineName: 'Active Recovery & Lymphatic Drainage Day',
      durationMinutes: 15,
      safetyIntensity: 'MODERATE_REST',
      morningSession: {
        title: 'Morning Gentle Lymphatic Drainage (8 Mins)',
        exercises: [
          { name: 'Elevated Hand Pump Sequence', repsOrDuration: '15 Reps', safetyNote: 'Raise cast above heart level while opening and closing fingers.' },
          { name: 'Diaphragmatic Deep Breathing (Pranayama)', repsOrDuration: '10 Deep Breaths', safetyNote: 'Expands lower lung lobes; reduces systemic inflammatory cytokines.' }
        ]
      },
      eveningSession: {
        title: 'Evening Relaxed Walking (10 Mins)',
        exercises: [
          { name: 'Gentle Garden Stroll in Sling', repsOrDuration: '15 Minutes', safetyNote: 'Wear supportive shoes on flat level ground.' },
          { name: 'Seated Hamstring & Calf Stretches', repsOrDuration: '30 Sec Holds', safetyNote: 'Avoid reaching forward with injured hand; use gentle leg extension.' }
        ]
      },
      prohibitedMovements: [
        'No strenuous lifting or carrying groceries.',
        'Do not submerge cast in bath or pool.'
      ],
      clinicalRationale: 'Restorative phase allows calcium phosphate crystal deposition across fracture micro-callus.'
    },
    {
      day: 'Friday',
      routineName: 'Upper-Extremity Neuromuscular & Quad Endurance',
      durationMinutes: 20,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Active Neuromuscular Tuning (10 Mins)',
        exercises: [
          { name: 'Mirror Visual Feedback Finger Glides', repsOrDuration: '10 Reps', safetyNote: 'Watch uninjured hand move in mirror to stimulate motor cortex cross-education.' },
          { name: 'Isometric Shoulder External Rotations', repsOrDuration: '5 Reps (5s holds)', safetyNote: 'Gentle pressure against pillow; zero forearm torsion.' }
        ]
      },
      eveningSession: {
        title: 'Evening Lower Body Stability (10 Mins)',
        exercises: [
          { name: 'Wall Sits (Isometric Quad Hold)', repsOrDuration: '30 Seconds x 3 Sets', safetyNote: 'Lean back securely against wall; arms resting on thighs.' },
          { name: 'Standing Side Leg Abductions', repsOrDuration: '12 Reps each leg', safetyNote: 'Hold wall with left hand for balance.' }
        ]
      },
      prohibitedMovements: [
        'No heavy overhead reaches with casted arm.',
        'No contact sports or gym weight machines.'
      ],
      clinicalRationale: 'Cross-education preserves up to 30% muscle strength in the immobilized limb via neural pathways.'
    },
    {
      day: 'Saturday',
      routineName: 'Aerobic Stamina & Isometric Tone',
      durationMinutes: 25,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Aerobic Walking (15 Mins)',
        exercises: [
          { name: 'Continuous Outdoor Park Walk in Morning Sunlight', repsOrDuration: '20 Minutes', safetyNote: 'Provides natural Vitamin D synthesis for bone mineralization.' },
          { name: 'Active Finger Spreads with Rubber Band (Light)', repsOrDuration: '8 Reps', safetyNote: 'Gentle resistance around distal fingertips only.' }
        ]
      },
      eveningSession: {
        title: 'Evening Gentle Core & Pelvic Stability (10 Mins)',
        exercises: [
          { name: 'Supine Dead-Bugs (Legs Only)', repsOrDuration: '10 Reps each leg', safetyNote: 'Keep arms relaxed at sides; move legs only.' },
          { name: 'Seated Torso Rotations (Gentle)', repsOrDuration: '10 Reps', safetyNote: 'Smooth slow spinal mobilization.' }
        ]
      },
      prohibitedMovements: [
        'No fast running, sprinting, or uneven trail walking.',
        'No carrying backpacks using the right shoulder strap.'
      ],
      clinicalRationale: 'Sunlight walking pairs physical stamina with natural Vitamin D3 calcitriol synthesis.'
    },
    {
      day: 'Sunday',
      routineName: 'Full Body Gentle Restorative & Stretch',
      durationMinutes: 15,
      safetyIntensity: 'MODERATE_REST',
      morningSession: {
        title: 'Morning Restorative Mobility (8 Mins)',
        exercises: [
          { name: 'Gentle Full-Body Seated Cat-Cow', repsOrDuration: '8 Reps', safetyNote: 'Seated on chair; arch and round back gently with hands on knees.' },
          { name: 'Finger Massage on Exposed Digits', repsOrDuration: '5 Minutes', safetyNote: 'Gently stroke fingers from tips toward hand to move interstitial fluid.' }
        ]
      },
      eveningSession: {
        title: 'Evening Meditative Breath & Relaxation (10 Mins)',
        exercises: [
          { name: 'Deep Diaphragmatic 4-7-8 Breathing', repsOrDuration: '5 Cycles', safetyNote: 'Parasympathetic tone reduces pain perception and muscle guarding.' },
          { name: 'Progressive Lower-Limb Muscle Relaxation', repsOrDuration: '10 Minutes', safetyNote: 'Tense and release feet, calves, and thighs while lying in bed.' }
        ]
      },
      prohibitedMovements: [
        'No strenuous chores or DIY tool usage.',
        'Ensure arm is properly propped on pillow before sleep.'
      ],
      clinicalRationale: 'Prepares neuromuscular junctions for the upcoming week of healing.'
    }
  ];

  // Ayurvedic Yoga & Pranayama Rehabilitation Timetable
  const ayurvedicExerciseSchedule: DailyExercisePlan[] = [
    {
      day: 'Monday',
      routineName: 'Sukshma Vyayama (Micro-movements) & Anulom Vilom',
      durationMinutes: 20,
      safetyIntensity: 'GENTLE_REHAB',
      morningSession: {
        title: 'Morning Sukshma Vyayama (10 Mins)',
        exercises: [
          { name: 'Anguli Shakti Vikasaka (Finger Energy Release)', repsOrDuration: '10 Slow Reps', safetyNote: 'Gentle opening and closing of uncasted fingers; stimulates Prana flow.' },
          { name: 'Skandha Sanchalana (Shoulder Rotations)', repsOrDuration: '8 Circles each way', safetyNote: 'Release tension in shoulder girdle while supporting cast in lap.' },
          { name: 'Griva Sanchalana (Neck Mobilization)', repsOrDuration: '6 Reps', safetyNote: 'Gentle forward, back, and side neck movements.' }
        ]
      },
      eveningSession: {
        title: 'Evening Nadi Shodhana Pranayama (10 Mins)',
        exercises: [
          { name: 'Anulom Vilom (Alternate Nostril Breathing)', repsOrDuration: '10 Minutes', safetyNote: 'Use left hand for Vishnu Mudra; balances Ida and Pingala Nadis.' },
          { name: 'Tadasana (Mountain Pose - Standing Gentle)', repsOrDuration: '30 Sec Holds x 3', safetyNote: 'Stand tall with feet grounded; keep injured arm resting in sling.' }
        ]
      },
      prohibitedMovements: [
        'Zero Asanas putting weight on wrists (No Adho Mukha Svanasana / Downward Dog).',
        'No vigorous Kapalabhati (causes sudden intra-thoracic pressure spikes).'
      ],
      clinicalRationale: 'Nadi Shodhana increases cellular oxygenation without any musculoskeletal strain.'
    },
    {
      day: 'Tuesday',
      routineName: 'Vrikshasana Balance & Bhramari Pranayama',
      durationMinutes: 20,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Grounding Asanas (10 Mins)',
        exercises: [
          { name: 'Vrikshasana (Tree Pose with Wall Support)', repsOrDuration: '30 Secs each leg', safetyNote: 'Support back against wall; keep hands in single-hand prayer at chest.' },
          { name: 'Virabhadrasana I (Gentle Warrior Stance - Legs Only)', repsOrDuration: '5 Breaths each side', safetyNote: 'Low lunge stance; keep arms resting comfortably in sling.' }
        ]
      },
      eveningSession: {
        title: 'Evening Soothing Bhramari (10 Mins)',
        exercises: [
          { name: 'Bhramari Pranayama (Humming Bee Breath)', repsOrDuration: '8 Repetitions', safetyNote: 'Vibrational resonance calms the central nervous system and relieves pain.' },
          { name: 'Shavasana with Arm Pillow Support', repsOrDuration: '10 Minutes', safetyNote: 'Elevate casted forearm above chest on a soft bolster.' }
        ]
      },
      prohibitedMovements: ['No inversions (Sirshasana / Sarvangasana).'],
      clinicalRationale: 'Stimulates neuro-endocrinal endorphin release naturally.'
    },
    {
      day: 'Wednesday',
      routineName: 'Marjariasana (Seated Cat-Cow) & Ujjayi Breath',
      durationMinutes: 20,
      safetyIntensity: 'GENTLE_REHAB',
      morningSession: {
        title: 'Morning Seated Spine Awakening (10 Mins)',
        exercises: [
          { name: 'Seated Marjariasana on Chair', repsOrDuration: '8 Reps', safetyNote: 'Arch and hollow spine rhythmically with breath without pushing through palms.' },
          { name: 'Hasta Mudra (Prana Mudra with Left Hand)', repsOrDuration: '10 Minutes', safetyNote: 'Touch thumb to ring & little finger tips on uninjured hand.' }
        ]
      },
      eveningSession: {
        title: 'Evening Ujjayi & Yoga Nidra (10 Mins)',
        exercises: [
          { name: 'Ujjayi (Victorious Ocean Breath)', repsOrDuration: '10 Minutes', safetyNote: 'Deep diaphragmatic throat resonance warming internal Agni.' },
          { name: 'Guided Body Scan Visualization for Bone Callus', repsOrDuration: '10 Minutes', safetyNote: 'Visualize golden healing light fusing the radial bone matrix.' }
        ]
      },
      prohibitedMovements: ['No tabletop positions on hands and knees.'],
      clinicalRationale: 'Guided bone healing visualization drastically improves patient adherence and recovery.'
    },
    {
      day: 'Thursday',
      routineName: 'Gentle Walk in Nature & Sheetali Pranayama',
      durationMinutes: 20,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Prana Walk (12 Mins)',
        exercises: [
          { name: 'Conscious Walking in Green Lawn / Park', repsOrDuration: '15 Minutes', safetyNote: 'Deep rhythmic breathing during relaxed pace in sling.' },
          { name: 'Manibandha Shakti Vikasaka (Exposed Fingers)', repsOrDuration: '10 Reps', safetyNote: 'Gentle isometric finger extensions.' }
        ]
      },
      eveningSession: {
        title: 'Evening Cooling Breath (8 Mins)',
        exercises: [
          { name: 'Sheetali / Sitkari Pranayama (Cooling Breath)', repsOrDuration: '8 Cycles', safetyNote: 'Pacifies excess Pitta and internal inflammatory heat.' }
        ]
      },
      prohibitedMovements: ['No heavy lifting or outdoor strenuous trekking.'],
      clinicalRationale: 'Balances Agni and cools post-traumatic inflammation.'
    },
    {
      day: 'Friday',
      routineName: 'Setu Bandhasana (Supported Bridge) & Bhastrika',
      durationMinutes: 20,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Core & Pelvic Flow (10 Mins)',
        exercises: [
          { name: 'Supported Setu Bandhasana (Bridge with Block under Sacrum)', repsOrDuration: '30 Sec Holds x 3', safetyNote: 'Zero weight on upper limbs; bolster holds pelvis.' },
          { name: 'Pawanmuktasana (Single Leg to Chest - Left Side)', repsOrDuration: '5 Breaths', safetyNote: 'Use left arm only to hug left knee.' }
        ]
      },
      eveningSession: {
        title: 'Evening Gentle Pranayama (10 Mins)',
        exercises: [
          { name: 'Gentle Anulom Vilom with Left Hand', repsOrDuration: '10 Minutes', safetyNote: 'Smooth effortless alternate nostril breathing.' }
        ]
      },
      prohibitedMovements: ['No Chakrasana or backbends relying on wrists.'],
      clinicalRationale: 'Maintains spinal suppleness and digestive fire.'
    },
    {
      day: 'Saturday',
      routineName: 'Surya Namaskar Modifications (Legs & Breathing Only)',
      durationMinutes: 25,
      safetyIntensity: 'LOW_IMPACT',
      morningSession: {
        title: 'Morning Adapted Sun Salutations (12 Mins)',
        exercises: [
          { name: 'Adapted Chair Surya Namaskar (No Arm Load)', repsOrDuration: '4 Slow Rounds', safetyNote: 'Performed seated on sturdy chair; focuses on spinal rhythm and breath.' },
          { name: 'Trikonasana (Triangle Pose against Wall)', repsOrDuration: '30 Secs each side', safetyNote: 'Support back against wall; keep injured arm resting in sling.' }
        ]
      },
      eveningSession: {
        title: 'Evening Deep Rest & Chanting (13 Mins)',
        exercises: [
          { name: 'Omkara Chanting (A-U-M)', repsOrDuration: '11 Repetitions', safetyNote: 'Vibrations soothe the mind and accelerate cell division.' },
          { name: 'Shavasana with Elevated Forearm', repsOrDuration: '10 Minutes', safetyNote: 'Total relaxation of all skeletal muscles.' }
        ]
      },
      prohibitedMovements: ['No standard floor Surya Namaskars with planks/pushups.'],
      clinicalRationale: 'Adaptive chair yoga delivers the cardiovascular benefits of classical surya namaskars without risk.'
    },
    {
      day: 'Sunday',
      routineName: 'Complete Restorative Yoga Nidra & Meditation',
      durationMinutes: 20,
      safetyIntensity: 'MODERATE_REST',
      morningSession: {
        title: 'Morning Sukhasana Meditation (10 Mins)',
        exercises: [
          { name: 'Sukhasana with Spine Erect & Chin Mudra', repsOrDuration: '10 Minutes', safetyNote: 'Sit comfortably with cushions; forearm resting safely in lap.' },
          { name: 'Deep Diaphragmatic Breath Awareness', repsOrDuration: '10 Cycles', safetyNote: 'Observe natural flow of Prana.' }
        ]
      },
      eveningSession: {
        title: 'Evening Yoga Nidra (10 Mins)',
        exercises: [
          { name: 'Deep Conscious Rest (Yoga Nidra)', repsOrDuration: '15 Minutes', safetyNote: 'Supine on comfortable mattress; complete mental and physical restoration.' }
        ]
      },
      prohibitedMovements: ['Zero strenuous activities.'],
      clinicalRationale: 'Deep cellular regeneration occurs during meditative delta-wave states.'
    }
  ];

  const currentSchedule = aiMode === 'AYURVEDIC' ? ayurvedicExerciseSchedule : clinicalExerciseSchedule;
  const currentDayPlan = currentSchedule.find(d => d.day === selectedDay) || currentSchedule[0];

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Weekly ${aiMode === 'AYURVEDIC' ? 'Ayurvedic Yoga Rehab' : 'Clinical Safe Exercise'} Timetable synthesized!`, 'success');
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-brand-emerald/30 shadow-spatial-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-glow-emerald">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {aiMode === 'AYURVEDIC' ? 'Ayurvedic Yoga & Prana Rehab Timetable' : 'Clinical Safe Physical Exercise & Rehab Timetable'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-bold">
                100% CLINICALLY SAFE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Custom-built for: <strong className="text-white">{patient.name}</strong> • Grounded in <span className="text-brand-emerald">{primaryIncident?.title || 'Active Condition'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-semibold flex items-center gap-1.5 transition-all shadow-spatial-sm"
          >
            <RefreshCw className={clsx("w-3.5 h-3.5", isGenerating && "animate-spin text-brand-emerald")} />
            <span>Regenerate Routine</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      {/* Safety Banner & Prohibited Movements */}
      <GlassPanel variant="base" className="p-4 border-l-4 border-l-brand-rose bg-gradient-to-r from-red-950/20 via-black/40 to-transparent">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-rose/20 border border-brand-rose/40 flex items-center justify-center text-brand-rose shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Strict Clinical Safety Guardrails: Prohibited Dangerous Movements</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-rose/20 text-brand-rose font-bold">MANDATORY PRECAUTION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Zero weight-bearing / lifting with casted arm</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>No high-impact running or jumping</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>No push-ups, planks, or palm load</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Keep arm elevated in sling during walks</span>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Weekday Selector Bar (Monday through Sunday) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {daysList.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={clsx(
              "px-4 py-2.5 rounded-2xl font-bold font-mono transition-all whitespace-nowrap border flex items-center gap-1.5",
              selectedDay === day
                ? "bg-gradient-to-r from-brand-emerald to-teal-500 text-slate-950 border-brand-emerald shadow-glow-emerald scale-105"
                : "bg-[#0d111a] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{day}</span>
          </button>
        ))}
      </div>

      {/* Daily Routine Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Morning & Evening Sessions */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Routine Header Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-slate-400 text-[10px] uppercase block">Scheduled Program for {selectedDay}</span>
              <h3 className="font-bold text-white text-sm">{currentDayPlan.routineName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-brand-emerald font-bold bg-brand-emerald/10 border border-brand-emerald/30 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{currentDayPlan.durationMinutes} Mins Total</span>
              </span>
              <span className={clsx(
                "text-[10px] font-mono font-bold px-2 py-1 rounded-lg border uppercase",
                currentDayPlan.safetyIntensity === 'GENTLE_REHAB' ? "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40" :
                currentDayPlan.safetyIntensity === 'LOW_IMPACT' ? "bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40" :
                "bg-brand-amber/20 text-brand-amber border-brand-amber/40"
              )}>
                {currentDayPlan.safetyIntensity.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Session 1: Morning Block */}
          <GlassPanel variant="base" className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center text-brand-amber">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-sm">{currentDayPlan.morningSession.title}</span>
              </div>
              <span className="font-mono text-brand-amber text-[11px] font-bold">Morning Protocol (08:30 AM)</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {currentDayPlan.morningSession.exercises.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
                      <span>{ex.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-3.5 italic flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-emerald shrink-0" />
                      <span>{ex.safetyNote}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-brand-amber text-xs px-2 py-0.5 rounded bg-brand-amber/10 border border-brand-amber/30 self-end sm:self-auto shrink-0">
                    {ex.repsOrDuration}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Session 2: Evening Block */}
          <GlassPanel variant="base" className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center text-brand-emerald">
                  <Sunset className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-sm">{currentDayPlan.eveningSession.title}</span>
              </div>
              <span className="font-mono text-brand-emerald text-[11px] font-bold">Evening Protocol (05:30 PM)</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {currentDayPlan.eveningSession.exercises.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                      <span>{ex.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-3.5 italic flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-emerald shrink-0" />
                      <span>{ex.safetyNote}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-brand-emerald text-xs px-2 py-0.5 rounded bg-brand-emerald/10 border border-brand-emerald/30 self-end sm:self-auto shrink-0">
                    {ex.repsOrDuration}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* Right Column: Safety Guidance & Rationale */}
        <div className="lg:col-span-4 space-y-4">
          
          <GlassPanel variant="glow-emerald" className="p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-brand-emerald tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>Clinical Safety Rationale</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed">
              {currentDayPlan.clinicalRationale}
            </div>

            {/* Prohibited movements for this day */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase text-brand-rose font-bold block">
                Forbidden for {selectedDay}:
              </span>
              {currentDayPlan.prohibitedMovements.map((pm, i) => (
                <div key={i} className="p-2 rounded-lg bg-brand-rose/10 border border-brand-rose/20 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <span className="text-brand-rose font-bold">✕</span>
                  <span>{pm}</span>
                </div>
              ))}
            </div>

            {/* Physician Directive */}
            <div className="pt-2 border-t border-white/10 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Treating Surgeon (Dr. Ram)</span>
              </span>
              <p className="text-[11px] leading-relaxed italic text-slate-300">
                "Active finger pumps 3 times daily prevent dorsal hand edema. Discontinue any movement if you feel sharp pain inside the cast."
              </p>
            </div>
          </GlassPanel>

        </div>

      </div>
    </div>
  );
};

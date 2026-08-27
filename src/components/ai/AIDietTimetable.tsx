import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { DailyDietPlan, WeeklyDietTimetable } from '../../types';
import { 
  Utensils, 
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
  Droplets, 
  Flame, 
  Apple, 
  Check, 
  XOctagon, 
  Printer, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Sparkle
} from 'lucide-react';
import { clsx } from 'clsx';

export const AIDietTimetable: React.FC = () => {
  const { incidents, patient, aiMode, setAiMode, showToast } = usePatient();

  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE');
  const primaryIncident = activeIncidents[0] || incidents[0];
  const isFracture = primaryIncident?.title.toLowerCase().includes('fracture') || primaryIncident?.diagnosis.toLowerCase().includes('fracture');

  const daysList: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Clinical Nutritionist Diet Timetable (Modern Allopathic Bone Healing)
  const clinicalDietSchedule: DailyDietPlan[] = [
    {
      day: 'Monday',
      breakfast: 'Finger Millet (Ragi) porridge with warm milk, 2 boiled eggs / sprouted moong, and a handful of soaked almonds (10 pcs).',
      midMorning: 'Fresh Amla juice or orange juice (High Vitamin C for collagen bone matrix synthesis).',
      lunch: 'Brown rice / 2 multigrain chapatis, paneer / tofu curry, spinach (palak) dal, and cucumber curd salad.',
      eveningSnack: 'Roasted Makhana (Fox nuts - rich in Calcium & Magnesium) + 1 cup Green tea.',
      dinner: 'Moong dal khichdi with mixed vegetables (carrots, beans, peas) + 1 tsp cold-pressed sesame oil.',
      bedtime: 'Warm fortified milk with 1/2 tsp organic turmeric + 1 pinch black pepper.',
      nutritionalFocus: 'High Calcium (1200mg) & Vitamin C for initial bone osteoblast activation.',
      hydrationTarget: '3.0 Liters clean water daily.'
    },
    {
      day: 'Tuesday',
      breakfast: 'Oats upma with carrots, green beans, and flaxseeds + 1 glass fortified soy/cow milk.',
      midMorning: '1 bowl of mixed papaya & guava slices (Bioflavonoids & Vitamin C).',
      lunch: '2 Whole wheat chapatis, Rajma (Kidney beans - high zinc/protein), steamed broccoli, and probiotic curd.',
      eveningSnack: 'Sprouted black chana chaat with lemon and coriander.',
      dinner: 'Vegetable vegetable stew with soft idlis or brown rice + light bottle gourd (lauki) soup.',
      bedtime: 'Warm milk with 1 tsp soaked chia seeds.',
      nutritionalFocus: 'Zinc & Phosphorus for mineralizing newly deposited bone callus.',
      hydrationTarget: '3.2 Liters water + electrolyte coconut water.'
    },
    {
      day: 'Wednesday',
      breakfast: 'Paneer / Tofu stuffed paratha (light oil) with mint curd + 1 boiled egg.',
      midMorning: 'Tender Coconut water + 2 whole walnuts (Omega-3 fatty acids).',
      lunch: 'Steamed rice with Drumstick (Moringa) sambar (highest natural plant calcium) + methi subzi.',
      eveningSnack: 'Boiled sweet corn with lime and roasted pumpkin seeds.',
      dinner: 'Light yellow moong dal with pumpkin sabzi and 2 soft phulkas.',
      bedtime: 'Warm milk with crushed dry dates (Kharik) for iron and bone marrow nourishment.',
      nutritionalFocus: 'Plant-based bioavailable Calcium (Moringa) & Omega-3 anti-inflammatory support.',
      hydrationTarget: '3.0 Liters.'
    },
    {
      day: 'Thursday',
      breakfast: 'Ragi Idlis (3 pcs) with coconut-sesame chutney and vegetable sambar.',
      midMorning: 'Pomegranate (Anar) bowl with soaked pumpkin and sunflower seeds.',
      lunch: '2 Bajra (Pearl millet) rotis, soya chunk curry, roasted bhindi, and buttermilk (chaas) with roasted cumin.',
      eveningSnack: 'Poha cooked with green peas, peanuts, and turmeric.',
      dinner: 'Clear vegetable lentil broth with soft multigrain wrap filled with stir-fried paneer & bell peppers.',
      bedtime: 'Warm turmeric milk + 1 pinch nutmeg.',
      nutritionalFocus: 'Magnesium & Silicon from Pearl Millet for trabecular bone tensile strength.',
      hydrationTarget: '3.0 Liters.'
    },
    {
      day: 'Friday',
      breakfast: 'Vegetable Besan Chilla (Chickpea pancake) with tomato-mint chutney + 1 cup warm milk.',
      midMorning: 'Fresh sweet lime (Mosambi) slices + 5 soaked figs (Anjeer).',
      lunch: 'Brown rice, grilled fish / paneer tikka, yellow arhar dal, and beet-carrot salad.',
      eveningSnack: 'Roasted chickpeas (Bhuna chana) + dry roasted sesame seeds (Til).',
      dinner: 'Soft paneer bhurji with 2 phulkas and warm spinach soup.',
      bedtime: 'Warm milk with 1/2 tsp ashwagandha or organic turmeric.',
      nutritionalFocus: 'High protein bioavailability (45g daily target) for skeletal muscle support around cast.',
      hydrationTarget: '3.2 Liters.'
    },
    {
      day: 'Saturday',
      breakfast: 'Scrambled eggs / Paneer scramble on whole grain toast + avocado slices + fresh orange juice.',
      midMorning: 'Chaas (Buttermilk) blended with curry leaves and ginger.',
      lunch: '2 Multigrain rotis, Chana dal with bottle gourd, capsicum subzi, and fresh curd.',
      eveningSnack: 'Makhana roasted in A2 cow ghee with pinch of pink Himalayan salt.',
      dinner: 'Light vegetable pulao with sprouted bean raita and tomato rasam.',
      bedtime: 'Warm milk with crushed almonds & saffron strand.',
      nutritionalFocus: 'Probiotics for gastric lining protection while taking NSAID pain relief.',
      hydrationTarget: '3.0 Liters.'
    },
    {
      day: 'Sunday',
      breakfast: 'Moong dal cheela stuffed with grated paneer & coriander + 1 boiled egg + herbal tea.',
      midMorning: '1 bowl of fresh kiwi and pomegranate seeds.',
      lunch: 'Steamed basmati rice, Dal tadka, paneer jalfrezi, roasted papad, and fresh green salad.',
      eveningSnack: 'Sprouted peanut chaat with diced onions and lemon.',
      dinner: 'Warm mixed vegetable soup + 2 soft chapatis with zucchini and paneer curry.',
      bedtime: 'Golden turmeric milk with pure cow ghee (1/2 tsp) to nourish deep Asthi Dhatu.',
      nutritionalFocus: 'Cellular tissue recovery and preparatory micronutrients for the upcoming week.',
      hydrationTarget: '3.2 Liters.'
    }
  ];

  // Ayurvedic Satvik Pathya Diet Timetable (Classical Bone Healing & Asthi Dhatu)
  const ayurvedicDietSchedule: DailyDietPlan[] = [
    {
      day: 'Monday',
      breakfast: 'Warm Godhuma (Whole Wheat) Dalia with organic A2 cow milk and 2 crushed Medjool dates.',
      midMorning: 'Fresh Amla Swarasa (Indian Gooseberry juice) with 1 tsp raw honey.',
      lunch: 'Shashtika Shali (Red rice) with Mudga (Green moong) dal, boiled Lauki (Bottle gourd), and Cow Ghee.',
      eveningSnack: 'Roasted White Sesame Seeds (Til Laddu made with jaggery) — Classical Asthi Poshan.',
      dinner: 'Light Laghu Ahara: Moong Dal Khichdi prepared with ginger, cumin, and rock salt.',
      bedtime: 'Ksheera Paka: Warm A2 cow milk boiled with 1/2 tsp Haridra (Turmeric) and 1/2 tsp pure Ghee.',
      nutritionalFocus: 'Vata pacification & Asthi Dhatu strengthening with Hadjod pathya.',
      hydrationTarget: 'Warm water infused with Ushnodaka (boiled with cumin & dry ginger).'
    },
    {
      day: 'Tuesday',
      breakfast: 'Ragi (Finger Millet) Malt porridge cooked in milk with cardamom and soaked almonds.',
      midMorning: 'Fresh pomegranate (Dadima) juice — balances Pitta and supports Rakta Dhatu.',
      lunch: '2 Soft wheat chapatis with Sigru (Drumstick / Moringa) soup and cooked Methi leaves in Ghee.',
      eveningSnack: 'Roasted Makhana with pinch of Saindhava Lavana (Rock salt).',
      dinner: 'Vegetable soup made of Ash Gourd and carrots + 1 phulka with cooked tender pumpkin.',
      bedtime: 'Warm cow milk with 1/4 tsp Ashwagandha Churna for cellular regeneration.',
      nutritionalFocus: 'Asthisanghata (Bone fusing) action through Moringa and organic calcium.',
      hydrationTarget: 'Luke-warm water throughout the day.'
    },
    {
      day: 'Wednesday',
      breakfast: 'Upma cooked with Cow Ghee, roasted curry leaves, carrots, and soaked raisins.',
      midMorning: 'Fresh tender coconut water (Narikela Jala) with 5 soaked Munakka.',
      lunch: 'Steamed rice with Tuvar dal seasoned with Ghee, Hing, and Jeera + boiled Beetroot sabzi.',
      eveningSnack: 'Til and Jaggery brittle (Chikki) for natural bioavailable calcium.',
      dinner: 'Light Barley (Yava) and moong soup with steamed bottle gourd.',
      bedtime: 'Golden milk (Turmeric + pinch of dry ginger + cow ghee).',
      nutritionalFocus: 'Balancing Agni (digestive fire) to ensure complete assimilation of bone supplements.',
      hydrationTarget: 'Warm herbal decoction.'
    },
    {
      day: 'Thursday',
      breakfast: 'Poha with roasted peanuts, grated fresh coconut, turmeric, and lime.',
      midMorning: 'Fresh orange slices or Amla preserve (Murabba).',
      lunch: '2 Phulkas with Paneer cooked in mild cumin gravy + palak saag + fresh Takra (Buttermilk).',
      eveningSnack: 'Sprouted green gram (Moong) lightly steamed with cumin and ghee.',
      dinner: 'Nutritious vegetable Khichdi with a spoonful of pure A2 Desi Cow Ghee.',
      bedtime: 'Warm milk with 1 pinch of Jaiphal (Nutmeg) and saffron for restorative sleep.',
      nutritionalFocus: 'Nourishing Majja Dhatu (Bone Marrow) and reducing trauma-induced insomnia.',
      hydrationTarget: 'Warm water.'
    },
    {
      day: 'Friday',
      breakfast: 'Moong Dal Cheela with fresh mint chutney and warm almond milk.',
      midMorning: '1 bowl of ripe sweet Papaya (promotes digestion and reduces systemic inflammation).',
      lunch: 'Brown rice, Kulthi (Horse gram) dal (cleanses channels), boiled ridge gourd, and cucumber salad.',
      eveningSnack: 'Roasted lotus seeds (Makhana) with cow ghee and crushed black pepper.',
      dinner: 'Lentil soup with 2 steamed Idlis and coconut chutney.',
      bedtime: 'Turmeric Ghee Milk (Haridra Ksheera).',
      nutritionalFocus: 'Srotoshodhana (clearing micro-channels) for unhindered nutrient delivery to bone callus.',
      hydrationTarget: 'Ginger-infused warm water.'
    },
    {
      day: 'Saturday',
      breakfast: 'Oatmeal cooked with cow milk, cinnamon, and 4 soaked dried figs (Anjeer).',
      midMorning: 'Takra (Medicinal buttermilk with roasted cumin and rock salt) for gut health.',
      lunch: '2 Chapatis, Green moong dal, cooked Parwal (Pointed gourd), and fresh home-set curd.',
      eveningSnack: 'Boiled chickpeas tempered with mustard seeds and curry leaves in ghee.',
      dinner: 'Soft daliya cooked with spinach, carrots, and mild digestive spices.',
      bedtime: 'Warm milk with 1/2 tsp organic A2 Ghee.',
      nutritionalFocus: 'Sneha (Unctuousness) replenishment to counter cast immobilization stiffness.',
      hydrationTarget: 'Warm water.'
    },
    {
      day: 'Sunday',
      breakfast: 'Ragi Idlis with drumstick sambar and fresh coriander chutney.',
      midMorning: 'Sweet lime juice with a pinch of rock salt.',
      lunch: 'Steamed rice, Dal fry with A2 Ghee, Paneer-Methi subzi, and fresh radish salad.',
      eveningSnack: 'Til (Sesame) laddu + green tea.',
      dinner: 'Light pumpkin and moong dal soup with 2 soft wheat rotis.',
      bedtime: 'Warm Ksheera with Haridra, Ashwagandha, and pure cow ghee.',
      nutritionalFocus: 'Rasayana rejuvenation and tissue vitality for the week ahead.',
      hydrationTarget: '3.0 Liters warm water.'
    }
  ];

  const currentSchedule = aiMode === 'AYURVEDIC' ? ayurvedicDietSchedule : clinicalDietSchedule;
  const currentDayPlan = currentSchedule.find(d => d.day === selectedDay) || currentSchedule[0];

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Weekly ${aiMode === 'AYURVEDIC' ? 'Ayurvedic Pathya' : 'Clinical'} Diet Timetable synthesized!`, 'success');
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Diet Plan Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-brand-cyan/30 shadow-spatial-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-glow-cyan">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {aiMode === 'AYURVEDIC' ? 'Ayurvedic Pathya Diet Timetable' : 'Clinical Nutrition & Bone Recovery Timetable'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-bold">
                WEEKLY SCHEDULE (MON - SUN)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized for: <strong className="text-white">{patient.name}</strong> • Grounded in <span className="text-brand-cyan">{primaryIncident?.title || 'Active Episode'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-semibold flex items-center gap-1.5 transition-all shadow-spatial-sm"
          >
            <RefreshCw className={clsx("w-3.5 h-3.5", isGenerating && "animate-spin text-brand-cyan")} />
            <span>Regenerate Plan</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Strict Safety Notice & Foods to Avoid */}
      <GlassPanel variant="base" className="p-4 border-l-4 border-l-brand-rose bg-gradient-to-r from-red-950/20 via-black/40 to-transparent">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-rose/20 border border-brand-rose/40 flex items-center justify-center text-brand-rose shrink-0 mt-0.5">
            <XOctagon className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Strict Clinical Safety Guardrails: Foods to Strictly Avoid</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-rose/20 text-brand-rose font-bold">ZERO TOLERANCE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Carbonated sodas (leaches calcium)</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Excess sodium & deep-fried snacks</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Alcohol & high caffeine (impairs osteoblasts)</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                <span className="text-brand-rose font-bold">⛔</span>
                <span>Pain relievers on empty stomach</span>
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
                ? "bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 border-brand-teal shadow-glow-teal scale-105"
                : "bg-[#0d111a] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{day}</span>
          </button>
        ))}
      </div>

      {/* Selected Day Timetable Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 6 Daily Meal Blocks */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Meal 1: Breakfast */}
          <GlassPanel variant="base" className="p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center text-brand-amber shrink-0 mt-0.5 shadow-sm">
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Breakfast</span>
                <span className="font-mono text-brand-amber font-bold text-[11px] bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/30">
                  08:00 AM - 08:30 AM
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentDayPlan.breakfast}
              </p>
            </div>
          </GlassPanel>

          {/* Meal 2: Mid-Morning */}
          <GlassPanel variant="base" className="p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5 shadow-sm">
              <Apple className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Mid-Morning Booster</span>
                <span className="font-mono text-brand-cyan font-bold text-[11px] bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30">
                  11:00 AM
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentDayPlan.midMorning}
              </p>
            </div>
          </GlassPanel>

          {/* Meal 3: Lunch */}
          <GlassPanel variant="base" className="p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shrink-0 mt-0.5 shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Balanced Lunch</span>
                <span className="font-mono text-brand-emerald font-bold text-[11px] bg-brand-emerald/10 px-2 py-0.5 rounded border border-brand-emerald/30">
                  01:30 PM - 02:00 PM
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentDayPlan.lunch}
              </p>
            </div>
          </GlassPanel>

          {/* Meal 4: Evening Snack */}
          <GlassPanel variant="base" className="p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center text-brand-amber shrink-0 mt-0.5 shadow-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Evening Refreshment</span>
                <span className="font-mono text-brand-amber font-bold text-[11px] bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/30">
                  05:00 PM
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentDayPlan.eveningSnack}
              </p>
            </div>
          </GlassPanel>

          {/* Meal 5: Dinner */}
          <GlassPanel variant="base" className="p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal shrink-0 mt-0.5 shadow-sm">
              <Sunset className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Light Dinner</span>
                <span className="font-mono text-brand-teal font-bold text-[11px] bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/30">
                  08:00 PM - 08:30 PM
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentDayPlan.dinner}
              </p>
            </div>
          </GlassPanel>

          {/* Meal 6: Bedtime Healing Tonic */}
          {currentDayPlan.bedtime && (
            <GlassPanel variant="glow-emerald" className="p-4 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center text-brand-emerald shrink-0 mt-0.5 shadow-glow-emerald">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white text-sm">Bedtime Bone Healing Elixir</span>
                  <span className="font-mono text-brand-emerald font-bold text-[11px] bg-brand-emerald/20 px-2 py-0.5 rounded border border-brand-emerald/40">
                    09:45 PM
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentDayPlan.bedtime}
                </p>
              </div>
            </GlassPanel>
          )}

        </div>

        {/* Right Column: Daily Targets & Clinical Focus */}
        <div className="lg:col-span-4 space-y-4">
          
          <GlassPanel variant="base" className="p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-brand-cyan tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{selectedDay}'s Nutritional Focus</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="text-slate-300 leading-relaxed">
                {currentDayPlan.nutritionalFocus}
              </div>
            </div>

            {/* Daily Hydration */}
            <div className="p-3.5 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-brand-cyan font-bold">
                <Droplets className="w-4 h-4" />
                <span>Hydration Protocol</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {currentDayPlan.hydrationTarget}
              </p>
            </div>

            {/* Doctor Note */}
            <div className="pt-2 border-t border-white/10 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Physician Directive (Dr. Ram)</span>
              </span>
              <p className="text-[11px] leading-relaxed italic text-slate-300">
                "Pair calcium-rich meals with Vitamin D sunlight exposure in the morning to maximize bone trabecular density."
              </p>
            </div>
          </GlassPanel>
        </div>

      </div>
    </div>
  );
};
